import { format, parseISO } from 'date-fns';
import { AlarmSeverity, SystemStatus } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a more readable format
 */
export function formatDate(dateString: string, formatString: string = 'PPp') {
  try {
    return format(parseISO(dateString), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Returns the appropriate color class based on system status
 */
export function getStatusColor(status: SystemStatus): string {
  switch (status) {
    case 'normal':
      return 'text-green-500';
    case 'warning':
      return 'text-amber-500';
    case 'critical':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Returns the appropriate background color class based on system status
 */
export function getStatusBgColor(status: SystemStatus): string {
  switch (status) {
    case 'normal':
      return 'bg-green-100 dark:bg-green-900/20';
    case 'warning':
      return 'bg-amber-100 dark:bg-amber-900/20';
    case 'critical':
      return 'bg-red-100 dark:bg-red-900/20';
    default:
      return 'bg-gray-100 dark:bg-gray-800';
  }
}

/**
 * Returns the appropriate color class based on alarm severity
 */
export function getSeverityColor(severity: AlarmSeverity): string {
  switch (severity) {
    case 'info':
      return 'text-blue-500';
    case 'warning':
      return 'text-amber-500';
    case 'critical':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Returns the appropriate background color class based on alarm severity
 */
export function getSeverityBgColor(severity: AlarmSeverity): string {
  switch (severity) {
    case 'info':
      return 'bg-blue-100 dark:bg-blue-900/20';
    case 'warning':
      return 'bg-amber-100 dark:bg-amber-900/20';
    case 'critical':
      return 'bg-red-100 dark:bg-red-900/20';
    default:
      return 'bg-gray-100 dark:bg-gray-800';
  }
}

/**
 * Formats a number to a specified number of decimal places with unit
 */
export function formatNumberWithUnit(value: number, unit: string, decimals: number = 2): string {
  return `${value.toFixed(decimals)} ${unit}`;
}

/**
 * Calculates if a value is within thresholds
 */
export function isWithinThresholds(value: number, minThreshold?: number, maxThreshold?: number): boolean {
  if (minThreshold !== undefined && value < minThreshold) {
    return false;
  }
  if (maxThreshold !== undefined && value > maxThreshold) {
    return false;
  }
  return true;
}

/**
 * Determines the system status based on active alarms
 */
export function determineSystemStatus(criticalCount: number, warningCount: number): SystemStatus {
  if (criticalCount > 0) {
    return 'critical';
  } else if (warningCount > 0) {
    return 'warning';
  }
  return 'normal';
}

/**
 * Calculates energy cost
 */
export function calculateEnergyCost(powerConsumptionWatts: number, hoursUsed: number, ratePerKwh: number): number {
  // Convert watts to kilowatts
  const powerKw = powerConsumptionWatts / 1000;
  // Calculate kWh
  const kWh = powerKw * hoursUsed;
  // Calculate cost
  return kWh * ratePerKwh;
}

/**
 * Calculates biogas energy equivalent in kWh
 * Formula assumes methane content percentage and standard energy content of methane
 */
export function calculateBiogasEnergyEquivalent(volumeLiters: number, methaneContentPercent: number): number {
  // Standard energy content of methane is approximately 10 kWh/m³
  const methaneEnergyContentKwhPerCubicMeter = 10;
  
  // Convert liters to cubic meters and adjust for methane content
  const methaneCubicMeters = (volumeLiters / 1000) * (methaneContentPercent / 100);
  
  // Calculate energy equivalent
  return methaneCubicMeters * methaneEnergyContentKwhPerCubicMeter;
}
