import { KeyboardEvent, RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronRight, Info, Pointer, X } from 'lucide-react';
import { BODY_BACK, BODY_FRONT, BODY_OUTLINE, BODY_VIEWBOX } from '../constants/bodyMapPaths';
import { BodyView, INJURY_ZONES, InjuryZone, InjuryZoneId, ZONE_BY_MUSCLE } from '../constants/injuryZones';
import { InjuryRow } from '../hooks/useInjuries';

export interface ZoneInjury {
  injury: InjuryRow;
  categoryName: string;
}

interface InjuryBodyMapProps {
  view: BodyView;
  onViewChange: (view: BodyView) => void;
  selectedZone: InjuryZoneId | null;
  onSelectZone: (zone: InjuryZoneId | null) => void;
  injuriesBySlug: Map<string, ZoneInjury>;
  loading: boolean;
  onOpenInjury: (injury: InjuryRow) => void;
}

// Zonas cuyo dibujo queda por debajo del tamaño mínimo de toque en móvil:
// se les añade un trazo transparente que amplía el área sensible.
const SMALL_ZONES: InjuryZoneId[] = ['muneca-mano', 'tobillo', 'aquiles', 'pie'];
const HIT_STROKE = 28;
const GLOW_ID = 'injury-zone-glow';

const DISCLAIMER = 'Orientativo: muestra lesiones frecuentes en esa zona. No sustituye el diagnóstico de un médico o fisioterapeuta.';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

function countLabel(n: number) {
  return n === 1 ? '1 lesión probable' : `${n} lesiones probables`;
}

function BodySvg({
  view,
  selectedZone,
  onSelectZone,
  isZoneAvailable,
  svgRef,
}: {
  view: BodyView;
  selectedZone: InjuryZoneId | null;
  onSelectZone: (zone: InjuryZoneId) => void;
  isZoneAvailable: (zone: InjuryZoneId) => boolean;
  svgRef: RefObject<SVGSVGElement>;
}) {
  const parts = view === 'front' ? BODY_FRONT : BODY_BACK;
  const vb = BODY_VIEWBOX[view];
  const zoneOf = ZONE_BY_MUSCLE[view];
  const activeZoneOf = (slug: string) => {
    const zone = zoneOf[slug];
    return zone && isZoneAvailable(zone) ? zone : undefined;
  };
  const neutralParts = parts.filter(p => !activeZoneOf(p.slug));
  const zones = INJURY_ZONES
    .map(zone => ({ zone, parts: parts.filter(p => activeZoneOf(p.slug) === zone.id) }))
    .filter(z => z.parts.length > 0);

  const handleKeyDown = (e: KeyboardEvent, zone: InjuryZoneId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectZone(zone);
    }
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
      className="w-full h-full"
      role="group"
      aria-label={`Cuerpo visto de ${view === 'front' ? 'frente' : 'espalda'}`}
    >
      <defs>
        <filter id={GLOW_ID} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d={BODY_OUTLINE[view]} fill="none" stroke="#6b5b8a" strokeWidth={2} vectorEffect="non-scaling-stroke" />

      {/* Músculos sin lesiones registradas en la BD: más oscuros y sin interacción */}
      <g fill="#2e2639" aria-hidden="true">
        {neutralParts.flatMap(p =>
          p.paths.map((d, i) => <path key={`${p.slug}-${i}`} d={d} fill={p.slug === 'hair' ? '#1a1422' : undefined} />)
        )}
      </g>

      {zones.map(({ zone, parts: zoneParts }) => {
        const isSelected = selectedZone === zone.id;
        const isSmall = SMALL_ZONES.includes(zone.id);
        return (
          <g
            key={zone.id}
            data-zone={zone.id}
            role="button"
            tabIndex={0}
            aria-label={zone.label}
            aria-pressed={isSelected}
            onClick={() => onSelectZone(zone.id)}
            onKeyDown={e => handleKeyDown(e, zone.id)}
            filter={isSelected ? `url(#${GLOW_ID})` : undefined}
            stroke={isSmall ? 'transparent' : undefined}
            strokeWidth={isSmall ? HIT_STROKE : undefined}
            className={`cursor-pointer outline-none transition-colors duration-200 motion-reduce:transition-none [-webkit-tap-highlight-color:transparent] ${
              isSelected ? 'fill-red-500' : 'fill-[#4a3d63] hover:fill-[#5d4d7d] focus-visible:fill-[#7c6aa0]'
            }`}
          >
            {zoneParts.flatMap(p =>
              p.paths.map((d, i) => (
                <path key={`${p.slug}-${i}`} d={d} fill={p.slug === 'hair' ? '#1a1422' : undefined} />
              ))
            )}
          </g>
        );
      })}
    </svg>
  );
}

