// Student type
export interface Student {
  id: string;
  internalCode: string;
  fullName: string;
  phone?: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

// Session type
export type SessionType = 'class' | 'double_class' | 'exam';

export interface Session {
  id: string;
  studentId: string;
  date: string; // ISO date
  time: string; // HH:MM format
  type: SessionType;
  signature?: string; // Base64 encoded image
  createdAt: string;
  updatedAt: string;
}

// Statistics type
export interface Statistics {
  totalClasses: number;
  totalDoubleClasses: number;
  totalExams: number;
  totalUnits: number;
  extraUnits: number;
  extraPayment: number;
  bonusActivated: boolean;
}

// Goals/Objectives configuration
export interface GoalsConfig {
  baseUnits: number;
  extraPaymentPerUnit: number;
  bonusThreshold: number;
  bonusAmount: number;
}

// Monthly summary
export interface MonthlySummary {
  year: number;
  month: number;
  totalSessions: number;
  totalClasses: number;
  totalDoubleClasses: number;
  totalExams: number;
  totalUnits: number;
}
