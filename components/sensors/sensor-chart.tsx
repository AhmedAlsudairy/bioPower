"use client";

import { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { format, parseISO } from "date-fns";
import { useAppStore } from "@/lib/store/store";
import { SensorReading } from "@/types";

interface SensorChartProps {
  sensorId: string;
  title: string;
  color: string;
  unit: string;
  timeRange: "1h" | "6h" | "24h" | "7d" | "30d";
}

export function SensorChart({ 
  sensorId, 
  title, 
  color,
  unit,
  timeRange = "24h" 
}: SensorChartProps) {
  const [selectedRange, setSelectedRange] = useState<"1h" | "6h" | "24h" | "7d" | "30d">(timeRange);
  const sensorReadings = useAppStore((state) => state.sensorReadings[sensorId] || []);
  
  // Format timestamp for tooltip
  const formatXAxis = (timestamp: string) => {
    return format(parseISO(timestamp), "HH:mm");
  };
  
  // Format tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label ? format(parseISO(label), "p") : ""}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {`${title}: ${payload[0].value.toFixed(2)} ${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Filter data based on selected time range
  const getFilteredData = (): SensorReading[] => {
    if (!sensorReadings.length) return [];
    
    const now = new Date();
    let timeLimit: Date;
    
    switch (selectedRange) {
      case "1h":
        timeLimit = new Date(now.getTime() - 1 * 60 * 60 * 1000);
        break;
      case "6h":
        timeLimit = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case "24h":
        timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        timeLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    return sensorReadings.filter(reading => {
      const readingDate = parseISO(reading.timestamp);
      return readingDate >= timeLimit;
    });
  };
  
  const filteredData = getFilteredData();
  
  // Calculate min and max for Y-axis domain
  const getMinMax = () => {
    if (!filteredData.length) return [0, 100];
    
    const values = filteredData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Add 10% padding
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  };
  
  const [yMin, yMax] = getMinMax();
  
  // Handle time range change
  const handleRangeChange = (range: "1h" | "6h" | "24h" | "7d" | "30d") => {
    setSelectedRange(range);
  };
  
  // Calculate statistics
  const calculateStats = () => {
    if (!filteredData.length) return { avg: 0, min: 0, max: 0, current: 0 };
    
    const values = filteredData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const current = values[0];
    
    return { avg, min, max, current };
  };
  
  const stats = calculateStats();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <button 
            onClick={() => handleRangeChange("1h")} 
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              selectedRange === "1h" 
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            1H
          </button>
          <button 
            onClick={() => handleRangeChange("6h")} 
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              selectedRange === "6h" 
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            6H
          </button>
          <button 
            onClick={() => handleRangeChange("24h")} 
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              selectedRange === "24h" 
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            24H
          </button>
          <button 
            onClick={() => handleRangeChange("7d")} 
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              selectedRange === "7d" 
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            7D
          </button>
          <button 
            onClick={() => handleRangeChange("30d")} 
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              selectedRange === "30d" 
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            30D
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {stats.current.toFixed(2)} {unit}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {stats.avg.toFixed(2)} {unit}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Min</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {stats.min.toFixed(2)} {unit}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Max</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {stats.max.toFixed(2)} {unit}
          </p>
        </div>
      </div>
      
      <div className="h-60">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatXAxis} 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                domain={[yMin, yMax]} 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
