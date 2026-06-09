import { useEffect, useState } from 'react';
import { Users, UserPlus, Dumbbell, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminStats, RecentUser } from '../../types/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, newToday: 0, totalExercises: 0, totalInjuries: 0 });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [
        { count: totalUsers },
        { count: newToday },
        { count: totalExercises },
        { count: totalInjuries },
        { data: recent },
      ] = await Promise.all([
        supabase.from('coach_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('coach_profiles').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
        supabase.from('exercises').select('*', { count: 'exact', head: true }),
        supabase.from('injuries').select('*', { count: 'exact', head: true }),
        supabase.from('coach_profiles').select('user_id, coach_name, created_at').order('created_at', { ascending: false }).limit(10),
      ]);

      setStats({
        totalUsers: totalUsers ?? 0,
        newToday: newToday ?? 0,
        totalExercises: totalExercises ?? 0,
        totalInjuries: totalInjuries ?? 0,
      });
      setRecentUsers(recent ?? []);
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total usuarios', value: stats.totalUsers, icon: Users, color: 'from-purple-500/20 to-purple-600/20', text: 'text-purple-400' },
    { label: 'Nuevos hoy', value: stats.newToday, icon: UserPlus, color: 'from-green-500/20 to-green-600/20', text: 'text-green-400' },
    { label: 'Ejercicios', value: stats.totalExercises, icon: Dumbbell, color: 'from-orange-500/20 to-orange-600/20', text: 'text-orange-400' },
    { label: 'Lesiones', value: stats.totalInjuries, icon: Activity, color: 'from-red-500/20 to-red-600/20', text: 'text-red-400' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, text }) => (
          <div key={label} className={`bg-gradient-to-br ${color} border border-white/10 rounded-2xl p-6`}>
            <Icon className={`${text} mb-3`} size={28} />
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-gray-400 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-semibold">Últimos registros</h3>
        </div>
        <div className="divide-y divide-white/5">
          {recentUsers.map((u) => (
            <div key={u.user_id} className="flex items-center justify-between px-4 py-3">
              <span className="text-white">{u.coach_name}</span>
              <span className="text-gray-400 text-sm">
                {new Date(u.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          ))}
          {recentUsers.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">Sin usuarios aún</div>
          )}
        </div>
      </div>
    </div>
  );
}
