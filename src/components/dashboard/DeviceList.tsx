"use client";

import { useState, useEffect } from 'react';
import { FiWifi, FiAlertTriangle, FiClock, FiMoreVertical } from 'react-icons/fi';
import type { Device } from '@/types';

interface DeviceListProps {
  devices: Device[];
  onDeviceUpdate?: (updatedDevices: Device[]) => void;
}

export default function DeviceList({ devices, onDeviceUpdate }: DeviceListProps) {
  const [filter, setFilter] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [localDevices, setLocalDevices] = useState(devices);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    setIsClient(true);
    setLocalDevices(devices);
  }, [devices]);

  const updateDeviceStatus = async (deviceId: string, status: string, risk: string, device: Device) => {
    try {
      console.log('Updating device status:', { deviceId, status, risk, device });
      
      const response = await fetch('/api/devices/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          deviceId, 
          status, 
          risk,
          device
        }),
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (!response.ok) {
        console.error('Update failed:', data);
        throw new Error(data.details || data.error || 'Failed to update device status');
      }
      
      if (!data.device) {
        console.error('No device data in response:', data);
        throw new Error('Invalid server response: missing device data');
      }

      // Update the local devices state with the updated device
      const newDevices = localDevices.map(dev => 
        dev.id === deviceId ? { ...data.device } : dev
      );
      
      console.log('Updated local devices:', newDevices);
      setLocalDevices(newDevices);
      
      // Propagate the update to the parent component
      if (onDeviceUpdate) {
        onDeviceUpdate(newDevices);
      }

      return data.device;
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  };

  const sendSecurityAlert = async (device: Device) => {
    try {
      console.log('Sending security alert for device:', device);
      
      const response = await fetch('/api/alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceName: device.name,
          deviceIP: device.ip,
          deviceMAC: device.mac,
          userEmail: '2022cs0878@svce.ac.in'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || 'Failed to send security alert');
      }
      
      // Open the preview URL in a new tab
      if (data.previewUrl) {
        window.open(data.previewUrl, '_blank');
        alert('Security alert sent successfully! Check the preview URL that opened in a new tab.');
      } else {
        alert('Security alert sent successfully!');
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      throw error;
    }
  };

  const handleSetCritical = async (device: Device) => {
    try {
      console.log('Setting device to critical:', device);
      
      // Update device status to critical and risk to high
      const updatedDevice = await updateDeviceStatus(device.id, 'critical', 'high', device);
      console.log('Device updated successfully:', updatedDevice);
      
      // Update selected device with new status
      setSelectedDevice(updatedDevice);
      
      // Send security alert
      await sendSecurityAlert(updatedDevice);
      console.log('Security alert sent successfully');
      
      // Close device details modal if open
      setShowDeviceDetails(false);
    } catch (error) {
      console.error('Error setting critical status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update device status. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setShowAuthModal(true);
    setAuthStatus('idle');
    setAuthMessage('');
  };

  const handleAuthorize = async () => {
    if (!selectedDevice) return;

    try {
      setAuthStatus('loading');
      
      console.log("DEMO: Authorizing device:", selectedDevice.name);
      console.log("- MAC:", selectedDevice.mac);
      console.log("- IP:", selectedDevice.ip);
      
      // This is a guaranteed-to-work demo implementation
      setTimeout(() => {
        console.log("Demo authorization completed successfully");
        
        setAuthStatus('success');
        setAuthMessage('Device successfully authorized!');
        
        // Update both local and parent device lists
        const updatedDevices = localDevices.map(device => 
          device.id === selectedDevice.id 
            ? { ...device, status: 'authorized' }
            : device
        );
        setLocalDevices(updatedDevices);
        if (onDeviceUpdate) {
          onDeviceUpdate(updatedDevices);
        }
        
        // Close modal after a short delay
        setTimeout(() => {
          setShowAuthModal(false);
          setSelectedDevice(null);
        }, 2000);
      }, 1500);
      
    } catch (error) {
      console.error("Demo authorization error:", error);
      setAuthStatus('error');
      setAuthMessage('Error in demo: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleCancel = () => {
    setShowAuthModal(false);
    setSelectedDevice(null);
    setAuthStatus('idle');
  };

  const filteredDevices = filter === 'all' 
    ? localDevices 
    : localDevices.filter(device => device.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <FiWifi className="text-green-500" />;
      case 'warning':
        return <FiAlertTriangle className="text-yellow-500" />;
      case 'critical':
        return <FiAlertTriangle className="text-red-500" />;
      default:
        return <FiWifi className="text-gray-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRiskClass = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Connected Devices</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded-full ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('normal')}
            className={`px-3 py-1 text-xs rounded-full ${
              filter === 'normal' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Normal
          </button>
          <button 
            onClick={() => setFilter('warning')}
            className={`px-3 py-1 text-xs rounded-full ${
              filter === 'warning' 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Warning
          </button>
          <button 
            onClick={() => setFilter('critical')}
            className={`px-3 py-1 text-xs rounded-full ${
              filter === 'critical' 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Critical
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Device</th>
              <th className="px-4 py-3 text-left">IP Address</th>
              <th className="px-4 py-3 text-left">MAC Address</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Risk Level</th>
              <th className="px-4 py-3 text-left">Last Active</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredDevices.map((device) => (
              <tr 
                key={device.id} 
                className={`
                  hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer
                  ${device.status === 'authorized' 
                    ? 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    : 'bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40'
                  }
                `}
                onClick={() => handleDeviceClick(device)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getStatusIcon(device.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{device.name}</p>
                      <p className="text-xs text-gray-500">{device.manufacturer}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{device.ip}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{device.mac}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(device.status)}`}>
                    {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-medium ${getRiskClass(device.risk)}`}>
                    {device.risk.charAt(0).toUpperCase() + device.risk.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <FiClock className="mr-1 text-gray-400" size={14} />
                    {isClient ? new Date(device.lastActive).toLocaleTimeString() : ''}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <FiMoreVertical className="text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showDeviceDetails && selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                <span className="text-blue-600 dark:text-blue-400">Sidemen Security</span> - Device Details
              </h2>
              <button 
                onClick={() => setShowDeviceDetails(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <span className="text-gray-500">×</span>
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  {getStatusIcon(selectedDevice.status)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{selectedDevice.name}</h3>
                  <p className="text-sm text-gray-500">{selectedDevice.manufacturer}</p>
                </div>
                <div className="ml-auto">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(selectedDevice.status)}`}>
                    {selectedDevice.status.charAt(0).toUpperCase() + selectedDevice.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">IP Address</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedDevice.ip}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">MAC Address</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedDevice.mac}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Device Type</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{selectedDevice.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                  <p className={`text-sm font-medium ${getRiskClass(selectedDevice.risk)}`}>
                    {selectedDevice.risk.charAt(0).toUpperCase() + selectedDevice.risk.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Active</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {new Date(selectedDevice.lastActive).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Security Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Firmware</span>
                    <span className="text-xs font-medium text-green-500">Up to date</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Authentication</span>
                    <span className="text-xs font-medium text-green-500">Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Encryption</span>
                    <span className="text-xs font-medium text-green-500">AES-256</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Blockchain ID</span>
                    <span className="text-xs font-medium text-gray-800 dark:text-white">0x7F3a...9B2d</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Actions</h4>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleSetCritical(selectedDevice)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    Set Critical Risk
                  </button>
                  <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    Isolate Device
                  </button>
                  <button className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                    Run Security Scan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authorization Modal */}
      {showAuthModal && selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Device Authorization
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300">
                Do you want to authorize this device?
              </p>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Name: {selectedDevice.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">IP: {selectedDevice.ip}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">MAC: {selectedDevice.mac}</p>
              </div>
            </div>

            {authStatus === 'loading' && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {authMessage && (
              <div className={`mb-4 p-3 rounded ${
                authStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {authMessage}
                {authStatus === 'error' && (
                  <button
                    onClick={() => {
                      setAuthStatus('idle');
                      setAuthMessage('');
                    }}
                    className="mt-2 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Go Back
                  </button>
                )}
              </div>
            )}

            {authStatus === 'idle' && (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAuthorize}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Authorize
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 