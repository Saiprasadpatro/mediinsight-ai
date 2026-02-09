
import { MedicalReport, HealthStatus, Medication, HealthMetric } from "../types";

export const MOCK_REPORTS: MedicalReport[] = [
  {
    id: '1',
    date: '2024-03-15',
    type: 'Blood Test',
    title: 'Annual Comprehensive Metabolic Panel',
    summary: 'Routine metabolic panel showing mostly normal values with slightly elevated LDL cholesterol.',
    explanation: 'Your blood sugar and kidney function look great. However, your "bad" cholesterol (LDL) is a bit higher than the ideal range, which we should keep an eye on through diet.',
    indicators: [
      { label: 'Glucose', value: '92 mg/dL', range: '70-99', status: HealthStatus.NORMAL },
      { label: 'LDL Cholesterol', value: '135 mg/dL', range: '< 100', status: HealthStatus.BORDERLINE },
      { label: 'Hemoglobin', value: '14.2 g/dL', range: '13.5-17.5', status: HealthStatus.NORMAL },
    ]
  },
  {
    id: '2',
    date: '2023-11-20',
    type: 'Prescription',
    title: 'Antibiotic Course - Sinusitis',
    summary: 'Prescription for Amoxicillin to treat an acute sinus infection.',
    explanation: 'This medication is used to clear up the bacterial infection in your sinuses. Make sure to finish the entire 10-day course even if you start feeling better.',
    indicators: [
      { label: 'Dosage', value: '500mg', range: 'Twice daily', status: HealthStatus.NORMAL }
    ]
  }
];

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: 'm1',
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily at night',
    startDate: '2024-03-20',
    purpose: 'Cholesterol Management',
    remainingDoses: 24
  },
  {
    id: 'm2',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'Once daily',
    startDate: '2023-01-01',
    purpose: 'Bone Health & Immune Support',
    remainingDoses: 15
  }
];

export const MOCK_TRENDS: HealthMetric[] = [
  { date: 'Oct 23', value: 145, label: 'LDL' },
  { date: 'Nov 23', value: 142, label: 'LDL' },
  { date: 'Dec 23', value: 138, label: 'LDL' },
  { date: 'Jan 24', value: 140, label: 'LDL' },
  { date: 'Feb 24', value: 135, label: 'LDL' },
  { date: 'Mar 24', value: 135, label: 'LDL' },
];
