"use client";

import { FiActivity, FiWifi, FiCpu } from 'react-icons/fi';

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

interface NetworkStatusProps {
  devices: Device[];
}

export default function NetworkStatus({ devices }: NetworkStatusProps) {
  // Calculate network metrics based on devices
  const activeDevices = devices.length;
  const connectedDevices = devices.filter(device => 
    new Date(device.lastActive).getTime() > Date.now() - 5 * 60 * 1000 // active in last 5 minutes
  ).length;
  
  // Calculate network load based on ideal range of 20-30 devices
  const getNetworkLoadStatus = (deviceCount: number) => {
    if (deviceCount <= 20) return { status: "Optimal", color: "text-green-600", load: Math.round((deviceCount / 20) * 100) };
    if (deviceCount <= 30) return { status: "Moderate", color: "text-yellow-600", load: Math.round(((deviceCount - 20) / 10 + 1) * 50) };
    return { status: "Heavy", color: "text-red-600", load: Math.min(100, Math.round(((deviceCount - 30) / 10 + 2) * 33)) };
  };

  const networkLoadInfo = getNetworkLoadStatus(activeDevices);
  
  const networkData = {
    networkStatus: activeDevices > 0 ? "Online" : "Offline",
    activeDevices,
    connectedDevices,
    networkLoad: networkLoadInfo.load,
    networkLoadStatus: networkLoadInfo.status,
    networkLoadColor: networkLoadInfo.color,
    lastScanTime: new Date().toLocaleTimeString(),
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Network Status</h2>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          networkData.networkStatus === "Online"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {networkData.networkStatus}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
            <FiActivity className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active Devices</p>
            <p className="font-semibold text-gray-800 dark:text-white">{networkData.activeDevices}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
            <FiWifi className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Connected</p>
            <p className="font-semibold text-gray-800 dark:text-white">{networkData.connectedDevices}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Network Load</h3>
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
            <FiCpu className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Load</p>
              <div className="flex items-center">
                <span className={`text-xs font-medium ${networkData.networkLoadColor} mr-2`}>
                  {networkData.networkLoadStatus}
                </span>
                <span className={`text-xs font-medium ${networkData.networkLoadColor}`}>
                  {networkData.networkLoad}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  networkData.networkLoad > 80 ? "bg-red-600" :
                  networkData.networkLoad > 50 ? "bg-yellow-600" :
                  "bg-green-600"
                }`}
                style={{ width: `${networkData.networkLoad}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {activeDevices <= 20 ? 
                "Network capacity is optimal (0-20 devices)" :
                activeDevices <= 30 ?
                "Moderate load (21-30 devices)" :
                "Heavy load (30+ devices) - Consider network optimization"
              }
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Last Scan</span>
            <span className="text-gray-800 dark:text-white">{networkData.lastScanTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 