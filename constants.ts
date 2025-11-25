
import { Role, ProjectState } from "./types";

export const ROLES: Role[] = [
  'Coordinador',
  'Documentación',
  'Comunicación',
  'Recursos',
  'Producción'
];

export const ROLE_DEFINITIONS: Record<Role, { description: string, tasks: string[] }> = {
  'Coordinador': {
    description: 'Lidera la organización y el tiempo del equipo.',
    tasks: [
      'Controla el calendario y asegura que el grupo cumple los plazos.',
      'Reparte las tareas de forma equilibrada entre los miembros.',
      'Supervisa el trabajo global del equipo y asegura el avance según lo planeado.',
      'Recopila los archivos de todas las fases y los unifica.'
    ]
  },
  'Documentación': {
    description: 'Gestiona la información y el formato de entrega.',
    tasks: [
      'Recopila y organiza los archivos generados por el equipo.',
      'Asegura que la Memoria Final cumpla con el formato exigido.',
      'Toma nota de los acuerdos en las reuniones (actas).',
      'Verifica que no falte ningún apartado de la Memoria Parcial.'
    ]
  },
  'Comunicación': {
    description: 'Portavoz y gestor de la presentación.',
    tasks: [
      'Actúa como interlocutor principal con el profesorado.',
      'Prepara el guion de la defensa oral.',
      'Asegura la coherencia en el tono y estilo de la redacción.',
      'Coordina la presentación visual (diapositivas, soportes).'
    ]
  },
  'Recursos': {
    description: 'Investigador de medios y materiales (y Finanzas).',
    tasks: [
      'Busca fuentes de información fiables y recursos necesarios.',
      'Gestiona el presupuesto ficticio y los escandallos.',
      'Localiza proveedores y referencias técnicas de la zona.',
      'Asegura que no falte información clave en cada fase.'
    ]
  },
  'Producción': {
    description: 'Control de calidad y viabilidad.',
    tasks: [
      'Revisa que el contenido cumpla con los Criterios de Evaluación.',
      'Verifica la viabilidad técnica de las propuestas gastronómicas.',
      'Detecta errores o inconsistencias antes de la entrega.',
      'Asegura que la propuesta sea realista y ejecutable.'
    ]
  }
};

export const ZONES = [
  'Altiplano (Jumilla, Yecla – vinos, productos de secano)',
  'Noroeste (Caravaca, Cehegín, Moratalla – montaña, turismo rural)',
  'Río Mula y Valle de Ricote (Mula, Bullas, Ricote – huertas, frutas)',
  'Vega del Segura (Alta y Media) (Cieza, Molina de Segura, Alcantarilla – agricultura sostenible)',
  'Huerta de Murcia y Oriental (Murcia capital, Santomera, Beniel – público urbano)',
  'Valle del Guadalentín (Lorca, Mazarrón, Águilas, Totana – arroz, mariscos)',
  'Campo de Cartagena y Mar Menor (Cartagena, Los Alcázares, San Javier, San Pedro – pescados, turismo costero)'
];

export const ODS_LIST = [
  { id: '1', label: '1. Fin de la Pobreza', color: 'bg-red-500' },
  { id: '2', label: '2. Hambre Cero', color: 'bg-yellow-500' },
  { id: '3', label: '3. Salud y Bienestar', color: 'bg-green-500' },
  { id: '4', label: '4. Educación de Calidad', color: 'bg-red-400' },
  { id: '5', label: '5. Igualdad de Género', color: 'bg-orange-500' },
  { id: '8', label: '8. Trabajo Decente', color: 'bg-red-700' },
  { id: '12', label: '12. Producción y Consumo', color: 'bg-orange-600' },
  { id: '13', label: '13. Acción por el Clima', color: 'bg-green-700' },
  { id: '14', label: '14. Vida Submarina', color: 'bg-blue-500' },
  { id: '15', label: '15. Ecosistemas Terrestres', color: 'bg-green-600' },
];

