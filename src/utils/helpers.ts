import { Session } from '../types';
import { calculateUnits, goalsStorage } from '../services/storage';

export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

export const formatDateTime = (date: string, time: string): string => {
  return `${formatDate(date)} a las ${formatTime(time)}`;
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentMonth = (): [number, number] => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth()];
};

export const getSessionTypeLabel = (type: 'class' | 'double_class' | 'exam'): string => {
  const labels = {
    'class': 'Clase',
    'double_class': 'Clase Doble',
    'exam': 'Examen',
  };
  return labels[type];
};

export const calculateStats = (sessions: Session[]) => {
  const goals = goalsStorage.get();
  
  const totalClasses = sessions.filter(s => s.type === 'class').length;
  const totalDoubleClasses = sessions.filter(s => s.type === 'double_class').length;
  const totalExams = sessions.filter(s => s.type === 'exam').length;
  const totalUnits = calculateUnits(sessions);
  
  const extraUnits = Math.max(0, totalUnits - goals.baseUnits);
  const extraPayment = extraUnits * goals.extraPaymentPerUnit;
  const bonusActivated = totalUnits >= goals.bonusThreshold;

  return {
    totalClasses,
    totalDoubleClasses,
    totalExams,
    totalUnits,
    extraUnits,
    extraPayment,
    bonusActivated,
  };
};

export const getMonthlySummary = (sessions: Session[]) => {
  const byDay: Record<string, Session[]> = {};

  sessions.forEach(session => {
    if (!byDay[session.date]) {
      byDay[session.date] = [];
    }
    byDay[session.date].push(session);
  });

  return Object.entries(byDay).map(([date, daySessions]) => ({
    date,
    count: daySessions.length,
    units: calculateUnits(daySessions),
    stats: calculateStats(daySessions),
  }));
};

export const isValidPhone = (phone: string): boolean => {
  return /^[0-9\s\-\+\(\)]{7,}$/.test(phone);
};

export const isValidTime = (time: string): boolean => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

export const isValidDate = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
};
