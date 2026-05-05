import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  count: number;
  activeIdx: number;
  onPress: (i: number) => void;
}

export default function PageDots({ count, activeIdx, onPress }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, i) => (
        <TouchableOpacity key={i} onPress={() => onPress(i)} hitSlop={8}>
          <View style={[styles.dot, i === activeIdx && styles.active]} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: {
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: '#e0e0e0',
  },
  active: {
    backgroundColor: '#91040C',
    transform: [{ scale: 1.2 }],
  },
});
