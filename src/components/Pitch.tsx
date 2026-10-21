import type { Ref } from 'react';
import { eraLabel, shortName, type Player } from '../data/players';
import type { Formation, Slot } from '../lib/formations';
import { playerAt, type Lineup } from '../lib/squad';
import { avatarColor, initials } from '../lib/avatar';
import type { PhotoMap } from '../lib/photos';
import type { ColorScheme } from '../hooks/useColorScheme';

/** Dimensions du terrain dans l'espace SVG (ratio proche d'un vrai terrain). */
const W = 1000;
const H = 1480;
const PITCH_TOP = 40;
const PITCH_HEIGHT = 1320;

// Tracé aux cotes FIFA (105 × 68 m), mis à l'échelle sur la hauteur disponible.
const M = PITCH_HEIGHT / 105;
const PITCH_WIDTH = 68 * M;
const PITCH_LEFT = (W - PITCH_WIDTH) / 2;
const PITCH_BOTTOM = PITCH_TOP + PITCH_HEIGHT;
const CENTER_X = W / 2;
const CENTER_Y = PITCH_TOP + PITCH_HEIGHT / 2;
const BOX_W = 40.32 * M;
const BOX_D = 16.5 * M;
const SIX_W = 18.32 * M;
const SIX_D = 5.5 * M;
const SPOT_D = 11 * M;
const ARC_R = 9.15 * M;
const CORNER_R = 1 * M;
const GOAL_W = 7.32 * M;
const GOAL_D = 2 * M;
const STRIPES = 12;

const CARD_W = 220;
const CARD_H = 72;
const FONT = 'system-ui, -apple-system, Segoe UI, sans-serif';

/**
 * Seule source de couleur du terrain, une palette par thème : herbe de jour en clair, herbe de
 * nocturne sous projecteurs en sombre. Couleurs en attributs : le PNG exporté suit le thème.
 */
const COLORS = {
  light: {
    grass: '#3d8b3d',
    grassAlt: '#47974a',
    edge: 'rgba(12, 40, 14, 0.38)',
    line: '#ffffff',
    lineOpacity: 0.92,
    net: 'rgba(255, 255, 255, 0.55)',
    shadow: 'rgba(8, 28, 10, 0.32)',
    cardFill: '#ffffff',
    cardStroke: 'rgba(16, 18, 21, 0.10)',
    pill: '#eceef1',
    pillText: '#3b4049',
    text: '#101215',
    muted: '#5d636e',
    emptyFill: 'rgba(255, 255, 255, 0.16)',
    emptyStroke: 'rgba(255, 255, 255, 0.85)',
    emptyText: '#ffffff',
    caption: '#ffffff',
    accent: '#da291c',
    avatarText: '#ffffff',
  },
  dark: {
    grass: '#1d5427',
    grassAlt: '#246631',
    edge: 'rgba(0, 0, 0, 0.5)',
    line: '#e9f2ea',
    lineOpacity: 0.8,
    net: 'rgba(233, 242, 234, 0.45)',
    shadow: 'rgba(0, 0, 0, 0.45)',
    cardFill: '#0f1b30',
    cardStroke: 'rgba(255, 255, 255, 0.14)',
    pill: '#1f2c44',
    pillText: '#c8d2e6',
    text: '#f4f7ff',
    muted: '#9aa6bd',
    emptyFill: 'rgba(0, 0, 0, 0.22)',
    emptyStroke: 'rgba(233, 242, 234, 0.7)',
    emptyText: '#e9f2ea',
    caption: '#e9f2ea',
    accent: '#da291c',
    avatarText: '#ffffff',
  },
} as const;

type Palette = (typeof COLORS)[ColorScheme];

