import { View, Text, StyleSheet } from 'react-native';

interface CardProps {
  customName?: string;
  customCountry?: string;
  titleFont?: string;
}

export default function LisbonCard({
  customName,
  customCountry,
  titleFont = 'BebasNeue',
}: CardProps) {
  return (
    <View style={styles.card}>
      {customName ? (
        <Text style={[styles.customName, { fontFamily: titleFont }]}>
          {customName}
        </Text>
      ) : (
        <>
          <Text style={styles.lis}>LIS</Text>
          <Text style={styles.bon}>bon</Text>
        </>
      )}

      <View style={styles.rule} />

      <View style={styles.circle}>
        <Text style={styles.circleLabel}>{customCountry ?? 'Por\ntugal'}</Text>
      </View>

      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { position: 'absolute', width: 280, height: 188, backgroundColor: '#fff', overflow: 'hidden' },
  lis: {
    position: 'absolute', top: 16, right: 24, zIndex: 3,
    fontFamily: 'BebasNeue',
    fontSize: 78, lineHeight: 78,
    letterSpacing: 2,
    color: '#1a1a1a',
    textAlign: 'right',
  },
  rule: {
    position: 'absolute', top: 94, left: 0, right: 0,
    height: 2, backgroundColor: '#23140C', zIndex: 5,
  },
  bon: {
    position: 'absolute', bottom: 16, left: 24, zIndex: 3,
    fontFamily: 'PlayfairDisplay-BoldItalic',
    fontSize: 72, lineHeight: 72,
    letterSpacing: -1,
    color: '#1a1a1a',
  },
  customName: {
    position: 'absolute', top: 16, left: 24, zIndex: 3,
    fontSize: 68, lineHeight: 65,
    letterSpacing: -1,
    color: '#1a1a1a',
  },
  circle: {
    position: 'absolute', top: 56, zIndex: 6,
    left: (280 - 78) / 2,
    width: 78, height: 78, borderRadius: 39,
    borderWidth: 2, borderColor: '#23140C',
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  circleLabel: {
    fontFamily: 'DMSans-Regular',
    fontSize: 7, letterSpacing: 2,
    color: '#aaa',
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 11,
  },
  dot: {
    position: 'absolute', bottom: 20, right: 24, zIndex: 4,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#91040C',
  },
});
