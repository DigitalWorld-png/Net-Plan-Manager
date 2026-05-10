import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const PAYMENT_METHODS = [
  { id: "card", label: "Tarjeta", icon: "card-outline", color: "#00C6FF" },
  { id: "mercadopago", label: "Mercado Pago", icon: "wallet-outline", color: "#00BCFF" },
  { id: "transfer", label: "Transferencia", icon: "swap-horizontal-outline", color: "#7B5EA7" },
];

export default function PaymentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { plans, user, subscribeToPlan, addPayment } = useAuth();
  const isWeb = Platform.OS === "web";

  const plan = planId ? plans.find(p => p.id === planId) : null;
  const activePlan = plans.find(p => p.id === user?.activePlanId);

  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);

  const amount = plan?.price ?? activePlan?.price ?? 0;
  const planName = plan?.name ?? activePlan?.name ?? "Plan actual";

  function formatCardNumber(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  async function handlePay() {
    if (method === "card") {
      const rawNumber = card.number.replace(/\s/g, "");
      if (rawNumber.length < 16 || !card.name || card.expiry.length < 5 || card.cvv.length < 3) {
        Alert.alert("Error", "Por favor completa los datos de la tarjeta.");
        return;
      }
    }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);

    if (plan) {
      await subscribeToPlan(plan.id, PAYMENT_METHODS.find(m => m.id === method)?.label ?? method);
    } else if (activePlan) {
      await addPayment({
        date: new Date().toISOString(),
        amount,
        plan: planName,
        status: "paid",
        method: PAYMENT_METHODS.find(m => m.id === method)?.label ?? method,
      });
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Pago exitoso", `Tu pago de $${amount.toFixed(2)} ha sido procesado correctamente.`, [
      { text: "Ver historial", onPress: () => { router.dismiss(); router.push("/history"); } },
      { text: "Inicio", onPress: () => { router.dismiss(); router.push("/(main)/home"); } },
    ]);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (isWeb ? 67 : 0) + 12, paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 100, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.foreground }]}>Realizar pago</Text>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Resumen del pago</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryItem, { color: colors.foreground }]}>{planName}</Text>
            <Text style={[styles.summaryPrice, { color: colors.primary }]}>${amount.toFixed(2)}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
            <Text style={[styles.totalPrice, { color: colors.foreground }]}>${amount.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Método de pago</Text>
        <View style={styles.methodRow}>
          {PAYMENT_METHODS.map(m => (
            <TouchableOpacity
              key={m.id}
              style={[styles.methodBtn, { backgroundColor: method === m.id ? m.color + "22" : colors.card, borderColor: method === m.id ? m.color : colors.border }]}
              onPress={() => setMethod(m.id)}
            >
              <Ionicons name={m.icon as any} size={22} color={method === m.id ? m.color : colors.mutedForeground} />
              <Text style={[styles.methodLabel, { color: method === m.id ? colors.foreground : colors.mutedForeground }]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {method === "card" && (
          <View style={[styles.cardForm, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardFormTitle, { color: colors.foreground }]}>Datos de la tarjeta</Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Número de tarjeta</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Ionicons name="card-outline" size={17} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={colors.mutedForeground}
                  value={card.number}
                  onChangeText={v => setCard(c => ({ ...c, number: formatCardNumber(v) }))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Nombre en la tarjeta</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Ionicons name="person-outline" size={17} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="JUAN PEREZ"
                  placeholderTextColor={colors.mutedForeground}
                  value={card.name}
                  onChangeText={v => setCard(c => ({ ...c, name: v.toUpperCase() }))}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.rowFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>Vencimiento</Text>
                <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder="MM/AA"
                    placeholderTextColor={colors.mutedForeground}
                    value={card.expiry}
                    onChangeText={v => setCard(c => ({ ...c, expiry: formatExpiry(v) }))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>CVV</Text>
                <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder="123"
                    placeholderTextColor={colors.mutedForeground}
                    value={card.cvv}
                    onChangeText={v => setCard(c => ({ ...c, cvv: v.replace(/\D/g, "").slice(0, 4) }))}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={4}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {method === "mercadopago" && (
          <View style={[styles.mpCard, { backgroundColor: "#00BCFF18", borderColor: "#00BCFF44" }]}>
            <Ionicons name="wallet" size={40} color="#00BCFF" />
            <Text style={[styles.mpTitle, { color: colors.foreground }]}>Mercado Pago</Text>
            <Text style={[styles.mpSub, { color: colors.mutedForeground }]}>Serás redirigido a Mercado Pago para completar el pago de forma segura.</Text>
          </View>
        )}

        {method === "transfer" && (
          <View style={[styles.mpCard, { backgroundColor: colors.accent + "18", borderColor: colors.accent + "44" }]}>
            <Ionicons name="swap-horizontal" size={40} color={colors.accent} />
            <Text style={[styles.mpTitle, { color: colors.foreground }]}>Transferencia bancaria</Text>
            <Text style={[styles.mpSub, { color: colors.mutedForeground }]}>Banco: NetPlus Bank{"\n"}Cuenta: 0012-3456-7890{"\n"}CLABE: 012 345 678 901 234 5{"\n"}Referencia: Tu número de cliente</Text>
          </View>
        )}

        <View style={[styles.secureNote, { backgroundColor: colors.success + "18" }]}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.success} />
          <Text style={[styles.secureText, { color: colors.mutedForeground }]}>Pago encriptado con SSL 256-bit. Tus datos están protegidos.</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 8 }]}>
        <TouchableOpacity
          style={[styles.payBtn, { backgroundColor: colors.primary, opacity: processing ? 0.7 : 1 }]}
          onPress={handlePay}
          disabled={processing}
          activeOpacity={0.85}
        >
          {processing ? (
            <><ActivityIndicator color={colors.primaryForeground} /><Text style={[styles.payBtnText, { color: colors.primaryForeground }]}>Procesando...</Text></>
          ) : (
            <><Ionicons name="lock-closed" size={18} color={colors.primaryForeground} /><Text style={[styles.payBtnText, { color: colors.primaryForeground }]}>Pagar ${amount.toFixed(2)}</Text></>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 20 },
  summaryCard: { borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 24 },
  summaryLabel: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryItem: { fontSize: 14 },
  summaryPrice: { fontSize: 14, fontWeight: "700" },
  divider: { height: 1, marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalPrice: { fontSize: 22, fontWeight: "800" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  methodRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  methodBtn: { flex: 1, borderRadius: 14, borderWidth: 1.5, alignItems: "center", paddingVertical: 14, gap: 6 },
  methodLabel: { fontSize: 11, fontWeight: "600" },
  cardForm: { borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 16 },
  cardFormTitle: { fontSize: 16, fontWeight: "700", marginBottom: 14 },
  fieldGroup: { marginBottom: 14, gap: 6 },
  label: { fontSize: 12, fontWeight: "600" },
  inputWrap: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 50, gap: 10 },
  input: { flex: 1, fontSize: 15 },
  rowFields: { flexDirection: "row", gap: 12 },
  mpCard: { borderRadius: 18, borderWidth: 1, padding: 24, alignItems: "center", gap: 10, marginBottom: 16 },
  mpTitle: { fontSize: 18, fontWeight: "700" },
  mpSub: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  secureNote: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, padding: 12 },
  secureText: { flex: 1, fontSize: 12 },
  footer: { padding: 20, paddingTop: 16, borderTopWidth: 1 },
  payBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16, height: 56, gap: 10 },
  payBtnText: { fontSize: 17, fontWeight: "700" },
});
