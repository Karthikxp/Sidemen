"use client";

import { useState, useEffect } from 'react';
import { FiBell, FiSearch, FiMoon, FiSun, FiRefreshCw, FiLogOut, FiClock } from 'react-icons/fi';

interface HeaderProps {
  onScan: () => void;
  onToggleAutoScan: () => void;
  isScanning: boolean;
  isAutoScanEnabled: boolean;
  onLogout: () => void;
  devices: Device[];
}

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

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function Header({ onScan, onToggleAutoScan, isScanning, isAutoScanEnabled, onLogout, devices }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Device[]>([]);

  useEffect(() => {
    const unauthorizedCount = devices.filter(d => d.status !== 'authorized').length;
    setNotifications([{
      id: 1,
      title: 'Network Security',
      message: `There are currently ${unauthorizedCount} unauthorised devices in the network`,
      time: new Date().toLocaleTimeString(),
      read: false,
    }]);
  }, [devices]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = devices.filter(device => 
        device.ip.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search IP address..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {showSearchResults && searchQuery && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
              {searchResults.length > 0 ? (
                searchResults.map(device => (
                  <div key={device.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{device.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">IP: {device.ip}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">MAC: {device.mac}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Status: {device.status}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        device.status === 'authorized' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {device.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-600 dark:text-gray-400">No devices found</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onScan}
            disabled={isScanning}
            className={`flex items-center px-3 py-1.5 rounded-lg text-white ${
              isScanning ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <FiRefreshCw className={`mr-2 ${isScanning ? 'animate-spin' : ''}`} size={16} />
            {isScanning ? 'Scanning...' : 'Scan Network'}
          </button>

          <button 
            onClick={onToggleAutoScan}
            className={`flex items-center px-3 py-1.5 rounded-lg ${
              isAutoScanEnabled 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            <FiClock className="mr-2" size={16} />
            {isAutoScanEnabled ? 'Auto: ON' : 'Auto: OFF'}
          </button>
        </div>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {darkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <FiBell className="text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Notifications</h3>
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onLogout}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="Logout"
        >
          <FiLogOut size={20} />
        </button>
      </div>
    </header>
  );
} 