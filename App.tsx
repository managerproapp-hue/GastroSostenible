
import React, { useState, useEffect } from 'react';
import { INITIAL_PROJECT_STATE, SAMPLE_PROJECT_STATE, ROLES, ROLE_DEFINITIONS, ZONES } from './constants';
import { ProjectState, Member, ViewState } from './types';
import { Phase1Editor, Phase2Editor, Phase3Editor, Phase4Editor, Phase5Editor, Phase6Editor } from './components/PhaseEditors';
import { Dashboard } from './components/Dashboard';
import { GuideView } from './components/GuideView';
import { Upload, Download, Printer, Menu, FileText, Users, Calculator, Calendar, BookOpen, LayoutDashboard, LogOut, PlayCircle, FolderOpen, Plus, Eye, Save, HelpCircle } from 'lucide-react';

export default function App() {
  const [project, setProject] = useState<ProjectState>(() => {
    const saved = localStorage.getItem('gastro_project');
    const baseState = { 
        ...INITIAL_PROJECT_STATE, 
        id: crypto.randomUUID(), 
        members: [],
        meta: { ...INITIAL_PROJECT_STATE.meta }
    };
    
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (!parsed || !parsed.meta) {
                console.warn("Corrupt project state. Resetting.");
                return baseState;
            }
            return {
                ...baseState,
                ...parsed,
                meta: { ...baseState.meta, ...(parsed.meta || {}) },
                phase1: { ...baseState.phase1, ...(parsed.phase1 || {}) },
                phase2: { ...baseState.phase2, ...(parsed.phase2 || {}) },
                phase3: { ...baseState.phase3, ...(parsed.phase3 || {}) },
                phase4: { ...baseState.phase4, ...(parsed.phase4 || {}) },
                phase5: { ...baseState.phase5, ...(parsed.phase5 || {}) },
                phase6: { ...baseState.phase6, ...(parsed.phase6 || {}) },
            };
        } catch (e) {
            return baseState;
        }
    }
    return baseState;
  });

  const [view, setView] = useState<ViewState>('LANDING');
  const [activePhase, setActivePhase] = useState<number>(0); // 0 is Dashboard, 99 is Guide
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Auto-save logic
  useEffect(() => {
    localStorage.setItem('gastro_project', JSON.stringify(project));
  }, [project]);

  // Smart Merge
  const executeSmartMerge = async (file: File) => {
    try {
        const text = await file.text();
        const importedData = JSON.parse(text) as ProjectState;
        
        if (!importedData || !importedData.meta) {
            alert("Archivo no válido.");
            return;
        }

        const merged = { ...project };

        // Merge Members
        (importedData.members || []).forEach(m => {
          if (!merged.members.find(em => em.id === m.id)) {
            merged.members.push(m);
          }
        });

        // Helper to merge lists
        const mergeList = (localList: any[], importedList: any[]) => {
            const idSet = new Set(localList.map(i => i.id));
            const newItems = importedList.filter(i => !idSet.has(i.id));
            return [...localList, ...newItems];
        };
        const mergeUpdates = (localList: any[], importedList: any[]) => {
            const itemMap = new Map(localList.map(i => [i.id, i]));
            importedList.forEach(i => itemMap.set(i.id, i));
            return Array.from(itemMap.values());
        }

        merged.phase2.trends = mergeList(merged.phase2.trends || [], importedData.phase2?.trends || []);
        merged.phase3.dishes = mergeUpdates(merged.phase3.dishes || [], importedData.phase3?.dishes || []);
        merged.phase4.timeline = mergeUpdates(merged.phase4.timeline || [], importedData.phase4?.timeline || []);
        merged.phase5.costings = mergeUpdates(merged.phase5.costings || [], importedData.phase5?.costings || []);
        
        const evalKey = (e: any) => `${e.evaluator}-${e.targetMember}`;
        const localEvals = new Map((merged.phase6.evaluations || []).map(e => [evalKey(e), e]));
        (importedData.phase6?.evaluations || []).forEach(e => localEvals.set(evalKey(e), e));
        merged.phase6.evaluations = Array.from(localEvals.values());

        if (importedData.phase1?.justification) merged.phase1.justification = importedData.phase1.justification;
        if (importedData.phase1?.targetAudience) merged.phase1.targetAudience = importedData.phase1.targetAudience;
        if (importedData.phase4?.introText) merged.phase4.introText = importedData.phase4.introText;
        if (importedData.phase4?.objectivesText) merged.phase4.objectivesText = importedData.phase4.objectivesText;
        if (importedData.phase6?.finalRefinementText) merged.phase6.finalRefinementText = importedData.phase6.finalRefinementText;
        
        if (importedData.phase2?.canvas?.updatedBy?.timestamp > (merged.phase2?.canvas?.updatedBy?.timestamp || 0)) {
            merged.phase2.canvas = importedData.phase2.canvas;
        }

        setProject(merged);
        alert(`Fusión completada con datos de ${importedData.meta.teamName}.`);
    } catch (e) {
        console.error(e);
        alert("Error al leer el archivo.");
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `aporte_${currentUser?.name || 'equipo'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const loadExampleProject = () => {
    const sample = JSON.parse(JSON.stringify(SAMPLE_PROJECT_STATE));
    sample.id = crypto.randomUUID();
    sample.meta.createdAt = Date.now();
    setProject(sample);
    setCurrentUser(sample.members[0]);
    setView('WORKSPACE');
  };

  const LandingView = () => (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12 animate-in slide-in-from-top-10 fade-in duration-700">
            <h1 className="text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 mb-4">
                GastroSostenible
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Gestión integral de proyectos gastronómicos. 
                <span className="text-blue-400 font-bold block mt-2">Metodología Flujo Puzle: Distribuye, Trabaja Offline, Fusiona.</span>
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-150">
            <button onClick={() => setView('SETUP')} className="group relative bg-indigo-600 hover:bg-indigo-500 p-8 rounded-2xl transition-all hover:scale-[1.02] shadow-xl text-left overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><PlayCircle size={100} /></div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><Plus size={24}/> Nuevo Proyecto</h3>
                <p className="text-indigo-100 opacity-80">Configura el equipo, define roles y comienza.</p>
            </button>
            <div className="relative group bg-gray-900 border border-gray-800 hover:border-gray-700 p-8 rounded-2xl transition-all hover:scale-[1.02] text-left">
                <input type="file" accept=".json" onChange={(e) => { if (e.target.files?.[0]) executeSmartMerge(e.target.files[0]).then(() => setView('WORKSPACE')); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><FolderOpen size={100} /></div>
                <h3 className="text-2xl font-bold mb-2 text-white flex items-center gap-2"><Upload size={24}/> Cargar Proyecto</h3>
                <p className="text-gray-400">Restaura un archivo .JSON previo.</p>
            </div>
        </div>
        <div className="text-center animate-in fade-in duration-1000 delay-300">
             <button onClick={loadExampleProject} className="text-gray-500 hover:text-white underline transition-all text-sm flex items-center justify-center gap-2 mx-auto">
                <Eye size={16}/> Ver Proyecto de Ejemplo (Demo)
            </button>
        </div>
      </div>
    </div>
  );

  const SetupView = () => {
      // Setup state for Architect Config
      const [setupMeta, setSetupMeta] = useState(project.meta || INITIAL_PROJECT_STATE.meta);
      const [membersDraft, setMembersDraft] = useState<Partial<Member>[]>(
          ROLES.map(role => ({ id: crypto.randomUUID(), role, name: '', customTasks: '' }))
      );

      const updateMember = (index: number, field: keyof Member, value: string) => {
          const newMembers = [...membersDraft];
          newMembers[index] = { ...newMembers[index], [field]: value };
          setMembersDraft(newMembers);
      };

      const handleExportConfig = () => {
          const configProject = {
              ...project,
              meta: setupMeta,
              members: membersDraft.filter(m => m.name) as Member[]
          };
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configProject));
          const node = document.createElement('a');
          node.setAttribute("href", dataStr);
          node.setAttribute("download", "config_inicial.json");
          document.body.appendChild(node);
          node.click();
          node.remove();
      };

      const finishSetup = () => {
          const validMembers = membersDraft.filter(m => m.name && m.role) as Member[];
          if (validMembers.length === 0) {
              alert("Debes asignar al menos un rol (probablemente el Coordinador).");
              return;
          }
          setProject({
              ...project,
              meta: setupMeta,
              members: validMembers,
              phase1: { ...project.phase1, gastronomicZone: project.phase1.gastronomicZone || ZONES[0] }
          });
          // Set current user as the first one defined (usually Coordinator) or let them choose
          setCurrentUser(validMembers[0]);
          setView('WORKSPACE');
      };

      return (
          <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center">
              <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full overflow-hidden">
                  <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                      <div>
                        <h2 className="text-3xl font-serif font-bold">Configuración del Arquitecto (Fase 1)</h2>
                        <p className="opacity-80">Define la constitución del equipo antes de comenzar.</p>
                      </div>
                      <button onClick={() => setView('LANDING')} className="text-xs bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded">Volver</button>
                  </div>

                  <div className="p-8 space-y-8">
                      {/* Section 1: General Data */}
                      <section>
                          <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2"><BookOpen size={20}/> Datos Generales</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Equipo</label>
                                  <input className="w-full border p-2 rounded" placeholder="Ej: Los Innovadores" value={setupMeta.teamName} onChange={e => setSetupMeta({...setupMeta, teamName: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-1">Número de Grupo</label>
                                  <input className="w-full border p-2 rounded" placeholder="Ej: G-04" value={setupMeta.groupNumber || ''} onChange={e => setSetupMeta({...setupMeta, groupNumber: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Proyecto</label>
                                  <input className="w-full border p-2 rounded" placeholder="Ej: GastroMurcia Experience" value={setupMeta.projectName || ''} onChange={e => setSetupMeta({...setupMeta, projectName: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Entrega</label>
                                  <input type="date" className="w-full border p-2 rounded" value={setupMeta.deliveryDate || ''} onChange={e => setSetupMeta({...setupMeta, deliveryDate: e.target.value})} />
                              </div>
                              <div className="md:col-span-2">
                                  <label className="block text-sm font-bold text-gray-700 mb-1">Zona Gastronómica (Elección Irreversible)</label>
                                  <select 
                                    className="w-full border p-2 rounded bg-indigo-50 border-indigo-200 text-indigo-900 font-bold"
                                    value={project.phase1.gastronomicZone}
                                    onChange={e => setProject({...project, phase1: { ...project.phase1, gastronomicZone: e.target.value }})}
                                  >
                                      <option value="">-- Selecciona una Zona --</option>
                                      {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                                  </select>
                              </div>
                          </div>
                      </section>

                      {/* Section 2: Roles */}
                      <section>
                          <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2"><Users size={20}/> Asignación de Roles y Responsabilidades</h3>
                          <div className="space-y-4">
                              {ROLES.map((role, idx) => (
                                  <div key={role} className="border rounded-lg p-4 bg-gray-50 hover:bg-white hover:shadow transition-all">
                                      <div className="flex items-start gap-4">
                                          <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">{idx + 1}</div>
                                          <div className="flex-1">
                                              <h4 className="font-bold text-lg text-indigo-900">{role}</h4>
                                              <p className="text-xs text-indigo-600 italic mb-3">{ROLE_DEFINITIONS[role].description}</p>
                                              
                                              <div className="bg-white p-3 rounded border border-gray-200 mb-3 text-xs text-gray-600">
                                                  <strong className="block mb-1 text-gray-800">RESPONSABILIDADES OFICIALES:</strong>
                                                  <ul className="list-disc pl-4 space-y-1">
                                                      {ROLE_DEFINITIONS[role].tasks.map((t, i) => <li key={i}>{t}</li>)}
                                                  </ul>
                                              </div>

                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div>
                                                      <label className="block text-xs font-bold text-gray-500 mb-1">NOMBRE DEL ALUMNO/A *</label>
                                                      <input 
                                                        className="w-full border p-2 rounded" 
                                                        placeholder="Nombre completo"
                                                        value={membersDraft[idx].name}
                                                        onChange={e => updateMember(idx, 'name', e.target.value)}
                                                      />
                                                  </div>
                                                  <div>
                                                      <label className="block text-xs font-bold text-gray-500 mb-1">RESPONSABILIDADES ADICIONALES</label>
                                                      <input 
                                                        className="w-full border p-2 rounded" 
                                                        placeholder="Tareas extra..."
                                                        value={membersDraft[idx].customTasks}
                                                        onChange={e => updateMember(idx, 'customTasks', e.target.value)}
                                                      />
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </section>
                      
                      <div className="flex flex-col md:flex-row gap-4 pt-6 border-t">
                          <button onClick={handleExportConfig} className="flex-1 bg-indigo-100 text-indigo-700 py-3 rounded font-bold hover:bg-indigo-200 flex items-center justify-center gap-2">
                              <Download size={20}/> Exportar Configuración (JSON)
                          </button>
                          <button onClick={finishSetup} className="flex-1 bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2">
                              <Save size={20}/> Guardar y Acceder al Workspace
                          </button>
                      </div>
                      <p className="text-center text-xs text-gray-400">Rellena todos los nombres obligatorios para continuar.</p>
                  </div>
              </div>
          </div>
      );
  };

  const PrintView = () => (
    <div className="bg-white min-h-screen text-black font-serif">
        <div className="max-w-[21cm] mx-auto p-12 print:p-0">
             <div className="text-center mb-16 border-b-2 border-black pb-8">
                 <h1 className="text-5xl font-bold mb-4">{project.meta.projectName || project.meta.teamName}</h1>
                 <h2 className="text-2xl text-gray-600 mb-2">{project.meta.centerName}</h2>
                 <p className="text-lg italic">Zona: {project.phase1.gastronomicZone}</p>
             </div>
             
             <section className="mb-12">
                 <h3 className="text-2xl font-bold border-b border-gray-400 mb-4">1. Equipo y Roles</h3>
                 <div className="grid grid-cols-2 gap-4">
                     {project.members.map(m => (
                         <div key={m.id} className="border p-4 rounded bg-gray-50">
                             <span className="block font-bold text-lg">{m.name}</span>
                             <span className="block text-sm text-gray-500 uppercase tracking-widest">{m.role}</span>
                         </div>
                     ))}
                 </div>
             </section>

             <div className="no-print fixed bottom-8 right-8 flex gap-4">
                 <button onClick={() => window.print()} className="bg-blue-600 text-white p-4 rounded-full shadow"><Printer/></button>
                 <button onClick={() => setView('WORKSPACE')} className="bg-gray-600 text-white p-4 rounded-full shadow">Volver</button>
             </div>
        </div>
    </div>
  );

  if (view === 'LANDING') return <LandingView />;
  if (view === 'SETUP') return <SetupView />;
  if (view === 'PRINT') return <PrintView />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white transition-all duration-300 flex flex-col shrink-0 z-20 shadow-xl`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-800 bg-gray-950">
           {isSidebarOpen && <div className="font-serif font-bold text-murcia-gold truncate">{project.meta.teamName}</div>}
           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-800 rounded"><Menu size={20} /></button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <button onClick={() => setActivePhase(0)} className={`w-full flex items-center p-3 hover:bg-gray-800 border-l-4 ${activePhase === 0 ? 'bg-gray-800 border-murcia-red' : 'border-transparent opacity-60'}`}>
              <LayoutDashboard size={20} /> {isSidebarOpen && <span className="ml-3 text-sm">Mi Progreso</span>}
          </button>
          {[
            {id: 1, l: '1. Definición', i: FileText}, {id: 2, l: '2. Inmersión', i: Users}, {id: 3, l: '3. Oferta', i: Menu},
            {id: 4, l: '4. Planif.', i: Calendar}, {id: 5, l: '5. Costes', i: Calculator}, {id: 6, l: '6. Final', i: BookOpen}
          ].map(x => (
              <button key={x.id} onClick={() => setActivePhase(x.id)} className={`w-full flex items-center p-3 hover:bg-gray-800 border-l-4 ${activePhase === x.id ? 'bg-gray-800 border-murcia-red' : 'border-transparent opacity-60'}`}>
                  <x.i size={20} /> {isSidebarOpen && <span className="ml-3 text-sm">{x.l}</span>}
              </button>
          ))}
          <div className="my-2 border-t border-gray-800 mx-4"></div>
          <button onClick={() => setActivePhase(99)} className={`w-full flex items-center p-3 hover:bg-gray-800 border-l-4 ${activePhase === 99 ? 'bg-gray-800 border-murcia-red' : 'border-transparent opacity-60'}`}>
              <HelpCircle size={20} /> {isSidebarOpen && <span className="ml-3 text-sm">Guía Didáctica</span>}
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800 bg-gray-950 space-y-3">
             {isSidebarOpen && (
                 <div className="p-2 bg-gray-800 rounded">
                     <div className="text-xs text-gray-400 font-bold mb-1 uppercase">Identidad Actual</div>
                     <select className="bg-transparent w-full text-sm outline-none font-bold text-white" value={currentUser?.id} onChange={e => setCurrentUser(project.members.find(m => m.id === e.target.value) || null)}>
                         {project.members.map(m => <option key={m.id} value={m.id} className="text-black">{m.name}</option>)}
                     </select>
                 </div>
             )}
             <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 bg-gray-800 p-2 rounded text-sm hover:bg-gray-700"><Download size={16}/> {isSidebarOpen && "Exportar JSON"}</button>
             <button onClick={() => setView('LANDING')} className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-900/20 p-2 rounded text-sm"><LogOut size={16}/> {isSidebarOpen && "Salir"}</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
         {activePhase === 0 && currentUser && <Dashboard project={project} currentUser={currentUser} onNavigate={setActivePhase} />}
         {activePhase === 1 && <Phase1Editor project={project} currentUser={currentUser} onUpdate={setProject} />}
         {activePhase === 2 && <Phase2Editor project={project} currentUser={currentUser} onUpdate={setProject} />}
         {activePhase === 3 && <Phase3Editor project={project} currentUser={currentUser} onUpdate={setProject} />}
         {activePhase === 4 && <Phase4Editor project={project} currentUser={currentUser} onUpdate={setProject} />}
         {activePhase === 5 && <Phase5Editor project={project} currentUser={currentUser} onUpdate={setProject} />}
         {activePhase === 6 && <Phase6Editor project={project} currentUser={currentUser} onUpdate={setProject} />}
         {activePhase === 99 && <GuideView />}
      </main>
    </div>
  );
}
