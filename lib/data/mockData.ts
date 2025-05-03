import { 
  AlarmConfig, 
  AlarmEvent, 
  BiogasProduction, 
  EnergyCost, 
  MaterialCost, 
  OperationalCost, 
  SystemState, 
  TimelineEvent, 
  UserPreferences,
  AIInsight,
  SensorReading
} from '@/types';
import { generateId } from '@/lib/utils/helpers';

// Helper to create dates in the past
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Helper to create hours ago
const hoursAgo = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

// Generate random number between min and max
const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Generate temperature readings for the past 24 hours
const generateTemperatureReadings = (sensorId: string, baseValue: number, variance: number): SensorReading[] => {
  const readings: SensorReading[] = [];
  
  for (let i = 0; i < 24; i++) {
    readings.push({
      id: generateId(),
      sensorId,
      timestamp: hoursAgo(i),
      value: baseValue + random(-variance, variance),
      unit: '°C'
    });
  }
  
  return readings;
};

// Generate pH readings for the past 24 hours
const generatePHReadings = (sensorId: string, baseValue: number, variance: number): SensorReading[] => {
  const readings: SensorReading[] = [];
  
  for (let i = 0; i < 24; i++) {
    readings.push({
      id: generateId(),
      sensorId,
      timestamp: hoursAgo(i),
      value: baseValue + random(-variance, variance),
      unit: 'pH'
    });
  }
  
  return readings;
};

// Generate methane gas readings for the past 24 hours
const generateMethaneReadings = (sensorId: string, baseValue: number, variance: number): SensorReading[] => {
  const readings: SensorReading[] = [];
  
  for (let i = 0; i < 24; i++) {
    readings.push({
      id: generateId(),
      sensorId,
      timestamp: hoursAgo(i),
      value: baseValue + random(-variance, variance),
      unit: '%'
    });
  }
  
  return readings;
};

// Generate pressure readings for the past 24 hours
const generatePressureReadings = (sensorId: string, baseValue: number, variance: number): SensorReading[] => {
  const readings: SensorReading[] = [];
  
  for (let i = 0; i < 24; i++) {
    readings.push({
      id: generateId(),
      sensorId,
      timestamp: hoursAgo(i),
      value: baseValue + random(-variance, variance),
      unit: 'kPa'
    });
  }
  
  return readings;
};

// Generate oxygen readings for the past 24 hours
const generateOxygenReadings = (sensorId: string, baseValue: number, variance: number): SensorReading[] => {
  const readings: SensorReading[] = [];
  
  for (let i = 0; i < 24; i++) {
    readings.push({
      id: generateId(),
      sensorId,
      timestamp: hoursAgo(i),
      value: baseValue + random(-variance, variance),
      unit: '%'
    });
  }
  
  return readings;
};

// Generate weight readings for the past 24 hours
const generateWeightReadings = (sensorId: string, baseValue: number, variance: number): SensorReading[] => {
  const readings: SensorReading[] = [];
  
  for (let i = 0; i < 24; i++) {
    readings.push({
      id: generateId(),
      sensorId,
      timestamp: hoursAgo(i),
      value: baseValue + random(-variance, variance),
      unit: 'kg'
    });
  }
  
  return readings;
};

// Generate mock alarm configs
const generateAlarmConfigs = (): AlarmConfig[] => {
  return [
    {
      id: generateId(),
      sensorId: 'temp-1',
      parameterName: 'Temperature',
      minThreshold: 25,
      maxThreshold: 35,
      severity: 'critical',
      enabled: true
    },
    {
      id: generateId(),
      sensorId: 'ph-1',
      parameterName: 'pH Level',
      minThreshold: 6,
      maxThreshold: 7,
      severity: 'warning',
      enabled: true
    },
    {
      id: generateId(),
      sensorId: 'methane-1',
      parameterName: 'Methane Concentration',
      minThreshold: undefined,
      maxThreshold: 60,
      severity: 'critical',
      enabled: true
    },
    {
      id: generateId(),
      sensorId: 'pressure-1',
      parameterName: 'Pressure',
      minThreshold: undefined,
      maxThreshold: 150,
      severity: 'warning',
      enabled: true
    },
    {
      id: generateId(),
      sensorId: 'oxygen-1',
      parameterName: 'Oxygen Level',
      minThreshold: undefined,
      maxThreshold: 5,
      severity: 'critical',
      enabled: true
    }
  ];
};

// Generate mock alarm events
const generateAlarmEvents = (configs: AlarmConfig[]): AlarmEvent[] => {
  const events: AlarmEvent[] = [];
  
  // Create some alarm events based on the configs
  configs.forEach(config => {
    if (Math.random() > 0.7) { // 30% chance of triggering an alarm
      events.push({
        id: generateId(),
        configId: config.id,
        timestamp: hoursAgo(Math.floor(random(0, 24))),
        value: config.maxThreshold ? config.maxThreshold + random(1, 5) : (config.minThreshold ? config.minThreshold - random(1, 5) : 0),
        message: `${config.parameterName} out of range`,
        severity: config.severity,
        acknowledged: Math.random() > 0.5
      });
    }
  });
  
  return events;
};

