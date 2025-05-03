// Chat Data Service
// This service connects the chatbot to the application's data store

import { useAppStore } from '../store/store';
import { SensorReading, AlarmEvent, SystemState, AIInsight, TimelineEvent } from '@/types';

/**
 * Gets the latest reading for a specific sensor
 */
export const getLatestSensorReading = (sensorId: string): SensorReading | null => {
  const store = useAppStore.getState();
  const readings = store.sensorReadings[sensorId] || [];
  
  if (readings.length === 0) {
    return null;
  }
  
  // Return the most recent reading (first in the array)
  return readings[0];
};

/**
 * Gets the average value for a sensor over the last n hours
 */
export const getSensorAverage = (sensorId: string, hours: number = 24): number | null => {
  const store = useAppStore.getState();
  const readings = store.sensorReadings[sensorId] || [];
  
  if (readings.length === 0) {
    return null;
  }
  
  // Filter readings from the last n hours
  const now = new Date();
  const cutoff = new Date(now.getTime() - (hours * 60 * 60 * 1000));
  
  const recentReadings = readings.filter(
    reading => new Date(reading.timestamp) >= cutoff
  );
  
  if (recentReadings.length === 0) {
    return null;
  }
  
  // Calculate average
  const sum = recentReadings.reduce((acc, reading) => acc + reading.value, 0);
  return sum / recentReadings.length;
};

/**
 * Gets the min/max values for a sensor over the last n hours
 */
export const getSensorMinMax = (sensorId: string, hours: number = 24): { min: number; max: number } | null => {
  const store = useAppStore.getState();
  const readings = store.sensorReadings[sensorId] || [];
  
  if (readings.length === 0) {
    return null;
  }
  
  // Filter readings from the last n hours
  const now = new Date();
  const cutoff = new Date(now.getTime() - (hours * 60 * 60 * 1000));
  
  const recentReadings = readings.filter(
    reading => new Date(reading.timestamp) >= cutoff
  );
  
  if (recentReadings.length === 0) {
    return null;
  }
  
  // Calculate min and max
  const values = recentReadings.map(reading => reading.value);
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
};

/**
 * Gets active alarms (unacknowledged)
 */
export const getActiveAlarms = (): AlarmEvent[] => {
  const store = useAppStore.getState();
  return store.alarmEvents.filter(alarm => !alarm.acknowledged);
};

/**
 * Gets current system state
 */
export const getSystemState = (): SystemState => {
  const store = useAppStore.getState();
  return store.systemState;
};

/**
 * Gets the most recent AI insights
 */
export const getRecentInsights = (count: number = 3): AIInsight[] => {
  const store = useAppStore.getState();
  return store.aiInsights.slice(0, count);
};

/**
 * Gets recent timeline events
 */
export const getRecentEvents = (count: number = 5): TimelineEvent[] => {
  const store = useAppStore.getState();
  return store.timelineEvents.slice(0, count);
};

/**
 * Gets all information about a specific parameter (sensor)
 */
export const getParameterInfo = (parameter: string): {
  latestReading?: SensorReading | null;
  average?: number | null;
  minMax?: { min: number; max: number } | null;
  alarms?: AlarmEvent[];
  alarmConfig?: { id: string; sensorId: string; parameterName: string; minThreshold?: number; maxThreshold?: number; severity: string; enabled: boolean } | undefined;
} => {
  const store = useAppStore.getState();
  
  // Map common parameter names to sensor IDs
  const sensorIdMap: Record<string, string> = {
    'temperature': 'temp-1',
    'temp': 'temp-1',
    'ph': 'ph-1',
    'acidity': 'ph-1',
    'methane': 'methane-1',
    'gas': 'methane-1',
    'pressure': 'pressure-1',
    'oxygen': 'oxygen-1',
    'o2': 'oxygen-1',
    'weight': 'weight-1',
    'mass': 'weight-1'
  };
  
  const sensorId = sensorIdMap[parameter.toLowerCase()] || parameter;
  
  // Get related alarm config
  const alarmConfig = store.alarmConfigs.find(config => config.sensorId === sensorId);
  
  // Get related alarms
  const alarms = store.alarmEvents.filter(alarm => {
    const config = store.alarmConfigs.find(c => c.id === alarm.configId);
    return config?.sensorId === sensorId;
  });
  
  return {
    latestReading: getLatestSensorReading(sensorId),
    average: getSensorAverage(sensorId),
    minMax: getSensorMinMax(sensorId),
    alarms,
    alarmConfig
  };
};

