import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function AccountScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, getActivePlan } = useAuth();
  const activePlan = getActivePlan();
  const isWeb = Platform.OS === "web";

  function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  const sections = [
    {
      title: "Mi cuenta",
      items: [
        { icon: "person-outline", label: "Información personal", sub: user?.name, onPress: () => {} },
        { icon: "mail-outline", label: "Correo electrónico", sub: user?.email, onPress: () => {} },
        { icon: "call-outline", label: "Teléfono", sub: user?.phone || "No registrado", onPress: () => {} },
        { icon: "location-outline", label: "Dirección", sub: user?.address || "No registrada", onPress: () => {} },
      ],
    },
    {
      title: "Mi servicio",
      items: [
        { icon: "wifi-outline", label: "Plan activo", sub: activePlan ? `${activePlan.name} · ${activePlan.speed}` : "Sin plan", onPress: () => router.push("/(main)/plans"), color: activePlan ? colors.success : colors.mutedForeground },
        { icon: "receipt-outline", label: "Historial de pagos", sub: `${user?.payments.length ?? 0} pagos registrados`, onPress: () => router.push("/history") },
        { icon: "notifications-outline", label: "Notificaciones", sub: "Pagos, vencimientos y más", onPress: () => router.push("/notifications") },
      ],
    },
    ...(user?.isAdmin ? [{
      title: "Administración",
      items: [
        { icon: "shield-outline", label: "Panel de administración", sub: "Gestiona usuarios y planes", onPress: () => router.push("/admin/index"), color: colors.primary },
      ],
    }] : []),
    {
      title: "Soporte",
      items: [
        { icon: "help-circle-outline", label: "Ayuda y FAQ", sub: "Resuelve tus dudas", onPress: () => router.push("/(main)/support") },
      ],
    },
  ];

  const initials = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("") ?? "U";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (isWeb ? 67 : 0) + 12, paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + "22", borderColor: colors.primary + "55" }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{initials}</Text>
          </View>
          <View>
            <Text style={[styles.profileName, { color: colors.foreground }]}>{user?.name}</Text>
            <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>{user?.email}</Text>
            {user?.isAdmin && (
              <View style={[styles.adminBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="shield-checkmark" size={11} color={colors.primaryForeground} />
                <Text style={[styles.adminBadgeText, { color: colors.primaryForeground }]}>Administrador</Text>
              </View>
            )}
          </View>
        </View>

        {sections.map((section, si) => (
          <View key={si} style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{section.title}</Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[styles.row, ii < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.rowIcon, { backgroundColor: (item.color ?? colors.primary) + "18" }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.color ?? colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowLabel, { color: colors.foreground }]}>{item.label}</Text>
                    {item.sub && <Text style={[styles.rowSub, { color: colors.mutedForeground }]} numberOfLines={1}>{item.sub}</Text>}
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: colors.destructive + "18", borderColor: colors.destructive + "44" }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
            <Text style={[styles.logoutText, { color: colors.destructive }]}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  profileHeader: { flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 20, marginBottom: 28 },
  avatar: { width: 70, height: 70, borderRadius: 35, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  avatarText: { fontSize: 26, fontWeight: "800" },
  profileName: { fontSize: 20, fontWeight: "700" },
  profileEmail: { fontSize: 13, marginTop: 2 },
  adminBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 6 },
  adminBadgeText: { fontSize: 10, fontWeight: "700" },
  sectionTitle: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rowLabel: { fontSize: 14, fontWeight: "600" },
  rowSub: { fontSize: 12, marginTop: 2 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16, borderWidth: 1, paddingVertical: 15, gap: 8 },
  logoutText: { fontSize: 16, fontWeight: "700" },
});
