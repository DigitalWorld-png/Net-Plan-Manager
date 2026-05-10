import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Ingresa tu correo y contraseña.");
      return;
    }
    setLoading(true);
    const ok = await login(email.trim(), password);
    setLoading(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(main)/home");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Correo o contraseña incorrectos.");
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoBlock}>
            <View style={[styles.logoCircle, { backgroundColor: colors.primary + "22" }]}>
              <Ionicons name="wifi" size={42} color={colors.primary} />
            </View>
            <Text style={[styles.brand, { color: colors.foreground }]}>NetPlus</Text>
            <Text style={[styles.tagline, { color: colors.mutedForeground }]}>Conectividad sin límites</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.foreground }]}>Iniciar sesión</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Ingresa tus datos para continuar</Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Correo electrónico</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="tu@correo.com"
                  placeholderTextColor={colors.mutedForeground}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Contraseña</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={colors.primaryForeground} />
                : <Text style={[styles.btnText, { color: colors.primaryForeground }]}>Ingresar</Text>
              }
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>Demo</Text>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
            </View>

            <View style={[styles.hintBox, { backgroundColor: colors.muted }]}>
              <Text style={[styles.hintTitle, { color: colors.foreground }]}>Cuentas de prueba:</Text>
              <Text style={[styles.hint, { color: colors.mutedForeground }]}>Admin: admin@netplus.com / admin123</Text>
              <Text style={[styles.hint, { color: colors.mutedForeground }]}>O regístrate como nuevo usuario</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.registerLink} onPress={() => router.push("/(auth)/register")}>
            <Text style={[styles.registerText, { color: colors.mutedForeground }]}>
              ¿No tienes cuenta?{" "}
              <Text style={{ color: colors.primary, fontWeight: "700" }}>Regístrate</Text>
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
  logoBlock: { alignItems: "center", marginBottom: 32, gap: 8 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  brand: { fontSize: 32, fontWeight: "800", letterSpacing: -1 },
  tagline: { fontSize: 14 },
  card: { borderRadius: 24, borderWidth: 1, padding: 24, gap: 4, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 2 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  fieldGroup: { marginBottom: 14, gap: 6 },
  label: { fontSize: 12, fontWeight: "600", letterSpacing: 0.3 },
  inputWrap: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 50, gap: 10 },
  input: { flex: 1, fontSize: 15 },
  btn: { borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center", marginTop: 8 },
  btnText: { fontSize: 16, fontWeight: "700" },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 16 },
  line: { flex: 1, height: 1 },
  dividerText: { fontSize: 12 },
  hintBox: { borderRadius: 12, padding: 14, gap: 3 },
  hintTitle: { fontSize: 12, fontWeight: "700", marginBottom: 2 },
  hint: { fontSize: 12 },
  registerLink: { alignItems: "center", paddingVertical: 8 },
  registerText: { fontSize: 14 },
});
