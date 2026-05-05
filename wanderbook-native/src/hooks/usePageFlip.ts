import { useCallback, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTripStore, PageState } from '../store/tripStore';

const N = 5;
const ANIM_LOCK_MS = 740;
const OPEN_SETTLE_MS = 700;
const CLOSE_MS = 900;

// Degree value for each logical page state
const DEG: Record<PageState, number> = {
  waiting:     88,
  incoming:    42,
  active:       0,
  'flipping-up': -180,
  past:        -180,
};

export function usePageFlip() {
  const {
    isOpen, isAnimating, activeIdx, pageStates,
    setOpen, setAnimating, setActiveIdx, setPageState, setAllPageStates,
  } = useTripStore();

  // One Animated.Value per page for rotateX (in degrees)
  const pageAnims = useRef(
    Array.from({ length: N }, () => new Animated.Value(DEG.waiting))
  ).current;

  // Cover flip: 0 = closed, 1 = open
  const coverAnim = useRef(new Animated.Value(0)).current;

  const animatePage = useCallback(
    (i: number, state: PageState, delay = 0, springy = false) => {
      const toValue = DEG[state];
      const anim = springy
        ? Animated.spring(pageAnims[i], {
            toValue,
            damping: 20,
            stiffness: 140,
            useNativeDriver: true,
          })
        : Animated.timing(pageAnims[i], {
            toValue,
            duration: 720,
            delay,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          });
      anim.start();
      setPageState(i, state);
    },
    [pageAnims, setPageState]
  );

  const openBook = useCallback(() => {
    if (isOpen || isAnimating) return;
    setAnimating(true);
    setOpen(true);

    // Flip the cover open
    Animated.timing(coverAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();

    // Pages rise after 200ms
    setTimeout(() => {
      for (let i = 0; i < N; i++) {
        if (i < activeIdx)      animatePage(i, 'past');
        else if (i === activeIdx) animatePage(i, 'active');
        else                    animatePage(i, 'waiting');
      }
    }, 200);

    setTimeout(() => setAnimating(false), OPEN_SETTLE_MS);
  }, [isOpen, isAnimating, activeIdx, coverAnim, animatePage, setOpen, setAnimating]);

  const closeBook = useCallback(() => {
    if (!isOpen || isAnimating) return;
    setAnimating(true);
    setOpen(false);

    // All pages drop
    for (let i = 0; i < N; i++) animatePage(i, 'waiting');

    // Cover flips back after short delay
    setTimeout(() => {
      Animated.timing(coverAnim, {
        toValue: 0,
        duration: 900,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start();
    }, 80);

    setTimeout(() => {
      setActiveIdx(1);
      // Reset page anim values silently
      pageAnims.forEach((a) => a.setValue(DEG.waiting));
      setAllPageStates(['waiting', 'waiting', 'waiting', 'waiting', 'waiting']);
      setAnimating(false);
    }, CLOSE_MS);
  }, [isOpen, isAnimating, coverAnim, pageAnims, animatePage, setOpen, setActiveIdx, setAllPageStates, setAnimating]);

  const goNext = useCallback(() => {
    if (!isOpen || isAnimating || activeIdx >= N - 1) return;
    setAnimating(true);

    const cur  = activeIdx;
    const next = activeIdx + 1;

    animatePage(cur, 'flipping-up');

    // Snap next to incoming, then animate to active
    pageAnims[next].setValue(DEG.incoming);
    setPageState(next, 'incoming');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      animatePage(next, 'active');
    }));

    setTimeout(() => {
      setPageState(cur, 'past');
      setActiveIdx(next);
      setAnimating(false);
    }, ANIM_LOCK_MS);
  }, [isOpen, isAnimating, activeIdx, pageAnims, animatePage, setActiveIdx, setAnimating, setPageState]);

  const goPrev = useCallback(() => {
    if (!isOpen || isAnimating || activeIdx <= 0) return;
    setAnimating(true);

    const cur  = activeIdx;
    const prev = activeIdx - 1;

    animatePage(cur, 'waiting');

    // Snap prev to flipping-up instantly, then spring back to active
    pageAnims[prev].setValue(DEG['flipping-up']);
    setPageState(prev, 'flipping-up');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      animatePage(prev, 'active', 0, true);
    }));

    setTimeout(() => {
      setActiveIdx(prev);
      setAnimating(false);
    }, ANIM_LOCK_MS);
  }, [isOpen, isAnimating, activeIdx, pageAnims, animatePage, setActiveIdx, setAnimating, setPageState]);

  const jumpTo = useCallback((idx: number) => {
    if (!isOpen || isAnimating || idx === activeIdx) return;
    if (idx > activeIdx) goNext();
    else goPrev();
  }, [isOpen, isAnimating, activeIdx, goNext, goPrev]);

  return {
    isOpen, isAnimating, activeIdx, pageStates,
    coverAnim, pageAnims,
    openBook, closeBook, goNext, goPrev, jumpTo,
  };
}