// Generate mock material costs
const generateMaterialCosts = (): MaterialCost[] => {
  return [
    {
      id: generateId(),
      name: 'Fruit Peels',
      quantity: 5,
      unitCost: 0.5,
      date: daysAgo(20),
      category: 'organic'
    },
    {
      id: generateId(),
      name: 'Food Waste',
      quantity: 10,
      unitCost: 0.2,
      date: daysAgo(18),
      category: 'organic'
    },
    {
      id: generateId(),
      name: 'Fusarium Fungi',
      quantity: 0.5,
      unitCost: 30,
      date: daysAgo(15),
      category: 'fungi'
    },
    {
      id: generateId(),
      name: 'Ammonium Nitrate',
      quantity: 1,
      unitCost: 12,
      date: daysAgo(15),
      category: 'nutrients'
    },
    {
      id: generateId(),
      name: 'Potassium dihydrogen phosphate',
      quantity: 0.5,
      unitCost: 15,
      date: daysAgo(12),
      category: 'buffer'
    },
    {
      id: generateId(),
      name: 'Potassium hydrogen phosphate',
      quantity: 0.5,
      unitCost: 18,
      date: daysAgo(12),
      category: 'buffer'
    },
    {
      id: generateId(),
      name: 'Sterilized Water',
      quantity: 10,
      unitCost: 1,
      date: daysAgo(10),
      category: 'other'
    }
  ];
};

// Generate mock energy costs
const generateEnergyCosts = (): EnergyCost[] => {
  return [
    {
      id: generateId(),
      deviceName: 'Temperature Control System',
      powerConsumption: 100,
      hoursUsed: 24 * 20,
      date: daysAgo(1),
      costPerKwh: 0.15
    },
    {
      id: generateId(),
      deviceName: 'pH Adjustment Pump',
      powerConsumption: 50,
      hoursUsed: 120,
      date: daysAgo(1),
      costPerKwh: 0.15
    },
    {
      id: generateId(),
      deviceName: 'Gas Collection System',
      powerConsumption: 75,
      hoursUsed: 480,
      date: daysAgo(1),
      costPerKwh: 0.15
    },
    {
      id: generateId(),
      deviceName: 'Monitoring Equipment',
      powerConsumption: 30,
      hoursUsed: 24 * 20,
      date: daysAgo(1),
      costPerKwh: 0.15
    }
  ];
};

// Generate mock operational costs
const generateOperationalCosts = (): OperationalCost[] => {
  return [
    {
      id: generateId(),
      description: 'Equipment Maintenance',
      amount: 50,
      date: daysAgo(10),
      category: 'maintenance'
    },
    {
      id: generateId(),
      description: 'Sensor Calibration',
      amount: 75,
      date: daysAgo(15),
      category: 'calibration'
    },
    {
      id: generateId(),
      description: 'Lab Analysis',
      amount: 120,
      date: daysAgo(7),
      category: 'analysis'
    }
  ];
};

// Generate mock biogas production data
const generateBiogasProduction = (): BiogasProduction[] => {
  const data: BiogasProduction[] = [];
  
  for (let i = 0; i < 20; i++) {
    // Simulate increasing production over time
    const dayFactor = i / 20; // 0 to 1
    
    data.push({
      id: generateId(),
      date: daysAgo(20 - i),
      volume: 2 + (8 * dayFactor) + random(-0.5, 0.5),
      methaneContent: 40 + (30 * dayFactor) + random(-5, 5),
      energyEquivalent: 0 // Will be calculated later
    });
  }
  
  // Calculate energy equivalent
  return data.map(item => ({
    ...item,
    energyEquivalent: (item.volume / 1000) * (item.methaneContent / 100) * 10 // Formula: volume(m³) * methane% * 10kWh/m³
  }));
};

// Generate timeline events
const generateTimelineEvents = (): TimelineEvent[] => {
  return [
    {
      id: generateId(),
      timestamp: daysAgo(20),
      title: 'Experiment Started',
      description: 'Initial setup complete. Starting anaerobic digestion process.',
      category: 'system'
    },
    {
      id: generateId(),
      timestamp: daysAgo(18),
      title: 'Oxygen Removal Complete',
      description: 'Successfully removed oxygen from container to ensure anaerobic conditions.',
      category: 'sensor'
    },
    {
      id: generateId(),
      timestamp: daysAgo(15),
      title: 'First Gas Production Detected',
      description: 'Initial signs of biogas production detected.',
      category: 'sensor'
    },
    {
      id: generateId(),
      timestamp: daysAgo(12),
      title: 'pH Adjustment',
      description: 'Buffer solution added to maintain optimal pH level.',
      category: 'user'
    },
    {
      id: generateId(),
      timestamp: daysAgo(10),
      title: 'Temperature Alert',
      description: 'Temperature exceeded 35°C. Cooling initiated.',
      category: 'alarm',
      severity: 'warning'
    },
    {
      id: generateId(),
      timestamp: daysAgo(7),
      title: 'Optimized Gas Production',
      description: 'AI analysis suggests optimal conditions reached for methane production.',
      category: 'ai'
    },
    {
      id: generateId(),
      timestamp: daysAgo(5),
      title: 'Methane Concentration High',
      description: 'Methane concentration reached 55% indicating effective digestion.',
      category: 'sensor'
    },
    {
      id: generateId(),
      timestamp: daysAgo(3),
      title: 'Gas Collection System Full',
      description: 'Gas storage at 80% capacity. Collection system expanded.',
      category: 'user'
    },
    {
      id: generateId(),
      timestamp: daysAgo(1),
      title: 'Energy Output Calculation',
      description: 'Current biogas production equivalent to 0.5 kWh per day.',
      category: 'ai'
    }
  ];
};

