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
    </div>
  );
} 