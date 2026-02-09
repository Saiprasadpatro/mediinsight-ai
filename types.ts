
export enum HealthStatus {
  NORMAL = 'Normal',
  BORDERLINE = 'Borderline',
  CONCERNING = 'Concerning'
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

export interface MedicalReport {
  id: string;
  date: string;
  type: 'Blood Test' | 'Prescription' | 'Imaging' | 'Doctor Note';
  title: string;
  summary: string;
  explanation: string;
  indicators: {
    label: string;
    value: string;
    range: string;
    status: HealthStatus;
  }[];
  fileUrl?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  purpose: string;
  remainingDoses: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface HealthMetric {
  date: string;
  value: number;
  label: string;
}
