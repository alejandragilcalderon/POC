import { StyleSheet, Text, View } from "react-native";
import type { SolWeatherReading } from "@/modules/insight-weather/presentation/utils/extract-sol-readings";
import { AppColors } from "@/shared/ui/theme/colors";

type Props = { reading: SolWeatherReading };

function fmt1(n: number | undefined): string {
  if (n === undefined || Number.isNaN(n)) return "—";
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function fmtInt(n: number | undefined): string {
  if (n === undefined || Number.isNaN(n)) return "—";
  return String(Math.round(n));
}

function formatUtcRange(first?: string, last?: string): string | undefined {
  if (!first && !last) return undefined;
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  try {
    if (first && last) {
      const a = new Date(first);
      const b = new Date(last);
      if (!Number.isNaN(a.getTime()) && !Number.isNaN(b.getTime())) {
        return `${a.toLocaleString(undefined, opts)}  →  ${b.toLocaleString(undefined, opts)}`;
      }
    }
    const one = first ?? last;
    if (one) {
      const d = new Date(one);
      if (!Number.isNaN(d.getTime())) return d.toLocaleString(undefined, opts);
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function StatRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {value}
        {unit ? <Text style={styles.statUnit}> {unit}</Text> : null}
      </Text>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={styles.sectionTitle} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function SolWeatherCard({ reading }: Props) {
  const range = formatUtcRange(reading.firstUtc, reading.lastUtc);
  const hasSeason =
    reading.season || reading.northernSeason || reading.southernSeason;

  return (
    <View style={styles.card} accessibilityLabel={`Sol ${reading.sol} weather`}>
      <View style={styles.hero}>
        <Text style={styles.solLabel}>Sol {reading.sol}</Text>
        <Text style={styles.solHint}>Martian solar day · NASA InSight summary</Text>
      </View>

      {range ? <Text style={styles.range}>{range}</Text> : null}

      {hasSeason ? (
        <View style={styles.seasonBlock}>
          {reading.season ? (
            <Text style={styles.seasonMain}>Season: {reading.season}</Text>
          ) : null}
          {reading.northernSeason ? (
            <Text style={styles.seasonLine}>Northern hemisphere: {reading.northernSeason}</Text>
          ) : null}
          {reading.southernSeason ? (
            <Text style={styles.seasonLine}>Southern hemisphere: {reading.southernSeason}</Text>
          ) : null}
        </View>
      ) : null}

      {reading.tempC ? (
        <View style={styles.section}>
          <SectionTitle>Air temperature</SectionTitle>
          <Text style={styles.unitHint}>°C (average, low, high)</Text>
          <StatRow label="Average" value={fmt1(reading.tempC.avg)} unit="°C" />
          <StatRow label="Low" value={fmt1(reading.tempC.min)} unit="°C" />
          <StatRow label="High" value={fmt1(reading.tempC.max)} unit="°C" />
          {reading.tempC.samples !== undefined ? (
            <Text style={styles.samples}>{fmtInt(reading.tempC.samples)} samples</Text>
          ) : null}
        </View>
      ) : null}

      {reading.windMs ? (
        <View style={styles.section}>
          <SectionTitle>Wind</SectionTitle>
          <Text style={styles.unitHint}>Horizontal speed · m/s</Text>
          <StatRow label="Average" value={fmt1(reading.windMs.avg)} unit="m/s" />
          <StatRow label="Low" value={fmt1(reading.windMs.min)} unit="m/s" />
          <StatRow label="High" value={fmt1(reading.windMs.max)} unit="m/s" />
          {reading.windCompass ? (
            <View style={styles.directionRow}>
              <Text style={styles.directionLabel}>Prevailing direction</Text>
              <Text style={styles.directionValue}>{reading.windCompass}</Text>
            </View>
          ) : null}
          {reading.windMs.samples !== undefined ? (
            <Text style={styles.samples}>{fmtInt(reading.windMs.samples)} samples</Text>
          ) : null}
        </View>
      ) : null}

      {reading.pressurePa ? (
        <View style={[styles.section, styles.lastSection]}>
          <SectionTitle>Atmospheric pressure</SectionTitle>
          <Text style={styles.unitHint}>Pascals (Pa)</Text>
          <StatRow label="Average" value={fmt1(reading.pressurePa.avg)} unit="Pa" />
          <StatRow label="Low" value={fmt1(reading.pressurePa.min)} unit="Pa" />
          <StatRow label="High" value={fmt1(reading.pressurePa.max)} unit="Pa" />
          {reading.pressurePa.samples !== undefined ? (
            <Text style={styles.samples}>{fmtInt(reading.pressurePa.samples)} samples</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(141, 162, 255, 0.22)",
  },
  hero: { marginBottom: 10 },
  solLabel: {
    color: AppColors.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  solHint: {
    color: AppColors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  range: {
    color: AppColors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  seasonBlock: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(141, 162, 255, 0.2)",
  },
  seasonMain: {
    color: AppColors.accentSoft,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  seasonLine: {
    color: AppColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 2,
  },
  section: { marginTop: 4, marginBottom: 18 },
  lastSection: { marginBottom: 0 },
  sectionTitle: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  unitHint: {
    color: AppColors.textMuted,
    fontSize: 12,
    marginBottom: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  statLabel: { color: AppColors.textMuted, fontSize: 15 },
  statValue: { color: AppColors.textPrimary, fontSize: 16, fontWeight: "600" },
  statUnit: { color: AppColors.textMuted, fontWeight: "500", fontSize: 14 },
  samples: {
    color: AppColors.textMuted,
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
  directionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  directionLabel: { color: AppColors.textMuted, fontSize: 15 },
  directionValue: {
    color: AppColors.accentSoft,
    fontSize: 20,
    fontWeight: "800",
  },
});