interface PitchProps {
  readonly formation: Formation;
  readonly lineup: Lineup;
  readonly photos: PhotoMap;
  readonly scheme: ColorScheme;
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

/** Arc de la surface (le « D ») : la portion du cercle de 9,15 m hors de la surface. */
function penaltyArc(spotY: number, boxEdgeY: number, towardsBottom: boolean): string {
  const dy = Math.abs(boxEdgeY - spotY);
  const half = Math.sqrt(ARC_R * ARC_R - dy * dy);
  const sweep = towardsBottom ? 0 : 1;
  return `M ${String(CENTER_X - half)} ${String(boxEdgeY)} A ${String(ARC_R)} ${String(ARC_R)} 0 0 ${String(sweep)} ${String(CENTER_X + half)} ${String(boxEdgeY)}`;
}

function PitchMarkings({ colors }: { readonly colors: Palette }) {
  const corners = [
    {
      x: PITCH_LEFT,
      y: PITCH_TOP,
      d: `M ${String(PITCH_LEFT + CORNER_R)} ${String(PITCH_TOP)} A ${String(CORNER_R)} ${String(CORNER_R)} 0 0 1 ${String(PITCH_LEFT)} ${String(PITCH_TOP + CORNER_R)}`,
    },
    {
      x: W - PITCH_LEFT,
      y: PITCH_TOP,
      d: `M ${String(W - PITCH_LEFT - CORNER_R)} ${String(PITCH_TOP)} A ${String(CORNER_R)} ${String(CORNER_R)} 0 0 0 ${String(W - PITCH_LEFT)} ${String(PITCH_TOP + CORNER_R)}`,
    },
    {
      x: PITCH_LEFT,
      y: PITCH_BOTTOM,
      d: `M ${String(PITCH_LEFT + CORNER_R)} ${String(PITCH_BOTTOM)} A ${String(CORNER_R)} ${String(CORNER_R)} 0 0 0 ${String(PITCH_LEFT)} ${String(PITCH_BOTTOM - CORNER_R)}`,
    },
    {
      x: W - PITCH_LEFT,
      y: PITCH_BOTTOM,
      d: `M ${String(W - PITCH_LEFT - CORNER_R)} ${String(PITCH_BOTTOM)} A ${String(CORNER_R)} ${String(CORNER_R)} 0 0 1 ${String(W - PITCH_LEFT)} ${String(PITCH_BOTTOM - CORNER_R)}`,
    },
  ];

  return (
    <g fill="none" stroke={colors.line} strokeWidth={3} opacity={colors.lineOpacity}>
      <rect x={PITCH_LEFT} y={PITCH_TOP} width={PITCH_WIDTH} height={PITCH_HEIGHT} />
      <line x1={PITCH_LEFT} y1={CENTER_Y} x2={W - PITCH_LEFT} y2={CENTER_Y} />
      <circle cx={CENTER_X} cy={CENTER_Y} r={ARC_R} />
      <circle cx={CENTER_X} cy={CENTER_Y} r={4} fill={colors.line} stroke="none" />

      {/* Moitié haute */}
      <rect x={CENTER_X - BOX_W / 2} y={PITCH_TOP} width={BOX_W} height={BOX_D} />
      <rect x={CENTER_X - SIX_W / 2} y={PITCH_TOP} width={SIX_W} height={SIX_D} />
      <circle cx={CENTER_X} cy={PITCH_TOP + SPOT_D} r={4} fill={colors.line} stroke="none" />
      <path d={penaltyArc(PITCH_TOP + SPOT_D, PITCH_TOP + BOX_D, true)} />

      {/* Moitié basse */}
      <rect x={CENTER_X - BOX_W / 2} y={PITCH_BOTTOM - BOX_D} width={BOX_W} height={BOX_D} />
      <rect x={CENTER_X - SIX_W / 2} y={PITCH_BOTTOM - SIX_D} width={SIX_W} height={SIX_D} />
      <circle cx={CENTER_X} cy={PITCH_BOTTOM - SPOT_D} r={4} fill={colors.line} stroke="none" />
      <path d={penaltyArc(PITCH_BOTTOM - SPOT_D, PITCH_BOTTOM - BOX_D, false)} />

      {corners.map((corner) => (
        <path key={`${String(corner.x)}-${String(corner.y)}`} d={corner.d} />
      ))}
    </g>
  );
}

/** But vu de dessus : cadre plein, filet en quadrillage léger. */
function Goal({ colors, top }: { readonly colors: Palette; readonly top: boolean }) {
  const x = CENTER_X - GOAL_W / 2;
  const y = top ? PITCH_TOP - GOAL_D : PITCH_BOTTOM;
  const columns = Array.from({ length: 7 }, (_, index) => x + ((index + 1) * GOAL_W) / 8);
  return (
    <g>
      <g stroke={colors.net} strokeWidth={1}>
        {columns.map((columnX) => (
          <line key={columnX} x1={columnX} y1={y} x2={columnX} y2={y + GOAL_D} />
        ))}
        <line x1={x} y1={y + GOAL_D / 2} x2={x + GOAL_W} y2={y + GOAL_D / 2} />
      </g>
      <rect
        x={x}
        y={y}
        width={GOAL_W}
        height={GOAL_D}
        fill="none"
        stroke={colors.line}
        strokeWidth={4}
        opacity={colors.lineOpacity}
      />
    </g>
  );
}

function PlayerCard({
  slot,
  player,
  photo,
  selected,
  colors,
  onSelect,
}: {
  readonly slot: Slot;
  readonly player: Player | null;
  readonly photo: string | null;
  readonly selected: boolean;
  readonly colors: Palette;
  readonly onSelect: () => void;
}) {
  const cx = toSvgX(slot.x);
  const cy = toSvgY(slot.y);
  const left = cx - CARD_W / 2;
  const top = cy - CARD_H / 2;
  const avatarX = left + 32;
  const pillW = slot.label.length * 10 + 16;
  const ring = selected ? colors.accent : player ? colors.cardStroke : colors.emptyStroke;

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
      {/* Ombre portée simulée : un `filter` ne survivrait pas à l'export. */}
      {player ? (
        <rect x={left} y={top + 5} width={CARD_W} height={CARD_H} rx={14} fill={colors.shadow} />
      ) : null}
      <rect
        x={left}
        y={top}
        width={CARD_W}
        height={CARD_H}
        rx={14}
        fill={player ? colors.cardFill : colors.emptyFill}
        stroke={ring}
        strokeWidth={selected ? 4 : 2}
        strokeDasharray={player ? undefined : '10 8'}
      />

      {player && photo ? (
        <>
          <defs>
            <clipPath id={`avatar-clip-${slot.id}`}>
              <circle cx={avatarX} cy={cy} r={24} />
            </clipPath>
          </defs>
          <image
            href={photo}
            x={avatarX - 24}
            y={cy - 24}
            width={48}
            height={48}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#avatar-clip-${slot.id})`}
          />
        </>
      ) : null}
      <circle
        cx={avatarX}
        cy={cy}
        r={24}
        fill={player && !photo ? avatarColor(player.id) : 'transparent'}
        stroke={selected ? colors.accent : player ? colors.cardStroke : colors.emptyStroke}
        strokeWidth={2}
        strokeDasharray={player ? undefined : '6 5'}
      />
      {player && !photo ? (
        <text
          x={avatarX}
          y={cy + 6}
          fill={colors.avatarText}
          fontSize={18}
          fontWeight={700}
          textAnchor="middle"
          fontFamily={FONT}
        >
          {initials(player.name)}
        </text>
      ) : null}

      {/* Poste en bas à droite, sur la ligne de l'époque (courte) : le nom garde toute la
          largeur, « Kvaratskhelia » compris. */}
      {player ? (
        <>
          <rect
            x={left + CARD_W - 10 - pillW}
            y={top + CARD_H - 29}
            width={pillW}
            height={20}
            rx={5}
            fill={selected ? colors.accent : colors.pill}
          />
          <text
            x={left + CARD_W - 10 - pillW / 2}
            y={top + CARD_H - 14}
            fill={selected ? colors.avatarText : colors.pillText}
            fontSize={13}
            fontWeight={700}
            letterSpacing={0.6}
            textAnchor="middle"
            fontFamily={FONT}
          >
            {slot.label}
          </text>
          <text
            x={left + 64}
            y={cy - 1}
            fill={colors.text}
            fontSize={21}
            fontWeight={600}
            textAnchor="start"
            fontFamily={FONT}
          >
            {shortName(player)}
          </text>
          <text
            x={left + 64}
            y={cy + 23}
            fill={colors.muted}
            fontSize={14}
            textAnchor="start"
            fontFamily={FONT}
          >
            {eraLabel(player)}
          </text>
        </>
      ) : (
        <>
          <text
            x={left + 64}
            y={cy - 4}
            fill={colors.emptyText}
            fontSize={20}
            fontWeight={600}
            textAnchor="start"
            fontFamily={FONT}
          >
            {slot.label}
          </text>
          <text
            x={left + 64}
            y={cy + 19}
            fill={colors.emptyText}
            opacity={0.8}
            fontSize={15}
            textAnchor="start"
            fontFamily={FONT}
          >
            Libre
          </text>
        </>
      )}
    </g>
  );
}

