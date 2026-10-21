import { eraLabel } from '../data/players';
import { LINE_LABELS, slotsByLine, type Formation } from '../lib/formations';
import { avatarColor, initials } from '../lib/avatar';
import { playerAt, type Lineup } from '../lib/squad';

interface MatchSheetProps {
  readonly formation: Formation;
  readonly lineup: Lineup;
  readonly filled: number;
  readonly complete: boolean;
  readonly remaining: number;
  readonly onSelectSlot: (slotId: string) => void;
  readonly onReset: () => void;
}

const SEGMENTS = Array.from({ length: 11 }, (_, index) => index);

export function MatchSheet({
  formation,
  lineup,
  filled,
  complete,
  remaining,
  onSelectSlot,
  onReset,
}: MatchSheetProps) {
  return (
    <section className="sheet" aria-labelledby="sheet-title">
      <header className="sheet__head">
        <div className="sheet__titles">
          <h2 id="sheet-title" className="sheet__title">
            Feuille de match
          </h2>
          <p className="sheet__formation">{formation.name}</p>
        </div>
        <div className="progress" data-complete={complete}>
          <p className="progress__count">
            <strong>{filled}</strong>/11
            <span className="progress__label">{complete ? 'XI complet' : 'titulaires'}</span>
          </p>
          <div
            className="progress__bar"
            role="progressbar"
            aria-label="Titulaires choisis"
            aria-valuemin={0}
            aria-valuemax={11}
            aria-valuenow={filled}
          >
            {SEGMENTS.map((index) => (
              <span
                key={index}
                className={index < filled ? 'progress__seg is-on' : 'progress__seg'}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="sheet__body">
        {slotsByLine(formation).map((group) => (
          <div key={group.line} className="line">
            <h3 className="line__title">
              {LINE_LABELS[group.line]}
              <span className="line__count">{group.slots.length}</span>
            </h3>
            <ul className="line__list">
              {group.slots.map((slot) => {
                const player = playerAt(lineup, slot.id);
                return (
                  <li key={slot.id}>
                    <button
                      type="button"
                      className={player ? 'row' : 'row row--empty'}
                      onClick={() => {
                        onSelectSlot(slot.id);
                      }}
                    >
                      <span className="pos">{slot.label}</span>
                      {player ? (
                        <span
                          className="avatar"
                          style={{ background: avatarColor(player.id) }}
                          aria-hidden="true"
                        >
                          {initials(player.name)}
                        </span>
                      ) : (
                        <span className="avatar avatar--empty" aria-hidden="true" />
                      )}
                      <span className="row__name">
                        {player ? player.name : 'Choisir un joueur'}
                      </span>
                      {player ? <span className="row__meta">{eraLabel(player)}</span> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <footer className="sheet__foot">
        <p id="export-hint" className="sheet__status">
          {complete
            ? 'XI complet — prêt à exporter.'
            : filled === 0
              ? 'Clique sur un poste pour choisir un joueur. L’export s’ouvre à 11/11.'
              : `Encore ${String(remaining)} joueur${remaining > 1 ? 's' : ''} avant l’export.`}
        </p>
        <button type="button" className="btn btn--quiet" onClick={onReset} disabled={filled === 0}>
          Réinitialiser
        </button>
      </footer>
    </section>
  );
}
