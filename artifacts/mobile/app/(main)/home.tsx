import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PromoCard } from "@/components/PromoCard";
import { PlanCard } from "@/components/PlanCard";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const PROMOS = [
  { title: "Primer mes 50% OFF", subtitle: "Al contratar cualquier plan nuevo. Válido hasta fin de mes.", badge: "OFERTA", icon: "flash", color: "#FFB800" },
  { title: "Refiere y gana", subtitle: "Trae un amigo y obtén 30 días gratis en tu plan actual.", badge: "REFERIDOS", icon: "gift", color: "#7B5EA7" },
  { title: "Plan Business sin instalación", subtitle: "Contrata el plan empresarial y ahorra $99 en instalación.", badge: "EMPRESA", icon: "briefcase", color: "#00D97E" },
];

const QUICK_ACTIONS = [
  { label: "Pagar", icon: "card-outline", color: "#00C6FF", route: "/payment" },
  { label: "Historial", icon: "receipt-outline", color: "#7B5EA7", route: "/history" },
  { label: "Soporte", icon: "headset-outline", color: "#00D97E", route: "/(main)/support" },
  { label: "Notif.", icon: "notifications-outline", color: "#FFB800", route: "/notifications" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, getActivePlan, plans } = useAuth();
  const activePlan = getActivePlan();
  const isWeb = Platform.OS === "web";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (isWeb ? 67 : 0) + 12, paddingBottom: 100, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>{greeting()},</Text>
            <Text style={[styles.userName, { color: colors.foreground }]}>{user?.name?.split(" ")[0] ?? "Usuario"}</Text>
          </View>
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
            <View style={[styles.notifDot, { backgroundColor: colors.primary }]} />
          </TouchableOpacity>
        </View>

        {activePlan ? (
          <View style={[styles.activePlanCard, { backgroundColor: activePlan.color + "18", borderColor: activePlan.color + "44" }]}>
            <View style={styles.activePlanHeader}>
              <View style={[styles.activeBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.activeBadgeText}>ACTIVO</Text>
              </View>
              <Ionicons name="wifi" size={24} color={activePlan.color} />
            </View>
            <Text style={[styles.activePlanName, { color: colors.foreground }]}>{activePlan.name}</Text>
            <Text style={[styles.activePlanSpeed, { color: activePlan.color }]}>{activePlan.speed}</Text>
            <View style={styles.activePlanFooter}>
              <Text style={[styles.activePlanPrice, { color: colors.mutedForeground }]}>
                ${activePlan.price.toFixed(2)}/mes
              </Text>
              <TouchableOpacity
                style={[styles.manageBtn, { backgroundColor: activePlan.color }]}
                onPress={() => router.push(`/plan/${activePlan.id}`)}
              >
                <Text style={styles.manageBtnText}>Gestionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.noPlanCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push("/(main)/plans")}
          >
            <Ionicons name="wifi-outline" size={36} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.noPlanTitle, { color: colors.foreground }]}>Sin plan activo</Text>
              <Text style={[styles.noPlanSub, { color: colors.mutedForeground }]}>Elige tu plan de internet ideal</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}

        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map(a => (
            <TouchableOpacity
              key={a.label}
              style={[styles.quickBtn, { backgroundColor: a.color + "18", borderColor: a.color + "33" }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(a.route as any);
              }}
            >
              <Ionicons name={a.icon as any} size={24} color={a.color} />
              <Text style={[styles.quickLabel, { color: colors.foreground }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Promociones</Text>
        {PROMOS.map((p, i) => <PromoCard key={i} {...p} />)}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Nuestros planes</Text>
        {plans.slice(0, 2).map(plan => (
          <PlanCard key={plan.id} plan={plan} isActive={plan.id === user?.activePlanId} compact />
        ))}
        <TouchableOpacity
          style={[styles.viewAllBtn, { borderColor: colors.primary }]}
          onPress={() => router.push("/(main)/plans")}
        >
          <Text style={[styles.viewAllText, { color: colors.primary }]}>Ver todos los planes</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  greeting: { fontSize: 14 },
  userName: { fontSize: 24, fontWeight: "800" },
  notifBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  notifDot: { width: 8, height: 8, borderRadius: 4, position: "absolute", top: 8, right: 8 },
  activePlanCard: { borderRadius: 20, borderWidth: 1.5, padding: 20, marginBottom: 20 },
  activePlanHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  activeBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  activeBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  activePlanName: { fontSize: 22, fontWeight: "800" },
  activePlanSpeed: { fontSize: 16, fontWeight: "700", marginTop: 2 },
  activePlanFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  activePlanPrice: { fontSize: 14 },
  manageBtn: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  manageBtnText: { color: "#0A0F1E", fontWeight: "700", fontSize: 13 },
  noPlanCard: { borderRadius: 20, borderWidth: 1.5, padding: 20, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
  noPlanTitle: { fontSize: 16, fontWeight: "700" },
  noPlanSub: { fontSize: 13, marginTop: 2 },
  quickActions: { flexDirection: "row", gap: 10, marginBottom: 24, justifyContent: "space-between" },
  quickBtn: { flex: 1, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingVertical: 14, gap: 6 },
  quickLabel: { fontSize: 11, fontWeight: "600" },
  sectionTitle: { fontSize: 20, fontWeight: "800", marginBottom: 14 },
  viewAllBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1.5, paddingVertical: 14, gap: 8, marginTop: 4 },
  viewAllText: { fontSize: 15, fontWeight: "700" },
});
