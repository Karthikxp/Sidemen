"use client";

import { FiLock, FiCheckCircle, FiDatabase } from 'react-icons/fi';

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

interface SecurityMetricsProps {
  devices: Device[];
}

export default function SecurityMetrics({ devices }: SecurityMetricsProps) {
  // Smart security metrics calculation
  const totalDevices = devices.length;
  
  // Calculate device risk levels with weighted scoring
  const riskScores = devices.map(device => {
    let score = 0;
    
    // Base risk score from device status
    switch (device.status) {
      case 'critical': score -= 30; break;
      case 'warning': score -= 15; break;
      case 'normal': score += 10; break;
    }
    
    // Additional risk factors
    switch (device.risk) {
      case 'high': score -= 20; break;
      case 'medium': score -= 10; break;
      case 'low': score += 15; break;
    }
    
    // Time-based risk adjustment (devices inactive for more than 5 minutes are considered risky)
    const lastActiveTime = new Date(device.lastActive).getTime();
    const timeDiff = Date.now() - lastActiveTime;
    if (timeDiff > 5 * 60 * 1000) {
      score -= 10;
    }
    
    return score;
  });

  // Calculate overall security metrics
  const criticalDevices = devices.filter(device => 
    device.status === 'critical' || device.risk === 'high' || 
    (Date.now() - new Date(device.lastActive).getTime() > 10 * 60 * 1000) // Inactive for 10+ minutes
  ).length;
  
  const secureDevices = devices.filter(device => 
    device.status === 'normal' && device.risk === 'low' &&
    (Date.now() - new Date(device.lastActive).getTime() <= 5 * 60 * 1000) // Active in last 5 minutes
  ).length;

  // Calculate weighted security score
  const averageRiskScore = riskScores.reduce((acc, score) => acc + score, 0) / Math.max(1, totalDevices);
  const securityScore = Math.max(0, Math.min(100, Math.round(50 + averageRiskScore)));

  // Determine encryption strength based on device count and security score
  const getEncryptionLevel = () => {
    if (securityScore < 30) return "Basic-128";
    if (securityScore < 60) return "AES-192";
    return "AES-256";
  };

  // Smart status determination
  const getBlockchainStatus = () => {
    if (criticalDevices > 0) return "Critical";
    if (securityScore < 60) return "At Risk";
    return "Protected";
  };

  const securityData = {
    blockchainStatus: getBlockchainStatus(),
    lastBlockTime: new Date().toLocaleTimeString(),
    totalDevices,
    verifiedDevices: secureDevices,
    encryptionStatus: getEncryptionLevel(),
    zeroTrustScore: securityScore,
    aiDetectionStatus: securityScore > 40 ? "Active" : "Alert",
    selfHealingStatus: criticalDevices === 0 ? "Ready" : "Responding",
    threatLevel: criticalDevices > 0 ? "High" : securityScore < 60 ? "Moderate" : "Low"
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Sidemen Security</h2>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          securityData.blockchainStatus === "Protected"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : securityData.blockchainStatus === "At Risk"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          {securityData.blockchainStatus}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Network Protection</h3>
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
            <FiDatabase className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
              <p className={`text-xs font-medium ${
                securityData.threatLevel === "Low" ? "text-green-600" :
                securityData.threatLevel === "Moderate" ? "text-yellow-600" :
                "text-red-600"
              }`}>{securityData.blockchainStatus}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">Last Check</p>
              <p className="text-xs font-medium text-gray-800 dark:text-white">{securityData.lastBlockTime}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Devices</p>
              <p className="text-xs font-medium text-gray-800 dark:text-white">{securityData.totalDevices}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Security Status</h3>
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
            <FiLock className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">Encryption</p>
              <p className="text-xs font-medium text-gray-800 dark:text-white">{securityData.encryptionStatus}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">Secure Devices</p>
              <p className="text-xs font-medium text-gray-800 dark:text-white">{securityData.verifiedDevices}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Security Score</h3>
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
            <FiCheckCircle className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Overall Score</p>
              <p className={`text-xs font-medium ${
                securityData.zeroTrustScore > 80 ? "text-green-600" :
                securityData.zeroTrustScore > 50 ? "text-yellow-600" :
                "text-red-600"
              }`}>{securityData.zeroTrustScore}%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  securityData.zeroTrustScore > 80 ? "bg-green-600" :
                  securityData.zeroTrustScore > 50 ? "bg-yellow-600" :
                  "bg-red-600"
                }`}
                style={{ width: `${securityData.zeroTrustScore}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${securityData.aiDetectionStatus === 'Active' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">AI Detection: {securityData.aiDetectionStatus}</p>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${securityData.selfHealingStatus === 'Ready' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Self-Healing: {securityData.selfHealingStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 