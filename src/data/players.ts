/**
 * Effectif historique du Paris Saint-Germain.
 * Source : fiches joueurs du club (saisonnées à la main, pas d'API).
 * `to: null` = joueur encore au club à la date de rédaction du fichier.
 */

export const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST'] as const;

export type Position = (typeof POSITIONS)[number];

export interface Player {
  readonly id: string;
  readonly name: string;
  readonly from: number;
  /** null = toujours au club */
  readonly to: number | null;
  readonly positions: readonly Position[];
  readonly nationality: string;
}

export const PLAYERS: readonly Player[] = [
  // Gardiens
  { id: 'baratelli', name: 'Dominique Baratelli', from: 1978, to: 1985, positions: ['GK'], nationality: 'France' },
  { id: 'bats', name: 'Joël Bats', from: 1985, to: 1992, positions: ['GK'], nationality: 'France' },
  { id: 'lama', name: 'Bernard Lama', from: 1992, to: 2000, positions: ['GK'], nationality: 'France' },
  { id: 'landreau', name: 'Mickaël Landreau', from: 2006, to: 2009, positions: ['GK'], nationality: 'France' },
  { id: 'sirigu', name: 'Salvatore Sirigu', from: 2011, to: 2017, positions: ['GK'], nationality: 'Italie' },
  { id: 'navas', name: 'Keylor Navas', from: 2019, to: 2024, positions: ['GK'], nationality: 'Costa Rica' },
  { id: 'donnarumma', name: 'Gianluigi Donnarumma', from: 2021, to: null, positions: ['GK'], nationality: 'Italie' },
  { id: 'safonov', name: 'Matvey Safonov', from: 2024, to: null, positions: ['GK'], nationality: 'Russie' },

  // Défenseurs centraux
  { id: 'alain-roche', name: 'Alain Roche', from: 1985, to: 1998, positions: ['CB'], nationality: 'France' },
  { id: 'le-guen', name: 'Paul Le Guen', from: 1991, to: 1998, positions: ['CB', 'DM'], nationality: 'France' },
  { id: 'pochettino', name: 'Mauricio Pochettino', from: 2001, to: 2003, positions: ['CB'], nationality: 'Argentine' },
  { id: 'heinze', name: 'Gabriel Heinze', from: 2001, to: 2004, positions: ['CB', 'LB'], nationality: 'Argentine' },
  { id: 'yepes', name: 'Mario Yepes', from: 2004, to: 2005, positions: ['CB'], nationality: 'Colombie' },
  { id: 'sakho', name: 'Mamadou Sakho', from: 2007, to: 2013, positions: ['CB'], nationality: 'France' },
  { id: 'camara', name: 'Zoumana Camara', from: 2007, to: 2015, positions: ['CB'], nationality: 'France' },
  { id: 'thiago-silva', name: 'Thiago Silva', from: 2012, to: 2020, positions: ['CB'], nationality: 'Brésil' },
  { id: 'alex', name: 'Alex', from: 2012, to: 2014, positions: ['CB'], nationality: 'Brésil' },
  { id: 'marquinhos', name: 'Marquinhos', from: 2013, to: null, positions: ['CB', 'RB'], nationality: 'Brésil' },
  { id: 'kimpembe', name: 'Presnel Kimpembe', from: 2014, to: 2025, positions: ['CB'], nationality: 'France' },
  { id: 'sergio-ramos', name: 'Sergio Ramos', from: 2021, to: 2023, positions: ['CB'], nationality: 'Espagne' },
  { id: 'skriniar', name: 'Milan Škriniar', from: 2023, to: null, positions: ['CB'], nationality: 'Slovaquie' },
  { id: 'lucas-hernandez', name: 'Lucas Hernández', from: 2023, to: null, positions: ['CB', 'LB'], nationality: 'France' },
  { id: 'pacho', name: 'Willian Pacho', from: 2024, to: null, positions: ['CB'], nationality: 'Équateur' },

  // Latéraux
  { id: 'sorin', name: 'Juan Pablo Sorín', from: 2002, to: 2003, positions: ['LB'], nationality: 'Argentine' },
  { id: 'armand', name: 'Sylvain Armand', from: 2004, to: 2013, positions: ['LB'], nationality: 'France' },
  { id: 'jallet', name: 'Christophe Jallet', from: 2009, to: 2014, positions: ['RB'], nationality: 'France' },
  { id: 'maxwell', name: 'Maxwell', from: 2012, to: 2017, positions: ['LB'], nationality: 'Brésil' },
  { id: 'van-der-wiel', name: 'Gregory van der Wiel', from: 2012, to: 2016, positions: ['RB'], nationality: 'Pays-Bas' },
  { id: 'aurier', name: 'Serge Aurier', from: 2014, to: 2017, positions: ['RB'], nationality: 'Côte d’Ivoire' },
  { id: 'kurzawa', name: 'Layvin Kurzawa', from: 2015, to: 2022, positions: ['LB'], nationality: 'France' },
  { id: 'dani-alves', name: 'Dani Alves', from: 2017, to: 2019, positions: ['RB'], nationality: 'Brésil' },
  { id: 'hakimi', name: 'Achraf Hakimi', from: 2021, to: null, positions: ['RB'], nationality: 'Maroc' },
  { id: 'nuno-mendes', name: 'Nuno Mendes', from: 2021, to: null, positions: ['LB'], nationality: 'Portugal' },

  // Milieux
  { id: 'luis-fernandez', name: 'Luis Fernández', from: 1979, to: 1993, positions: ['DM', 'CM'], nationality: 'France' },
  { id: 'fournier', name: 'Laurent Fournier', from: 1991, to: 1996, positions: ['DM', 'CM'], nationality: 'France' },
  { id: 'guerin', name: 'Vincent Guérin', from: 1992, to: 1998, positions: ['CM'], nationality: 'France' },
  { id: 'makalele', name: 'Claude Makélélé', from: 2008, to: 2011, positions: ['DM'], nationality: 'France' },
  { id: 'chantome', name: 'Clément Chantôme', from: 2006, to: 2015, positions: ['DM', 'CM'], nationality: 'France' },
  { id: 'matuidi', name: 'Blaise Matuidi', from: 2011, to: 2017, positions: ['CM', 'DM'], nationality: 'France' },
  { id: 'thiago-motta', name: 'Thiago Motta', from: 2012, to: 2018, positions: ['DM', 'CM'], nationality: 'Italie' },
  { id: 'verratti', name: 'Marco Verratti', from: 2012, to: 2023, positions: ['CM', 'DM'], nationality: 'Italie' },
  { id: 'rabiot', name: 'Adrien Rabiot', from: 2012, to: 2019, positions: ['CM'], nationality: 'France' },
  { id: 'herrera', name: 'Ander Herrera', from: 2019, to: 2022, positions: ['CM'], nationality: 'Espagne' },
  { id: 'gueye', name: 'Idrissa Gueye', from: 2019, to: 2022, positions: ['DM'], nationality: 'Sénégal' },
  { id: 'vitinha', name: 'Vitinha', from: 2022, to: null, positions: ['CM', 'DM'], nationality: 'Portugal' },
  { id: 'fabian-ruiz', name: 'Fabián Ruiz', from: 2022, to: null, positions: ['CM'], nationality: 'Espagne' },
  { id: 'zaire-emery', name: 'Warren Zaïre-Emery', from: 2022, to: null, positions: ['CM', 'RB'], nationality: 'France' },
  { id: 'joao-neves', name: 'João Neves', from: 2024, to: null, positions: ['CM', 'DM'], nationality: 'Portugal' },

  // Meneurs / ailiers
  { id: 'dahleb', name: 'Mustapha Dahleb', from: 1974, to: 1984, positions: ['AM', 'RW'], nationality: 'Algérie' },
  { id: 'susic', name: 'Safet Sušić', from: 1982, to: 1991, positions: ['AM'], nationality: 'Yougoslavie' },
  { id: 'rocheteau', name: 'Dominique Rocheteau', from: 1980, to: 1987, positions: ['RW', 'ST'], nationality: 'France' },
  { id: 'valdo', name: 'Valdo', from: 1991, to: 1995, positions: ['AM', 'RW'], nationality: 'Brésil' },
  { id: 'ginola', name: 'David Ginola', from: 1992, to: 1995, positions: ['LW', 'AM'], nationality: 'France' },
  { id: 'rai', name: 'Raí', from: 1993, to: 1998, positions: ['AM'], nationality: 'Brésil' },
  { id: 'djorkaeff', name: 'Youri Djorkaeff', from: 1995, to: 1996, positions: ['AM', 'ST'], nationality: 'France' },
  { id: 'leonardo', name: 'Leonardo', from: 1996, to: 1997, positions: ['LW', 'AM'], nationality: 'Brésil' },
  { id: 'okocha', name: 'Jay-Jay Okocha', from: 1998, to: 2002, positions: ['AM'], nationality: 'Nigéria' },
  { id: 'ronaldinho', name: 'Ronaldinho', from: 2001, to: 2003, positions: ['AM', 'LW'], nationality: 'Brésil' },
  { id: 'giuly', name: 'Ludovic Giuly', from: 2008, to: 2011, positions: ['RW'], nationality: 'France' },
  { id: 'nene', name: 'Nenê', from: 2010, to: 2013, positions: ['LW', 'AM'], nationality: 'Brésil' },
  { id: 'menez', name: 'Jérémy Ménez', from: 2011, to: 2014, positions: ['RW', 'AM'], nationality: 'France' },
  { id: 'pastore', name: 'Javier Pastore', from: 2011, to: 2018, positions: ['AM'], nationality: 'Argentine' },
  { id: 'lavezzi', name: 'Ezequiel Lavezzi', from: 2012, to: 2016, positions: ['LW', 'RW'], nationality: 'Argentine' },
  { id: 'lucas-moura', name: 'Lucas Moura', from: 2013, to: 2018, positions: ['RW'], nationality: 'Brésil' },
  { id: 'di-maria', name: 'Ángel Di María', from: 2015, to: 2022, positions: ['RW', 'AM', 'LW'], nationality: 'Argentine' },
  { id: 'neymar', name: 'Neymar', from: 2017, to: 2023, positions: ['LW', 'AM'], nationality: 'Brésil' },
  { id: 'draxler', name: 'Julian Draxler', from: 2017, to: 2023, positions: ['AM', 'LW'], nationality: 'Allemagne' },
  { id: 'messi', name: 'Lionel Messi', from: 2021, to: 2023, positions: ['RW', 'AM'], nationality: 'Argentine' },
  { id: 'lee-kang-in', name: 'Lee Kang-in', from: 2023, to: null, positions: ['AM', 'RW'], nationality: 'Corée du Sud' },
  { id: 'dembele', name: 'Ousmane Dembélé', from: 2023, to: null, positions: ['RW', 'ST'], nationality: 'France' },
  { id: 'barcola', name: 'Bradley Barcola', from: 2023, to: null, positions: ['LW'], nationality: 'France' },
  { id: 'doue', name: 'Désiré Doué', from: 2024, to: null, positions: ['AM', 'RW'], nationality: 'France' },
  { id: 'kvaratskhelia', name: 'Khvicha Kvaratskhelia', from: 2025, to: null, positions: ['LW'], nationality: 'Géorgie' },

  // Attaquants
  { id: 'bianchi', name: 'Carlos Bianchi', from: 1977, to: 1979, positions: ['ST'], nationality: 'Argentine' },
  { id: 'weah', name: 'George Weah', from: 1992, to: 1995, positions: ['ST'], nationality: 'Liberia' },
  { id: 'loko', name: 'Patrice Loko', from: 1994, to: 1998, positions: ['ST'], nationality: 'France' },
  { id: 'simone', name: 'Marco Simone', from: 1997, to: 1999, positions: ['ST'], nationality: 'Italie' },
  { id: 'anelka', name: 'Nicolas Anelka', from: 1996, to: 2002, positions: ['ST'], nationality: 'France' },
  { id: 'pauleta', name: 'Pauleta', from: 2003, to: 2008, positions: ['ST'], nationality: 'Portugal' },
  { id: 'wiltord', name: 'Sylvain Wiltord', from: 2009, to: 2010, positions: ['ST', 'RW'], nationality: 'France' },
  { id: 'hoarau', name: 'Guillaume Hoarau', from: 2008, to: 2013, positions: ['ST'], nationality: 'France' },
  { id: 'ibrahimovic', name: 'Zlatan Ibrahimović', from: 2012, to: 2016, positions: ['ST'], nationality: 'Suède' },
  { id: 'cavani', name: 'Edinson Cavani', from: 2013, to: 2020, positions: ['ST'], nationality: 'Uruguay' },
  { id: 'mbappe', name: 'Kylian Mbappé', from: 2017, to: 2024, positions: ['ST', 'LW'], nationality: 'France' },
  { id: 'icardi', name: 'Mauro Icardi', from: 2019, to: 2024, positions: ['ST'], nationality: 'Argentine' },
  { id: 'kolo-muani', name: 'Randal Kolo Muani', from: 2023, to: 2025, positions: ['ST'], nationality: 'France' },
  { id: 'goncalo-ramos', name: 'Gonçalo Ramos', from: 2023, to: null, positions: ['ST'], nationality: 'Portugal' },
];

export const PLAYERS_BY_ID: ReadonlyMap<string, Player> = new Map(
  PLAYERS.map((player) => [player.id, player]),
);

/** Libellé d'époque affiché sous le nom : « 1992-1995 » ou « depuis 2022 ». */
export function eraLabel(player: Player): string {
  if (player.to === null) return `depuis ${String(player.from)}`;
  return `${String(player.from)}-${String(player.to)}`;
}

const PARTICLES = new Set(['di', 'de', 'van', 'von', 'dos', 'der', 'da', 'le', 'la', 'del', 'du']);

/** Nom court pour l'affichage sur le terrain (« Thiago Silva » → « Silva », « Di María » → « Di María »). */
export function shortName(player: Player): string {
  const parts = player.name.split(' ').filter(Boolean);
  if (parts.length <= 1) return player.name;
  const last = parts[parts.length - 1] ?? player.name;
  const previous = parts.length >= 3 ? parts[parts.length - 2] : undefined;
  if (previous !== undefined && PARTICLES.has(previous.toLowerCase())) {
    return `${previous} ${last}`;
  }
  return last;
}
