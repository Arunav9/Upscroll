import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';
import StarfieldBackground from './StarfieldBackground';
import Wordmark from './Wordmark';

const { height } = Dimensions.get('window');
const HOLD_DURATION = 3000;
const LAUNCH_DURATION = 450;

export default function AppSplash({ onLaunch }: { onLaunch: () => void }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Accelerating ease-in so the wordmark starts slow and rockets off
      // the top of the screen, then we cut straight to the next screen —
      // no fade, the launch itself is the transition.
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -height,
          duration: LAUNCH_DURATION,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: LAUNCH_DURATION,
          delay: LAUNCH_DURATION * 0.6,
          useNativeDriver: true,
        }),
      ]).start(onLaunch);
    }, HOLD_DURATION);

    return () => clearTimeout(timeoutId);
  }, [onLaunch, opacity, translateY]);

  return (
    <LinearGradient colors={colors.backgroundGradient} style={styles.container}>
      <StarfieldBackground />
      <View style={styles.center}>
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <Wordmark fontSize={44} />
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
