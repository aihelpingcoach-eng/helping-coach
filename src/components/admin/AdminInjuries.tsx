import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, FolderPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useInjuryCategories, InjuryCategoryRow, InjuryRow } from '../../hooks/useInjuries';
import InjuryFormModal from './InjuryFormModal';
import InjuryCategoryFormModal from './InjuryCategoryFormModal';

export default function AdminInjuries() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { categories, loading } = useInjuryCategories(refreshKey);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Injury modal
  const [showInjuryModal, setShowInjuryModal] = useState(false);
  const [editInjury, setEditInjury] = useState<InjuryRow | undefined>();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');

  // Category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editCategory, setEditCategory] = useState<InjuryCategoryRow | undefined>();

  const refresh = () => setRefreshKey(k => k + 1);

  const handleDeleteCategory = async (category: InjuryCategoryRow) => {
    if (!confirm(`¿Eliminar el tipo "${category.name}" y todas sus lesiones?`)) return;
    await supabase.from('injury_categories').delete().eq('id', category.id);
    if (expanded === category.id) setExpanded(null);
    refresh();
  };

  const handleDeleteInjury = async (id: string) => {
    if (!confirm('¿Eliminar esta lesión?')) return;
    await supabase.from('injuries').delete().eq('id', id);
    refresh();
  };

  const openAddInjury = (categoryId: string) => {
    setEditInjury(undefined);
    setActiveCategoryId(categoryId);
    setShowInjuryModal(true);
  };

  const openEditInjury = (injury: InjuryRow, categoryId: string) => {
    setEditInjury(injury);
    setActiveCategoryId(categoryId);
    setShowInjuryModal(true);
  };

  const openAddCategory = () => {
    setEditCategory(undefined);
    setShowCategoryModal(true);
  };

  const openEditCategory = (category: InjuryCategoryRow) => {
    setEditCategory(category);
    setShowCategoryModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Tipos de lesiones ({categories.length})
        </h3>
        <button
          onClick={openAddCategory}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <FolderPlus size={16} /> Nueva categoría
        </button>
      </div>

      {categories.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-gray-400 mb-2">No hay categorías aún.</p>
          <p className="text-gray-500 text-sm">Pulsa "Nueva categoría" para empezar.</p>
        </div>
      )}

      <div className="space-y-3">
        {categories.map((category: InjuryCategoryRow) => (
          <div key={category.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpanded(expanded === category.id ? null : category.id)}
            >
              <div className="flex items-center gap-3">
                {expanded === category.id
                  ? <ChevronDown size={16} className="text-gray-400" />
                  : <ChevronRight size={16} className="text-gray-400" />}
                <span className="text-white font-semibold">{category.name}</span>
                <span className="text-gray-400 text-sm">({category.injuries.length})</span>
              </div>

              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => openAddInjury(category.id)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                >
                  <Plus size={13} /> Lesión
                </button>
                <button
                  onClick={() => openEditCategory(category)}
                  className="text-gray-400 hover:text-orange-400 transition-colors p-1.5 rounded hover:bg-white/5"
                  title="Editar categoría"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-white/5"
                  title="Eliminar categoría"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {expanded === category.id && (
              <div className="divide-y divide-white/5 border-t border-white/10">
                {category.injuries.map((injury: InjuryRow) => (
                  <div key={injury.id} className="flex items-center gap-3 px-4 py-3 pl-10">
                    <div className="flex-1 text-white text-sm">{injury.name}</div>
                    <button
                      onClick={() => openEditInjury(injury, category.id)}
                      className="text-gray-400 hover:text-orange-400 transition-colors p-1"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteInjury(injury.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {category.injuries.length === 0 && (
                  <div className="px-10 py-4 text-gray-500 text-sm">
                    Sin lesiones — pulsa "+ Lesión" para añadir
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showInjuryModal && (
        <InjuryFormModal
          injury={editInjury}
          categories={categories}
          defaultCategoryId={activeCategoryId}
          onClose={() => setShowInjuryModal(false)}
          onSaved={() => { setShowInjuryModal(false); refresh(); }}
        />
      )}

      {showCategoryModal && (
        <InjuryCategoryFormModal
          category={editCategory}
          onClose={() => setShowCategoryModal(false)}
          onSaved={() => { setShowCategoryModal(false); refresh(); }}
        />
      )}
    </div>
  );
}
