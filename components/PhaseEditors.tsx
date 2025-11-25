
import React, { useState } from 'react';
import { ProjectState, Member, AuthorMeta, Dish, Trend, TimelineEvent, Costing, Ingredient, Evaluation, Role } from '../types';
import { ODS_LIST } from '../constants';
import { Camera, Plus, Lock } from 'lucide-react';

interface EditorProps {
  project: ProjectState;
  currentUser: Member | null;
  onUpdate: (updatedProject: ProjectState) => void;
}

const createMeta = (user: Member | null): AuthorMeta => ({
  author: user?.name || 'Anonimo',
  role: user?.role || 'Coordinador',
  timestamp: Date.now()
});

const handleImageResize = (file: File, callback: (base64: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target?.result as string;
    img.onload = () => {
      const elem = document.createElement('canvas');
      const width = 800;
      const scaleFactor = width / img.width;
      elem.width = width;
      elem.height = img.height * scaleFactor;
      const ctx = elem.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, elem.height);
        callback(ctx.canvas.toDataURL('image/jpeg', 0.8));
      }
    };
  };
};

const RoleBadge = ({ role }: { role: Role | 'Todos' }) => {
    const colors: Record<string, string> = {
        'Coordinador': 'bg-blue-100 text-blue-800 border-blue-200',
        'Documentación': 'bg-green-100 text-green-800 border-green-200',
        'Comunicación': 'bg-purple-100 text-purple-800 border-purple-200',
        'Recursos': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Producción': 'bg-red-100 text-red-800 border-red-200',
        'Todos': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return (
        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${colors[role] || colors['Todos']} flex items-center gap-1`}>
            {role === 'Coordinador' && '👑'} {role}
        </span>
    );
};

const RoleCheck = ({ 
    allowedRoles, 
    currentRole, 
    children, 
}: { 
    allowedRoles: Role[], 
    currentRole?: Role, 
    children?: React.ReactNode, 
}) => {
    if (!currentRole || !allowedRoles.includes(currentRole)) {
        return (
            <div className="relative group">
                <div className="absolute inset-0 bg-gray-50/50 z-10 cursor-not-allowed flex items-center justify-center backdrop-blur-[1px]">
                     <div className="bg-white shadow px-3 py-1 rounded-full text-xs font-bold text-gray-500 border flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Lock size={12}/> Solo lectura ({allowedRoles.join(', ')})
                     </div>
                </div>
                <div className="opacity-60 pointer-events-none select-none grayscale-[0.5]">
                    {children}
                </div>
            </div>
        );
    }
    return <>{children}</>;
};

export const Phase1Editor: React.FC<EditorProps> = ({ project, currentUser, onUpdate }) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2"><h2 className="text-2xl font-serif text-murcia-red">Fase 1: Definición</h2><RoleBadge role="Coordinador" /></div>
      <RoleCheck allowedRoles={['Coordinador']} currentRole={currentUser?.role}>
        <div className="bg-white p-6 rounded shadow space-y-4">
            <div>
                <label className="block font-bold mb-1">Público Objetivo</label>
                <input className="w-full border p-2 rounded" value={project.phase1.targetAudience} onChange={e => onUpdate({...project, phase1: {...project.phase1, targetAudience: e.target.value, justificationMeta: createMeta(currentUser)}})} />
            </div>
            <div>
                <label className="block font-bold mb-1">Justificación</label>
                <textarea className="w-full h-32 border p-2 rounded" value={project.phase1.justification} onChange={e => onUpdate({...project, phase1: {...project.phase1, justification: e.target.value}})} />
            </div>
        </div>
      </RoleCheck>
    </div>
);

export const Phase2Editor: React.FC<EditorProps> = ({ project, currentUser, onUpdate }) => {
  const [newTrend, setNewTrend] = useState({ title: '', description: '' });
  const addTrend = () => {
    if (!newTrend.title) return;
    onUpdate({ ...project, phase2: { ...project.phase2, trends: [...(project.phase2.trends||[]), { id: crypto.randomUUID(), ...newTrend, meta: createMeta(currentUser) }] } });
    setNewTrend({ title: '', description: '' });
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-murcia-red">Fase 2: Inmersión</h2>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-bold mb-4">Tendencias (Todos)</h3>
        <div className="space-y-2 mb-4">
            {(project.phase2.trends||[]).map(t => (
                <div key={t.id} className="border-l-4 border-murcia-gold bg-gray-50 p-3"><h4 className="font-bold">{t.title}</h4><p className="text-sm">{t.description}</p></div>
            ))}
        </div>
        <div className="flex gap-2"><input className="border p-2 flex-1" placeholder="Nueva Tendencia" value={newTrend.title} onChange={e => setNewTrend({...newTrend, title: e.target.value})} /><button onClick={addTrend} className="bg-murcia-red text-white p-2 rounded"><Plus/></button></div>
      </div>
      <RoleCheck allowedRoles={['Coordinador']} currentRole={currentUser?.role}>
         <div className="bg-white p-6 rounded shadow"><h3 className="font-bold mb-4">Canvas (Coordinador)</h3>
             <textarea className="w-full h-32 border p-2" value={project.phase2.canvas.valueProp} onChange={e => onUpdate({...project, phase2: {...project.phase2, canvas: {...project.phase2.canvas, valueProp: e.target.value, updatedBy: createMeta(currentUser)}}})} placeholder="Propuesta de Valor..." />
         </div>
      </RoleCheck>
    </div>
  );
};

export const Phase3Editor: React.FC<EditorProps> = ({ project, currentUser, onUpdate }) => {
    const [editing, setEditing] = useState<Partial<Dish>>({});
    const save = () => {
        if(!editing.name) return;
        const newDish = { id: editing.id || crypto.randomUUID(), name: editing.name, category: editing.category || 'Principal', description: editing.description || '', ods: editing.ods || [], photoBase64: editing.photoBase64, meta: editing.id ? editing.meta as AuthorMeta : createMeta(currentUser) };
        const list = [...(project.phase3.dishes||[])];
        const idx = list.findIndex(d => d.id === newDish.id);
        if(idx >= 0) list[idx] = newDish; else list.push(newDish);
        onUpdate({...project, phase3: {...project.phase3, dishes: list}});
        setEditing({});
    };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif text-murcia-red">Fase 3: Oferta</h2>
            <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input className="border p-2 w-full" placeholder="Nombre Plato" value={editing.name||''} onChange={e=>setEditing({...editing, name:e.target.value})}/>
                    <div className="flex items-center gap-2">
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded flex items-center gap-2 border flex-1 justify-center">
                            <Camera size={18} />
                            <span className="text-sm">{editing.photoBase64 ? 'Cambiar Foto' : 'Subir Foto'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                if(e.target.files?.[0]) handleImageResize(e.target.files[0], (b64) => setEditing({...editing, photoBase64: b64}))
                            }} />
                        </label>
                        {editing.photoBase64 && (
                            <div className="relative group">
                                <img src={editing.photoBase64} alt="Preview" className="h-10 w-10 object-cover rounded border" />
                                <button onClick={()=>setEditing({...editing, photoBase64: undefined})} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center text-[10px]">×</button>
                            </div>
                        )}
                    </div>
                </div>
                <textarea className="border p-2 w-full mb-2" placeholder="Descripción" value={editing.description||''} onChange={e=>setEditing({...editing, description:e.target.value})}/>
                <div className="flex gap-2 flex-wrap mb-4">{ODS_LIST.map(o => <button key={o.id} onClick={() => { const s = new Set(editing.ods||[]); if(s.has(o.id)) s.delete(o.id); else s.add(o.id); setEditing({...editing, ods: Array.from(s)}) }} className={`text-xs px-2 py-1 rounded text-white ${o.color} ${editing.ods?.includes(o.id) ? 'ring-2 ring-black' : 'opacity-50'}`}>{o.label}</button>)}</div>
                <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">Guardar Plato</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(project.phase3.dishes||[]).map(d => (
                    <div key={d.id} className="bg-white p-4 rounded shadow border">
                        {d.photoBase64 && <img src={d.photoBase64} alt={d.name} className="w-full h-32 object-cover rounded mb-2"/>}
                        <h4 className="font-bold">{d.name}</h4>
                        <p className="text-sm line-clamp-2">{d.description}</p>
                        <button onClick={()=>setEditing(d)} className="text-blue-500 text-sm mt-2">Editar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Phase4Editor: React.FC<EditorProps> = ({ project, currentUser, onUpdate }) => {
    const [tab, setTab] = useState('intro');
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif text-murcia-red">Fase 4: Consolidación</h2>
            <div className="flex gap-2 border-b"><button onClick={()=>setTab('intro')} className={`px-4 py-2 ${tab==='intro'?'font-bold border-b-2 border-red-500':''}`}>Intro <RoleBadge role="Documentación"/></button><button onClick={()=>setTab('obj')} className={`px-4 py-2 ${tab==='obj'?'font-bold border-b-2 border-red-500':''}`}>Objetivos <RoleBadge role="Producción"/></button><button onClick={()=>setTab('time')} className={`px-4 py-2 ${tab==='time'?'font-bold border-b-2 border-red-500':''}`}>Timeline <RoleBadge role="Coordinador"/></button></div>
            <div className="bg-white p-6 rounded shadow">
                {tab==='intro' && <RoleCheck allowedRoles={['Documentación', 'Coordinador']} currentRole={currentUser?.role}><textarea className="w-full h-64 border p-2" value={project.phase4.introText} onChange={e=>onUpdate({...project, phase4:{...project.phase4, introText:e.target.value}})} placeholder="Intro..."/></RoleCheck>}
                {tab==='obj' && <RoleCheck allowedRoles={['Producción', 'Coordinador']} currentRole={currentUser?.role}><textarea className="w-full h-64 border p-2" value={project.phase4.objectivesText} onChange={e=>onUpdate({...project, phase4:{...project.phase4, objectivesText:e.target.value}})} placeholder="Objetivos..."/></RoleCheck>}
                {tab==='time' && <RoleCheck allowedRoles={['Coordinador']} currentRole={currentUser?.role}><div className="text-center text-gray-500">Gestor de Timeline disponible en versión completa.</div></RoleCheck>}
            </div>
        </div>
    );
};

export const Phase5Editor: React.FC<EditorProps> = ({ project, currentUser, onUpdate }) => {
    return <div className="p-6 bg-white rounded shadow"><h2 className="text-xl font-bold mb-4">Fase 5: Costes (Rol: Recursos)</h2><p>Selecciona un plato para calcular su escandallo.</p></div>
};

export const Phase6Editor: React.FC<EditorProps> = ({ project, currentUser, onUpdate }) => {
     return <div className="p-6 bg-white rounded shadow"><h2 className="text-xl font-bold mb-4">Fase 6: Final (Rol: Comunicación/Documentación)</h2><p>Revisión final y defensa.</p></div>
};
