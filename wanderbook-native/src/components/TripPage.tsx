import { Animated, View, Text, StyleSheet } from 'react-native';
import { PageState, Trip } from '../store/tripStore';
import ParisCard   from './cards/ParisCard';
import KyotoCard   from './cards/KyotoCard';
import BaliCard    from './cards/BaliCard';
import MoroccoCard from './cards/MoroccoCard';
import LisbonCard  from './cards/LisbonCard';

const CARDS = [ParisCard, KyotoCard, BaliCard, MoroccoCard, LisbonCard];

const Z: Record<PageState, number> = {
  'waiting':     2,
  'incoming':    14,
  'active':      15,
  'flipping-up': 16,
  'past':        5,
};

interface Props {
  index: number;
  trip: Trip;
  pageState: PageState;
  rotateAnim: Animated.Value;
}

export default function TripPage({ index, trip, pageState, rotateAnim }: Props) {
  const Card = CARDS[trip.cardDesign];

  const rotateX = rotateAnim.interpolate({
    inputRange:  [-180, 0, 88],
    outputRange: ['-180deg', '0deg', '88deg'],
  });

  const HALF_H = 94;

  return (
    <Animated.View
      style={[
        styles.page,
        {
          zIndex: Z[pageState],
          transform: [
            { perspective: 1400 },
            { translateY: -HALF_H },
            { rotateX },
            { translateY: HALF_H },
          ],
        },
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.topEdge} />

        <Card
          customName={trip.customName}
          customCountry={trip.customCountry}
          titleFont={trip.titleFont}
        />

        <Text style={styles.pageNum}>{String(index + 1).padStart(2, '0')}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  page: {
    position: 'absolute', width: 280, height: 188, top: 0, left: 0,
  },
  inner: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  topEdge: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 1, backgroundColor: 'rgba(0,0,0,0.06)', zIndex: 5,
  },
  pageNum: {
    position: 'absolute', top: 8, right: 12, zIndex: 4,
    fontFamily: 'CormorantGaramond-LightItalic',
    fontSize: 10, color: '#ccc',
  },
});
