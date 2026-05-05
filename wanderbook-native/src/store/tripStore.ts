import { create } from 'zustand';

export type PageState = 'waiting' | 'active' | 'flipping-up' | 'past' | 'incoming';

export interface Trip {
  id: string;
  name: string;
  country: string;
  status: 'past' | 'now' | 'upcoming';
  cardDesign: 0 | 1 | 2 | 3 | 4;
  titleFont: string;
  customName?: string;
  customCountry?: string;
}

interface AppState {
  isOpen: boolean;
  activeIdx: number;
  isAnimating: boolean;
  pageStates: PageState[];
  trips: Trip[];

  setOpen: (v: boolean) => void;
  setActiveIdx: (i: number) => void;
  setAnimating: (v: boolean) => void;
  setPageState: (i: number, state: PageState) => void;
  setAllPageStates: (states: PageState[]) => void;
  updateTrip: (id: string, patch: Partial<Pick<Trip, 'customName' | 'customCountry' | 'titleFont'>>) => void;
}

const TRIPS: Trip[] = [
  { id: 'paris',   name: 'Paris',   country: 'France',    status: 'past',     cardDesign: 0, titleFont: 'PlayfairDisplay-Black' },
  { id: 'kyoto',   name: 'Kyoto',   country: 'Japan',     status: 'now',      cardDesign: 1, titleFont: 'PlayfairDisplay-Black' },
  { id: 'bali',    name: 'Bali',    country: 'Indonesia', status: 'upcoming', cardDesign: 2, titleFont: 'BebasNeue' },
  { id: 'morocco', name: 'Morocco', country: 'Morocco',   status: 'upcoming', cardDesign: 3, titleFont: 'BebasNeue' },
  { id: 'lisbon',  name: 'Lisbon',  country: 'Portugal',  status: 'upcoming', cardDesign: 4, titleFont: 'BebasNeue' },
];

export const useTripStore = create<AppState>((set) => ({
  isOpen:      false,
  activeIdx:   1,
  isAnimating: false,
  pageStates:  ['waiting', 'waiting', 'waiting', 'waiting', 'waiting'],
  trips:       TRIPS,

  setOpen:      (v) => set({ isOpen: v }),
  setActiveIdx: (i) => set({ activeIdx: i }),
  setAnimating: (v) => set({ isAnimating: v }),

  setPageState: (i, state) =>
    set((s) => {
      const next = [...s.pageStates] as PageState[];
      next[i] = state;
      return { pageStates: next };
    }),

  setAllPageStates: (states) => set({ pageStates: states }),

  updateTrip: (id, patch) =>
    set((s) => ({
      trips: s.trips.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
}));
