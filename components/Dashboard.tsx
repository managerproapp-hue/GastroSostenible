
import React from 'react';
import { ProjectState, Member } from '../types';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface DashboardProps {
  project: ProjectState;
  currentUser: Member;
  onNavigate: (phase: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ project, currentUser, onNavigate }) => {
  const { name, role } = currentUser;
  const myDishes = (project.phase3.dishes || []).filter(d => d.meta.author === name).length;
  
  const tasks = [
    { id: 2, title: "Inmersión", desc: "Aporta tendencias.", current: 0, target: 1, done: false },
    { id: 3, title: "Platos", desc: "Diseña 4 platos.", current: myDishes, target: 4, done: myDishes >= 4 },
  ];

  if (role === 'Coordinador') tasks.push({ id: 4, title: "Cronograma", desc: "Define tiempos.", current: (project.phase4.timeline||[]).length, target: 1, done: (project.phase4.timeline||[]).length > 0 });
  if (role === 'Recursos') tasks.push({ id: 5, title: "Costes", desc: "Calcula escandallos.", current: (project.phase5.costings||[]).length, target: 4, done: false });
  if (role === 'Comunicación') tasks.push({ id: 6, title: "Defensa", desc: "Prepara guion.", current: 0, target: 1, done: false });

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="bg-white p-6 rounded shadow border-l-8 border-murcia-red flex justify-between">
        <div><h2 className="text-2xl font-serif font-bold">Hola, {name}</h2><p className="text-gray-500">Rol: <span className="font-bold text-murcia-red">{role}</span></p></div>
      </header>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="bg-gray-900 text-white p-4 font-bold flex gap-2"><CheckCircle/> Tareas</div>
          <div className="divide-y">{tasks.map((t, i) => <div key={i} className="p-4 flex justify-between hover:bg-gray-50"><div><h4 className="font-bold">{t.title}</h4><p className="text-sm">{t.desc}</p></div><button onClick={()=>onNavigate(t.id)} className="text-blue-600"><ArrowRight/></button></div>)}</div>
        </div>
      </div>
    </div>
  );
};
