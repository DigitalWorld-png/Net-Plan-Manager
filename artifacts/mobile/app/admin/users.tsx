import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User, useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function UserRow({ user, plan, onToggleAdmin, onDelete }: { user: User; plan: string | null; onToggleAdmin: () => void; onDelete: () => void }) {
  const colors = useColors();
  const initials = user.name.split(" ").map(w => w[0]).slice(0, 2).join("");

  return (
    <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.userHeader}>
        <View style={[styles.avatar, { backgroundColor: colors.primary + "22" }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
            {user.isAdmin && (
              <View style={[styles.adminBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            )}
          </View>
          <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>{user.email}</Text>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="wifi-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{plan ?? "Sin plan"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="receipt-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{user.payments.length} pagos</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={14} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{user.phone || "N/A"}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "44" }]}
          onPress={onToggleAdmin}
        >
          <Ionicons name="shield-outline" size={15} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>{user.isAdmin ? "Quitar admin" : "Hacer admin"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.destructive + "18", borderColor: colors.destructive + "44" }]}
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={15} color={colors.destructive} />
          <Text style={[styles.actionText, { color: colors.destructive }]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function UsersAdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { users, plans, updateUsers, user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const isWeb = Platform.OS === "web";

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  function getPlanName(planId: string | null) {
    if (!planId) return null;
    return plans.find(p => p.id === planId)?.name ?? null;
  }

  function handleToggleAdmin(target: User) {
    if (target.id === currentUser?.id) {
      Alert.alert("Error", "No puedes cambiar tu propio rol de administrador.");
      return;
    }
    Alert.alert(
      target.isAdmin ? "Quitar administrador" : "Hacer administrador",
      `¿Confirmas cambiar el rol de ${target.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            updateUsers(users.map(u => u.id === target.id ? { ...u, isAdmin: !u.isAdmin } : u));
          },
        },
      ]
    );
  }

  function handleDelete(target: User) {
    if (target.id === currentUser?.id) {
      Alert.alert("Error", "No puedes eliminar tu propia cuenta.");
      return;
    }
    Alert.alert("Eliminar usuario", `¿Estás seguro de eliminar a ${target.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          updateUsers(users.filter(u => u.id !== target.id));
        },
      },
    ]);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (isWeb ? 67 : 0) + 12, paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.foreground }]}>Usuarios</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{users.length} usuarios registrados</Text>

        <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Buscar por nombre o correo..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {filtered.map(u => (
          <UserRow
            key={u.id}
            user={u}
            plan={getPlanName(u.activePlanId)}
            onToggleAdmin={() => handleToggleAdmin(u)}
            onDelete={() => handleDelete(u)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 13, marginBottom: 16, marginTop: 2 },
  searchWrap: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 48, gap: 10, marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 15 },
  userCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  userHeader: { flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 17, fontWeight: "700" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  userName: { fontSize: 15, fontWeight: "700" },
  adminBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  adminBadgeText: { color: "#0A0F1E", fontSize: 10, fontWeight: "700" },
  userEmail: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginBottom: 12 },
  infoRow: { flexDirection: "row", gap: 16, marginBottom: 12, flexWrap: "wrap" },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  infoText: { fontSize: 12 },
  actions: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, paddingVertical: 8, gap: 6 },
  actionText: { fontSize: 12, fontWeight: "600" },
});
