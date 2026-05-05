import { View, Text, StyleSheet } from 'react-native';

export default function BaliCard() {
  return (
    <View style={styles.card}>
      {/* BALI — centred vertically */}
      <Text style={styles.name}>BALI</Text>

      {/* Indonesia — vertical right edge */}
      <View style={styles.verticalWrap}>
        <Text style={styles.country}>Indonesia</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute', width: 280, height: 188,
    backgroundColor: '#fff', overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  name: {
    fontFamily: 'BebasNeue',
    fontSize: 100, lineHeight: 100,
    letterSpacing: 4,
    color: '#1a1a1a',
    marginTop: -8,       // nudge up slightly to match translateY(-54%)
  },
  verticalWrap: {
    position: 'absolute', right: 22, top: 0, bottom: 0,
    zIndex: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  country: {
    fontFamily: 'DMSans-Regular',
    fontSize: 7, letterSpacing: 3,
    color: '#91040C',
    textTransform: 'uppercase',
    transform: [{ rotate: '90deg' }],
    width: 80,          // gives the rotated text room without clipping
    textAlign: 'center',
  },
});
