import React, { useState } from 'react';
import { ROLE_DEFINITIONS, ROLES, ZONES, ODS_LIST } from '../constants';
import { BookOpen, Users, CheckSquare, HelpCircle, ArrowRight, GitMerge, Download, Upload, MapPin, Target } from 'lucide-react';

export const GuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metodologia' | 'roles' | 'contexto' | 'evaluacion' | 'faq'>('metodologia');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-serif font-bold mb-2">Guía Didáctica del Alumno</h1>
        <p className="opacity-80 text-lg">Manual de supervivencia para el Proyecto GastroSostenible.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          { id: 'metodologia', label: 'Cómo Funciona', icon: GitMerge },
          { id: 'roles', label: 'Roles', icon: Users },
          { id: 'contexto', label: 'Zonas y ODS', icon: MapPin },
          { id: 'evaluacion', label: 'Evaluación', icon: CheckSquare },
          { id: 'faq', label: 'Ayuda / FAQ', icon: HelpCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors rounded-t-lg ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-b-xl shadow-sm min-h-[500px]">
        
        {/* TAB: METODOLOGÍA */}
        {activeTab === 'metodologia' && (
          <div className="space-y-8 animate-in fade-in">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">La Metodología "Flujo Puzle"</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Olvídate de Google Drive y de sobreescribir el trabajo de tus compañeros. Esta aplicación funciona 
                mediante un sistema de <strong>trabajo distribuido y fusión inteligente</strong>.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto"><Download/></div>
                  <h3 className="font-bold text-center text-blue-800 mb-2">1. Configuración (Arquitecto)</h3>
                  <p className="text-sm text-center text-gray-600">
                    El Coordinador crea el equipo en la Fase 1 y exporta el archivo <code>config.json</code>. Se lo envía a todos por WhatsApp/Email.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center text-purple-600 mb-4 mx-auto"><Users/></div>
                  <h3 className="font-bold text-center text-purple-800 mb-2">2. Trabajo Especializado</h3>
                  <p className="text-sm text-center text-gray-600">
                    Cada alumno carga ese archivo, se identifica con su Rol y trabaja en su parte (Fase 2, 3, etc.). Al terminar, pulsa "Exportar Mi Parte".
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center text-green-600 mb-4 mx-auto"><Upload/></div>
                  <h3 className="font-bold text-center text-green-800 mb-2">3. Fusión Maestra</h3>
                  <p className="text-sm text-center text-gray-600">
                    El Coordinador recibe los archivos de todos, los carga uno a uno en la App y el sistema une todas las piezas automáticamente.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
              <h3 className="font-bold text-yellow-800 flex items-center gap-2"><HelpCircle size={18}/> Regla de Oro: ¡No borres tu caché!</h3>
              <p className="text-sm text-yellow-800 mt-1">
                La aplicación guarda tu trabajo en el navegador (Autoguardado). Si cambias de ordenador o borras el historial, perderás lo que no hayas exportado. 
                <strong>Exporta siempre un JSON al terminar tu sesión de trabajo.</strong>
              </p>
            </section>
          </div>
        )}

        {/* TAB: ROLES */}
        {activeTab === 'roles' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Responsabilidades por Perfil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROLES.map((role) => (
                <div key={role} className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-gray-50/50">
                  <h3 className="text-lg font-bold text-indigo-700 mb-1">{role}</h3>
                  <p className="text-sm text-gray-500 italic mb-3">{ROLE_DEFINITIONS[role].description}</p>
                  <ul className="space-y-2">
                    {ROLE_DEFINITIONS[role].tasks.map((task, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <ArrowRight size={14} className="mt-1 text-indigo-400 shrink-0"/>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CONTEXTO (Zonas y ODS) */}
        {activeTab === 'contexto' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Zonas */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
                   <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <MapPin className="text-blue-600" /> Zonas Gastronómicas
                   </h3>
                   <ul className="space-y-3">
                     {ZONES.map((zone, idx) => (
                       <li key={idx} className="bg-white p-3 rounded shadow-sm text-sm text-gray-700 flex items-center gap-3">
                         <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                         {zone}
                       </li>
                     ))}
                   </ul>
                </div>

                {/* ODS */}
                <div className="bg-green-50/50 border border-green-100 rounded-xl p-6">
                   <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <Target className="text-green-600" /> Objetivos (ODS) Prioritarios
                   </h3>
                   <div className="flex flex-wrap gap-2">
                     {ODS_LIST.map((ods) => (
                       <div key={ods.id} className={`${ods.color} text-white text-xs px-3 py-2 rounded shadow-sm opacity-90 hover:opacity-100 transition-opacity cursor-default`}>
                         {ods.label}
                       </div>
                     ))}
                   </div>
                   <p className="text-xs text-gray-500 mt-4 italic">
                     * Debes vincular al menos un ODS principal a cada plato diseñado en la Fase 3.
                   </p>
                </div>
             </div>
          </div>
        )}

        {/* TAB: EVALUACIÓN */}
        {activeTab === 'evaluacion' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="prose max-w-none text-gray-700">
                <h2 className="text-2xl font-bold text-gray-900">Criterios de Evaluación Oficiales (BOE)</h2>
                <p className="text-sm text-gray-500 mb-6">Referencia: BOE-A-2024-10684. Región de Murcia.</p>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-indigo-800 mb-4">Módulo de Proyecto (Principal)</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-gray-900">RA 1 - Análisis y Caracterización</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                                    <li>Identificación de modelos empresariales y estructura organizativa.</li>
                                    <li>Definición de funciones, roles y responsabilidades.</li>
                                    <li>Evaluación del volumen de negocio y estrategia de demanda.</li>
                                    <li>Relación con los <strong>Objetivos de Desarrollo Sostenible (ODS)</strong>.</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="font-bold text-gray-900">RA 2 - Propuesta de Soluciones (Viabilidad)</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                                    <li>Detección de necesidades y propuestas innovadoras.</li>
                                    <li>Análisis de <strong>viabilidad técnica y económica</strong>.</li>
                                    <li>Presupuesto detallado y documentación técnica.</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900">RA 3 - Planificación y Ejecución</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                                    <li>Cronología detallada (Timeline) y asignación de recursos.</li>
                                    <li>Plan de prevención de riesgos y gestión de contingencias.</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900">RA 4 - Supervisión y Calidad</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                                    <li>Seguimiento de resultados y estándares de calidad.</li>
                                    <li>Documentación final para la evaluación integral.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                            <h3 className="font-bold text-orange-900 mb-2">Ofertas Gastronómicas (Costes)</h3>
                            <p className="text-sm font-bold text-orange-800">RA 4 - Cálculo de Costes</p>
                            <p className="text-sm mt-1">
                                Cálculo y valoración de costes (materias primas, mano de obra, gastos generales) para garantizar la viabilidad económica.
                            </p>
                        </div>

                        <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                            <h3 className="font-bold text-red-900 mb-2">Productos Culinarios</h3>
                            <p className="text-sm font-bold text-red-800">RA 3 - Elaboración Creativa</p>
                            <p className="text-sm mt-1">
                                Aprovechamiento de recursos, combinaciones lógicas, equilibradas y creativas en la carta.
                            </p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB: FAQ */}
        {activeTab === 'faq' && (
           <div className="space-y-4 animate-in fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Preguntas Frecuentes</h2>
              
              <details className="group bg-gray-50 rounded-lg p-4 cursor-pointer">
                  <summary className="font-bold flex items-center justify-between text-gray-800">
                      ¿Qué pasa si dos personas editan el mismo plato?
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2 text-gray-600 text-sm">
                      El sistema priorizará la versión con la fecha de modificación más reciente al hacer la fusión. Lo ideal es que cada uno edite solo sus propios platos asignados.
                  </p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-4 cursor-pointer">
                  <summary className="font-bold flex items-center justify-between text-gray-800">
                      ¿Cómo entrego la Memoria Final?
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2 text-gray-600 text-sm">
                      Ve a la Fase 6 -> Botón "Imprimir Memoria PDF". Asegúrate de que en las opciones de impresión del navegador esté activada la opción "Gráficos en segundo plano" para que se vean los colores.
                  </p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-4 cursor-pointer">
                  <summary className="font-bold flex items-center justify-between text-gray-800">
                      Soy "Recursos", ¿puedo escribir en la Intro?
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2 text-gray-600 text-sm">
                      Por defecto, las secciones están bloqueadas por rol para mantener el orden. Si necesitas aportar, comunícalo al responsable de esa sección (Documentación) o pídele al Coordinador que lo añada.
                  </p>
              </details>
           </div>
        )}

      </div>
    </div>
  );
};