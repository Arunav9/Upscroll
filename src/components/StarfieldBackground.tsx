import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const STAR_COUNT = 70;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Star({ top, left, size }: { top: number; left: number; size: number }) {
  const opacity = useRef(new Animated.Value(random(0.2, 0.6))).current;

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const twinkle = () => {
      if (!mounted) return;
      const duration = random(1400, 3200);
      Animated.sequence([
        Animated.timing(opacity, { toValue: random(0.7, 1), duration, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: random(0.15, 0.4), duration, useNativeDriver: true }),
      ]).start(() => twinkle());
    };

    timeoutId = setTimeout(twinkle, random(0, 2000));
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          top: `${top}%`,
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
        },
      ]}
    />
  );
}

function ShootingStar() {
  const translate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [origin, setOrigin] = useState(() => ({ top: random(6, 30), left: random(4, 50) }));

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const fire = () => {
      if (!mounted) return;
      setOrigin({ top: random(6, 30), left: random(4, 50) });
      translate.setValue({ x: 0, y: 0 });
      opacity.setValue(0);

      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(translate, { toValue: { x: 110, y: 70 }, duration: 650, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 650, useNativeDriver: true }),
        ]),
      ]).start(() => {
        timeoutId = setTimeout(fire, random(3500, 8000));
      });
    };

    timeoutId = setTimeout(fire, random(1500, 4000));
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [translate, opacity]);

  return (
    <Animated.View
      style={[
        styles.shootingStarWrap,
        {
          top: `${origin.top}%`,
          left: `${origin.left}%`,
          opacity,
          transform: [{ translateX: translate.x }, { translateY: translate.y }, { rotate: '32deg' }],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0)', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.shootingStar}
      />
    </Animated.View>
  );
}

export default function StarfieldBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, () => ({
        top: random(0, 100),
        left: random(0, 100),
        size: random(1, 2.6),
      })),
    []
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((s, i) => (
        <Star key={i} top={s.top} left={s.left} size={s.size} />
      ))}
      <ShootingStar />
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  shootingStarWrap: {
    position: 'absolute',
    width: 60,
    height: 2,
  },
  shootingStar: {
    flex: 1,
    borderRadius: 2,
  },
});
