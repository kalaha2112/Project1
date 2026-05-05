import { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, ScrollView,
  TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Trip, useTripStore } from '../store/tripStore';

const FONTS = [
  { key: 'PlayfairDisplay-Black',         label: 'Playfair Blk' },
  { key: 'PlayfairDisplay-Bold',          label: 'Playfair Bd'  },
  { key: 'PlayfairDisplay-BoldItalic',    label: 'Playfair It'  },
  { key: 'PlayfairDisplay-Italic',        label: 'Playfair Li'  },
  { key: 'BebasNeue',                     label: 'Bebas Neue'   },
  { key: 'DMSans-Regular',               label: 'DM Sans'      },
  { key: 'DMSans-Medium',               label: 'DM Sans Md'   },
  { key: 'CormorantGaramond-LightItalic', label: 'Cormorant'    },
];

interface Props {
  trip: Trip | null;
  visible: boolean;
  onClose: () => void;
}

export default function EditSheet({ trip, visible, onClose }: Props) {
  const { updateTrip } = useTripStore();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [font, setFont] = useState('PlayfairDisplay-Black');

  useEffect(() => {
    if (trip) {
      setName(trip.customName ?? trip.name);
      setCountry(trip.customCountry ?? trip.country);
      setFont(trip.titleFont);
    }
  }, [trip]);

  function handleSave() {
    if (!trip) return;
    updateTrip(trip.id, {
      customName:    name.trim()    || undefined,
      customCountry: country.trim() || undefined,
      titleFont:     font,
    });
    onClose();
  }

  function handleReset() {
    if (!trip) return;
    updateTrip(trip.id, {
      customName:    undefined,
      customCountry: undefined,
      titleFont:     trip.titleFont,
    });
    setName(trip.name);
    setCountry(trip.country);
  }

  const previewText = name.trim() || trip?.name || 'City';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          {/* Handle bar */}
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Edit Card</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Text style={styles.cancelBtn}>cancel</Text>
            </TouchableOpacity>
          </View>

          {/* City name */}
          <Text style={styles.label}>CITY</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={trip?.name ?? 'City name'}
            placeholderTextColor="#ccc"
            returnKeyType="next"
          />

          {/* Country */}
          <Text style={styles.label}>COUNTRY</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder={trip?.country ?? 'Country'}
            placeholderTextColor="#ccc"
            returnKeyType="done"
          />

          {/* Font picker */}
          <Text style={styles.label}>FONT</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.fontScroll}
            contentContainerStyle={styles.fontRow}
          >
            {FONTS.map((f) => {
              const active = f.key === font;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.fontPill, active && styles.fontPillActive]}
                  onPress={() => setFont(f.key)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.fontPreview, { fontFamily: f.key }, active && styles.fontPreviewActive]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {previewText}
                  </Text>
                  <Text style={[styles.fontLabel, active && styles.fontLabelActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset} hitSlop={8}>
              <Text style={styles.resetBtnText}>reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>SAVE</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 36, height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    color: '#1a1a1a',
    letterSpacing: 0.2,
  },
  cancelBtn: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: '#aaa',
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: 'DMSans-Medium',
    fontSize: 8,
    letterSpacing: 2.5,
    color: '#bbb',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 22,
    color: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    paddingVertical: 6,
    letterSpacing: 0.5,
  },
  fontScroll: {
    marginTop: 4,
  },
  fontRow: {
    gap: 8,
    paddingRight: 8,
  },
  fontPill: {
    width: 80,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    alignItems: 'center',
  },
  fontPillActive: {
    borderColor: '#91040C',
    backgroundColor: 'rgba(145,4,12,0.04)',
  },
  fontPreview: {
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  fontPreviewActive: {
    color: '#91040C',
  },
  fontLabel: {
    fontFamily: 'DMSans-Regular',
    fontSize: 7,
    letterSpacing: 1,
    color: '#bbb',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  fontLabelActive: {
    color: '#91040C',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  resetBtn: {
    paddingVertical: 6,
  },
  resetBtnText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    letterSpacing: 1,
    color: '#ccc',
    textTransform: 'uppercase',
  },
  saveBtn: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
  },
  saveBtnText: {
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    letterSpacing: 2.5,
    color: '#fff',
  },
});
