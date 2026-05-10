import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Plan } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

interface PlanCardProps {
  plan: Plan;
  isActive?: boolean;
  compact?: boolean;
}

export function PlanCard({ plan, isActive, compact }: PlanCardProps) {
  const colors = useColors();
  const router = useRouter();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handlePress() {
    scale.value = withSpring(0.97, {}, () => { scale.value = withSpring(1); });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/plan/${plan.id}`);
  }

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: isActive ? plan.color : colors.border }]}>
          {plan.popular && !compact && (
            <View style={[styles.badge, { backgroundColor: plan.color }]}>
              <Text style={styles.badgeText}>MÁS POPULAR</Text>
            </View>
          )}
          {isActive && (
            <View style={[styles.badge, { backgroundColor: colors.success }]}>
              <Text style={styles.badgeText}>ACTIVO</Text>
            </View>
          )}
          <View style={styles.header}>
            <View style={[styles.iconWrap, { backgroundColor: plan.color + "22" }]}>
              <Ionicons name="wifi" size={22} color={plan.color} />
            </View>
            <View style={styles.titleBlock}>
              <Text style={[styles.planName, { color: colors.foreground }]}>{plan.name}</Text>
              <Text style={[styles.speed, { color: plan.color }]}>{plan.speed}</Text>
            </View>
            <View style={styles.priceBlock}>
              <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>$/mes</Text>
              <Text style={[styles.price, { color: colors.foreground }]}>{plan.price.toFixed(2)}</Text>
            </View>
          </View>
          {!compact && (
            <>
              <Text style={[styles.description, { color: colors.mutedForeground }]}>{plan.description}</Text>
              <View style={styles.benefits}>
                {plan.benefits.slice(0, 3).map((b, i) => (
                  <View key={i} style={styles.benefitRow}>
                    <Ionicons name="checkmark-circle" size={15} color={colors.success} />
                    <Text style={[styles.benefitText, { color: colors.foreground }]}>{b}</Text>
                  </View>
                ))}
              </View>
              <View style={[styles.cta, { backgroundColor: plan.color }]}>
                <Text style={styles.ctaText}>{isActive ? "Ver detalles" : "Contratar"}</Text>
                <Ionicons name="arrow-forward" size={16} color="#0A0F1E" />
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1.5, padding: 18, marginBottom: 14, overflow: "hidden" },
  badge: { position: "absolute", top: 12, right: 12, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  titleBlock: { flex: 1 },
  planName: { fontSize: 17, fontWeight: "700" },
  speed: { fontSize: 13, fontWeight: "600", marginTop: 2 },
  priceBlock: { alignItems: "flex-end" },
  priceLabel: { fontSize: 11 },
  price: { fontSize: 22, fontWeight: "800" },
  description: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  benefits: { gap: 6, marginBottom: 16 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  benefitText: { fontSize: 13 },
  cta: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 12, paddingVertical: 12, gap: 6 },
  ctaText: { color: "#0A0F1E", fontWeight: "700", fontSize: 14 },
});
