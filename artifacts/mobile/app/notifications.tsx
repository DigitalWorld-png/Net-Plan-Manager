import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const NOTIFICATIONS = [
  { id: "1", title: "Pago procesado exitosamente", body: "Tu pago de $49.99 ha sido confirmado.", icon: "checkmark-circle", color: "#00D97E", time: "Ahora", read: false },
  { id: "2", title: "Vencimiento próximo", body: "Tu factura vence en 5 días. Evita interrupciones pagando hoy.", icon: "time", color: "#FFB800", time: "Hace 2 horas", read: false },
  { id: "3", title: "Promoción especial", body: "50% de descuento en tu primer mes al actualizar tu plan.", icon: "flash", color: "#00C6FF", time: "Ayer", read: true },
  { id: "4", title: "Mantenimiento programado", body: "El domingo 18 de mayo realizaremos mantenimiento de 2-4 AM. Posibles interrupciones.", icon: "construct", color: "#7B5EA7", time: "2 días", read: true },
  { id: "5", title: "Velocidad mejorada", body: "Hemos actualizado tu plan: ahora disfrutas de mayor velocidad sin costo adicional.", icon: "rocket", color: "#00D97E", time: "1 semana", read: true },
];

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const isWeb = Platform.OS === "web";

  const unread = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(n => n.map(i => ({ ...i, read: true })));
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

        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>Notificaciones</Text>
          {unread > 0 && (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={[styles.markRead, { color: colors.primary }]}>Marcar todas leídas</Text>
            </TouchableOpacity>
          )}
        </View>
        {unread > 0 && (
          <Text style={[styles.unreadBadge, { color: colors.mutedForeground }]}>{unread} sin leer</Text>
        )}

        {notifications.map(n => (
          <TouchableOpacity
            key={n.id}
            style={[styles.notifItem, { backgroundColor: n.read ? colors.card : n.color + "18", borderColor: n.read ? colors.border : n.color + "55" }]}
            onPress={() => setNotifications(prev => prev.map(i => i.id === n.id ? { ...i, read: true } : i))}
            activeOpacity={0.8}
          >
            <View style={[styles.notifIcon, { backgroundColor: n.color + "33" }]}>
              <Ionicons name={n.icon as any} size={22} color={n.color} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.notifHeader}>
                <Text style={[styles.notifTitle, { color: colors.foreground }]}>{n.title}</Text>
                {!n.read && <View style={[styles.dot, { backgroundColor: n.color }]} />}
              </View>
              <Text style={[styles.notifBody, { color: colors.mutedForeground }]}>{n.body}</Text>
              <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{n.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  title: { fontSize: 26, fontWeight: "800" },
  markRead: { fontSize: 13, fontWeight: "600" },
  unreadBadge: { fontSize: 13, marginBottom: 16 },
  notifItem: { borderRadius: 16, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  notifIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  notifHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  notifTitle: { fontSize: 14, fontWeight: "700", flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  notifBody: { fontSize: 13, marginTop: 3, lineHeight: 18 },
  notifTime: { fontSize: 11, marginTop: 6 },
});
