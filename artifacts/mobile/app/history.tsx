import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Payment, useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function PaymentItem({ payment }: { payment: Payment }) {
  const colors = useColors();
  const statusColor = payment.status === "paid" ? colors.success : payment.status === "pending" ? colors.warning : colors.destructive;
  const statusLabel = payment.status === "paid" ? "Pagado" : payment.status === "pending" ? "Pendiente" : "Vencido";

  return (
    <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.itemIcon, { backgroundColor: statusColor + "22" }]}>
        <Ionicons name={payment.status === "paid" ? "checkmark-circle" : "time"} size={22} color={statusColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemPlan, { color: colors.foreground }]}>{payment.plan}</Text>
        <Text style={[styles.itemDate, { color: colors.mutedForeground }]}>
          {new Date(payment.date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
        </Text>
        <Text style={[styles.itemMethod, { color: colors.mutedForeground }]}>{payment.method}</Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 6 }}>
        <Text style={[styles.itemAmount, { color: colors.foreground }]}>${payment.amount.toFixed(2)}</Text>
        <View style={[styles.statusChip, { backgroundColor: statusColor + "22" }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
        <Text style={[styles.invoiceNum, { color: colors.mutedForeground }]}>{payment.invoiceNumber}</Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const payments = user?.payments ?? [];
  const isWeb = Platform.OS === "web";

  const total = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (isWeb ? 67 : 0) + 12, paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.foreground }]}>Historial de pagos</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{payments.length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total pagos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.success }]}>${total.toFixed(0)}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total pagado</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{payments.filter(p => p.status === "paid").length}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Completados</Text>
          </View>
        </View>

        {payments.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Sin pagos registrados</Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>Tus pagos aparecerán aquí cuando contrates un plan</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Facturas</Text>
            {payments.map(p => <PaymentItem key={p.id} payment={p} />)}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 20 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: "center", gap: 4 },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 11, textAlign: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 14 },
  item: { borderRadius: 16, borderWidth: 1, padding: 16, flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  itemIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  itemPlan: { fontSize: 14, fontWeight: "700" },
  itemDate: { fontSize: 12, marginTop: 2 },
  itemMethod: { fontSize: 12, marginTop: 2 },
  itemAmount: { fontSize: 16, fontWeight: "700" },
  statusChip: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: "700" },
  invoiceNum: { fontSize: 10 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptySub: { fontSize: 14, textAlign: "center", maxWidth: 260 },
});
