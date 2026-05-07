import { useRef, useState } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { CardElement, useTripStore } from '../store/tripStore';

export type DrawBrush = 'pen' | 'brush' | 'highlighter' | 'eraser';

interface Point { x: number; y: number; }

interface Props {
  tripId: string;
  elements: CardElement[];
  brush: DrawBrush;
  strokeColor: string;
  onBeforeDraw: () => void;
  onNextZIndex: () => number;
}

function buildSmoothPath(pts: Point[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x} ${pts[i].y} ${mx} ${my}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

function normalizePath(pts: Point[], sw: number) {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs) - sw;
  const minY = Math.min(...ys) - sw;
  const maxX = Math.max(...xs) + sw;
  const maxY = Math.max(...ys) + sw;
  const w = Math.max(maxX - minX, 2);
  const h = Math.max(maxY - minY, 2);
  const norm = pts.map((p) => ({ x: p.x - minX, y: p.y - minY }));
  return { pathD: buildSmoothPath(norm), x: minX, y: minY, w, h };
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const BRUSH_PARAMS: Record<DrawBrush, { width: number; opacity: number; draggable: boolean }> = {
  pen:         { width: 2,  opacity: 1.0, draggable: false },
  brush:       { width: 10, opacity: 1.0, draggable: true  },
  highlighter: { width: 20, opacity: 0.4, draggable: false },
  eraser:      { width: 0,  opacity: 0,   draggable: false },
};

export default function DrawingLayer({
  tripId, elements, brush, strokeColor, onBeforeDraw, onNextZIndex,
}: Props) {
  const { addElement } = useTripStore();
  const [livePathD, setLivePathD] = useState('');
  const points = useRef<Point[]>([]);
  const hasPushedHistory = useRef(false);

  // Stable refs — PanResponder is created once but must read current prop values
  const R = useRef({ brush, strokeColor, onBeforeDraw, onNextZIndex, elements });
  R.current = { brush, strokeColor, onBeforeDraw, onNextZIndex, elements };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,

      onPanResponderGrant: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        const { brush: b, elements: els, onBeforeDraw: before } = R.current;
        hasPushedHistory.current = false;

        if (b === 'eraser') {
          const { removeElement } = useTripStore.getState();
          els.forEach((el) => {
            const elW = (el.width  ?? (el.type === 'text' ? 80 : 40)) * el.scale;
            const elH = (el.height ?? (el.type === 'text' ? 20 : 40)) * el.scale;
            if (x >= el.x && x <= el.x + elW && y >= el.y && y <= el.y + elH) {
              if (!hasPushedHistory.current) { before(); hasPushedHistory.current = true; }
              removeElement(tripId, el.id);
            }
          });
          return;
        }

        before();
        hasPushedHistory.current = true;
        points.current = [{ x, y }];
        setLivePathD(`M ${x} ${y}`);
      },

      onPanResponderMove: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        const { brush: b, elements: els, onBeforeDraw: before } = R.current;

        if (b === 'eraser') {
          const { removeElement } = useTripStore.getState();
          els.forEach((el) => {
            const elW = (el.width  ?? (el.type === 'text' ? 80 : 40)) * el.scale;
            const elH = (el.height ?? (el.type === 'text' ? 20 : 40)) * el.scale;
            if (x >= el.x && x <= el.x + elW && y >= el.y && y <= el.y + elH) {
              if (!hasPushedHistory.current) { before(); hasPushedHistory.current = true; }
              removeElement(tripId, el.id);
            }
          });
          return;
        }

        points.current.push({ x, y });
        setLivePathD(buildSmoothPath(points.current));
      },

      onPanResponderRelease: () => {
        const { brush: b, strokeColor: color, onNextZIndex: nextZ } = R.current;

        if (b === 'eraser' || points.current.length < 2) {
          setLivePathD('');
          points.current = [];
          return;
        }

        const params = BRUSH_PARAMS[b];
        const { pathD, x, y, w, h } = normalizePath(points.current, params.width);

        addElement(tripId, {
          id:            makeId(),
          type:          'path',
          x, y, scale: 1, rotation: 0,
          zIndex:        nextZ(),
          pathD,
          strokeColor:   color,
          strokeWidth:   params.width,
          strokeOpacity: params.opacity,
          draggable:     params.draggable,
          width: w, height: h,
        });

        setLivePathD('');
        points.current = [];
      },
    })
  ).current;

  const params = BRUSH_PARAMS[brush];

  return (
    <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
      {livePathD ? (
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Path
            d={livePathD}
            stroke={strokeColor}
            strokeWidth={params.width}
            strokeOpacity={params.opacity}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}
    </View>
  );
}
