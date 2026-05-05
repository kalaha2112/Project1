import { create } from 'zustand';

export type PageState = 'waiting' | 'active' | 'flipping-up' | 'past' | 'incoming';

export interface Trip {
  id: string;
  name: string;
  country: string;
  status: 'past' | 'now' | 'upcoming';
  cardDesign: 0 | 1 | 2 | 3 | 4;
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
}

const TRIPS: Trip[] = [
  { id: 'paris',   name: 'Paris',   country: 'France',    status: 'past',     cardDesign: 0 },
  { id: 'kyoto',   name: 'Kyoto',   country: 'Japan',     status: 'now',      cardDesign: 1 },
  { id: 'bali',    name: 'Bali',    country: 'Indonesia', status: 'upcoming', cardDesign: 2 },
  { id: 'morocco', name: 'Morocco', country: 'Morocco',   status: 'upcoming', cardDesign: 3 },
  { id: 'lisbon',  name: 'Lisbon',  country: 'Portugal',  status: 'upcoming', cardDesign: 4 },
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
}));
