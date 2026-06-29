import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Dimensions, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { spacing, radius, ONBOARDING_SLIDE_BG } from '../theme';
import { setOnboardingDone } from '../storage/settings';
import { useLanguage } from '../i18n';

const { width: W } = Dimensions.get('window');

const SLIDE_KEYS = [
  { key: 'welcome', emoji: '🏃', bg: ONBOARDING_SLIDE_BG[0] },
  { key: 'plan',    emoji: '📅', bg: ONBOARDING_SLIDE_BG[1] },
  { key: 'start',   emoji: '🏆', bg: ONBOARDING_SLIDE_BG[2] },
];

export default function OnboardingScreen({ onDone }) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const listRef = useRef(null);

  const goNext = async () => {
    if (current < SLIDE_KEYS.length - 1) {
      const next = current + 1;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrent(next);
    } else {
      await setOnboardingDone();
      onDone();
    }
  };

  const skip = async () => {
    await setOnboardingDone();
    onDone();
  };

  const slide = SLIDE_KEYS[current];
  const slides = t('onboarding.slides');

  return (
    <View style={[styles.root, { backgroundColor: slide.bg }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* Skip button */}
        {current < SLIDE_KEYS.length - 1 && (
          <TouchableOpacity style={styles.skipBtn} onPress={skip} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
          </TouchableOpacity>
        )}

        {/* Slides */}
        <FlatList
          ref={listRef}
          data={SLIDE_KEYS}
          keyExtractor={(s) => s.key}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.slide}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.title}>{slides[index]?.title || ''}</Text>
              <Text style={styles.body}>{slides[index]?.body || ''}</Text>
            </View>
          )}
          style={styles.list}
        />

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDE_KEYS.map((_, i) => (
            <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
          ))}
        </View>

        {/* CTA */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btn} onPress={goNext} activeOpacity={0.88}>
            <Text style={[styles.btnText, { color: slide.bg }]}>
              {current < SLIDE_KEYS.length - 1 ? t('onboarding.next') : t('onboarding.begin')}
            </Text>
            <Ionicons
              name={current < SLIDE_KEYS.length - 1 ? 'arrow-forward' : 'play'}
              size={18}
              color={slide.bg}
            />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  skipBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    marginRight: spacing.xs,
  },
  skipText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },

  list: { flex: 1 },
  slide: {
    width: W,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emoji: { fontSize: 80, marginBottom: spacing.md },
  title: {
    fontSize: 32, fontWeight: '800', color: '#fff',
    textAlign: 'center', lineHeight: 38,
  },
  body: {
    fontSize: 17, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', lineHeight: 26,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 24, backgroundColor: '#fff',
  },

  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  btn: {
    backgroundColor: '#fff',
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
  },
  btnText: { fontSize: 17, fontWeight: '800' },
});
