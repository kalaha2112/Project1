import { View, Text, StyleSheet } from 'react-native';

interface CardProps {
  customName?: string;
  customCountry?: string;
  titleFont?: string;
}

export default function BaliCard({
  customName,
  customCountry,
  titleFont = 'BebasNeue',
}: CardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.name, { fontFamily: titleFont }]}>
        {customName ?? 'BALI'}
      </Text>
      <View style={styles.verticalWrap}>
        <Text style={styles.country}>{customCountry ?? 'Indonesia'}</Text>
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
    fontSize: 100, lineHeight: 100,
    letterSpacing: 4,
    color: '#1a1a1a',
    marginTop: -8,
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
    width: 80,
    textAlign: 'center',
  },
});
