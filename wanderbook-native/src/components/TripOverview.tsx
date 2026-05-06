import { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar,
  ScrollView, Image,
} from 'react-native';
import { Trip } from '../store/tripStore';
import EditSheet from './EditSheet';

interface Props {
  trip: Trip | null;
  index: number | null;
  visible: boolean;
  onClose: () => void;
}

export default function TripOverview({ trip, index, visible, onClose }: Props) {
  const [showEdit, setShowEdit]   = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  if (!trip) return null;

  const displayName = trip.customName    ?? trip.name;
  const displayCtry = trip.customCountry ?? trip.country;
  const imageEls    = trip.elements.filter((e) => e.type === 'image');
  const numDays     = trip.itinerary?.length ?? 3;
  const spentPct    = trip.budgetTotal && trip.budgetTotal > 0
    ? Math.min((trip.budgetSpent ?? 0) / trip.budgetTotal, 1)
    : 0;
  const budgetLeft  = trip.budgetTotal != null
    ? trip.budgetTotal - (trip.budgetSpent ?? 0)
    : null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" />

        <TouchableOpacity style={styles.backBtn} onPress={onClose} hitSlop={12}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero ── */}
          <View style={styles.card}>
            <View style={styles.heroRow}>
              <View style={styles.heroLeft}>
                <Text style={styles.mLabel}>{displayCtry.toUpperCase()}</Text>
                <Text style={[styles.heroCity, { fontFamily: trip.titleFont }]}>
                  {displayName}
                </Text>
                {trip.dateRange ? (
                  <Text style={styles.heroDate}>{trip.dateRange}</Text>
                ) : null}
                {trip.daysAway ? (
                  <View style={styles.daysAwayPill}>
                    <View style={styles.daysAwayDot} />
                    <Text style={styles.daysAwayText}>{trip.daysAway}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.polaroidStack}>
                {imageEls.length > 0 ? (
                  <>
                    <View style={[styles.polaroid, styles.polaroidBack]}>
                      <Image
                        source={{ uri: imageEls[1]?.uri ?? imageEls[0].uri! }}
                        style={styles.polaroidImg}
                        resizeMode="cover"
                      />
                      <Text style={styles.polaroidCaption} numberOfLines={1}>
                        {trip.dateRange?.split('–').pop()?.trim() ?? displayName.toLowerCase()}
                      </Text>
                    </View>
                    <View style={styles.polaroid}>
                      <Image
                        source={{ uri: imageEls[0].uri! }}
                        style={styles.polaroidImg}
                        resizeMode="cover"
                      />
                      <Text style={styles.polaroidCaption} numberOfLines={1}>
                        {displayName.toLowerCase()}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={[styles.polaroid, styles.polaroidBack, styles.polaroidEmpty]} />
                    <View style={[styles.polaroid, styles.polaroidEmpty]} />
                  </>
                )}
              </View>
            </View>
          </View>

          {/* ── Itinerary ── */}
          <View style={styles.card}>
            <Text style={styles.mLabel}>DAY BY DAY</Text>
            <Text style={styles.sectionTitle}>Itinerary</Text>
            <View style={styles.dayPills}>
              {Array.from({ length: numDays }, (_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.dayPill, activeDay === i && styles.dayPillActive]}
                  onPress={() => setActiveDay(i)}
                >
                  <Text style={[styles.dayPillText, activeDay === i && styles.dayPillTextActive]}>
                    Day {i + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {trip.itinerary?.[activeDay]?.length ? (
              <View style={styles.itineraryList}>
                {trip.itinerary[activeDay].map((item, i) => (
                  <Text key={i} style={styles.itineraryItem}>· {item}</Text>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyHint}>No plans added yet. Tap edit to fill in.</Text>
            )}
          </View>

          {/* ── OOTD + Budget ── */}
          <View style={styles.halfRow}>
            <View style={[styles.card, styles.halfCard]}>
              <Text style={styles.mLabel}>TODAY'S LOOK</Text>
              <Text style={[styles.sectionTitle, styles.ootdTitle]}>OOTD</Text>
              <View style={styles.ootdIcons}>
                <Text style={styles.ootdIcon}>👕</Text>
                <Text style={styles.ootdIcon}>👓</Text>
                {'\n'}
                <Text style={styles.ootdIcon}>👜</Text>
              </View>
            </View>

            <View style={[styles.card, styles.halfCard]}>
              <Text style={styles.mLabel}>SPENDING</Text>
              <Text style={styles.sectionTitle}>Budget</Text>
              <Text style={styles.budgetAmount}>
                {trip.budgetSpent != null
                  ? `$${trip.budgetSpent.toLocaleString()}`
                  : '—'}
              </Text>
              {trip.budgetTotal != null && (
                <Text style={styles.budgetOf}>of ${trip.budgetTotal.toLocaleString()}</Text>
              )}
              {trip.budgetTotal != null && trip.budgetTotal > 0 && (
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${(spentPct * 100).toFixed(0)}%` }]} />
                </View>
              )}
              {budgetLeft != null && (
                <Text style={styles.budgetLeft}>${budgetLeft.toLocaleString()} left</Text>
              )}
            </View>
          </View>

          {/* ── Hotel ── */}
          {(trip.hotelLocation || trip.hotelNights) ? (
            <View style={[styles.card, styles.hotelCard]}>
              <View>
                <Text style={styles.mLabel}>
                  {[
                    trip.hotelLocation?.toUpperCase(),
                    trip.hotelNights ? `${trip.hotelNights} NIGHTS` : null,
                  ].filter(Boolean).join(' · ')}
                </Text>
                <Text style={styles.sectionTitle}>Hotel</Text>
              </View>
              <View style={styles.hotelPhoto} />
            </View>
          ) : null}
        </ScrollView>

        {/* Floating edit button */}
        <TouchableOpacity
          style={styles.editFab}
          onPress={() => setShowEdit(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.editFabText}>edit card</Text>
        </TouchableOpacity>
      </View>

      <EditSheet trip={trip} visible={showEdit} onClose={() => setShowEdit(false)} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f7f5f2',
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
  scroll: {
    paddingTop: Platform.OS === 'ios' ? 100 : 72,
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },

  // ── Card shell ──
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    borderRadius: 8,
    padding: 20,
  },

  // ── Shared label ──
  mLabel: {
    fontFamily: 'DMSans-Medium',
    fontSize: 8,
    letterSpacing: 2,
    color: '#c4a472',
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  // ── Hero ──
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroLeft: {
    flex: 1,
    paddingRight: 8,
  },
  heroCity: {
    fontSize: 52,
    lineHeight: 48,
    letterSpacing: -1.5,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  heroDate: {
    fontFamily: 'CormorantGaramond-LightItalic',
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  daysAwayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#91040C',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  daysAwayDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#91040C',
  },
  daysAwayText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: '#91040C',
    letterSpacing: 0.3,
  },

  // ── Polaroids ──
  polaroidStack: {
    width: 130,
    height: 150,
  },
  polaroid: {
    position: 'absolute',
    width: 82,
    height: 104,
    backgroundColor: '#111',
    padding: 5,
    paddingBottom: 22,
    left: 5,
    top: 28,
    transform: [{ rotate: '-4deg' }],
    zIndex: 2,
  },
  polaroidBack: {
    left: undefined,
    right: 0,
    top: 4,
    transform: [{ rotate: '9deg' }],
    zIndex: 1,
  },
  polaroidImg: {
    flex: 1,
    backgroundColor: '#333',
  },
  polaroidCaption: {
    position: 'absolute',
    bottom: 4,
    left: 5,
    right: 5,
    textAlign: 'center',
    fontFamily: 'CormorantGaramond-LightItalic',
    fontSize: 8,
    color: '#bbb',
    letterSpacing: 0.5,
  },
  polaroidEmpty: {
    backgroundColor: '#d8d5d0',
  },

  // ── Section title ──
  sectionTitle: {
    fontFamily: 'PlayfairDisplay-BoldItalic',
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  ootdTitle: {
    fontFamily: 'BebasNeue',
    letterSpacing: 1,
  },

  // ── Itinerary ──
  dayPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayPill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
  },
  dayPillActive: {
    borderColor: '#91040C',
    backgroundColor: 'rgba(145,4,12,0.04)',
  },
  dayPillText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: '#aaa',
  },
  dayPillTextActive: {
    color: '#91040C',
    fontFamily: 'DMSans-Medium',
  },
  itineraryList: { marginTop: 12, gap: 4 },
  itineraryItem: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: '#444',
    lineHeight: 20,
  },
  emptyHint: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: '#ccc',
    marginTop: 8,
  },

  // ── Half row ──
  halfRow: { flexDirection: 'row', gap: 12 },
  halfCard: { flex: 1, padding: 16 },

  // ── OOTD ──
  ootdIcons: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  ootdIcon: { fontSize: 28 },

  // ── Budget ──
  budgetAmount: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    letterSpacing: -0.5,
    color: '#1a1a1a',
    marginTop: 2,
  },
  budgetOf: {
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    color: '#aaa',
    marginTop: 2,
    marginBottom: 8,
  },
  progressBg: {
    height: 3,
    backgroundColor: '#e4e1dc',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: 3,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
  },
  budgetLeft: {
    fontFamily: 'CormorantGaramond-LightItalic',
    fontSize: 15,
    color: '#91040C',
    letterSpacing: 0.2,
  },

  // ── Hotel ──
  hotelCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotelPhoto: {
    width: 88,
    height: 88,
    borderRadius: 4,
    backgroundColor: '#e4e1dc',
  },

  // ── FAB ──
  editFab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    alignSelf: 'center',
    left: 16,
    right: 16,
    paddingVertical: 14,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    alignItems: 'center',
  },
  editFabText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    letterSpacing: 2.5,
    color: '#fff',
    textTransform: 'uppercase',
  },
});
