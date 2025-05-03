import { create } from 'zustand';
import { 
  AlarmConfig, 
  AlarmEvent, 
  BiogasProduction, 
  EnergyCost, 
  MaterialCost, 
  OperationalCost, 
  SensorReading, 
  SystemState, 
  TimelineEvent, 
  UserPreferences,
  AIInsight
} from '@/types';
import { generateId } from '@/lib/utils/helpers';
import { MOCK_SENSOR_DATA } from '../data/mockData';

interface AppState {
  // System state
  systemState: SystemState;
  setSystemState: (state: Partial<SystemState>) => void;
  
  // Sensor readings
  sensorReadings: Record<string, SensorReading[]>;
  addSensorReading: (sensorId: string, reading: Omit<SensorReading, 'id' | 'sensorId'>) => void;
  
  // Alarms
  alarmConfigs: AlarmConfig[];
  alarmEvents: AlarmEvent[];
  addAlarmConfig: (config: Omit<AlarmConfig, 'id'>) => void;
  updateAlarmConfig: (id: string, config: Partial<AlarmConfig>) => void;
  removeAlarmConfig: (id: string) => void;
  addAlarmEvent: (event: Omit<AlarmEvent, 'id'>) => void;
  acknowledgeAlarm: (id: string) => void;
  
  // Cost tracking
  materialCosts: MaterialCost[];
  energyCosts: EnergyCost[];
  operationalCosts: OperationalCost[];
  addMaterialCost: (cost: Omit<MaterialCost, 'id'>) => void;
  addEnergyCost: (cost: Omit<EnergyCost, 'id'>) => void;
  addOperationalCost: (cost: Omit<OperationalCost, 'id'>) => void;
  
  // Biogas production
  biogasProduction: BiogasProduction[];
  addBiogasProduction: (production: Omit<BiogasProduction, 'id'>) => void;
  
  // Timeline events
  timelineEvents: TimelineEvent[];
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  
  // User preferences
  userPreferences: UserPreferences;
  updateUserPreferences: (prefs: Partial<UserPreferences>) => void;
  
  // AI Insights
  aiInsights: AIInsight[];
  addAIInsight: (insight: Omit<AIInsight, 'id'>) => void;
  
  // Dev helpers
  loadMockData: () => void;
}

// Create the store
export const useAppStore = create<AppState>((set) => ({
  // Initialize system state
  systemState: {
    status: 'normal',
    startDate: new Date().toISOString(),
    currentPhase: 'Setup',
    daysRemaining: 30,
    lastUpdate: new Date().toISOString(),
    runtime: 0
  },
  setSystemState: (newState) => 
    set((state) => ({ 
      systemState: { ...state.systemState, ...newState },
      timelineEvents: newState.status && newState.status !== state.systemState.status
        ? [
            {
              id: generateId(),
              timestamp: new Date().toISOString(),
              title: `System status changed to ${newState.status}`,
              description: `The system status has been updated from ${state.systemState.status} to ${newState.status}`,
              category: 'system',
              severity: newState.status === 'critical' ? 'critical' : newState.status === 'warning' ? 'warning' : 'info'
            },
            ...state.timelineEvents
          ]
        : state.timelineEvents
    })),
  
  // Sensor readings
  sensorReadings: {},
  addSensorReading: (sensorId, reading) => 
    set((state) => {
      const newReading = {
        ...reading,
        id: generateId(),
        sensorId,
      };
      
      const existingReadings = state.sensorReadings[sensorId] || [];
      const updatedReadings = [newReading, ...existingReadings].slice(0, 1000); // Keep last 1000 readings
      
      return {
        sensorReadings: {
          ...state.sensorReadings,
          [sensorId]: updatedReadings
        }
      };
    }),
  
  // Alarms
  alarmConfigs: [],
  alarmEvents: [],
  addAlarmConfig: (config) => 
    set((state) => ({
      alarmConfigs: [...state.alarmConfigs, { ...config, id: generateId() }]
    })),
  updateAlarmConfig: (id, config) =>
    set((state) => ({
      alarmConfigs: state.alarmConfigs.map(c => 
        c.id === id ? { ...c, ...config } : c
      )
    })),
  removeAlarmConfig: (id) =>
    set((state) => ({
      alarmConfigs: state.alarmConfigs.filter(c => c.id !== id)
    })),
  addAlarmEvent: (event) =>
    set((state) => {
      const newEvent = { ...event, id: generateId() };
      
      // Add to timeline as well
      const timelineEvent: TimelineEvent = {
        id: generateId(),
        timestamp: newEvent.timestamp,
        title: `Alarm triggered: ${newEvent.message}`,
        description: `Value: ${newEvent.value}`,
        category: 'alarm',
        severity: newEvent.severity
      };
      
      return {
        alarmEvents: [newEvent, ...state.alarmEvents],
        timelineEvents: [timelineEvent, ...state.timelineEvents]
      };
    }),
  acknowledgeAlarm: (id) =>
    set((state) => ({
      alarmEvents: state.alarmEvents.map(e => 
        e.id === id ? { ...e, acknowledged: true } : e
      )
    })),
  
  // Cost tracking
  materialCosts: [],
  energyCosts: [],
  operationalCosts: [],
  addMaterialCost: (cost) =>
    set((state) => ({
      materialCosts: [...state.materialCosts, { ...cost, id: generateId() }]
    })),
  addEnergyCost: (cost) =>
    set((state) => ({
      energyCosts: [...state.energyCosts, { ...cost, id: generateId() }]
    })),
  addOperationalCost: (cost) =>
    set((state) => ({
      operationalCosts: [...state.operationalCosts, { ...cost, id: generateId() }]
    })),
  
  // Biogas production
  biogasProduction: [],
  addBiogasProduction: (production) =>
    set((state) => ({
      biogasProduction: [...state.biogasProduction, { ...production, id: generateId() }]
    })),
  
  // Timeline events
  timelineEvents: [],
  addTimelineEvent: (event) =>
    set((state) => ({
      timelineEvents: [{ ...event, id: generateId() }, ...state.timelineEvents]
    })),
  
  // User preferences
  userPreferences: {
    theme: 'light',
    notificationsEnabled: true,
    dataRefreshInterval: 30,
    language: 'en',
    dashboardLayout: 'detailed'
  },
  updateUserPreferences: (prefs) =>
    set((state) => ({
      userPreferences: { ...state.userPreferences, ...prefs }
    })),
  
  // AI Insights
  aiInsights: [],
  addAIInsight: (insight) =>
    set((state) => {
      const newInsight = { ...insight, id: generateId() };
      
      // Add to timeline as well
      const timelineEvent: TimelineEvent = {
        id: generateId(),
        timestamp: newInsight.timestamp,
        title: `AI Insight: ${newInsight.title || newInsight.summary}`,
        description: newInsight.description || newInsight.details,
        category: 'ai'
      };
      
      return {
        aiInsights: [newInsight, ...state.aiInsights],
        timelineEvents: [timelineEvent, ...state.timelineEvents]
      };
    }),
  
  // Load mock data for development
  loadMockData: () => set(() => {
    const mockData = MOCK_SENSOR_DATA;
    return mockData;
  })
}));