function ZoneInjuryList({
  items,
  loading,
  onOpenInjury,
}: {
  items: ZoneInjury[];
  loading: boolean;
  onOpenInjury: (injury: InjuryRow) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1].map(i => (
          <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-sm text-gray-400">No hay lesiones registradas para esta zona.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map(({ injury, categoryName }) => (
        <li key={injury.id}>
          <button
            type="button"
            onClick={() => onOpenInjury(injury)}
            className="group w-full text-left flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 hover:bg-white/10 hover:border-red-500/50 transition-colors active:scale-[0.98]"
          >
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-white text-sm leading-snug group-hover:text-red-300 transition-colors">
                {injury.name}
              </span>
              <span className="block text-gray-400 text-xs leading-relaxed line-clamp-2 mt-0.5">{injury.what_is}</span>
              <span className="inline-block mt-1.5 text-[11px] font-medium text-red-200 bg-red-500/15 rounded-full px-2 py-0.5">
                {categoryName}
              </span>
            </span>
            <ChevronRight className="text-red-400 flex-shrink-0 mt-1" size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}

function Disclaimer() {
  return (
    <p className="flex gap-2 text-[11px] leading-snug text-gray-400 border-t border-white/10 pt-3 mt-3">
      <Info size={14} className="flex-shrink-0 mt-px" />
      {DISCLAIMER}
    </p>
  );
}

export default function InjuryBodyMap({
  view,
  onViewChange,
  selectedZone,
  onSelectZone,
  injuriesBySlug,
  loading,
  onOpenInjury,
}: InjuryBodyMapProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const stageRef = useRef<HTMLDivElement>(null);
  const bodyAreaRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  const zone = INJURY_ZONES.find(z => z.id === selectedZone) ?? null;
  // La hoja conserva la última zona mientras se cierra, para que no se vacíe a mitad de animación.
  const lastZoneRef = useRef<InjuryZone | null>(null);
  if (zone) lastZoneRef.current = zone;
  const shownZone = zone ?? lastZoneRef.current;

  const itemsFor = (z: InjuryZone | null) =>
    z ? z.injurySlugs.map(slug => injuriesBySlug.get(slug)).filter((i): i is ZoneInjury => !!i) : [];
  const items = itemsFor(shownZone);
  // Una zona solo se puede tocar si la BD tiene alguna de sus lesiones
  // (mientras carga se dan todas por disponibles para que no parpadee).
  const isZoneAvailable = (id: InjuryZoneId) =>
    loading || itemsFor(INJURY_ZONES.find(z => z.id === id) ?? null).length > 0;

  // En móvil la hoja tapa la mitad inferior: se desplaza el cuerpo (como al
  // centrar un punto en un mapa) para que la zona marcada siga a la vista.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const area = bodyAreaRef.current;
    const svg = svgRef.current;
    const sheet = sheetRef.current;
    const target = svg?.querySelector<SVGGElement>(`[data-zone="${selectedZone}"]`);
    if (isDesktop || !selectedZone || !stage || !area || !svg || !sheet || !target) {
      setShift(0);
      return;
    }
    const vb = BODY_VIEWBOX[view];
    const scale = Math.min(area.clientWidth / vb.width, area.clientHeight / vb.height);
    const drawnTop = (area.clientHeight - vb.height * scale) / 2;
    const bb = target.getBBox();
    const zoneCenter = area.offsetTop + drawnTop + (bb.y + bb.height / 2 - vb.y) * scale;
    const visibleCenter = (area.offsetTop + stage.clientHeight - sheet.offsetHeight) / 2;
    setShift(Math.min(0, visibleCenter - zoneCenter));
  }, [selectedZone, view, isDesktop]);

  const zoneHeader = (z: InjuryZone, n: number) => (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-white leading-tight">{z.label}</h2>
        <p className="text-xs text-gray-400">{loading ? 'Cargando…' : countLabel(n)}</p>
      </div>
      <button
        type="button"
        onClick={() => onSelectZone(null)}
        aria-label="Cerrar"
        className="w-9 h-9 flex-shrink-0 rounded-full bg-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );

  return (
    <div className="md:grid md:grid-cols-2 md:gap-6 md:items-start">
      <p className="sr-only" aria-live="polite">
        {zone && !loading ? `${zone.label}: ${countLabel(items.length)}` : ''}
      </p>

      <div
        ref={stageRef}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-red-500/[0.03] h-[min(62vh,540px)] md:h-[620px]"
      >
        <div className="absolute top-3 inset-x-0 z-10 flex justify-center">
          <div role="group" aria-label="Vista del cuerpo" className="flex gap-1 p-1 rounded-full bg-black/60 backdrop-blur border border-white/10">
            {(['front', 'back'] as const).map(v => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => onViewChange(v)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  view === v ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {v === 'front' ? 'Frente' : 'Espalda'}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={bodyAreaRef}
          className="absolute inset-x-0 top-16 bottom-9 transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateY(${shift}px)` }}
        >
          <BodySvg
            view={view}
            selectedZone={selectedZone}
            onSelectZone={onSelectZone}
            isZoneAvailable={isZoneAvailable}
            svgRef={svgRef}
          />
        </div>

        {!zone && (
          <p className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 text-xs text-gray-400 pointer-events-none">
            <Pointer size={14} />
            Toca la zona donde duele
          </p>
        )}

        {!isDesktop && (
          <div
            ref={sheetRef}
            role="region"
            aria-label={shownZone ? `Lesiones probables: ${shownZone.label}` : undefined}
            className={`absolute inset-x-0 bottom-0 z-20 h-[56%] flex flex-col rounded-t-3xl border-t border-red-500/40 bg-[#17121f] shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.8)] transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none ${
              zone ? 'translate-y-0 visible' : 'translate-y-full invisible'
            }`}
          >
            <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-white/20" aria-hidden="true" />
            {shownZone && (
              <>
                <div className="px-4 pt-2 pb-3">{zoneHeader(shownZone, items.length)}</div>
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-4">
                  <ZoneInjuryList items={items} loading={loading} onOpenInjury={onOpenInjury} />
                  <Disclaimer />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {isDesktop && (
        <aside className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 h-[620px]">
          {zone ? (
            <>
              <div className="mb-4">{zoneHeader(zone, items.length)}</div>
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <ZoneInjuryList items={items} loading={loading} onOpenInjury={onOpenInjury} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                <Pointer className="text-red-400" size={26} />
              </div>
              <h2 className="text-lg font-bold text-white">Toca la zona donde duele</h2>
              <p className="text-sm text-gray-400 max-w-xs">
                Verás las lesiones más frecuentes en esa parte del cuerpo y podrás abrir su ficha completa.
              </p>
            </div>
          )}
          <Disclaimer />
        </aside>
      )}
    </div>
  );
}
