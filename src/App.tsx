import { useRef, useState } from 'react';
import { Pitch } from './components/Pitch';
import { Picker } from './components/Picker';
import { MatchSheet } from './components/MatchSheet';
import { usePhotos } from './hooks/usePhotos';
import { FORMATION_IDS, getFormation, type FormationId } from './lib/formations';
import { exportSvgToPng } from './lib/exportPng';
import {
  adaptLineup,
  clearAll,
  clearSlot,
  emptyLineup,
  filledCount,
  isComplete,
  place,
  type Lineup,
} from './lib/squad';

const DEFAULT_FORMATION: FormationId = '4-3-3';

export default function App() {
  const [formationId, setFormationId] = useState<FormationId>(DEFAULT_FORMATION);
  const [lineup, setLineup] = useState<Lineup>(() => emptyLineup(getFormation(DEFAULT_FORMATION)));
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const formation = getFormation(formationId);
  const photos = usePhotos(lineup);
  const selectedSlot = formation.slots.find((slot) => slot.id === selectedSlotId);
  const filled = filledCount(lineup);
  const complete = isComplete(lineup);

  function handleFormationChange(nextId: FormationId) {
    if (nextId === formationId) return;
    const nextFormation = getFormation(nextId);
    setFormationId(nextId);
    setLineup((previous) => adaptLineup(previous, nextFormation));
    setSelectedSlotId(null);
    setQuery('');
  }

  function handleSelectSlot(slotId: string) {
    setSelectedSlotId(slotId);
    setQuery('');
  }

  function handlePick(playerId: string) {
    if (!selectedSlotId) return;
    setLineup((previous) => place(previous, formation, selectedSlotId, playerId));
    setSelectedSlotId(null);
    setQuery('');
  }

  function handleClear() {
    if (!selectedSlotId) return;
    setLineup((previous) => clearSlot(previous, selectedSlotId));
    setSelectedSlotId(null);
    setQuery('');
  }

  function handleReset() {
    setLineup(clearAll(lineup));
    setSelectedSlotId(null);
    setQuery('');
  }

  async function handleExport() {
    if (!svgRef.current) return;
    setBusy(true);
    setError(null);
    try {
      await exportSvgToPng(svgRef.current, `mon-xi-psg-${formationId}.png`);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Export impossible.');
    } finally {
      setBusy(false);
    }
  }

  function handleClose() {
    setSelectedSlotId(null);
    setQuery('');
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true" />
          <h1 className="brand__name">
            Mon XI PSG
            <span className="brand__sub">Le onze all-time du Paris Saint-Germain</span>
          </h1>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => void handleExport()}
          disabled={busy}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              d="M8 2.5v7m0 0L5 6.5m3 3 3-3M3 11.5v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {busy ? 'Export…' : 'Exporter en PNG'}
        </button>
      </header>

      <main className="stage">
        <div className="stage__bar">
          <div className="segmented" role="group" aria-label="Schéma tactique">
            {FORMATION_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className="segmented__item"
                aria-pressed={id === formationId}
                onClick={() => {
                  handleFormationChange(id);
                }}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <p className="alert" role="alert">
            {error}
          </p>
        ) : null}

        <div className="pitch-wrap">
          <Pitch
            formation={formation}
            lineup={lineup}
            photos={photos}
            selectedSlotId={selectedSlotId}
            onSelectSlot={handleSelectSlot}
            svgRef={svgRef}
          />
        </div>
      </main>

      <aside className={selectedSlot ? 'panel is-picking' : 'panel'}>
        {selectedSlot ? (
          <>
            <button
              type="button"
              className="scrim"
              aria-label="Fermer le sélecteur"
              tabIndex={-1}
              onClick={handleClose}
            />
            <Picker
              slot={selectedSlot}
              lineup={lineup}
              query={query}
              onQueryChange={setQuery}
              onPick={handlePick}
              onClear={handleClear}
              onClose={handleClose}
            />
          </>
        ) : (
          <MatchSheet
            formation={formation}
            lineup={lineup}
            filled={filled}
            complete={complete}
            onSelectSlot={handleSelectSlot}
            onReset={handleReset}
          />
        )}
      </aside>
    </div>
  );
}
