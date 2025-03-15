"use client";

import { FiAlertTriangle, FiShield } from 'react-icons/fi';

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

interface ThreatDetectionProps {
  devices: Device[];
}

export default function ThreatDetection({ devices }: ThreatDetectionProps) {
  // Calculate threat metrics based on device risks
  const criticalDevices = devices.filter(device => device.status === 'critical' || device.risk === 'high');
  const warningDevices = devices.filter(device => device.status === 'warning' || device.risk === 'medium');
  const normalDevices = devices.filter(device => device.status === 'normal' && device.risk === 'low');
  
  const threatData = {
    totalThreats: criticalDevices.length + warningDevices.length,
    criticalThreats: criticalDevices.length,
    warningThreats: warningDevices.length,
    secureDevices: normalDevices.length,
    lastScanTime: new Date().toLocaleTimeString(),
    threatTypes: [
      { 
        type: "Critical Risk Devices", 
        count: criticalDevices.length,
        devices: criticalDevices 
      },
      { 
        type: "Warning Level Devices", 
        count: warningDevices.length,
        devices: warningDevices 
      },
      { 
        type: "Secure Devices", 
        count: normalDevices.length,
        devices: normalDevices 
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Threat Detection</h2>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          threatData.totalThreats === 0 
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
            : threatData.criticalThreats > 0
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        }`}>
          {threatData.totalThreats === 0 
            ? "All Clear" 
            : threatData.criticalThreats > 0
              ? "Critical Threats"
              : "Warnings"
          }
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
            <FiAlertTriangle className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Critical Threats</p>
            <p className="font-semibold text-gray-800 dark:text-white">{threatData.criticalThreats}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
            <FiAlertTriangle className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Warnings</p>
            <p className="font-semibold text-gray-800 dark:text-white">{threatData.warningThreats}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
            <FiShield className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Secure Devices</p>
            <p className="font-semibold text-gray-800 dark:text-white">{threatData.secureDevices}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
            <FiShield className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Last Scan</p>
            <p className="font-semibold text-gray-800 dark:text-white">{threatData.lastScanTime}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Device Security Status</h3>
        <div className="space-y-2">
          {threatData.threatTypes.map((threat, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">{threat.type}</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                  <div 
                    className={`h-1.5 rounded-full ${
                      index === 0 ? 'bg-red-600' : 
                      index === 1 ? 'bg-yellow-600' : 
                      'bg-green-600'
                    }`}
                    style={{ width: `${(threat.count / devices.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-800 dark:text-white">{threat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 