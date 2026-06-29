import { Text, View } from 'react-native';
import { useLanguage } from '../../i18n';
import { useHistoryStyles } from './useHistoryStyles';

const CHART_H = 72;
const fmtPace = (p) => `${Math.floor(p / 60)}'${String(p % 60).padStart(2, '0')}"`;

export default function PaceChart({ runs }) {
  const { styles, colors } = useHistoryStyles();
  const { t } = useLanguage();

  const paceRuns = [...runs].filter(r => r.pace > 0 && r.distance > 0).reverse().slice(0, 15);
  if (paceRuns.length < 2) return null;

  const paces = paceRuns.map(r => r.pace);
  const fastest = Math.min(...paces);
  const slowest = Math.max(...paces);
  const range = slowest - fastest || 1;
  const improving = paceRuns[paceRuns.length - 1].pace < paceRuns[0].pace;

  return (
    <View style={styles.section}>
      <View style={styles.chartHeader}>
        <Text style={styles.sectionLabel}>{t('history.paceTitle')}</Text>
        {improving && <Text style={styles.chartImproving}>{t('history.paceImproving')}</Text>}
      </View>
      <View style={styles.chartCard}>
        <View style={{ height: CHART_H, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
          {paceRuns.map((run, i) => {
            const isLast = i === paceRuns.length - 1;
            const barH = Math.max(6, ((slowest - run.pace) / range) * CHART_H);
            const opacity = Math.round((0.25 + (i / (paceRuns.length - 1)) * 0.75) * 255).toString(16).padStart(2, '0');
            return (
              <View key={run.id} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: CHART_H }}>
                {isLast && <Text style={styles.chartBarLabel}>{fmtPace(run.pace)}</Text>}
                <View style={[styles.chartBar, {
                  height: barH,
                  backgroundColor: isLast ? colors.primary : colors.primary + opacity,
                }]} />
              </View>
            );
          })}
        </View>
        <View style={styles.chartFooter}>
          <Text style={styles.chartFooterText}>{paceRuns.length} {t('history.sessions')}</Text>
          <Text style={styles.chartBest}>{t('history.paceBest')} {fmtPace(fastest)}/km</Text>
        </View>
      </View>
    </View>
  );
}