/**
 * Generates a text summary of the system status
 */
export const generateSystemSummary = (): string => {
  const state = getSystemState();
  const activeAlarms = getActiveAlarms();
  const recentEvents = getRecentEvents(3);
  
  let summary = `Current system status: ${state.status}. `;
  summary += `Current phase: ${state.currentPhase}. `;
  
  if (state.daysRemaining !== undefined) {
    summary += `Estimated days remaining: ${state.daysRemaining}. `;
  }
  
  if (activeAlarms.length > 0) {
    summary += `There are ${activeAlarms.length} active alarms that require attention. `;
    
    // Add details of the most critical alarm
    const criticalAlarms = activeAlarms.filter(a => a.severity === 'critical');
    if (criticalAlarms.length > 0) {
      summary += `Most critical: ${criticalAlarms[0].message} (value: ${criticalAlarms[0].value}). `;
    }
  } else {
    summary += `No active alarms. `;
  }
  
  if (recentEvents.length > 0) {
    summary += `Recent event: ${recentEvents[0].title} - ${recentEvents[0].description}`;
  }
  
  return summary;
};

/**
 * Generates a summary of a specific sensor's data
 */
export const generateSensorSummary = (sensorId: string): string => {
  const info = getParameterInfo(sensorId);
  
  if (!info.latestReading) {
    return `No data available for ${sensorId}.`;
  }
  
  let summary = `${info.latestReading.unit === '°C' ? 'Temperature' : info.latestReading.unit === 'pH' ? 'pH level' : info.latestReading.unit === '%' && sensorId.includes('methane') ? 'Methane concentration' : info.latestReading.unit === 'kPa' ? 'Pressure' : info.latestReading.unit === '%' && sensorId.includes('oxygen') ? 'Oxygen level' : 'Parameter'} `;
  summary += `current reading: ${info.latestReading.value.toFixed(2)} ${info.latestReading.unit}. `;
  
  if (info.average !== null && info.average !== undefined) {
    summary += `24-hour average: ${info.average.toFixed(2)} ${info.latestReading.unit}. `;
  }
  
  if (info.minMax) {
    summary += `24-hour range: ${info.minMax.min.toFixed(2)} - ${info.minMax.max.toFixed(2)} ${info.latestReading.unit}. `;
  }
  
  if (info.alarmConfig) {
    summary += `Configured safe range: `;
    if (info.alarmConfig.minThreshold !== undefined) {
      summary += `minimum ${info.alarmConfig.minThreshold} ${info.latestReading.unit}`;
    }
    if (info.alarmConfig.minThreshold !== undefined && info.alarmConfig.maxThreshold !== undefined) {
      summary += ` to `;
    }
    if (info.alarmConfig.maxThreshold !== undefined) {
      summary += `maximum ${info.alarmConfig.maxThreshold} ${info.latestReading.unit}`;
    }
    summary += `. `;
  }
  
  if (info.alarms && info.alarms.length > 0) {
    const activeAlarms = info.alarms.filter(a => !a.acknowledged);
    if (activeAlarms.length > 0) {
      summary += `There ${activeAlarms.length === 1 ? 'is' : 'are'} ${activeAlarms.length} active alarm${activeAlarms.length === 1 ? '' : 's'} for this parameter.`;
    }
  }
  
  return summary;
};
