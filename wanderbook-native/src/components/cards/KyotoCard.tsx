import { View, Text, StyleSheet } from 'react-native';

export default function KyotoCard() {
  return (
    <View style={styles.card}>
      {/* Ghost watermark */}
      <Text style={styles.ghost}>{'KY\nOTO'}</Text>

      {/* Accent dot */}
      <View style={styles.dot} />

      {/* Kyoto */}
      <Text style={styles.name}>Kyoto</Text>

      {/* Japan */}
      <Text style={styles.country}>Japan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { position: 'absolute', width: 280, height: 188, backgroundColor: '#fff', overflow: 'hidden' },
  ghost: {
    position: 'absolute', top: -12, left: -6, zIndex: 1,
    fontFamily: 'BebasNeue',
    fontSize: 128, lineHeight: 105,
    letterSpacing: -2,
    color: 'rgba(0,0,0,0.033)',
  },
  dot: {
    position: 'absolute', top: 18, right: 20, zIndex: 5,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: '#23140C',
  },
  name: {
    position: 'absolute', top: 22, left: 24, zIndex: 4,
    fontFamily: 'PlayfairDisplay-Black',
    fontSize: 54, lineHeight: 48,
    letterSpacing: -1.5,
    color: '#1a1a1a',
  },
  country: {
    position: 'absolute', bottom: 18, right: 24, zIndex: 4,
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 28, lineHeight: 28,
    letterSpacing: 0.5,
    color: '#1a1a1a',
  },
});
