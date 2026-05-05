import { View, Text, Image, StyleSheet } from 'react-native';

interface CardProps {
  customName?: string;
  customCountry?: string;
  titleFont?: string;
}

export default function ParisCard({
  customName,
  titleFont = 'PlayfairDisplay-Black',
}: CardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={require('../../../assets/eiffel.png')}
        style={styles.eiffel}
        resizeMode="contain"
      />
      <Text style={[styles.name, { fontFamily: titleFont }]}>
        {customName ?? 'PARIS'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { position: 'absolute', top: 0, left: 0, width: 280, height: 188, backgroundColor: '#fff', overflow: 'hidden' },
  eiffel: {
    position: 'absolute', right: -6, top: -24,
    height: 206, width: 120,
    opacity: 0.9,
    zIndex: 2,
  },
  name: {
    position: 'absolute', bottom: 4, left: 22, zIndex: 3,
    fontSize: 78, lineHeight: 78,
    letterSpacing: -2,
    color: '#1a1a1a',
  },
});
