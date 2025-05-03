"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store/store";
import { formatDate, getStatusColor, getStatusBgColor } from "@/lib/utils/helpers";
import { FiThermometer, FiActivity, FiDroplet, FiWind, FiZap, FiCalendar } from "react-icons/fi";

interface OverviewCardProps {
  className?: string;
}

export function OverviewCard({ className = "" }: OverviewCardProps) {
  const systemState = useAppStore((state) => state.systemState);
  const sensorReadings = useAppStore((state) => state.sensorReadings);
  
  // Client-side state for formatted dates
  const [formattedStartDate, setFormattedStartDate] = useState<string>("");
  const [formattedLastUpdate, setFormattedLastUpdate] = useState<string>("");
  
  // Format dates on the client side only to avoid hydration mismatch
  useEffect(() => {
    setFormattedStartDate(formatDate(systemState.startDate, 'PPP'));
    setFormattedLastUpdate(formatDate(systemState.lastUpdate, 'pp'));
  }, [systemState.startDate, systemState.lastUpdate]);
  
  // Get the most recent readings for each sensor type
  const getLatestReading = (sensorId: string) => {
    const readings = sensorReadings[sensorId] || [];
    return readings.length > 0 ? readings[0] : null;
  };
  
  const temperatureReading = getLatestReading("temp-1");
  const phReading = getLatestReading("ph-1");
  const methaneReading = getLatestReading("methane-1");
  const pressureReading = getLatestReading("pressure-1");

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Overview</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(systemState.status)} ${getStatusColor(systemState.status)}`}>
            {systemState.status.toUpperCase()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Temperature */}
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              <FiThermometer className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Temperature</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {temperatureReading ? `${temperatureReading.value.toFixed(1)}°C` : "N/A"}
              </p>
            </div>
          </div>
          
          {/* pH Level */}
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
              <FiDroplet className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">pH Level</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {phReading ? phReading.value.toFixed(2) : "N/A"}
              </p>
            </div>
          </div>
          
          {/* Methane */}
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300">
              <FiZap className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Methane</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {methaneReading ? `${methaneReading.value.toFixed(1)}%` : "N/A"}
              </p>
            </div>
          </div>
          
          {/* Pressure */}
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
              <FiActivity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pressure</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {pressureReading ? `${pressureReading.value.toFixed(1)} kPa` : "N/A"}
              </p>
            </div>
          </div>
          
          {/* Current Phase */}
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
              <FiWind className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Phase</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {systemState.currentPhase}
              </p>
            </div>
          </div>
          
          {/* Days Remaining */}
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Remaining</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {systemState.daysRemaining}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Started</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {formattedStartDate}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {formattedLastUpdate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
