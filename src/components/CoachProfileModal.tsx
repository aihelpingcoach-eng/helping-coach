import { X, User, Crown, MapPin, Cake, CalendarClock, Shirt, LayoutGrid, Target } from 'lucide-react';

export interface RankingRow {
  user_id: string;
  coach_name: string;
  team_name: string;
  profile_photo: string;
  total_xp: number;
  rank: string;
  age: number | null;
  country: string | null;
  years_experience: number | null;
  coaching_style: string | null;
  favorite_formation: string | null;
  coach_level: string | null;
  team_objective: string | null;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-black/30 rounded-lg px-3 py-2.5">
      <div className="text-purple-400 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-gray-500 text-[11px] leading-none mb-1">{label}</p>
        <p className="text-white text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

export default function CoachProfileModal({ coach, onClose }: { coach: RankingRow; onClose: () => void }) {
  const facts: { icon: React.ReactNode; label: string; value: string }[] = [];
  if (coach.country) facts.push({ icon: <MapPin size={16} />, label: 'País', value: coach.country });
  if (coach.age) facts.push({ icon: <Cake size={16} />, label: 'Edad', value: `${coach.age} años` });
  if (coach.years_experience != null) facts.push({ icon: <CalendarClock size={16} />, label: 'Experiencia', value: `${coach.years_experience} años` });
  if (coach.coaching_style) facts.push({ icon: <Shirt size={16} />, label: 'Estilo de entrenador', value: coach.coaching_style });
  if (coach.favorite_formation) facts.push({ icon: <LayoutGrid size={16} />, label: 'Formación favorita', value: coach.favorite_formation });
  if (coach.team_objective) facts.push({ icon: <Target size={16} />, label: 'Objetivo del equipo', value: coach.team_objective });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-2xl max-w-md w-full shadow-2xl border border-purple-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-purple-500/30 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Perfil del entrenador</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-700 flex items-center justify-center flex-shrink-0 border-2 border-purple-500/50">
              {coach.profile_photo ? (
                <img src={coach.profile_photo} alt={coach.coach_name} className="w-full h-full object-cover" />
              ) : (
                <User size={26} className="text-white" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-white truncate">{coach.coach_name || 'Entrenador'}</h3>
              {coach.team_name && <p className="text-gray-400 text-sm truncate">{coach.team_name}</p>}
              <div className="flex items-center gap-1 mt-1 text-purple-300 font-bold text-sm">
                <Crown size={14} className="text-yellow-400" />
                {coach.total_xp.toLocaleString()} XP
                <span className="text-gray-500 font-normal">· {coach.coach_level || coach.rank}</span>
              </div>
            </div>
          </div>

          {facts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {facts.map((f, i) => <InfoRow key={i} {...f} />)}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Este entrenador no ha completado su perfil todavía.</p>
          )}
        </div>
      </div>
    </div>
  );
}
