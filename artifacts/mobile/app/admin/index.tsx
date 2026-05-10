import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { users, plans } = useAuth();
  const isWeb = Platform.OS === "web";

  const activeUsers = users.filter(u => u.activePlanId).length;
  const totalRevenue = users.reduce((sum, u) => sum + u.payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0), 0);
  const totalPayments = users.reduce((sum, u) => sum + u.payments.length, 0);

  const stats = [
    { label: "Usuarios totales", value: users.length, icon: "people-outline", color: "#00C6FF" },
    { label: "Con plan activo", value: activeUsers, icon: "wifi-outline", color: "#00D97E" },
    { label: "Total pagos", value: totalPayments, icon: "receipt-outline", color: "#7B5EA7" },
    { label: "Ingresos totales", value: `$${totalRevenue.toFixed(0)}`, icon: "trending-up-outline", color: "#FFB800" },
  ];

  const planStats = plans.map(plan => ({
    ...plan,
    subscribers: users.filter(u => u.activePlanId === plan.id).length,
  }));

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (isWeb ? 67 : 0) + 12, paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Panel Admin</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Resumen general del sistema</Text>
          </View>
          <View style={[styles.adminBadge, { backgroundColor: colors.primary + "22", borderColor: colors.primary + "55" }]}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <Text style={[styles.adminBadgeText, { color: colors.primary }]}>Admin</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: s.color + "18", borderColor: s.color + "33" }]}>
              <View style={[styles.statIcon, { backgroundColor: s.color + "33" }]}>
                <Ionicons name={s.icon as any} size={20} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Planes por suscriptores</Text>
        <View style={[styles.plansCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {planStats.map((p, i) => (
            <View key={i} style={[styles.planRow, i < planStats.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={[styles.planDot, { backgroundColor: p.color }]} />
              <Text style={[styles.planRowName, { color: colors.foreground }]}>{p.name}</Text>
              <Text style={[styles.planRowSpeed, { color: colors.mutedForeground }]}>{p.speed}</Text>
              <View style={[styles.planSubscriberBadge, { backgroundColor: p.color + "22" }]}>
                <Text style={[styles.planSubscriberText, { color: p.color }]}>{p.subscribers} usuarios</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Gestión</Text>
        <View style={styles.mgmtGrid}>
          {[
            { label: "Gestionar usuarios", icon: "people-outline", color: "#00C6FF", route: "/admin/users" },
            { label: "Gestionar planes", icon: "wifi-outline", color: "#7B5EA7", route: "/admin/plans-admin" },
          ].map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.mgmtBtn, { backgroundColor: m.color + "18", borderColor: m.color + "44" }]}
              onPress={() => router.push(m.route as any)}
              activeOpacity={0.8}
            >
              <Ionicons name={m.icon as any} size={28} color={m.color} />
              <Text style={[styles.mgmtLabel, { color: colors.foreground }]}>{m.label}</Text>
              <Ionicons name="arrow-forward" size={16} color={m.color} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 13, marginTop: 2 },
  adminBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  adminBadgeText: { fontSize: 12, fontWeight: "700" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  statCard: { width: "47%", borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 24, fontWeight: "800" },
  statLabel: { fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 14 },
  plansCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", marginBottom: 24 },
  planRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 10 },
  planDot: { width: 10, height: 10, borderRadius: 5 },
  planRowName: { flex: 1, fontSize: 14, fontWeight: "600" },
  planRowSpeed: { fontSize: 13 },
  planSubscriberBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  planSubscriberText: { fontSize: 12, fontWeight: "700" },
  mgmtGrid: { gap: 12 },
  mgmtBtn: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 18, gap: 14 },
  mgmtLabel: { flex: 1, fontSize: 15, fontWeight: "600" },
});
