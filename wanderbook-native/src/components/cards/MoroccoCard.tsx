import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';

export default function MoroccoCard() {
  return (
    <View style={styles.card}>
      {/* Ghost M */}
      <Text style={styles.ghostM}>M</Text>

      {/* MO */}
      <Text style={styles.mo}>MO</Text>

      {/* rocco */}
      <Text style={styles.rocco}>rocco</Text>

      {/* Diagonal ink line */}
      <Svg style={StyleSheet.absoluteFillObject} width={280} height={188} viewBox="0 0 280 188">
        <Line x1="8" y1="120" x2="200" y2="50" stroke="#1a1a1a" strokeWidth={0.8} strokeLinecap="round" opacity={0.18} />
      </Svg>

      {/* Amber circle outline */}
      <View style={styles.circle} />

      {/* Marrakech */}
      <Text style={styles.sub}>Marrakech</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { position: 'absolute', width: 280, height: 188, backgroundColor: '#fff', overflow: 'hidden' },
  ghostM: {
    position: 'absolute', top: -22, left: -8, zIndex: 1,
    fontFamily: 'PlayfairDisplay-Black',
    fontSize: 170, lineHeight: 170,
    color: 'rgba(0,0,0,0.03)',
  },
  mo: {
    position: 'absolute', top: 22, left: 24, zIndex: 4,
    fontFamily: 'BebasNeue',
    fontSize: 54, lineHeight: 49,
    letterSpacing: 1,
    color: '#1a1a1a',
  },
  rocco: {
    position: 'absolute', top: 64, left: 32, zIndex: 4,
    fontFamily: 'PlayfairDisplay-Italic',
    fontSize: 48, lineHeight: 43,
    letterSpacing: -0.5,
    color: '#1a1a1a',
  },
  circle: {
    position: 'absolute', top: 20, right: 22, zIndex: 5,
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#91040C',
    backgroundColor: 'transparent',
  },
  sub: {
    position: 'absolute', bottom: 20, left: 24, zIndex: 4,
    fontFamily: 'DMSans-Regular',
    fontSize: 7, letterSpacing: 3,
    color: '#bbb',
    textTransform: 'uppercase',
  },
});