export function Pitch({
  formation,
  lineup,
  photos,
  scheme,
  selectedSlotId,
  onSelectSlot,
  svgRef,
}: PitchProps) {
  const colors = COLORS[scheme];
  const band = PITCH_HEIGHT / STRIPES;
  // Les bandes de tonte débordent du tracé, comme sur une vraie pelouse.
  const stripes = Array.from({ length: STRIPES + 2 }, (_, index) => PITCH_TOP + (index - 1) * band);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${String(W)} ${String(H)}`}
      width="100%"
      role="img"
      aria-label={`Terrain ${formation.name}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Bords assombris : donne la profondeur d'une pelouse éclairée au centre. */}
        <radialGradient id="pitch-light" cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor={colors.edge} stopOpacity={0} />
          <stop offset="100%" stopColor={colors.edge} stopOpacity={1} />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={W} height={H} fill={colors.grass} />
      {stripes.map((y, index) => (
        <rect
          key={y}
          x={0}
          y={y}
          width={W}
          height={band}
          fill={index % 2 === 0 ? colors.grassAlt : colors.grass}
        />
      ))}

      <PitchMarkings colors={colors} />
      <Goal colors={colors} top />
      <Goal colors={colors} top={false} />

      <rect x={0} y={0} width={W} height={H} fill="url(#pitch-light)" />

      {formation.slots.map((slot) => {
        const player = playerAt(lineup, slot.id);
        return (
          <PlayerCard
            key={slot.id}
            slot={slot}
            player={player}
            photo={player ? (photos[player.id] ?? null) : null}
            selected={selectedSlotId === slot.id}
            colors={colors}
            onSelect={() => {
              onSelectSlot(slot.id);
            }}
          />
        );
      })}

      <text
        x={W / 2}
        y={H - 44}
        fill={colors.caption}
        opacity={0.85}
        fontSize={26}
        fontWeight={600}
        textAnchor="middle"
        fontFamily={FONT}
        letterSpacing={3}
      >
        MON XI PSG · {formation.name}
      </text>
    </svg>
  );
}
