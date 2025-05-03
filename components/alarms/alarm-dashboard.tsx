"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store/store";
import { AlarmSeverity } from "@/types";
import { formatDate, getSeverityColor, getSeverityBgColor } from "@/lib/utils/helpers";
import { FiPlus, FiBell, FiAlertTriangle, FiInfo, FiCheck, FiSlash, FiEdit } from "react-icons/fi";

export function AlarmDashboard() {
  const alarmConfigs = useAppStore((state) => state.alarmConfigs);
  const alarmEvents = useAppStore((state) => state.alarmEvents);
  const acknowledgeAlarm = useAppStore((state) => state.acknowledgeAlarm);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'settings'>('active');

  // Count active alarms by severity
  const criticalCount = alarmEvents.filter(alarm => !alarm.acknowledged && alarm.severity === 'critical').length;
  const warningCount = alarmEvents.filter(alarm => !alarm.acknowledged && alarm.severity === 'warning').length;
  const infoCount = alarmEvents.filter(alarm => !alarm.acknowledged && alarm.severity === 'info').length;
  const totalActiveCount = criticalCount + warningCount + infoCount;

  // Get active alarms (unacknowledged)
  const activeAlarms = alarmEvents.filter(alarm => !alarm.acknowledged);
  
  // Get history (acknowledged alarms)
  const alarmHistory = alarmEvents.filter(alarm => alarm.acknowledged);

  // Handle alarm acknowledgement
  const handleAcknowledge = (id: string) => {
    acknowledgeAlarm(id);
  };

  // Get severity icon
  const getSeverityIcon = (severity: AlarmSeverity) => {
    switch (severity) {
      case 'critical':
        return <FiAlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <FiBell className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <FiInfo className="h-5 w-5 text-blue-500" />;
      default:
        return <FiInfo className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get alarm config details by configId
  const getAlarmConfigDetails = (configId: string) => {
    const config = alarmConfigs.find(c => c.id === configId);
    return config || null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Active Alarms
            {totalActiveCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {totalActiveCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Alarm History
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Alarm Settings
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'active' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">Critical Alarms</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">{criticalCount}</p>
                </div>
                <FiAlertTriangle className="h-10 w-10 text-red-400 dark:text-red-300" />
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Warning Alarms</p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">{warningCount}</p>
                </div>
                <FiBell className="h-10 w-10 text-amber-400 dark:text-amber-300" />
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Info Alerts</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{infoCount}</p>
                </div>
                <FiInfo className="h-10 w-10 text-blue-400 dark:text-blue-300" />
              </div>
            </div>

            {activeAlarms.length === 0 ? (
              <div className="text-center py-12">
                <FiCheck className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">All Clear</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No active alarms at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAlarms.map((alarm) => {
                  const config = getAlarmConfigDetails(alarm.configId);
                  return (
                    <div 
                      key={alarm.id}
                      className={`p-4 rounded-lg border ${getSeverityBgColor(alarm.severity)} ${
                        alarm.severity === 'critical' ? 'border-red-200 dark:border-red-800' :
                        alarm.severity === 'warning' ? 'border-amber-200 dark:border-amber-800' :
                        'border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          {getSeverityIcon(alarm.severity)}
                          <div>
                            <p className={`font-medium ${getSeverityColor(alarm.severity)}`}>{alarm.message}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Value: {alarm.value} {config?.maxThreshold ? `(Max: ${config.maxThreshold})` : config?.minThreshold ? `(Min: ${config.minThreshold})` : ''}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(alarm.timestamp, 'PPp')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAcknowledge(alarm.id)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60"
                        >
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                Export History
              </button>
            </div>
            
            {alarmHistory.length === 0 ? (
              <div className="text-center py-12">
                <FiSlash className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No alarm history available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Severity</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Message</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acknowledged</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {alarmHistory.map((alarm) => (
                      <tr key={alarm.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBgColor(alarm.severity)} ${getSeverityColor(alarm.severity)}`}>
                            {alarm.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{alarm.message}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{alarm.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(alarm.timestamp, 'PPp')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <FiCheck className="h-5 w-5 text-green-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alarm Configurations</h3>
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                <FiPlus className="mr-1" /> Add Alarm
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Parameter</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sensor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Min Threshold</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Max Threshold</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Severity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {alarmConfigs.map((config) => (
                    <tr key={config.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{config.parameterName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{config.sensorId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{config.minThreshold !== undefined ? config.minThreshold : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{config.maxThreshold !== undefined ? config.maxThreshold : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBgColor(config.severity)} ${getSeverityColor(config.severity)}`}>
                          {config.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          config.enabled 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {config.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                          <FiEdit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
