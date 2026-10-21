import { eraLabel, type Player } from '../data/players';
import type { Slot } from '../lib/formations';
import { avatarColor, initials } from '../lib/avatar';
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
    <section
      className="picker"
      aria-label={`Choix du ${slot.label}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
    >
      <header className="picker__head">
        <button type="button" className="back" onClick={onClose}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              d="M10 3 5 8l5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Feuille de match
        </button>
        <div className="picker__titles">
          <h2 className="picker__title">
            <span className="pos pos--lg">{slot.label}</span>
            Choisir un joueur
          </h2>
          <p className="picker__accepts">
            Postes acceptés :{' '}
            {slot.accepts.map((position) => (
              <span key={position} className="tag">
                {position}
              </span>
            ))}
          </p>
        </div>
      </header>

      {current ? (
        <div className="picker__current">
          <span
            className="avatar"
            style={{ background: avatarColor(current.id) }}
            aria-hidden="true"
          >
            {initials(current.name)}
          </span>
          <span className="picker__current-text">
            <span className="picker__current-label">Titulaire</span>
            <strong>{current.name}</strong>
          </span>
          <button type="button" className="btn btn--danger" onClick={onClear}>
            Retirer
          </button>
        </div>
      ) : null}

      <div className="search">
        <svg className="search__icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          className="search__input"
          placeholder="Rechercher un joueur"
          aria-label="Rechercher un joueur"
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
          }}
          autoFocus
        />
      </div>

      <p className="picker__count" aria-live="polite">
        {sorted.length} joueur{sorted.length > 1 ? 's' : ''} disponible
        {sorted.length > 1 ? 's' : ''}
      </p>

      <ul className="picker__list">
        {sorted.map((player) => (
          <li key={player.id}>
            <button
              type="button"
              className={current?.id === player.id ? 'option is-current' : 'option'}
              onClick={() => {
                onPick(player.id);
              }}
            >
              <span
                className="avatar"
                style={{ background: avatarColor(player.id) }}
                aria-hidden="true"
              >
                {initials(player.name)}
              </span>
              <span className="option__main">
                <span className="option__name">{player.name}</span>
                <span className="option__tags">
                  {player.positions.map((position) => (
                    <span key={position} className="tag">
                      {position}
                    </span>
                  ))}
                  <span className="option__nat">{player.nationality}</span>
                </span>
              </span>
              <span className="option__era">{eraLabel(player)}</span>
            </button>
          </li>
        ))}
        {sorted.length === 0 ? (
          <li className="picker__empty">
            {query
              ? `Aucun joueur ne correspond à « ${query} » pour ce poste.`
              : 'Aucun joueur disponible pour ce poste.'}
          </li>
        ) : null}
      </ul>
    </section>
  );
}
