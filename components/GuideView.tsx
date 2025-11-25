
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
                <div className="border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Criterios de Evaluación Oficiales</h2>
                    <p className="text-sm text-gray-500">
                        Fuente: BOLETÍN OFICIAL DEL ESTADO. Núm. 129, Martes 28 de mayo de 2024, Sec. I. Pág. 61079. cve: BOE-A-2024-10684. REGIÓN DE MURCIA.
                    </p>
                </div>

                {/* MÓDULO PRINCIPAL */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                    <h3 className="text-xl font-bold text-indigo-900 border-b border-gray-300 pb-3 mb-4">Módulo de Proyecto (Principal)</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm bg-indigo-50 p-2 rounded">RA1. Analizar y caracterizar las empresas del sector según su estructura organizativa y la naturaleza de sus productos o servicios.</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1 mt-2 text-gray-700">
                                <li>a) Se han identificado los modelos empresariales más representativos del sector.</li>
                                <li>b) Se ha descrito la estructura organizativa típica de estas empresas.</li>
                                <li>c) Se han definido las funciones y características de los principales departamentos.</li>
                                <li>d) Se ha especificado el rol y las responsabilidades de cada área funcional.</li>
                                <li>e) Se ha evaluado el volumen de negocio en función de las demandas y necesidades del cliente.</li>
                                <li>f) Se ha diseñado una estrategia adecuada para responder a dichas demandas.</li>
                                <li>g) Se ha valorado la dotación necesaria de recursos humanos y materiales.</li>
                                <li>h) Se ha implementado un sistema de seguimiento de resultados acorde con la estrategia definida.</li>
                                <li>i) Se ha establecido la relación entre los productos/servicios ofrecidos y su posible aporte a los Objetivos de Desarrollo Sostenible (ODS).</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 text-sm bg-indigo-50 p-2 rounded">RA2. Proponer soluciones viables a las necesidades del sector, considerando costes y desarrollando un proyecto básico.</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1 mt-2 text-gray-700">
                                <li>a) Se han detectado y priorizado las necesidades del sector.</li>
                                <li>b) Se han generado, en equipo, propuestas de solución.</li>
                                <li>c) Se ha recopilado información relevante sobre las soluciones planteadas.</li>
                                <li>d) Se han incorporado elementos innovadores con potencial de aplicación práctica.</li>
                                <li>e) Se ha realizado un análisis de viabilidad técnica de las propuestas.</li>
                                <li>f) Se han definido las partes esenciales que componen el proyecto.</li>
                                <li>g) Se ha estimado la dotación de recursos humanos y materiales requeridos.</li>
                                <li>h) Se ha elaborado un presupuesto económico detallado.</li>
                                <li>i) Se ha redactado la documentación técnica necesaria para el diseño del proyecto.</li>
                                <li>j) Se han considerado los aspectos de calidad inherentes al proyecto.</li>
                                <li>k) Se ha presentado públicamente el contenido más relevante del proyecto propuesto.</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 text-sm bg-indigo-50 p-2 rounded">RA3. Planificar la ejecución de las actividades derivadas de la solución propuesta, definiendo un plan de intervención y su documentación asociada.</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1 mt-2 text-gray-700">
                                <li>a) Se ha establecido una cronología detallada para cada actividad.</li>
                                <li>b) Se han asignado los recursos y la logística necesarios para cada fase.</li>
                                <li>c) Se han identificado los permisos o autorizaciones obligatorios, en caso de requerirse.</li>
                                <li>d) Se han detectado las actividades con riesgos potenciales durante su ejecución.</li>
                                <li>e) Se ha integrado el plan de prevención de riesgos laborales y se han previsto los equipos de protección necesarios.</li>
                                <li>f) Se han asignado recursos humanos y materiales específicos a cada tarea.</li>
                                <li>g) Se han contemplado posibles contingencias o imprevistos.</li>
                                <li>h) Se han diseñado medidas correctivas para hacer frente a dichos imprevistos.</li>
                                <li>i) Se ha elaborado toda la documentación técnica y administrativa requerida.</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 text-sm bg-indigo-50 p-2 rounded">RA4. Supervisar la ejecución de las actividades, asegurando el cumplimiento del plan establecido.</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1 mt-2 text-gray-700">
                                <li>a) Se ha definido un procedimiento claro para el seguimiento de las actividades.</li>
                                <li>b) Se ha verificado que los resultados obtenidos cumplen con los estándares de calidad esperados.</li>
                                <li>c) Se han detectado desviaciones respecto al plan inicial o a los resultados previstos.</li>
                                <li>d) Se ha comunicado oportunamente cualquier desviación relevante a los responsables.</li>
                                <li>e) Se han implementado y documentado las acciones correctivas necesarias.</li>
                                <li>f) Se ha generado la documentación final para la evaluación integral de las actividades y del proyecto global.</li>
                            </ul>
                        </div>

                         <div>
                            <h4 className="font-bold text-gray-900 text-sm bg-indigo-50 p-2 rounded">RA5. Comunicar información de forma clara, ordenada y estructurada, tanto interna como externamente.</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1 mt-2 text-gray-700">
                                <li>a) Se ha mantenido una actitud metódica y organizada en la transmisión de la información.</li>
                                <li>b) Se ha facilitado comunicación verbal efectiva, tanto en horizontal (entre pares) como en vertical (con superiores o subordinados).</li>
                                <li>c) Se ha utilizado herramientas informáticas para la comunicación interna en el equipo.</li>
                                <li>d) Se ha adquirido familiaridad con la terminología técnica del sector en otros idiomas de uso internacional.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* OTROS MÓDULOS */}
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">RA de otros módulos</h3>
                
                <div className="grid grid-cols-1 gap-6">
                    {/* PRODUCTOS CULINARIOS */}
                    <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                        <h4 className="font-bold text-red-900 text-lg mb-2">PRODUCTOS CULINARIOS (Código 0048)</h4>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="font-bold text-sm text-red-800">RA1. Organiza los procesos productivos y de servicio en cocina, interpretando información oral o escrita.</p>
                                <ul className="list-disc pl-5 text-sm mt-1 text-gray-700">
                                    <li>a) Se han identificado y caracterizado los distintos ámbitos de producción y servicio en cocina.</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-red-800">RA3. Elabora productos culinarios a partir de un conjunto de materias primas, evaluando alternativas creativas y funcionales.</p>
                                <ul className="list-disc pl-5 text-sm mt-1 text-gray-700">
                                    <li>b) Se ha valorado el aprovechamiento integral de los recursos disponibles (materias primas, tiempos, técnicas).</li>
                                    <li>c) Se han diseñado elaboraciones que combinan los ingredientes de manera lógica, equilibrada y creativa.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* POSTRES Y OFERTAS (Dos columnas) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                            <h4 className="font-bold text-purple-900 text-lg mb-2">POSTRES EN RESTAURACIÓN (0028)</h4>
                            <div>
                                <p className="font-bold text-sm text-purple-800">RA7. Presenta postres emplatados a partir de elaboraciones de pastelería y repostería, integrando criterios estéticos y funcionales.</p>
                                <ul className="list-disc pl-5 text-sm mt-1 text-gray-700">
                                    <li>c) Se han aplicado técnicas de presentación y decoración acordes a las características del producto final y al contexto de servicio, garantizando equilibrio visual, textural y conceptual.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                            <h4 className="font-bold text-orange-900 text-lg mb-2">OFERTAS GASTRONÓMICAS (0045)</h4>
                            <div>
                                <p className="font-bold text-sm text-orange-800">RA4. Calcula el coste global de la oferta gastronómica, analizando y ponderando todas las variables que lo componen.</p>
                                <ul className="list-disc pl-5 text-sm mt-1 text-gray-700">
                                    <li>d) Se han calculado y valorado los costes asociados a cada elaboración de cocina y/o pastelería/repostería, incluyendo materias primas, mano de obra, desperdicios, energía y otros gastos indirectos, con el fin de garantizar la viabilidad económica de la oferta.</li>
                                </ul>
                            </div>
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
                      Ve a la Fase 6 → Botón "Imprimir Memoria PDF". Asegúrate de que en las opciones de impresión del navegador esté activada la opción "Gráficos en segundo plano" para que se vean los colores.
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