import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRAINING_PLANS } from '../../data/trainingPlans';
import { useLanguage } from '../../i18n';
import { DIFFICULTY_COLOR, spacing } from '../../theme';
import { usePlanStyles } from './usePlanStyles';

export default function BrowsePlansView({ onSelectPlan, onFinderPress }) {
  const { styles, colors } = usePlanStyles();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.browseContent} showsVerticalScrollIndicator={false}>
        <View style={styles.browseHero}>
          <Text style={styles.browseHeroEmoji}>🏃</Text>
          <Text style={styles.browseHeroTitle}>{t('plans.browse.heroTitle')}</Text>
          <Text style={styles.browseHeroSub}>{t('plans.browse.heroSub')}</Text>
        </View>

        <TouchableOpacity style={styles.finderBanner} onPress={onFinderPress} activeOpacity={0.75}>
          <Ionicons name="sparkles-outline" size={22} color={colors.primary} />
          <View style={styles.finderBannerBody}>
            <Text style={styles.finderBannerTitle}>{t('plans.browse.finderCta')}</Text>
            <Text style={styles.finderBannerSub}>{t('plans.browse.finderSub')}</Text>
            <Text style={styles.finderBannerBtn}>{t('plans.browse.finderBtn')}</Text>
          </View>
        </TouchableOpacity>

        {TRAINING_PLANS.map((plan, planIndex) => {
          const diffColor = DIFFICULTY_COLOR[plan.difficulty] || colors.primary;
          return (
            <View key={plan.id} style={styles.browseCard}>
              <View style={[styles.browseColorBar, { backgroundColor: plan.color }]} />
              <View style={styles.browseCardBody}>
                <View style={styles.browseCardTop}>
                  <Text style={styles.browseName}>{t('plans.name.' + plan.id)}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                    {planIndex === 0 && (
                      <View style={styles.recommendedPill}>
                        <Text style={styles.recommendedText}>{t('plans.browse.popular')}</Text>
                      </View>
                    )}
                    <View style={[styles.diffPill, { backgroundColor: diffColor + '20' }]}>
                      <Text style={[styles.diffText, { color: diffColor }]}>{t('plans.browse.difficulty.' + plan.difficulty)}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.browseDesc}>{t('plans.planDesc.' + plan.id)}</Text>

                <View style={styles.browseMeta}>
                  <View style={styles.browseMetaItem}>
                    <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.browseMetaText}>{t('plans.browse.weeks', { n: plan.weeks })}</Text>
                  </View>
                  <Text style={styles.browseMetaDot}>·</Text>
                  <View style={styles.browseMetaItem}>
                    <Ionicons name="trophy-outline" size={13} color={colors.textSecondary} />
                    <Text style={styles.browseMetaText}>{plan.goal}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.startBtn, { backgroundColor: plan.color }]}
                  onPress={() => onSelectPlan(plan)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.startBtnText}>{t('plans.startPlan')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
