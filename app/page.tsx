"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { SensorChart } from "@/components/sensors/sensor-chart";
import { useAppStore } from "@/lib/store/store";

export default function Home() {
  // Use Zustand store to load mock data
  const loadMockData = useAppStore((state) => state.loadMockData);
  
  // Load mock data on initial load
  useEffect(() => {
    loadMockData();
  }, [loadMockData]);
  
  return (
    <DashboardLayout>
      {/* Sticky header for mobile */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">Dashboard</h1>
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: 1 minute ago</span>
            <button className="ml-3 px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Refresh
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">

        {/* Overview section */}
        <OverviewCard className="" />

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          {/* Sensor charts */}
          <div className="col-span-1 lg:col-span-2 space-y-4 md:space-y-6">
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[300px]">
                <SensorChart 
                  sensorId="temp-1" 
                  title="Temperature" 
                  color="#3B82F6" 
                  unit="°C" 
                  timeRange="24h" 
                />
              </div>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[300px]">
                <SensorChart 
                  sensorId="ph-1" 
                  title="pH Level" 
                  color="#10B981" 
                  unit="pH" 
                  timeRange="24h" 
                />
              </div>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[300px]">
                <SensorChart 
                  sensorId="methane-1" 
                  title="Methane Concentration" 
                  color="#F59E0B" 
                  unit="%" 
                  timeRange="24h" 
                />
              </div>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[300px]">
                <SensorChart 
                  sensorId="pressure-1" 
                  title="Pressure" 
                  color="#8B5CF6" 
                  unit="kPa" 
                  timeRange="24h" 
                />
              </div>
            </div>
          </div>

          {/* Active alarms */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Active Alarms</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
                <p className="font-medium text-sm sm:text-base">Temperature Out of Range</p>
                <p className="text-xs sm:text-sm mt-1">Value: 36.5°C (Max: 35°C)</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-red-700 dark:text-red-300">5 minutes ago</span>
                  <button className="text-xs font-medium text-red-700 dark:text-red-300 hover:underline">
                    Acknowledge
                  </button>
                </div>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-md">
                <p className="font-medium text-sm sm:text-base">Pressure Rising</p>
                <p className="text-xs sm:text-sm mt-1">Value: 148 kPa (Max: 150 kPa)</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-amber-700 dark:text-amber-300">10 minutes ago</span>
                  <button className="text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline">
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
          {/* Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Events</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <p className="font-medium text-gray-900 dark:text-white">System Status Changed</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Status changed from Warning to Normal</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Today, 10:24 AM</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-1">
                <p className="font-medium text-gray-900 dark:text-white">Alarm Triggered</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Temperature out of range (36.5°C)</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Today, 10:12 AM</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-1">
                <p className="font-medium text-gray-900 dark:text-white">AI Insight</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimal temperature range detected</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday, 3:45 PM</p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Insights</h2>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded-md">
              <p className="font-medium">Optimal Temperature Range</p>
              <p className="text-sm mt-1">Maintaining temperature between 30-32°C will maximize biogas yield based on current readings.</p>
              <div className="mt-3">
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Recommendations:</p>
                <ul className="text-xs list-disc list-inside mt-1 space-y-1 text-purple-700 dark:text-purple-300">
                  <li>Adjust temperature control to maintain 31°C</li>
                  <li>Monitor methane production for next 48 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
