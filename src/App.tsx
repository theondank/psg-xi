import { useRef, useState } from 'react';
import { Pitch } from './components/Pitch';
import { Picker } from './components/Picker';
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
  playerAt,
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

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand__dot" aria-hidden="true" />
          <div>
            <h1>Mon XI PSG</h1>
            <p className="brand__sub">Le onze all-time du Paris Saint-Germain</p>
          </div>
        </div>

        <div className="topbar__actions">
          <div className="formations" role="group" aria-label="Schéma tactique">
            {FORMATION_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={id === formationId ? 'chip chip--on' : 'chip'}
                aria-pressed={id === formationId}
                onClick={() => {
                  handleFormationChange(id);
                }}
              >
                {id}
              </button>
            ))}
          </div>

          <span className={complete ? 'badge badge--done' : 'badge'}>
            {filled}/11{complete ? ' · XI complet' : ''}
          </span>

          <button
            type="button"
            className="ghost"
            onClick={handleReset}
            disabled={filled === 0}
          >
            Réinitialiser
          </button>
          <button type="button" className="primary" onClick={() => void handleExport()} disabled={busy}>
            {busy ? 'Export…' : 'Exporter en PNG'}
          </button>
        </div>
      </header>

      <main className="layout">
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

        <aside className="sidebar">
          {selectedSlot ? (
            <Picker
              slot={selectedSlot}
              lineup={lineup}
              query={query}
              onQueryChange={setQuery}
              onPick={handlePick}
              onClear={handleClear}
              onClose={() => {
                setSelectedSlotId(null);
                setQuery('');
              }}
            />
          ) : (
            <section className="summary" aria-label="Composition">
              <h2 className="summary__title">Ta composition</h2>
              <p className="summary__hint">
                Clique sur une carte du terrain pour choisir un joueur. Seuls les postes compatibles
                sont proposés.
              </p>
              <ul className="summary__list">
                {formation.slots.map((slot) => {
                  const player = playerAt(lineup, slot.id);
                  return (
                    <li key={slot.id}>
                      <button
                        type="button"
                        className={player ? 'slotrow' : 'slotrow slotrow--empty'}
                        onClick={() => {
                          handleSelectSlot(slot.id);
                        }}
                      >
                        <span className="slotrow__pos">{slot.label}</span>
                        <span className="slotrow__name">{player ? player.name : 'Choisir…'}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {complete ? (
                <p className="summary__done">XI complet — prêt à exporter. 🔴🔵</p>
              ) : null}
            </section>
          )}
        </aside>
      </main>

      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}

      <footer className="footer">
        Données statiques, aucun appel réseau · export PNG 100 % local · React + TypeScript
      </footer>
    </div>
  );
}
