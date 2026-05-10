import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, plans } = useAuth();
  const isWeb = Platform.OS === "web";

  const plan = plans.find(p => p.id === id);
  if (!plan) return null;

  const isActive = user?.activePlanId === plan.id;

  function handleSubscribe() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: "/payment", params: { planId: plan!.id } });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (isWeb ? 67 : 0) + 12, paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 100, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <View style={[styles.heroCard, { backgroundColor: plan.color + "18", borderColor: plan.color + "55" }]}>
          {plan.popular && (
            <View style={[styles.badge, { backgroundColor: plan.color }]}>
              <Text style={styles.badgeText}>MÁS POPULAR</Text>
            </View>
          )}
          {isActive && (
            <View style={[styles.badge, { backgroundColor: colors.success }]}>
              <Text style={styles.badgeText}>TU PLAN ACTUAL</Text>
            </View>
          )}
          <View style={[styles.heroIcon, { backgroundColor: plan.color + "33" }]}>
            <Ionicons name="wifi" size={48} color={plan.color} />
          </View>
          <Text style={[styles.planName, { color: colors.foreground }]}>{plan.name}</Text>
          <Text style={[styles.planSpeed, { color: plan.color }]}>{plan.speed}</Text>
          <Text style={[styles.planDescription, { color: colors.mutedForeground }]}>{plan.description}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceCurrency, { color: colors.mutedForeground }]}>$</Text>
            <Text style={[styles.priceAmount, { color: colors.foreground }]}>{plan.price.toFixed(2)}</Text>
            <Text style={[styles.pricePeriod, { color: colors.mutedForeground }]}>/mes</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Lo que incluye</Text>
        <View style={[styles.benefitsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {plan.benefits.map((b, i) => (
            <View key={i} style={[styles.benefitRow, i < plan.benefits.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={[styles.checkCircle, { backgroundColor: colors.success + "22" }]}>
                <Ionicons name="checkmark" size={14} color={colors.success} />
              </View>
              <Text style={[styles.benefitText, { color: colors.foreground }]}>{b}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Métodos de pago</Text>
        <View style={styles.paymentMethods}>
          {[
            { label: "Tarjeta de crédito/débito", icon: "card-outline", color: "#00C6FF" },
            { label: "Mercado Pago", icon: "wallet-outline", color: "#00BCFF" },
            { label: "Transferencia bancaria", icon: "swap-horizontal-outline", color: "#7B5EA7" },
          ].map((m, i) => (
            <View key={i} style={[styles.paymentMethod, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name={m.icon as any} size={20} color={m.color} />
              <Text style={[styles.paymentMethodText, { color: colors.foreground }]}>{m.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 8 }]}>
        <View>
          <Text style={[styles.footerPrice, { color: colors.foreground }]}>${plan.price.toFixed(2)}<Text style={[styles.footerPeriod, { color: colors.mutedForeground }]}>/mes</Text></Text>
          <Text style={[styles.footerNote, { color: colors.mutedForeground }]}>Sin contratos forzosos</Text>
        </View>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: plan.color }]}
          onPress={isActive ? () => Alert.alert("Plan activo", "Este es tu plan actual.") : handleSubscribe}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>{isActive ? "Plan activo" : "Contratar ahora"}</Text>
          {!isActive && <Ionicons name="arrow-forward" size={18} color="#0A0F1E" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { marginBottom: 16, width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  heroCard: { borderRadius: 24, borderWidth: 1.5, padding: 24, alignItems: "center", marginBottom: 24, gap: 8 },
  badge: { position: "absolute", top: 16, right: 16, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  heroIcon: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  planName: { fontSize: 28, fontWeight: "800" },
  planSpeed: { fontSize: 20, fontWeight: "700" },
  planDescription: { fontSize: 14, textAlign: "center", lineHeight: 20, maxWidth: 280 },
  priceRow: { flexDirection: "row", alignItems: "flex-end", marginTop: 8 },
  priceCurrency: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  priceAmount: { fontSize: 48, fontWeight: "900", lineHeight: 52 },
  pricePeriod: { fontSize: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  benefitsCard: { borderRadius: 18, borderWidth: 1, overflow: "hidden", marginBottom: 24 },
  benefitRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  checkCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  benefitText: { fontSize: 14, flex: 1 },
  paymentMethods: { gap: 10, marginBottom: 24 },
  paymentMethod: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, padding: 14 },
  paymentMethodText: { fontSize: 14 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingTop: 16, borderTopWidth: 1 },
  footerPrice: { fontSize: 22, fontWeight: "800" },
  footerPeriod: { fontSize: 14, fontWeight: "400" },
  footerNote: { fontSize: 12, marginTop: 2 },
  ctaBtn: { flexDirection: "row", alignItems: "center", borderRadius: 14, paddingHorizontal: 22, paddingVertical: 14, gap: 6 },
  ctaBtnText: { color: "#0A0F1E", fontWeight: "700", fontSize: 15 },
});
