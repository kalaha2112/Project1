import { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar,
} from 'react-native';
import { Trip } from '../store/tripStore';
import BookOutline from './BookOutline';
import StickerLayer from './StickerLayer';
import EditSheet from './EditSheet';
import ParisCard   from './cards/ParisCard';
import KyotoCard   from './cards/KyotoCard';
import BaliCard    from './cards/BaliCard';
import MoroccoCard from './cards/MoroccoCard';
import LisbonCard  from './cards/LisbonCard';

const CARDS = [ParisCard, KyotoCard, BaliCard, MoroccoCard, LisbonCard];

interface Props {
  trip: Trip | null;
  index: number | null;
  visible: boolean;
  onClose: () => void;
}

export default function TripOverview({ trip, index, visible, onClose }: Props) {
  const [showEdit, setShowEdit] = useState(false);

  if (!trip) return null;

  const Card        = CARDS[trip.cardDesign];
  const pageNum     = String((index ?? 0) + 1).padStart(2, '0');
  const displayName = trip.customName    ?? trip.name;
  const displayCtry = trip.customCountry ?? trip.country;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" />

        {/* ← back */}
        <TouchableOpacity style={styles.backBtn} onPress={onClose} hitSlop={12}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Hero text */}
        <View style={styles.hero}>
          <Text style={styles.heroCountry}>{displayCtry.toUpperCase()}</Text>
          <Text style={[styles.heroCity, { fontFamily: trip.titleFont }]}>
            {displayName}
          </Text>
        </View>

        {/* Card + outline — identical structure to App.tsx bookContainer */}
        <View style={styles.bookContainer}>
          <View style={styles.bookWrap}>
            <View style={styles.topEdge} />
            <Card
              customName={trip.customName}
              customCountry={trip.customCountry}
              titleFont={trip.titleFont}
            />
            <StickerLayer trip={trip} />
            <Text style={styles.pageNum}>{pageNum}</Text>
          </View>
          <BookOutline />
        </View>

        {/* Footer actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setShowEdit(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.editBtnText}>edit card</Text>
          </TouchableOpacity>
        </View>
      </View>

      <EditSheet
        trip={trip}
        visible={showEdit}
        onClose={() => setShowEdit(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#faf9f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 28,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  backArrow: {
    fontFamily: 'DMSans-Regular',
    fontSize: 22,
    color: '#1a1a1a',
  },

  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  heroCountry: {
    fontFamily: 'DMSans-Medium',
    fontSize: 8,
    letterSpacing: 3,
    color: '#bbb',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroCity: {
    fontSize: 48,
    lineHeight: 44,
    letterSpacing: -1.5,
    color: '#1a1a1a',
  },

  // Mirrors App.tsx exactly
  bookContainer: { width: 344, height: 232 },
  bookWrap: {
    position: 'absolute', top: 2, left: 2,
    width: 340, height: 228,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 1,
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

  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  editBtn: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 2,
  },
  editBtnText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 9,
    letterSpacing: 2,
    color: '#1a1a1a',
    textTransform: 'uppercase',
  },
});
