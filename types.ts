
// Data Models for GastroSostenible

// Nuevos roles oficiales
export type Role = 'Coordinador' | 'Documentación' | 'Comunicación' | 'Recursos' | 'Producción';

export interface Member {
  id: string;
  name: string;
  role: Role;
  customTasks?: string; // Tareas adicionales asignadas en Fase 1
}

export interface AuthorMeta {
  author: string;
  role: Role;
  timestamp: number;
}

// Phase 1: Definición
export interface Phase1Data {
  justification: string;
  justificationMeta?: AuthorMeta;
  targetAudience: string;
  gastronomicZone: string;
}

// Phase 2: Inmersión
export interface Trend {
  id: string;
  title: string;
  description: string;
  meta: AuthorMeta;
}

export interface BusinessCanvas {
  partners: string;
  activities: string;
  resources: string;
  valueProp: string;
  relationships: string;
  channels: string;
  segments: string;
  structure: string;
  revenue: string;
  updatedBy?: AuthorMeta;
}

export interface Phase2Data {
  trends: Trend[];
  canvas: BusinessCanvas;
}

// Phase 3: Diseño Oferta
export interface Dish {
  id: string;
  name: string;
  category: 'Aperitivo' | 'Entrante' | 'Principal' | 'Postre';
  description: string;
  ods: string[]; // IDs of SDGs
  photoBase64?: string;
  meta: AuthorMeta;
}

export interface Phase3Data {
  dishes: Dish[];
}

// Phase 4: Consolidación
export interface TimelineEvent {
  id: string;
  week: number;
  task: string;
  responsible: string;
  meta: AuthorMeta;
}

export interface Phase4Data {
  introText: string;
  introMeta?: AuthorMeta;
  objectivesText: string;
  objectivesMeta?: AuthorMeta;
  timeline: TimelineEvent[];
}

// Phase 5: Costes (Escandallos Profesionales)
export interface Ingredient {
  id: string;
  name: string; // Descripción de la pieza
  grossWeight: number; // Peso despiece
  pricePerUnit: number; // Coste kilo
  wastePercentage: number; // Mermas %
}

export interface Costing {
  dishId: string;
  supplier: string; // Nombre Proveedor
  date: string;
  ingredients: Ingredient[];
  portionWeight: number; // Peso ración
  portions: number; // Número de raciones
  multiplier: number; // Coeficiente multiplicador
  totalCost: number; // Coste total calculado
  meta: AuthorMeta;
}

export interface Phase5Data {
  costings: Costing[];
}

// Phase 6: Final & Defensa (Tarea 5)
export interface IndividualChecklist {
  reviewedResearch: boolean; // Fase 1 y 2
  reviewedDishes: boolean;   // Fase 3
  defensePrep: boolean;      // Preparación Defensa Oral
}

export interface Phase6Data {
  // Parte A: Trabajo Individual
  individualChecklists: Record<string, IndividualChecklist>; // userId -> Checklist

  // Parte B: Trabajo Grupal - Memoria (Documentación)
  introduction: string;
  conclusions: string;
  bibliography: string;
  memoryPdfUploaded: boolean; // Mock flag

  // Parte B: Trabajo Grupal - Defensa (Comunicación)
  presentationUploaded: boolean; // Mock flag
  virtualMenuUrl: string;
  physicalMenuUploaded: boolean; // Mock flag
  rehearsalDate: string;

  // Legacy / Coevaluación
  evaluations: Evaluation[];
}

export interface Evaluation {
  evaluator: string;
  targetMember: string;
  score: number; // -1, 0, +1
  comment: string;
}

// Master Project State
export interface ProjectState {
  id: string;
  meta: {
    teamName: string;
    centerName?: string;
    groupNumber?: string;
    projectName?: string;
    deliveryDate?: string;
    logoBase64?: string;
    createdAt: number;
  };
  members: Member[];
  phase1: Phase1Data;
  phase2: Phase2Data;
  phase3: Phase3Data;
  phase4: Phase4Data;
  phase5: Phase5Data;
  phase6: Phase6Data;
}

// Application View State
export type ViewState = 'LANDING' | 'SETUP' | 'WORKSPACE' | 'PRINT';