// Generate AI insights
const generateAIInsights = (): AIInsight[] => {
  return [
    {
      id: generateId(),
      timestamp: daysAgo(10),
      title: 'Optimal Temperature Range Detected',
      description: 'Based on current methane production rates, maintaining temperature between 30-32°C will maximize biogas yield.',
      summary: 'Optimal Temperature Range Detected',
      details: 'Based on current methane production rates, maintaining temperature between 30-32°C will maximize biogas yield.',
      relatedParameters: ['temperature', 'methane'],
      confidence: 0.85,
      recommendations: [
        'Adjust temperature control to maintain 31°C',
        'Monitor methane production for next 48 hours to confirm'
      ],
      status: 'active'
    },
    {
      id: generateId(),
      timestamp: daysAgo(7),
      title: 'pH Balance Critical for Process Stability',
      description: 'Analysis shows pH fluctuations correlating with decreased gas production. Maintaining stable pH is essential.',
      summary: 'pH Balance Critical for Process Stability',
      details: 'Analysis shows pH fluctuations correlating with decreased gas production. Maintaining stable pH is essential.',
      relatedParameters: ['ph', 'biogas-volume'],
      confidence: 0.92,
      recommendations: [
        'Increase buffer solution concentration by 5%',
        'Implement automated pH correction for values below 6.5'
      ],
      status: 'active'
    },
    {
      id: generateId(),
      timestamp: daysAgo(4),
      title: 'Organic Material Processing Rate',
      description: 'Current substrate consumption rate indicates experiment completion in 24±3 days at current conditions.',
      summary: 'Organic Material Processing Rate',
      details: 'Current substrate consumption rate indicates experiment completion in 24±3 days at current conditions.',
      relatedParameters: ['weight', 'methane', 'temperature'],
      confidence: 0.78,
      recommendations: [
        'No intervention required if current parameters are maintained',
        'Consider adding 100g additional substrate to extend production phase'
      ],
      status: 'active'
    },
    {
      id: generateId(),
      timestamp: daysAgo(2),
      title: 'Anomaly Detected in Oxygen Sensor',
      description: 'Pattern analysis suggests oxygen sensor calibration drift. Readings may be 0.5-1% higher than actual values.',
      summary: 'Anomaly Detected in Oxygen Sensor',
      details: 'Pattern analysis suggests oxygen sensor calibration drift. Readings may be 0.5-1% higher than actual values.',
      relatedParameters: ['oxygen'],
      confidence: 0.89,
      recommendations: [
        'Recalibrate oxygen sensor',
        'Verify anaerobic conditions using alternative method'
      ],
      status: 'active'
    }
  ];
};

// Create the complete mock data
export const MOCK_SENSOR_DATA = {
  systemState: {
    status: 'normal',
    startDate: daysAgo(20),
    currentPhase: 'Gas Production',
    daysRemaining: 10,
    lastUpdate: hoursAgo(1)
  } as SystemState,
  
  sensorReadings: {
    'temp-1': generateTemperatureReadings('temp-1', 30, 2),
    'ph-1': generatePHReadings('ph-1', 6.8, 0.3),
    'methane-1': generateMethaneReadings('methane-1', 45, 5),
    'pressure-1': generatePressureReadings('pressure-1', 110, 10),
    'oxygen-1': generateOxygenReadings('oxygen-1', 0.8, 0.4),
    'weight-1': generateWeightReadings('weight-1', 450, 5)
  },
  
  alarmConfigs: generateAlarmConfigs(),
  alarmEvents: [] as AlarmEvent[], // Will be populated after alarm configs are generated
  
  materialCosts: generateMaterialCosts(),
  energyCosts: generateEnergyCosts(),
  operationalCosts: generateOperationalCosts(),
  
  biogasProduction: generateBiogasProduction(),
  
  timelineEvents: generateTimelineEvents(),
  
  userPreferences: {
    theme: 'light',
    notificationsEnabled: true,
    dataRefreshInterval: 30,
    language: 'en',
    dashboardLayout: 'detailed'
  } as UserPreferences,
  
  aiInsights: generateAIInsights()
};

// Now add alarm events based on the configs
MOCK_SENSOR_DATA.alarmEvents = generateAlarmEvents(MOCK_SENSOR_DATA.alarmConfigs);
