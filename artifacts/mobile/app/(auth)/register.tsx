import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
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

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleRegister() {
    if (!form.name || !form.email || !form.phone || !form.password) {
      Alert.alert("Error", "Completa todos los campos obligatorios.");
      return;
    }
    if (form.password !== form.confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const ok = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      password: form.password,
      activePlanId: null,
      planStartDate: null,
      planEndDate: null,
    });
    setLoading(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(main)/home");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Este correo ya está registrado.");
    }
  }

  const fields = [
    { key: "name", label: "Nombre completo *", icon: "person-outline", placeholder: "Juan Pérez", keyboard: "default" as const },
    { key: "email", label: "Correo electrónico *", icon: "mail-outline", placeholder: "tu@correo.com", keyboard: "email-address" as const },
    { key: "phone", label: "Teléfono *", icon: "call-outline", placeholder: "+52 55 1234 5678", keyboard: "phone-pad" as const },
    { key: "address", label: "Dirección", icon: "location-outline", placeholder: "Calle, Colonia, Ciudad", keyboard: "default" as const },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>Crear cuenta</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Únete a NetPlus y conecta tu mundo</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {fields.map(f => (
              <View key={f.key} style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>{f.label}</Text>
                <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                  <Ionicons name={f.icon as any} size={17} color={colors.mutedForeground} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.mutedForeground}
                    value={form[f.key as keyof typeof form]}
                    onChangeText={v => update(f.key, v)}
                    keyboardType={f.keyboard}
                    autoCapitalize={f.key === "email" ? "none" : "words"}
                  />
                </View>
              </View>
            ))}

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Contraseña *</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={17} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={colors.mutedForeground}
                  value={form.password}
                  onChangeText={v => update("password", v)}
                  secureTextEntry={!showPwd}
                />
                <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
                  <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={17} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Confirmar contraseña *</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={17} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor={colors.mutedForeground}
                  value={form.confirm}
                  onChangeText={v => update("confirm", v)}
                  secureTextEntry={!showPwd}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={colors.primaryForeground} />
                : <Text style={[styles.btnText, { color: colors.primaryForeground }]}>Registrarme</Text>
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
            <Text style={[styles.loginText, { color: colors.mutedForeground }]}>
              ¿Ya tienes cuenta?{" "}
              <Text style={{ color: colors.primary, fontWeight: "700" }}>Iniciar sesión</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20 },
  back: { marginBottom: 16, width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  header: { marginBottom: 24, gap: 6 },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14 },
  card: { borderRadius: 24, borderWidth: 1, padding: 20, marginBottom: 20 },
  fieldGroup: { marginBottom: 14, gap: 6 },
  label: { fontSize: 12, fontWeight: "600", letterSpacing: 0.3 },
  inputWrap: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 50, gap: 10 },
  input: { flex: 1, fontSize: 15 },
  btn: { borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center", marginTop: 8 },
  btnText: { fontSize: 16, fontWeight: "700" },
  loginLink: { alignItems: "center", paddingVertical: 8 },
  loginText: { fontSize: 14 },
});
