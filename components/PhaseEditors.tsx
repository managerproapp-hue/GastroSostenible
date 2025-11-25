
import React, { useState, useEffect } from 'react';
import { ProjectState, Member, AuthorMeta, Dish, Trend, TimelineEvent, Costing, Ingredient, Evaluation, Role, IndividualChecklist } from '../types';
import { ODS_LIST } from '../constants';
import { Camera, Plus, Lock, CheckSquare, FileText, Presentation, Upload, Link, Calendar, DollarSign, Calculator, Trash2, Image as ImageIcon, Users, MapPin } from 'lucide-react';

interface EditorProps {
  project: ProjectState;
  currentUser: Member | null;
  onUpdate: (updatedProject: ProjectState) => void;
}

// Helper para generar IDs seguros
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

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
            {role === 'Coordinador' ? '👑' : ''} {role}
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
            
            {/* DATOS INSTITUCIONALES EDITABLES */}
            <div className="pt-4 border-t">
                 <h3 className="font-bold text-gray-800 mb-2">Datos Institucionales (Editables)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Centro</label>
                        <input className="w-full border p-2 rounded" value={project.meta.centerName || ''} onChange={e => onUpdate({...project, meta: {...project.meta, centerName: e.target.value}})} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Dirección del Centro</label>
                        <input className="w-full border p-2 rounded" value={project.meta.centerAddress || ''} onChange={e => onUpdate({...project, meta: {...project.meta, centerAddress: e.target.value}})} />
                     </div>
                 </div>
            </div>

            {/* ASSETS INSTITUCIONALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><ImageIcon size={16}/> Logo del Centro</label>
                    <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center h-32">
                        {project.meta.logoBase64 ? (
                            <img src={project.meta.logoBase64} alt="Logo" className="h-full object-contain" />
                        ) : (
                            <span className="text-xs text-gray-500">Click para subir Logo</span>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            if(e.target.files?.[0]) handleImageResize(e.target.files[0], (b64) => onUpdate({...project, meta: {...project.meta, logoBase64: b64}}))
                        }} />
                    </label>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Users size={16}/> Foto del Equipo</label>
                    <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center h-32">
                         {project.meta.groupPhotoBase64 ? (
                            <img src={project.meta.groupPhotoBase64} alt="Equipo" className="h-full object-cover" />
                        ) : (
                            <span className="text-xs text-gray-500">Click para subir Foto Grupo</span>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            if(e.target.files?.[0]) handleImageResize(e.target.files[0], (b64) => onUpdate({...project, meta: {...project.meta, groupPhotoBase64: b64}}))
                        }} />
                    </label>
                 </div>
            </div>
        </div>
      </RoleCheck>
    </div>
);

export const Phase2Editor: React.FC<EditorProps> = ({ project, currentUser, onUpdate }) => {
  const [newTrend, setNewTrend] = useState({ title: '', description: '' });
  const addTrend = () => {
    if (!newTrend.title) return;
    onUpdate({ ...project, phase2: { ...project.phase2, trends: [...(project.phase2.trends||[]), { id: generateId(), ...newTrend, meta: createMeta(currentUser) }] } });
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
        const newDish: Dish = { 
            id: editing.id || generateId(), 
            name: editing.name, 
            category: editing.category || 'Principal', 
            description: editing.description || '', 
            ingredientsList: editing.ingredientsList || '',
            elaborationSteps: editing.elaborationSteps || '',
            criticalPhases: editing.criticalPhases || '',
            ods: editing.ods || [], 
            photoBase64: editing.photoBase64, 
            meta: editing.id ? editing.meta as AuthorMeta : createMeta(currentUser) 
        };
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
                <h3 className="font-bold text-lg mb-4">{editing.id ? 'Editar Plato' : 'Nuevo Plato'}</h3>
                
                {/* Cabecera Plato */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <input className="border p-2 w-full mb-2 font-bold" placeholder="Nombre del Plato" value={editing.name||''} onChange={e=>setEditing({...editing, name:e.target.value})}/>
                        <select className="border p-2 w-full" value={editing.category || 'Principal'} onChange={e => setEditing({...editing, category: e.target.value as any})}>
                            <option value="Aperitivo">Aperitivo</option>
                            <option value="Entrante">Entrante</option>
                            <option value="Principal">Principal</option>
                            <option value="Postre">Postre</option>
                        </select>
                    </div>
                    <div className="flex flex-col justify-center">
                         <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded flex items-center gap-2 border flex-1 justify-center h-full">
                                <Camera size={18} />
                                <span className="text-sm">{editing.photoBase64 ? 'Cambiar Foto' : 'Subir Foto'}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    if(e.target.files?.[0]) handleImageResize(e.target.files[0], (b64) => setEditing({...editing, photoBase64: b64}))
                                }} />
                            </label>
                            {editing.photoBase64 && (
                                <img src={editing.photoBase64} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Campos Extendidos */}
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Descripción</label>
                        <textarea className="border p-2 w-full h-20 text-sm" placeholder="Breve historia del plato..." value={editing.description||''} onChange={e=>setEditing({...editing, description:e.target.value})}/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Lista de Ingredientes</label>
                        <textarea className="border p-2 w-full h-24 text-sm font-mono" placeholder="- Ingrediente 1&#10;- Ingrediente 2..." value={editing.ingredientsList||''} onChange={e=>setEditing({...editing, ingredientsList:e.target.value})}/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Elaboración Paso a Paso</label>
                        <textarea className="border p-2 w-full h-32 text-sm" placeholder="1. Primero..." value={editing.elaborationSteps||''} onChange={e=>setEditing({...editing, elaborationSteps:e.target.value})}/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Fases Importantes / Puntos Críticos</label>
                        <textarea className="border p-2 w-full h-20 text-sm bg-yellow-50" placeholder="¡Cuidado con la temperatura!..." value={editing.criticalPhases||''} onChange={e=>setEditing({...editing, criticalPhases:e.target.value})}/>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap mb-4">
                    {ODS_LIST.map(o => <button key={o.id} onClick={() => { const s = new Set(editing.ods||[]); if(s.has(o.id)) s.delete(o.id); else s.add(o.id); setEditing({...editing, ods: Array.from(s)}) }} className={`text-xs px-2 py-1 rounded text-white ${o.color} ${editing.ods?.includes(o.id) ? 'ring-2 ring-black' : 'opacity-50'}`}>{o.label}</button>)}
                </div>
                
                <button onClick={save} className="bg-blue-600 text-white px-6 py-2 rounded w-full font-bold">Guardar Ficha de Plato</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(project.phase3.dishes||[]).map(d => (
                    <div key={d.id} className="bg-white p-4 rounded shadow border hover:shadow-lg transition-shadow">
                        {d.photoBase64 && <img src={d.photoBase64} alt={d.name} className="w-full h-32 object-cover rounded mb-2"/>}
                        <h4 className="font-bold">{d.name}</h4>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{d.category}</span>
                        <p className="text-sm line-clamp-2 mt-2 text-gray-600">{d.description}</p>
                        <button onClick={()=>setEditing(d)} className="text-blue-500 text-sm mt-3 font-bold border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 w-full">Editar Ficha</button>
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
    const [selectedDishId, setSelectedDishId] = useState<string>('');
    
    // Find costing for selected dish or create default
    const currentCosting = (project.phase5.costings || []).find(c => c.dishId === selectedDishId) || {
        dishId: selectedDishId,
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        ingredients: [],
        portionWeight: 0,
        portions: 1,
        multiplier: 3, // Default coefficient
        totalCost: 0,
        meta: createMeta(currentUser)
    };

    const selectedDish = project.phase3.dishes?.find(d => d.id === selectedDishId);

    const updateCosting = (updated: Costing) => {
        // Recalculate totals
        const totalIngredientsCost = updated.ingredients.reduce((acc, ing) => {
            const cost = ing.grossWeight * ing.pricePerUnit; // Simple calculation: weight * price/unit
            return acc + cost;
        }, 0);
        
        updated.totalCost = totalIngredientsCost;

        const list = [...(project.phase5.costings || [])];
        const idx = list.findIndex(c => c.dishId === updated.dishId);
        if (idx >= 0) list[idx] = updated; else list.push(updated);
        onUpdate({ ...project, phase5: { ...project.phase5, costings: list } });
    };

    const addIngredient = () => {
        const newIng: Ingredient = {
            id: generateId(),
            name: '',
            grossWeight: 0,
            unit: 'Kg',
            pricePerUnit: 0
        };
        updateCosting({ ...currentCosting, ingredients: [...currentCosting.ingredients, newIng] });
    };

    const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
        const newIngs = [...currentCosting.ingredients];
        newIngs[index] = { ...newIngs[index], [field]: value };
        updateCosting({ ...currentCosting, ingredients: newIngs });
    };

    const removeIngredient = (index: number) => {
        const newIngs = [...currentCosting.ingredients];
        newIngs.splice(index, 1);
        updateCosting({ ...currentCosting, ingredients: newIngs });
    };

    const costPerPortion = currentCosting.totalCost / (currentCosting.portions || 1);
    const pvp = costPerPortion * currentCosting.multiplier;
    const foodCost = pvp > 0 ? (costPerPortion / pvp) * 100 : 0;
    const margen = pvp - costPerPortion;
    const margenPorcentaje = pvp > 0 ? (margen / pvp) * 100 : 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif text-murcia-red flex items-center gap-2">
                Fase 5: Costes <RoleBadge role="Recursos"/>
            </h2>

            {!selectedDishId ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(project.phase3.dishes || []).map(d => (
                        <button key={d.id} onClick={() => setSelectedDishId(d.id)} className="bg-white p-6 rounded shadow border hover:border-blue-500 text-left transition-all">
                            <h4 className="font-bold text-lg mb-1">{d.name}</h4>
                            <p className="text-sm text-gray-500">{d.category}</p>
                            <div className="mt-4 text-xs font-bold text-blue-600">
                                {project.phase5.costings?.find(c => c.dishId === d.id) ? '✓ Escandallo Iniciado' : '+ Crear Escandallo'}
                            </div>
                        </button>
                    ))}
                    {(project.phase3.dishes || []).length === 0 && <p className="text-gray-500 italic">Primero crea platos en la Fase 3.</p>}
                </div>
            ) : (
                <div className="animate-in slide-in-from-right-10 fade-in duration-300">
                    <button onClick={() => setSelectedDishId('')} className="mb-4 text-sm text-gray-500 hover:text-black">← Volver a la lista</button>
                    
                    <div className="bg-blue-100 border-2 border-black rounded-none shadow-xl overflow-hidden text-sm">
                        {/* HEADER FICHA */}
                        <div className="bg-blue-200 p-4 border-b-2 border-black text-center">
                            <h3 className="text-xl font-bold uppercase">ESCANDALLO DE PLATO</h3>
                            <h4 className="font-bold">HOJA DE COSTE</h4>
                        </div>

                        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-2 border-b-2 border-black bg-white">
                            <div>
                                <div className="flex justify-between items-center h-8"><span className="font-bold">Nombre del plato:</span> <span className="flex-1 ml-2 border-b border-gray-300">{selectedDish?.name}</span></div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex justify-between items-center border border-black p-1 flex-1">
                                    <span className="font-bold text-xs mr-2">Nº de raciones</span> 
                                    <input type="number" className="w-12 text-right font-bold" value={currentCosting.portions} onChange={e => updateCosting({...currentCosting, portions: Number(e.target.value)})} />
                                </div>
                                <div className="flex justify-between items-center border border-black p-1 flex-1">
                                    <span className="font-bold text-xs mr-2">Fecha</span> 
                                    <input type="date" className="w-24 text-xs" value={currentCosting.date} onChange={e => updateCosting({...currentCosting, date: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* TABLA INGREDIENTES */}
                        <table className="w-full text-left border-collapse bg-white">
                            <thead>
                                <tr className="bg-blue-200 border-b-2 border-black text-xs text-center">
                                    <th className="p-1 border-r border-black w-1/3">Productos</th>
                                    <th className="p-1 border-r border-black w-20">Cantidad</th>
                                    <th className="p-1 border-r border-black w-20">Unidad</th>
                                    <th className="p-0 border-black" colSpan={2}>
                                        <div className="border-b border-black">Costes</div>
                                        <div className="flex">
                                            <div className="w-1/2 border-r border-black">Precio</div>
                                            <div className="w-1/2">Coste</div>
                                        </div>
                                    </th>
                                    <th className="p-1 w-8"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCosting.ingredients.map((ing, idx) => (
                                    <tr key={ing.id} className="border-b border-gray-300 text-xs">
                                        <td className="p-1 border-r border-black">
                                            <input className="w-full p-1 outline-none" placeholder="Ingrediente..." value={ing.name} onChange={e => updateIngredient(idx, 'name', e.target.value)} />
                                        </td>
                                        <td className="p-1 border-r border-black text-right">
                                            <input type="number" step="0.001" className="w-full p-1 text-right outline-none" value={ing.grossWeight} onChange={e => updateIngredient(idx, 'grossWeight', Number(e.target.value))} />
                                        </td>
                                        <td className="p-1 border-r border-black text-center text-gray-500">
                                            <select className="w-full bg-transparent outline-none" value={ing.unit || 'Kg'} onChange={e => updateIngredient(idx, 'unit', e.target.value)}>
                                                <option>Kg</option>
                                                <option>L</option>
                                                <option>Ud</option>
                                                <option>g</option>
                                            </select>
                                        </td>
                                        <td className="p-1 border-r border-black text-right relative">
                                            <input type="number" step="0.01" className="w-full p-1 text-right outline-none" value={ing.pricePerUnit} onChange={e => updateIngredient(idx, 'pricePerUnit', Number(e.target.value))} />
                                        </td>
                                        <td className="p-1 text-right font-mono bg-blue-50">
                                            {(ing.grossWeight * ing.pricePerUnit).toFixed(2)} €
                                        </td>
                                        <td className="p-1 text-center">
                                            <button onClick={() => removeIngredient(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={12}/></button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={6} className="p-2 bg-gray-50 border-t border-black text-center">
                                        <button onClick={addIngredient} className="text-blue-600 font-bold text-xs">+ Añadir Ingrediente</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* TOTALES Y RENTABILIDAD */}
                        <div className="bg-white border-t-2 border-black text-sm">
                            <div className="flex border-b border-black">
                                <div className="w-2/3 p-1 pl-2 font-bold border-r border-black">Coste total de la materia prima</div>
                                <div className="w-1/3 p-1 pr-2 text-right">{currentCosting.totalCost.toFixed(2)} €</div>
                            </div>
                            <div className="flex border-b border-black">
                                <div className="w-2/3 p-1 pl-2 font-bold border-r border-black">Coste por ración</div>
                                <div className="w-1/3 p-1 pr-2 text-right">{costPerPortion.toFixed(2)} €</div>
                            </div>
                            <div className="flex border-b border-black">
                                <div className="w-2/3 p-1 pl-2 font-bold border-r border-black">% Food cost</div>
                                <div className="w-1/3 p-1 pr-2 text-right">{foodCost.toFixed(1)} %</div>
                            </div>
                            <div className="flex border-b border-black">
                                <div className="w-2/3 p-1 pl-2 font-bold border-r border-black">Margen bruto de explotación</div>
                                <div className="w-1/3 p-1 pr-2 text-right">{margen.toFixed(2)} €</div>
                            </div>
                            <div className="flex border-b border-black">
                                <div className="w-2/3 p-1 pl-2 font-bold border-r border-black">% Margen bruto de explotación</div>
                                <div className="w-1/3 p-1 pr-2 text-right">{margenPorcentaje.toFixed(1)} %</div>
                            </div>
                            <div className="flex border-b border-black bg-yellow-50">
                                <div className="w-2/3 p-1 pl-2 font-bold border-r border-black flex justify-between items-center">
                                    <span>Precio de venta calculado</span>
                                    <div className="flex items-center gap-2 text-xs font-normal">
                                        (Coeficiente <input type="number" className="w-10 border text-center font-bold" value={currentCosting.multiplier} onChange={e => updateCosting({...currentCosting, multiplier: Number(e.target.value)})} />)
                                    </div>
                                </div>
                                <div className="w-1/3 p-1 pr-2 text-right font-bold text-green-700">{pvp.toFixed(2)} €</div>
                            </div>
                             <div className="flex bg-gray-900 text-white font-bold">
                                <div className="w-2/3 p-2 pl-2 border-r border-gray-700 uppercase">Precio de venta al público por ración</div>
                                <div className="w-1/3 p-2 pr-2 text-right text-lg">{pvp.toFixed(2)} €</div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

// --- FASE 6: FINAL Y DEFENSA (Tarea 5) ---
export const Phase6Editor: React.FC<EditorProps> = ({ project, currentUser, onUpdate }) => {
    const [tab, setTab] = useState<'individual' | 'memory' | 'defense'>('individual');
    
    // Ensure phase6 data exists (backward compatibility)
    if (!project.phase6.individualChecklists) {
        // This is a safety check usually handled in state init, but robust for UI render
    }

    const myChecklist = currentUser ? (project.phase6.individualChecklists?.[currentUser.id] || { reviewedResearch: false, reviewedDishes: false, defensePrep: false }) : { reviewedResearch: false, reviewedDishes: false, defensePrep: false };

    const updateChecklist = (key: keyof IndividualChecklist) => {
        if (!currentUser) return;
        const newChecklist = { ...myChecklist, [key]: !myChecklist[key] };
        onUpdate({
            ...project,
            phase6: {
                ...project.phase6,
                individualChecklists: {
                    ...(project.phase6.individualChecklists || {}),
                    [currentUser.id]: newChecklist
                }
            }
        });
    };

    const generateDraft = () => {
        const draft = `
PROYECTO: ${project.meta.projectName || project.meta.teamName}
ZONA: ${project.phase1.gastronomicZone}

1. INTRODUCCIÓN Y JUSTIFICACIÓN
${project.phase1.justification}

2. PÚBLICO OBJETIVO
${project.phase1.targetAudience}

3. TENDENCIAS APLICADAS
${(project.phase2.trends || []).map(t => `- ${t.title}: ${t.description}`).join('\n')}

4. PROPUESTA DE VALOR
${project.phase2.canvas.valueProp}

5. OFERTA GASTRONÓMICA
${(project.phase3.dishes || []).map(d => `- ${d.name} (${d.category})`).join('\n')}
        `;
        // Put in Intro
        onUpdate({
            ...project,
            phase6: { ...project.phase6, introduction: draft }
        });
        alert("Borrador generado en el campo 'Introducción' con los datos actuales.");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-2xl font-serif text-murcia-red">Fase 6: Final y Defensa</h2>
                <span className="text-sm text-gray-500 italic">Tarea 5: Consolidación</span>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                <button 
                    onClick={() => setTab('individual')} 
                    className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 ${tab === 'individual' ? 'bg-white text-indigo-700 border-t-2 border-indigo-700 shadow-sm' : 'bg-gray-100 text-gray-500'}`}
                >
                    <CheckSquare size={16}/> Parte A: Individual <RoleBadge role="Todos"/>
                </button>
                <button 
                    onClick={() => setTab('memory')} 
                    className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 ${tab === 'memory' ? 'bg-white text-green-700 border-t-2 border-green-700 shadow-sm' : 'bg-gray-100 text-gray-500'}`}
                >
                    <FileText size={16}/> Memoria <RoleBadge role="Documentación"/>
                </button>
                <button 
                    onClick={() => setTab('defense')} 
                    className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 ${tab === 'defense' ? 'bg-white text-purple-700 border-t-2 border-purple-700 shadow-sm' : 'bg-gray-100 text-gray-500'}`}
                >
                    <Presentation size={16}/> Defensa <RoleBadge role="Comunicación"/>
                </button>
            </div>

            <div className="bg-white p-6 rounded-b-lg rounded-tr-lg shadow border-t border-gray-100 min-h-[400px]">
                
                {/* TAB A: TRABAJO INDIVIDUAL */}
                {tab === 'individual' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-indigo-50 p-4 rounded border-l-4 border-indigo-500 text-indigo-900 text-sm">
                            <strong>Instrucciones:</strong> Cada miembro debe revisar sus aportaciones y preparar su parte de la defensa oral. Marca las casillas cuando estés listo.
                        </div>

                        {currentUser ? (
                            <div className="max-w-xl mx-auto border p-6 rounded-xl shadow-sm">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">{currentUser.name.charAt(0)}</span>
                                    Checklist de {currentUser.name}
                                </h3>
                                
                                <div className="space-y-4">
                                    <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer border transition-colors">
                                        <input type="checkbox" className="mt-1 w-5 h-5 text-indigo-600 rounded" checked={myChecklist.reviewedResearch} onChange={() => updateChecklist('reviewedResearch')} />
                                        <div>
                                            <span className="font-bold block text-gray-800">1. Revisión de Investigación</span>
                                            <span className="text-sm text-gray-500">He confirmado que mis aportes en Fase 1 y 2 (Tendencias) están correctos en la memoria.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer border transition-colors">
                                        <input type="checkbox" className="mt-1 w-5 h-5 text-indigo-600 rounded" checked={myChecklist.reviewedDishes} onChange={() => updateChecklist('reviewedDishes')} />
                                        <div>
                                            <span className="font-bold block text-gray-800">2. Validación de Platos</span>
                                            <span className="text-sm text-gray-500">Mis platos en Fase 3 tienen nombre, descripción, foto y ODS asignados.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer border transition-colors">
                                        <input type="checkbox" className="mt-1 w-5 h-5 text-indigo-600 rounded" checked={myChecklist.defensePrep} onChange={() => updateChecklist('defensePrep')} />
                                        <div>
                                            <span className="font-bold block text-gray-800">3. Preparación Defensa Oral</span>
                                            <span className="text-sm text-gray-500">He ensayado mi parte de la exposición y preparado posibles respuestas.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 italic py-10">Selecciona tu usuario en la barra lateral para ver tu checklist.</div>
                        )}
                    </div>
                )}

                {/* TAB B: MEMORIA (DOCUMENTACIÓN) */}
                {tab === 'memory' && (
                    <div className="space-y-6 animate-in fade-in">
                        <RoleCheck allowedRoles={['Documentación', 'Coordinador']} currentRole={currentUser?.role}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Redacción Final del Proyecto</h3>
                                <button onClick={generateDraft} className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-2 rounded flex items-center gap-1 font-bold">
                                    <FileText size={14}/> Generar Borrador Automático
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Introducción Completa</label>
                                    <textarea 
                                        className="w-full h-48 border p-3 rounded bg-gray-50 focus:bg-white transition-colors" 
                                        placeholder="Escribe la introducción final que une todas las fases..."
                                        value={project.phase6.introduction}
                                        onChange={e => onUpdate({...project, phase6: {...project.phase6, introduction: e.target.value}})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Conclusiones Grupales</label>
                                    <textarea 
                                        className="w-full h-32 border p-3 rounded bg-gray-50 focus:bg-white transition-colors" 
                                        placeholder="Reflexión final sobre la viabilidad y aprendizaje..."
                                        value={project.phase6.conclusions}
                                        onChange={e => onUpdate({...project, phase6: {...project.phase6, conclusions: e.target.value}})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Bibliografía y Anexos</label>
                                    <textarea 
                                        className="w-full h-24 border p-3 rounded bg-gray-50 focus:bg-white transition-colors" 
                                        placeholder="Lista de fuentes consultadas..."
                                        value={project.phase6.bibliography}
                                        onChange={e => onUpdate({...project, phase6: {...project.phase6, bibliography: e.target.value}})}
                                    />
                                </div>

                                <div className="border-t pt-4 flex items-center justify-between">
                                    <div>
                                        <span className="font-bold text-gray-800 block">Subida de PDF Final</span>
                                        <span className="text-xs text-gray-500">Sube la versión definitiva maquetada.</span>
                                    </div>
                                    <button 
                                        onClick={() => onUpdate({...project, phase6: {...project.phase6, memoryPdfUploaded: !project.phase6.memoryPdfUploaded}})}
                                        className={`px-4 py-2 rounded font-bold flex items-center gap-2 ${project.phase6.memoryPdfUploaded ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border'}`}
                                    >
                                        <Upload size={16}/> {project.phase6.memoryPdfUploaded ? 'Memoria Subida (Simulado)' : 'Subir PDF'}
                                    </button>
                                </div>
                            </div>
                        </RoleCheck>
                    </div>
                )}

                {/* TAB B: DEFENSA (COMUNICACIÓN) */}
                {tab === 'defense' && (
                    <div className="space-y-6 animate-in fade-in">
                        <RoleCheck allowedRoles={['Comunicación', 'Coordinador']} currentRole={currentUser?.role}>
                            <h3 className="font-bold text-gray-800 mb-4">Preparación de la Defensa Oral</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-purple-50 p-4 rounded border border-purple-100">
                                    <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2"><Presentation size={18}/> Presentación Visual</h4>
                                    <p className="text-xs text-purple-700 mb-4">PowerPoint/Genially (Máx 15 slides)</p>
                                    <button 
                                        onClick={() => onUpdate({...project, phase6: {...project.phase6, presentationUploaded: !project.phase6.presentationUploaded}})}
                                        className={`w-full py-2 rounded font-bold text-sm ${project.phase6.presentationUploaded ? 'bg-green-500 text-white' : 'bg-white border border-purple-200 text-purple-700'}`}
                                    >
                                        {project.phase6.presentationUploaded ? '✓ Presentación Lista' : 'Marcar como Completada'}
                                    </button>
                                </div>

                                <div className="bg-orange-50 p-4 rounded border border-orange-100">
                                    <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2"><Calendar size={18}/> Ensayo General</h4>
                                    <p className="text-xs text-orange-700 mb-2">Fecha prevista para el ensayo:</p>
                                    <input 
                                        type="date" 
                                        className="w-full p-2 rounded border border-orange-200 text-sm"
                                        value={project.phase6.rehearsalDate}
                                        onChange={e => onUpdate({...project, phase6: {...project.phase6, rehearsalDate: e.target.value}})}
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-6 mt-2">
                                <h4 className="font-bold text-gray-800 mb-3">Formatos de Carta</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-1 flex items-center gap-2"><Link size={14}/> URL Carta Virtual (QR)</label>
                                        <input 
                                            className="w-full border p-2 rounded" 
                                            placeholder="https://..."
                                            value={project.phase6.virtualMenuUrl}
                                            onChange={e => onUpdate({...project, phase6: {...project.phase6, virtualMenuUrl: e.target.value}})}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                        <span className="text-sm font-bold text-gray-600">Carta Física (Foto/PDF)</span>
                                        <button 
                                            onClick={() => onUpdate({...project, phase6: {...project.phase6, physicalMenuUploaded: !project.phase6.physicalMenuUploaded}})}
                                            className={`px-3 py-1 rounded text-xs font-bold ${project.phase6.physicalMenuUploaded ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                                        >
                                            {project.phase6.physicalMenuUploaded ? 'Subida' : 'Pendiente'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </RoleCheck>
                    </div>
                )}
            </div>
        </div>
    );
};