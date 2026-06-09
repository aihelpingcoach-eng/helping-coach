import { useState } from 'react';
import { LayoutDashboard, Dumbbell, Activity } from 'lucide-react';
import AdminDashboard from './admin/AdminDashboard';
import AdminExercises from './admin/AdminExercises';
import AdminInjuries from './admin/AdminInjuries';

type AdminTab = 'dashboard' | 'exercises' | 'injuries';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exercises', label: 'Ejercicios', icon: Dumbbell },
    { id: 'injuries', label: 'Lesiones', icon: Activity },
  ];

  return (
    <div className="relative w-full p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Panel Admin</h1>
        <p className="text-gray-400 mb-6">Gestión de contenidos de la app</p>

        <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-xl w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === id
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'exercises' && <AdminExercises />}
        {activeTab === 'injuries' && <AdminInjuries />}
      </div>
    </div>
  );
}
