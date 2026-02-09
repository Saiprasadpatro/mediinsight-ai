
import { MedicalReport, Medication, User } from "../types";

const KEYS = {
  REPORTS: 'mediinsight_reports_',
  MEDICATIONS: 'mediinsight_meds_',
  FAMILY: 'mediinsight_family_',
  USER: 'mediinsight_current_user'
};

export const db = {
  getReports: (userId: string): MedicalReport[] => {
    const data = localStorage.getItem(KEYS.REPORTS + userId);
    return data ? JSON.parse(data) : [];
  },
  saveReport: (userId: string, report: MedicalReport) => {
    const reports = db.getReports(userId);
    const updated = [report, ...reports];
    localStorage.setItem(KEYS.REPORTS + userId, JSON.stringify(updated));
  },
  getMedications: (userId: string): Medication[] => {
    const data = localStorage.getItem(KEYS.MEDICATIONS + userId);
    return data ? JSON.parse(data) : [];
  },
  saveMedication: (userId: string, med: Medication) => {
    const meds = db.getMedications(userId);
    const updated = [med, ...meds];
    localStorage.setItem(KEYS.MEDICATIONS + userId, JSON.stringify(updated));
  },
  getFamilyMembers: (userId: string): Partial<User>[] => {
    const data = localStorage.getItem(KEYS.FAMILY + userId);
    return data ? JSON.parse(data) : [];
  },
  addFamilyMember: (userId: string, member: Partial<User>) => {
    const members = db.getFamilyMembers(userId);
    localStorage.setItem(KEYS.FAMILY + userId, JSON.stringify([...members, member]));
  }
};