export const INITIAL_PROJECT_STATE: ProjectState = {
  id: '',
  members: [],
  meta: {
    teamName: '',
    centerName: '',
    createdAt: 0
  },
  phase1: { justification: '', targetAudience: '', gastronomicZone: '' },
  phase2: { trends: [], canvas: { partners: '', activities: '', resources: '', valueProp: '', relationships: '', channels: '', segments: '', structure: '', revenue: '' } },
  phase3: { dishes: [] },
  phase4: { introText: '', objectivesText: '', timeline: [] },
  phase5: { costings: [] },
  phase6: { 
    individualChecklists: {},
    introduction: '',
    conclusions: '',
    bibliography: '',
    memoryPdfUploaded: false,
    presentationUploaded: false,
    virtualMenuUrl: '',
    physicalMenuUploaded: false,
    rehearsalDate: '',
    evaluations: [] 
  }
};

export const SAMPLE_PROJECT_STATE: ProjectState = {
  id: 'sample-demo',
  meta: {
    teamName: 'La Barraca Sostenible',
    centerName: 'CIFP Hostelería y Turismo',
    groupNumber: 'G-01',
    projectName: 'Recuperación Huertana',
    createdAt: Date.now(),
    logoBase64: undefined
  },
  members: [
    { id: 'm1', name: 'Ana García', role: 'Coordinador' },
    { id: 'm2', name: 'Pedro Martínez', role: 'Recursos' },
    { id: 'm3', name: 'Lucía Ruiz', role: 'Comunicación' },
    { id: 'm4', name: 'Javier Sola', role: 'Producción' },
    { id: 'm5', name: 'Elena Nito', role: 'Documentación' }
  ],
  phase1: {
    justification: 'El proyecto "La Barraca Sostenible" nace con la vocación de recuperar el patrimonio gastronómico de la Huerta de Murcia, fusionándolo con técnicas de vanguardia.',
    targetAudience: 'Turista cultural y público local concienciado.',
    gastronomicZone: 'Huerta de Murcia y Oriental (Murcia capital, Santomera, Beniel – público urbano)'
  },
  phase2: {
    trends: [
      { id: 't1', title: 'Trash Cooking', description: 'Aprovechamiento integral.', meta: { author: 'Javier Sola', role: 'Producción', timestamp: Date.now() } },
    ],
    canvas: {
      partners: 'Cooperativa del Raal',
      activities: 'Restaurante y Huerto',
      resources: 'Finca 3000m2',
      valueProp: 'Km0 Real',
      relationships: 'Cercana',
      channels: 'RRSS',
      segments: 'Turistas',
      structure: 'Sueldos, Alquiler',
      revenue: 'Menú degustación',
      updatedBy: { author: 'Ana García', role: 'Coordinador', timestamp: Date.now() }
    }
  },
  phase3: {
    dishes: [
      {
        id: 'd1', name: 'Zarangollo 3.0', category: 'Entrante',
        description: 'Deconstrucción.',
        ods: ['12'],
        meta: { author: 'Lucía Ruiz', role: 'Comunicación', timestamp: Date.now() }
      }
    ]
  },
  phase4: {
    introText: 'Ubicación en La Arboleja...',
    objectivesText: '1. Viabilidad año 1.',
    timeline: [
      { id: 'ev1', week: 1, task: 'Constitución', responsible: 'Ana García', meta: { author: 'Ana García', role: 'Coordinador', timestamp: Date.now() } }
    ]
  },
  phase5: {
    costings: []
  },
  phase6: {
    individualChecklists: {
        'm1': { reviewedResearch: true, reviewedDishes: true, defensePrep: true }
    },
    introduction: 'Este proyecto representa el esfuerzo conjunto...',
    conclusions: 'En conclusión, la viabilidad es alta...',
    bibliography: 'INE, Murcia Turística...',
    memoryPdfUploaded: true,
    presentationUploaded: false,
    virtualMenuUrl: 'https://qr.carta.com/labarraca',
    physicalMenuUploaded: false,
    rehearsalDate: '2025-03-20',
    evaluations: []
  }
};
