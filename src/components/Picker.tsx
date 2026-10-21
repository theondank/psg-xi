import { eraLabel, type Player } from '../data/players';
import type { Slot } from '../lib/formations';
import { eligiblePlayers, matchesQuery, playerAt, type Lineup } from '../lib/squad';

interface PickerProps {
  readonly slot: Slot;
  readonly lineup: Lineup;
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
  readonly onPick: (playerId: string) => void;
  readonly onClear: () => void;
  readonly onClose: () => void;
}

function sortByName(a: Player, b: Player): number {
  return a.name.localeCompare(b.name, 'fr');
}

export function Picker({
  slot,
  lineup,
  query,
  onQueryChange,
  onPick,
  onClear,
  onClose,
}: PickerProps) {
  const current = playerAt(lineup, slot.id);
  const options = eligiblePlayers(lineup, slot).filter((player) => matchesQuery(player, query));
  const sorted = [...options].sort(sortByName);

  return (
    <section className="picker" aria-label={`Choix du ${slot.label}`}>
      <header className="picker__head">
        <div>
          <p className="picker__eyebrow">Poste recherché</p>
          <h2 className="picker__title">
            {slot.label}
            <span className="picker__accepts">{slot.accepts.join(' · ')}</span>
          </h2>
        </div>
        <button type="button" className="ghost" onClick={onClose} aria-label="Fermer le sélecteur">
          ✕
        </button>
      </header>

      {current ? (
        <div className="picker__current">
          <span>
            Titulaire : <strong>{current.name}</strong> ({eraLabel(current)})
          </span>
          <button type="button" className="ghost ghost--danger" onClick={onClear}>
            Retirer
          </button>
        </div>
      ) : null}

      <input
        type="search"
        className="picker__search"
        placeholder="Rechercher un joueur…"
        value={query}
        onChange={(event) => {
          onQueryChange(event.target.value);
        }}
        autoFocus
      />

      <p className="picker__count">
        {sorted.length} joueur{sorted.length > 1 ? 's' : ''} disponible
        {sorted.length > 1 ? 's' : ''}
      </p>

      <ul className="picker__list">
        {sorted.map((player) => (
          <li key={player.id}>
            <button
              type="button"
              className={current?.id === player.id ? 'player player--active' : 'player'}
              onClick={() => {
                onPick(player.id);
              }}
            >
              <span className="player__name">{player.name}</span>
              <span className="player__meta">
                {player.positions.join(' · ')} — {player.nationality} — {eraLabel(player)}
              </span>
            </button>
          </li>
        ))}
        {sorted.length === 0 ? (
          <li className="picker__empty">Aucun joueur disponible pour ce poste.</li>
        ) : null}
      </ul>
    </section>
  );
}
