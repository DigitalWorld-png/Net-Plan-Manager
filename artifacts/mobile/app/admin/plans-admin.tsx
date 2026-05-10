import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plan, useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function PlanAdminCard({ plan, subscribers, onEdit, onDelete }: { plan: Plan; subscribers: number; onEdit: () => void; onDelete: () => void }) {
  const colors = useColors();
  return (
    <View style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.planHeader}>
        <View style={[styles.planIcon, { backgroundColor: plan.color + "22" }]}>
          <Ionicons name="wifi" size={20} color={plan.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.planName, { color: colors.foreground }]}>{plan.name}</Text>
          <Text style={[styles.planSpeed, { color: plan.color }]}>{plan.speed}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.planPrice, { color: colors.foreground }]}>${plan.price}/mes</Text>
          <View style={[styles.subBadge, { backgroundColor: plan.color + "22" }]}>
            <Text style={[styles.subBadgeText, { color: plan.color }]}>{subscribers} subs</Text>
          </View>
        </View>
      </View>
      <View style={styles.planActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "44" }]}
          onPress={onEdit}
        >
          <Ionicons name="pencil-outline" size={15} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>Editar</Text>
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

export default function PlansAdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { plans, users, updatePlans } = useAuth();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: "", speed: "", price: "", description: "" });
  const isWeb = Platform.OS === "web";

  function getSubscribers(planId: string) {
    return users.filter(u => u.activePlanId === planId).length;
  }

  function handleEdit(plan: Plan) {
    setEditingPlan(plan);
    setForm({ name: plan.name, speed: plan.speed, price: plan.price.toString(), description: plan.description });
  }

  function handleSave() {
    if (!form.name || !form.speed || !form.price) {
      Alert.alert("Error", "Completa los campos requeridos.");
      return;
    }
    const updated = plans.map(p =>
      p.id === editingPlan?.id
        ? { ...p, name: form.name, speed: form.speed, price: parseFloat(form.price), description: form.description }
        : p
    );
    updatePlans(updated);
    setEditingPlan(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function handleDelete(plan: Plan) {
    const subs = getSubscribers(plan.id);
    if (subs > 0) {
      Alert.alert("No se puede eliminar", `Este plan tiene ${subs} suscriptor(es) activos.`);
      return;
    }
    Alert.alert("Eliminar plan", `¿Eliminar el plan ${plan.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          updatePlans(plans.filter(p => p.id !== plan.id));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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

        <Text style={[styles.title, { color: colors.foreground }]}>Gestión de Planes</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{plans.length} planes disponibles</Text>

        {editingPlan && (
          <View style={[styles.editCard, { backgroundColor: colors.card, borderColor: colors.primary + "55" }]}>
            <Text style={[styles.editTitle, { color: colors.foreground }]}>Editando: {editingPlan.name}</Text>
            {[
              { key: "name", label: "Nombre del plan", placeholder: "Ej: Estándar" },
              { key: "speed", label: "Velocidad", placeholder: "Ej: 150 Mbps" },
              { key: "price", label: "Precio mensual ($)", placeholder: "Ej: 49.99", keyboard: "numeric" },
              { key: "description", label: "Descripción", placeholder: "Descripción breve del plan" },
            ].map(f => (
              <View key={f.key} style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.mutedForeground}
                    value={form[f.key as keyof typeof form]}
                    onChangeText={v => setForm(fm => ({ ...fm, [f.key]: v }))}
                    keyboardType={f.keyboard === "numeric" ? "decimal-pad" : "default"}
                  />
                </View>
              </View>
            ))}
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.editBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
                onPress={() => setEditingPlan(null)}
              >
                <Text style={[styles.editBtnText, { color: colors.mutedForeground }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editBtn, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={[styles.editBtnText, { color: colors.primaryForeground }]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {plans.map(plan => (
          <PlanAdminCard
            key={plan.id}
            plan={plan}
            subscribers={getSubscribers(plan.id)}
            onEdit={() => handleEdit(plan)}
            onDelete={() => handleDelete(plan)}
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
  subtitle: { fontSize: 13, marginBottom: 20, marginTop: 2 },
  planCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  planHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  planIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  planName: { fontSize: 16, fontWeight: "700" },
  planSpeed: { fontSize: 13, marginTop: 2 },
  planPrice: { fontSize: 15, fontWeight: "700" },
  subBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  subBadgeText: { fontSize: 11, fontWeight: "700" },
  planActions: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, paddingVertical: 8, gap: 6 },
  actionText: { fontSize: 12, fontWeight: "600" },
  editCard: { borderRadius: 18, borderWidth: 1.5, padding: 18, marginBottom: 20 },
  editTitle: { fontSize: 16, fontWeight: "700", marginBottom: 14 },
  fieldGroup: { marginBottom: 12, gap: 5 },
  fieldLabel: { fontSize: 12, fontWeight: "600" },
  inputWrap: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, height: 46 },
  input: { flex: 1, fontSize: 14, height: "100%" },
  editActions: { flexDirection: "row", gap: 10, marginTop: 6 },
  editBtn: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 12, alignItems: "center" },
  editBtnText: { fontSize: 14, fontWeight: "700" },
});
