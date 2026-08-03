import { useCallback, useEffect, useState } from "react";

export type CustomExtra = {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
};

export type Service = {
  id: string;
  subKey: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  atHome: boolean;
  atSalon: boolean;
  extras: string[];
  customExtras?: CustomExtra[];
  interval: string;
};


export type CatalogState = {
  step: number;
  areas: string[];
  subs: string[];
  services: Service[];
  published: boolean;
};

const STORAGE_KEY = "vemmimo:catalogo:v1";

export const emptyState: CatalogState = {
  step: 1,
  areas: [],
  subs: [],
  services: [],
  published: false,
};

function load(): CatalogState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    return { ...emptyState, ...(JSON.parse(raw) as Partial<CatalogState>) };
  } catch {
    return emptyState;
  }
}

export function useCatalog() {
  const [state, setState] = useState<CatalogState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const update = useCallback(
    (patch: Partial<CatalogState> | ((s: CatalogState) => Partial<CatalogState>)) =>
      setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) })),
    [],
  );

  const reset = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(emptyState);
  }, []);

  return { state, update, reset, hydrated };
}
