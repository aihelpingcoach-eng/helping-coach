import { useState } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';
import { Player } from '../constants/playstyles';
import { supabase } from '../lib/supabase';
import { analyzePlayerPlaystyle } from '../utils/ai';

interface AddPlayerModalProps {
  onClose: () => void;
  onPlayerAdded: (player: Player) => void;
  existingPlayers: Player[];
}

export default function AddPlayerModal({ onClose, onPlayerAdded, existingPlayers }: AddPlayerModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedExisting, setSelectedExisting] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    playstyle: string;
    category: string;
    explanation: string;
  } | null>(null);
  const [mode, setMode] = useState<'new' | 'existing'>('new');

  const handleAnalyze = async () => {
    if (!name || !description) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzePlayerPlaystyle(description, name);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing player:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al analizar el jugador. Inténtalo de nuevo.';
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Solo se permiten imágenes JPG, PNG o WebP');
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    setIsUploadingImage(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('player-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('player-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (mode === 'existing' && selectedExisting) {
      const player = existingPlayers.find(p => p.id === selectedExisting);
      if (player) {
        onPlayerAdded(player);
      }
      return;
    }

    if (!name || !description || !analysisResult) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let finalImageUrl = null;
    if (imageFile) {
      finalImageUrl = await uploadImage();
    }

    const { data, error } = await supabase
      .from('players')
      .insert({
        name,
        description,
        image_url: finalImageUrl,
        playstyle: analysisResult.playstyle,
        playstyle_category: analysisResult.category,
        playstyle_explanation: analysisResult.explanation,
        level: 1,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving player:', error);
      return;
    }

    onPlayerAdded(data);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl max-w-2xl w-full p-4 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-3xl font-bold text-white">Añadir Jugador</h2>
          <button
            onClick={onClose}
            className="text-gray-400 active:text-white transition-colors touch-manipulation"
          >
            <X size={24} className="sm:w-7 sm:h-7" />
          </button>
        </div>

        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => setMode('new')}
            className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold transition-all touch-manipulation text-sm sm:text-base ${
              mode === 'new'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 active:bg-gray-700'
            }`}
          >
            Crear Nuevo
          </button>
          <button
            onClick={() => setMode('existing')}
            className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold transition-all touch-manipulation text-sm sm:text-base ${
              mode === 'existing'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 active:bg-gray-700'
            }`}
          >
            Usar Existente
          </button>
        </div>

        {mode === 'existing' ? (
          <div className="space-y-3 sm:space-y-4">
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
              Seleccionar Jugador
            </label>
            <select
              value={selectedExisting}
              onChange={(e) => setSelectedExisting(e.target.value)}
              className="w-full bg-black/50 text-white border border-purple-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              <option value="">-- Selecciona un jugador --</option>
              {existingPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} - {player.playstyle} (Nivel {player.level})
                </option>
              ))}
            </select>

            <button
              onClick={handleSave}
              disabled={!selectedExisting}
              className="w-full bg-green-600 active:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 rounded-lg transition-all mt-4 sm:mt-6 touch-manipulation text-sm sm:text-base"
            >
              Añadir a Formación
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Nombre del Jugador
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Cristiano Ronaldo"
                className="w-full bg-black/50 text-white border border-purple-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Descripción del Jugador
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe las características del jugador: velocidad, técnica, físico, estilo de juego..."
                rows={3}
                className="w-full bg-black/50 text-white border border-purple-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base sm:rows-4"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Imagen del Jugador (Opcional)
              </label>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex-1 bg-black/50 text-white border border-purple-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 cursor-pointer active:bg-black/70 transition-colors flex items-center justify-center gap-2 text-xs sm:text-base touch-manipulation"
                  >
                    <Upload size={18} className="sm:w-5 sm:h-5" />
                    <span className="truncate">{imageFile ? imageFile.name : 'Seleccionar imagen'}</span>
                  </label>
                </div>
                {imageUrl && (
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border-2 border-purple-500"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImageUrl('');
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 active:bg-red-700 text-white rounded-full p-1 touch-manipulation"
                    >
                      <X size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
                <p className="text-[10px] sm:text-xs text-gray-400 text-center">
                  JPG, PNG o WebP. Máximo 5MB
                </p>
              </div>
            </div>

            {!analysisResult && (
              <button
                onClick={handleAnalyze}
                disabled={!name || !description || isAnalyzing}
                className="w-full bg-purple-600 active:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 rounded-lg transition-all flex items-center justify-center gap-2 touch-manipulation text-sm sm:text-base"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="animate-spin" size={18} />
                    Analizando con IA...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analizar Playstyle
                  </>
                )}
              </button>
            )}

            {analysisResult && (
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-green-400 font-bold text-lg sm:text-xl">
                  <Sparkles size={20} className="sm:w-6 sm:h-6" />
                  ¡Felicidades!
                </div>
                <p className="text-white text-base sm:text-lg">
                  Su jugador es <span className="font-bold text-purple-300">{analysisResult.playstyle}</span>
                </p>
                <p className="text-gray-300 text-xs sm:text-sm">
                  {analysisResult.explanation}
                </p>
                <div className="text-xs sm:text-sm text-purple-400">
                  Categoría: {analysisResult.category}
                </div>

                <button
                  onClick={handleSave}
                  disabled={isUploadingImage}
                  className="w-full bg-green-600 active:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 rounded-lg transition-all mt-3 sm:mt-4 touch-manipulation text-sm sm:text-base"
                >
                  {isUploadingImage ? 'Subiendo imagen...' : 'Guardar Jugador'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
