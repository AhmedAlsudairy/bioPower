"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AlarmDashboard } from "@/components/alarms/alarm-dashboard";
import { useAppStore } from "@/lib/store/store";

export default function AlarmsPage() {
  // Use Zustand store to load mock data if not already loaded
  const loadMockData = useAppStore((state) => state.loadMockData);
  const alarmConfigs = useAppStore((state) => state.alarmConfigs);
  
  // Load mock data if not already loaded
  useEffect(() => {
    if (alarmConfigs.length === 0) {
      loadMockData();
    }
  }, [loadMockData, alarmConfigs.length]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alarm Management</h1>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Configure Alerts
            </button>
          </div>
        </div>

        <AlarmDashboard />
      </div>
    </DashboardLayout>
  );
}
