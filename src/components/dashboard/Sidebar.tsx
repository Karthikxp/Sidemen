"use client";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Sidemen Security</h2>
      <p className="text-lg text-gray-500 dark:text-gray-400">IoT Protection System</p>
      <div className="mt-4 space-x-2">
        <button
          onClick={() => setActiveView('overview')}
          className={`px-3 py-1 rounded-full text-sm ${
            activeView === 'overview'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveView('devices')}
          className={`px-3 py-1 rounded-full text-sm ${
            activeView === 'devices'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Devices
        </button>
      </div>
    </div>
  );
} 