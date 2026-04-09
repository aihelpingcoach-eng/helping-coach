interface Synergy {
  player_a: string;
  player_b: string;
  color: 'yellow' | 'orange' | 'green' | 'purple';
  reason: string;
}

interface SynergyLinesProps {
  synergies: Synergy[];
  playerPositions: Map<string, { x: number; y: number }>;
  containerWidth: number;
  containerHeight: number;
}

const colorMap = {
  yellow: '#EAB308',
  orange: '#F59E0B',
  green: '#10B981',
  purple: '#9333EA',
};

export default function SynergyLines({
  synergies,
  playerPositions,
  containerWidth,
  containerHeight,
}: SynergyLinesProps) {
  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {synergies.map((synergy, index) => {
        const posA = playerPositions.get(synergy.player_a);
        const posB = playerPositions.get(synergy.player_b);

        if (!posA || !posB) {
          return null;
        }

        const x1 = (posA.x / 100) * containerWidth;
        const y1 = (posA.y / 100) * containerHeight;
        const x2 = (posB.x / 100) * containerWidth;
        const y2 = (posB.y / 100) * containerHeight;

        return (
          <g key={index}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colorMap[synergy.color]}
              strokeWidth="3"
              strokeOpacity="0.6"
              strokeLinecap="round"
            />
            <title>{`${synergy.player_a} - ${synergy.player_b}: ${synergy.reason}`}</title>
          </g>
        );
      })}
    </svg>
  );
}
