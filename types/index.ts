// Chat types
export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Types for sensor readings
export interface SensorReading {
  id: string;
  timestamp: string;
  value: number;
  unit: string;
  sensorId: string;
}

// Types for different sensor categories
export interface TemperatureSensor extends SensorReading {
  location: string;
}

export interface PHSensor extends SensorReading {
  calibrationDate?: string;
}

export interface MethaneSensor extends SensorReading {
  concentration: number; // percentage
}

export interface PressureSensor extends SensorReading {
  threshold: number;
}

export interface OxygenSensor extends SensorReading {
  safetyThreshold: number;
}

export interface WeightSensor extends SensorReading {
  tareWeight: number;
}

// Experiment system status
export type SystemStatus = 'normal' | 'warning' | 'critical';

export interface SystemState {
  status: SystemStatus;
  startDate: string;
  currentPhase: string;
  daysRemaining: number;
  lastUpdate: string;
  runtime: number; // in days
}

// Alarm configuration
export type AlarmSeverity = 'info' | 'warning' | 'critical';

export interface AlarmConfig {
  id: string;
  sensorId: string;
  parameterName: string;
  minThreshold?: number;
  maxThreshold?: number;
  severity: AlarmSeverity;
  enabled: boolean;
}

export interface AlarmEvent {
  id: string;
  configId: string;
  timestamp: string;
  value: number;
  message: string;
  severity: AlarmSeverity;
  acknowledged: boolean;
}

// Cost tracking
export interface MaterialCost {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  date: string;
  category: 'organic' | 'fungi' | 'nutrients' | 'buffer' | 'other';
}

export interface EnergyCost {
  id: string;
  deviceName: string;
  powerConsumption: number; // watts
  hoursUsed: number;
  date: string;
  costPerKwh: number;
}

export interface OperationalCost {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

// Biogas production
export interface BiogasProduction {
  id: string;
  date: string;
  volume: number; // liters
  methaneContent: number; // percentage
  energyEquivalent: number; // kWh
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  dataRefreshInterval: number; // seconds
  language: string;
  dashboardLayout: 'compact' | 'detailed';
}

// Experiment control
export interface ExperimentControl {
  id: string;
  parameterName: string;
  currentValue: number;
  targetValue: number;
  autoAdjust: boolean;
  adjustmentHistory: {
    timestamp: string;
    oldValue: number;
    newValue: number;
    isAutomatic: boolean;
  }[];
}

// AI Insights
export interface AIInsight {
  id: string;
  timestamp: string;
  title?: string; // Backward compatibility
  description?: string; // Backward compatibility
  summary: string; // New field for Gemini integration
  details: string; // New field for Gemini integration
  relatedParameters: string[];
  confidence: number;
  recommendations?: string[];
  status?: 'active' | 'error' | 'archived';
}

// Event timeline
export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'system' | 'sensor' | 'alarm' | 'user' | 'ai';
  severity?: AlarmSeverity;
}
