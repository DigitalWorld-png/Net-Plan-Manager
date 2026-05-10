import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const FAQS = [
  { q: "¿Cómo puedo contratar un plan?", a: "Selecciona el plan que más te convenga en la sección 'Planes', presiona 'Contratar', y sigue el proceso de pago. Tu servicio estará activo en menos de 24 horas." },
  { q: "¿Cuáles son los métodos de pago aceptados?", a: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), Mercado Pago y transferencias bancarias. Todos los pagos son procesados de forma segura." },
  { q: "¿Qué hago si mi internet no funciona?", a: "1) Reinicia tu router desconectándolo 30 segundos. 2) Verifica que los cables estén bien conectados. 3) Si el problema persiste, contacta a soporte técnico por WhatsApp." },
  { q: "¿Puedo cambiar de plan?", a: "Sí, puedes actualizar o cambiar tu plan en cualquier momento. El cambio es efectivo desde el siguiente ciclo de facturación sin costos adicionales." },
  { q: "¿Tienen cobertura en mi zona?", a: "Ofrecemos cobertura en más de 150 ciudades. Puedes verificar disponibilidad ingresando tu dirección en nuestro portal web o contactando a soporte." },
  { q: "¿Cuánto tiempo tarda la instalación?", a: "La instalación técnica se realiza en 24-72 horas hábiles dependiendo de tu zona. El técnico te contactará para coordinar el horario." },
  { q: "¿Hay cargos por cancelación?", a: "No tenemos contratos forzosos. Puedes cancelar cuando quieras sin penalizaciones. Solo se cobra el período ya facturado." },
  { q: "¿El router tiene costo adicional?", a: "El router está incluido en todos nuestros planes. Si necesitas un equipo adicional o de mayor capacidad, contáctanos para opciones personalizadas." },
];

const CONTACT_CHANNELS = [
  { label: "WhatsApp", icon: "logo-whatsapp", color: "#25D366", desc: "Respuesta inmediata", action: () => Linking.openURL("https://wa.me/5555555555?text=Hola, necesito ayuda con mi servicio NetPlus") },
  { label: "Chat en vivo", icon: "chatbubble-ellipses-outline", color: "#00C6FF", desc: "Lunes a viernes 8am-8pm", action: () => Alert.alert("Chat", "El chat en vivo estará disponible próximamente.") },
  { label: "Llamar", icon: "call-outline", color: "#7B5EA7", desc: "555-NET-PLUS", action: () => Linking.openURL("tel:+5555555555") },
  { label: "Email", icon: "mail-outline", color: "#FFB800", desc: "soporte@netplus.com", action: () => Linking.openURL("mailto:soporte@netplus.com") },
];

export default function SupportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isWeb = Platform.OS === "web";

  function toggleFaq(i: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOpenFaq(openFaq === i ? null : i);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + (isWeb ? 67 : 0) + 12, paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 100, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Centro de Ayuda</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Estamos aquí para ayudarte</Text>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Contáctanos</Text>
        <View style={styles.contactGrid}>
          {CONTACT_CHANNELS.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.contactCard, { backgroundColor: c.color + "18", borderColor: c.color + "44" }]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); c.action(); }}
              activeOpacity={0.8}
            >
              <View style={[styles.contactIcon, { backgroundColor: c.color + "33" }]}>
                <Ionicons name={c.icon as any} size={26} color={c.color} />
              </View>
              <Text style={[styles.contactLabel, { color: colors.foreground }]}>{c.label}</Text>
              <Text style={[styles.contactDesc, { color: colors.mutedForeground }]}>{c.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.statusCard, { backgroundColor: colors.success + "18", borderColor: colors.success + "44" }]}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <View>
            <Text style={[styles.statusTitle, { color: colors.foreground }]}>Todos los sistemas operativos</Text>
            <Text style={[styles.statusSub, { color: colors.mutedForeground }]}>Última verificación: hoy 6:00 AM</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Preguntas frecuentes</Text>
        {FAQS.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.faqItem, { backgroundColor: colors.card, borderColor: openFaq === i ? colors.primary : colors.border }]}
            onPress={() => toggleFaq(i)}
            activeOpacity={0.85}
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQ, { color: colors.foreground, flex: 1 }]}>{faq.q}</Text>
              <Ionicons name={openFaq === i ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedForeground} />
            </View>
            {openFaq === i && (
              <Text style={[styles.faqA, { color: colors.mutedForeground }]}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 14 },
  contactGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  contactCard: { width: "47%", borderRadius: 16, borderWidth: 1, padding: 16, alignItems: "center", gap: 8 },
  contactIcon: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  contactLabel: { fontSize: 14, fontWeight: "700" },
  contactDesc: { fontSize: 11, textAlign: "center" },
  statusCard: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 24 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusTitle: { fontSize: 14, fontWeight: "600" },
  statusSub: { fontSize: 12, marginTop: 2 },
  faqItem: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 10 },
  faqHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  faqQ: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  faqA: { fontSize: 13, lineHeight: 20, marginTop: 12 },
});
