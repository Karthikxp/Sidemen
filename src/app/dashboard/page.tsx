"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DeviceList from "../../components/dashboard/DeviceList";
import NetworkStatus from "../../components/dashboard/NetworkStatus";
import ThreatDetection from "../../components/dashboard/ThreatDetection";
import SecurityMetrics from "../../components/dashboard/SecurityMetrics";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";

// Import the Device interface
interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  status: string;
  lastActive: string;
  type: string;
  manufacturer: string;
  risk: string;
}

// Start with an empty devices array
const mockDevices: Device[] = [];

export default function Dashboard() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [activeView, setActiveView] = useState("overview");
  const [isScanning, setIsScanning] = useState(false);
  const [autoScan, setAutoScan] = useState(true);

  // Scan function that can be called both manually and automatically
  const performScan = useCallback(async () => {
    if (isScanning) return;
    
    try {
      setIsScanning(true);
      window.dispatchEvent(new Event('scan-start'));
      
      const response = await fetch('/api/network/scan');
      const data = await response.json();
      
      if (response.ok) {
        // Merge new devices with existing ones, updating timestamps
        const updatedDevices = [...devices];
        data.devices.forEach((newDevice: Device) => {
          const existingDeviceIndex = updatedDevices.findIndex(d => d.id === newDevice.id);
          if (existingDeviceIndex >= 0) {
            // Update existing device's lastActive and status
            updatedDevices[existingDeviceIndex] = {
              ...updatedDevices[existingDeviceIndex],
              lastActive: newDevice.lastActive,
              status: newDevice.status
            };
          } else {
            // Add new device
            updatedDevices.push(newDevice);
          }
        });
        
        // Remove devices that haven't been seen in the last minute
        const oneMinuteAgo = Date.now() - 60000;
        const activeDevices = updatedDevices.filter(device => 
          new Date(device.lastActive).getTime() > oneMinuteAgo
        );
        
        setDevices(activeDevices);
        console.log('Network scan completed:', activeDevices.length, 'devices found');
      }
    } catch (error) {
      console.error('Network scan failed:', error);
    } finally {
      setIsScanning(false);
      window.dispatchEvent(new Event('scan-end'));
      window.dispatchEvent(new Event('network-scan'));
    }
  }, [devices, isScanning]);

  // Handle auto-scanning
  useEffect(() => {
    let scanInterval: NodeJS.Timeout | null = null;

    if (autoScan) {
      // Initial scan when auto-scan is enabled
      performScan();
      // Set up interval for continuous scanning
      scanInterval = setInterval(performScan, 5000);
      console.log('Auto-scan enabled - scanning every 5 seconds');
    } else {
      console.log('Auto-scan disabled');
    }

    // Cleanup function
    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [autoScan, performScan]);

  const handleDeviceUpdate = (updatedDevices: Device[]) => {
    console.log('Updating devices in dashboard:', updatedDevices);
    setDevices(updatedDevices);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  // Manual scan handler
  const handleManualScan = () => {
    console.log('Manual scan initiated');
    performScan();
  };

  // Auto-scan toggle handler
  const handleToggleAutoScan = () => {
    setAutoScan(!autoScan);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col">
        <Header 
          onScan={handleManualScan}
          onToggleAutoScan={handleToggleAutoScan}
          isScanning={isScanning}
          isAutoScanEnabled={autoScan}
          onLogout={handleLogout}
          devices={devices}
        />
        
        <main className="flex-1 p-4">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <NetworkStatus devices={devices} />
            <ThreatDetection devices={devices} />
            <SecurityMetrics devices={devices} />
          </div>
          
          <DeviceList devices={devices} onDeviceUpdate={handleDeviceUpdate} />
        </main>
      </div>
    </div>
  );
} 