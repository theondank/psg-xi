import type { Ref } from 'react';
import { eraLabel, shortName, type Player } from '../data/players';
import type { Formation, Slot } from '../lib/formations';
import { playerAt, type Lineup } from '../lib/squad';
import { avatarColor, initials } from '../lib/avatar';

/** Dimensions du terrain dans l'espace SVG (ratio proche d'un vrai terrain). */
const W = 1000;
const H = 1480;
const PITCH_TOP = 40;
const PITCH_HEIGHT = 1320;

const CARD_W = 220;
const CARD_H = 72;

const COLORS = {
  background: '#040f26',
  stripe: '#0a1f45',
  line: '#c9d6f2',
  cardFill: '#123468',
  cardStroke: '#3a63ad',
  accent: '#da291c',
  text: '#f4f7ff',
  muted: '#8ba3cf',
} as const;

interface PitchProps {
  readonly formation: Formation;
  readonly lineup: Lineup;
  readonly selectedSlotId: string | null;
  readonly onSelectSlot: (slotId: string) => void;
  readonly svgRef: Ref<SVGSVGElement>;
}

function toSvgX(percent: number): number {
  return (percent / 100) * W;
}

function toSvgY(percent: number): number {
  return PITCH_TOP + (percent / 100) * PITCH_HEIGHT;
}

function PlayerCard({
  slot,
  player,
  selected,
  onSelect,
}: {
  readonly slot: Slot;
  readonly player: Player | null;
  readonly selected: boolean;
  readonly onSelect: () => void;
}) {
  const cx = toSvgX(slot.x);
  const cy = toSvgY(slot.y);

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={
        player ? `${slot.label} : ${player.name}, retirer ou remplacer` : `Choisir un ${slot.label}`
      }
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={cx - CARD_W / 2}
        y={cy - CARD_H / 2}
        width={CARD_W}
        height={CARD_H}
        rx={14}
        fill={player ? COLORS.cardFill : 'rgba(13, 42, 92, 0.35)'}
        stroke={selected ? COLORS.accent : player ? COLORS.cardStroke : COLORS.muted}
        strokeWidth={selected ? 4 : 2}
        strokeDasharray={player ? undefined : '10 8'}
      />
      <circle
        cx={cx - CARD_W / 2 + 30}
        cy={cy}
        r={24}
        fill={player ? avatarColor(player.id) : 'transparent'}
        stroke={selected ? COLORS.accent : player ? COLORS.cardStroke : COLORS.muted}
        strokeWidth={2}
        strokeDasharray={player ? undefined : '6 5'}
      />
      {player ? (
        <text
          x={cx - CARD_W / 2 + 30}
          y={cy + 6}
          fill={COLORS.text}
          fontSize={18}
          fontWeight={700}
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          {initials(player.name)}
        </text>
      ) : null}
      <text
        x={cx + CARD_W / 2 - 12}
        y={cy - CARD_H / 2 + 22}
        fill={COLORS.muted}
        fontSize={15}
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        letterSpacing={1.2}
        textAnchor="end"
      >
        {slot.label}
      </text>
      <text
        x={cx - CARD_W / 2 + 62}
        y={cy - 1}
        fill={player ? COLORS.text : COLORS.muted}
        fontSize={player ? 21 : 20}
        fontWeight={player ? 600 : 500}
        textAnchor="start"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
      >
        {player ? shortName(player) : 'Libre'}
      </text>
      {player ? (
        <text
          x={cx - CARD_W / 2 + 62}
          y={cy + 22}
          fill={COLORS.muted}
          fontSize={14}
          textAnchor="start"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          {eraLabel(player)}
        </text>
      ) : null}
    </g>
  );
}

export function Pitch({ formation, lineup, selectedSlotId, onSelectSlot, svgRef }: PitchProps) {
  const stripes = Array.from({ length: 10 }, (_, index) => index);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${String(W)} ${String(H)}`}
      width="100%"
      role="img"
      aria-label={`Terrain ${formation.name}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x={0} y={0} width={W} height={H} fill={COLORS.background} />

      {stripes.map((index) => (
        <rect
          key={index}
          x={0}
          y={PITCH_TOP + (index * PITCH_HEIGHT) / 10}
          width={W}
          height={PITCH_HEIGHT / 10}
          fill={index % 2 === 0 ? COLORS.stripe : 'transparent'}
        />
      ))}

      <g fill="none" stroke={COLORS.line} strokeWidth={3} opacity={0.75}>
        <rect x={40} y={PITCH_TOP} width={920} height={PITCH_HEIGHT} />
        <line x1={40} y1={PITCH_TOP + PITCH_HEIGHT / 2} x2={960} y2={PITCH_TOP + PITCH_HEIGHT / 2} />
        <circle cx={500} cy={PITCH_TOP + PITCH_HEIGHT / 2} r={110} />
        <circle cx={500} cy={PITCH_TOP + PITCH_HEIGHT / 2} r={5} fill={COLORS.line} />
        <rect x={295} y={PITCH_TOP} width={410} height={180} />
        <rect x={405} y={PITCH_TOP} width={190} height={70} />
        <rect x={295} y={PITCH_TOP + PITCH_HEIGHT - 180} width={410} height={180} />
        <rect x={405} y={PITCH_TOP + PITCH_HEIGHT - 70} width={190} height={70} />
        <circle cx={500} cy={PITCH_TOP + 120} r={5} fill={COLORS.line} />
        <circle cx={500} cy={PITCH_TOP + PITCH_HEIGHT - 120} r={5} fill={COLORS.line} />
      </g>

      {/* Buts */}
      <g fill="none" stroke={COLORS.line} strokeWidth={4} opacity={0.75}>
        <rect x={440} y={PITCH_TOP - 20} width={120} height={20} />
        <rect x={440} y={PITCH_TOP + PITCH_HEIGHT} width={120} height={20} />
      </g>

      {formation.slots.map((slot) => (
        <PlayerCard
          key={slot.id}
          slot={slot}
          player={playerAt(lineup, slot.id)}
          selected={selectedSlotId === slot.id}
          onSelect={() => {
            onSelectSlot(slot.id);
          }}
        />
      ))}

      <text
        x={W / 2}
        y={H - 42}
        fill={COLORS.muted}
        fontSize={26}
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        letterSpacing={2}
      >
        MON XI PSG — {formation.name}
      </text>
    </svg>
  );
}
