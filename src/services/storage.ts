import { Student, Session, GoalsConfig } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'cuaderno_students',
  SESSIONS: 'cuaderno_sessions',
  GOALS: 'cuaderno_goals',
};

// Default goals configuration
const DEFAULT_GOALS: GoalsConfig = {
  baseUnits: 180,
  extraPaymentPerUnit: 10,
  bonusThreshold: 220,
  bonusAmount: 200,
};

// Students
export const studentsStorage = {
  getAll: (): Student[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Student | null => {
    const students = studentsStorage.getAll();
    return students.find(s => s.id === id) || null;
  },

  create: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Student => {
    const newStudent: Student = {
      ...student,
      id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const students = studentsStorage.getAll();
    students.push(newStudent);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return newStudent;
  },

  update: (id: string, updates: Partial<Omit<Student, 'id' | 'createdAt'>>): Student | null => {
    const students = studentsStorage.getAll();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    students[index] = {
      ...students[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return students[index];
  },

  delete: (id: string): boolean => {
    const students = studentsStorage.getAll();
    const filtered = students.filter(s => s.id !== id);
    if (filtered.length === students.length) return false;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
    return true;
  },
};

// Sessions
export const sessionsStorage = {
  getAll: (): Session[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },

  getByStudentId: (studentId: string): Session[] => {
    const sessions = sessionsStorage.getAll();
    return sessions.filter(s => s.studentId === studentId).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  },

  getByDate: (date: string): Session[] => {
    const sessions = sessionsStorage.getAll();
    return sessions.filter(s => s.date === date).sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  },

  getByMonth: (year: number, month: number): Session[] => {
    const sessions = sessionsStorage.getAll();
    return sessions.filter(s => {
      const [sessionYear, sessionMonth] = s.date.split('-');
      return parseInt(sessionYear) === year && parseInt(sessionMonth) === month + 1;
    });
  },

  create: (session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Session => {
    const newSession: Session = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const sessions = sessionsStorage.getAll();
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    return newSession;
  },

  update: (id: string, updates: Partial<Omit<Session, 'id' | 'createdAt'>>): Session | null => {
    const sessions = sessionsStorage.getAll();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    sessions[index] = {
      ...sessions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    return sessions[index];
  },

  delete: (id: string): boolean => {
    const sessions = sessionsStorage.getAll();
    const filtered = sessions.filter(s => s.id !== id);
    if (filtered.length === sessions.length) return false;
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filtered));
    return true;
  },
};

// Goals Configuration
export const goalsStorage = {
  get: (): GoalsConfig => {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : DEFAULT_GOALS;
  },

  set: (goals: GoalsConfig): void => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  reset: (): void => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
  },
};

// Helper: Calculate units from sessions
export const calculateUnits = (sessions: Session[], sessionTypes?: SessionType[]): number => {
  return sessions.reduce((total, session) => {
    if (sessionTypes && !sessionTypes.includes(session.type)) return total;
    
    if (session.type === 'class') return total + 1;
    if (session.type === 'double_class') return total + 2;
    if (session.type === 'exam') return total + 1;
    return total;
  }, 0);
};

type SessionType = 'class' | 'double_class' | 'exam';
