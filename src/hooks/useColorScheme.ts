import { useEffect, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

const QUERY = '(prefers-color-scheme: dark)';

/**
 * Thème de l'OS, suivi en direct. Le terrain SVG en a besoin en JS : ses couleurs sont des
 * attributs (pour survivre à l'export PNG), donc les variables CSS du thème ne l'atteignent pas.
 */
export function useColorScheme(): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>(() =>
    typeof window !== 'undefined' && window.matchMedia(QUERY).matches ? 'dark' : 'light',
  );

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      setScheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  return scheme;
}
