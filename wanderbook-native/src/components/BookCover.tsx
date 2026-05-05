import { Animated, TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';

interface BookCoverProps {
  coverAnim: Animated.Value;  // 0 = closed, 1 = open
  onOpen: () => void;
}

export default function BookCover({ coverAnim, onOpen }: BookCoverProps) {
  // Front face: rotates from 0 → -180deg as coverAnim goes 0 → 1
  const frontRotateX = coverAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  // Front face fades out at the halfway point
  const frontOpacity = coverAnim.interpolate({
    inputRange:  [0, 0.48, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  // Back face fades in at the halfway point and mirrors the rotation
  const backOpacity = coverAnim.interpolate({
    inputRange:  [0, 0.5, 0.52, 1],
    outputRange: [0, 0, 1, 1],
  });

  const backRotateX = coverAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  return (
    <TouchableWithoutFeedback onPress={onOpen}>
      <View style={styles.container}>
        {/* Front face */}
        <Animated.View
          style={[
            styles.face,
            {
              opacity: frontOpacity,
              transform: [
                { perspective: 1400 },
                { translateY: -94 },
                { rotateX: frontRotateX },
                { translateY: 94 },
              ],
            },
          ]}
        >
          <View style={styles.front}>
            <Text style={styles.coverText}>
              {'Where will you be\n'}
              <Text style={styles.tapWord}>off to next?</Text>
            </Text>
          </View>
        </Animated.View>

        {/* Back face (underside — off-white) */}
        <Animated.View
          style={[
            styles.face,
            styles.back,
            {
              opacity: backOpacity,
              transform: [
                { perspective: 1400 },
                { translateY: -94 },
                { rotateX: backRotateX },
                { translateY: 94 },
              ],
            },
          ]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280, height: 188,
    position: 'absolute', top: 0, left: 0,
    zIndex: 20,
  },
  face: {
    position: 'absolute', width: 280, height: 188,
    top: 0, left: 0,
  },
  front: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    backgroundColor: '#f8f8f8',
    borderRadius: 1,
  },
  coverText: {
    fontFamily: 'CormorantGaramond-LightItalic',
    fontSize: 16,
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 24,
  },
  tapWord: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(145,4,12,0.35)',
  },
});
