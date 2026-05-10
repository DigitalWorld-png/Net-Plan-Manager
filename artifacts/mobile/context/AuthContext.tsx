import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Plan {
  id: string;
  name: string;
  speed: string;
  price: number;
  benefits: string[];
  color: string;
  popular?: boolean;
  description: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  plan: string;
  status: "paid" | "pending" | "overdue";
  method: string;
  invoiceNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  activePlanId: string | null;
  planStartDate: string | null;
  planEndDate: string | null;
  isAdmin: boolean;
  payments: Payment[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  plans: Plan[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Omit<User, "id" | "isAdmin" | "payments" | "createdAt">) => Promise<boolean>;
  logout: () => void;
  subscribeToPlan: (planId: string, paymentMethod: string) => void;
  addPayment: (payment: Omit<Payment, "id" | "invoiceNumber">) => void;
  updateUsers: (users: User[]) => void;
  updatePlans: (plans: Plan[]) => void;
  getActivePlan: () => Plan | null;
}

const DEFAULT_PLANS: Plan[] = [
  {
    id: "basic",
    name: "Básico",
    speed: "50 Mbps",
    price: 29.99,
    benefits: ["Velocidad de bajada 50 Mbps", "Velocidad de subida 10 Mbps", "Sin límite de datos", "Soporte 24/7", "Router incluido"],
    color: "#4A90D9",
    description: "Ideal para uso básico: redes sociales, correo y navegación.",
  },
  {
    id: "standard",
    name: "Estándar",
    speed: "150 Mbps",
    price: 49.99,
    benefits: ["Velocidad de bajada 150 Mbps", "Velocidad de subida 30 Mbps", "Sin límite de datos", "Soporte 24/7", "Router Wi-Fi 6 incluido", "Instalación gratuita"],
    color: "#7B5EA7",
    popular: true,
    description: "Perfecto para familias y trabajo remoto con múltiples dispositivos.",
  },
  {
    id: "pro",
    name: "Pro",
    speed: "300 Mbps",
    price: 79.99,
    benefits: ["Velocidad de bajada 300 Mbps", "Velocidad de subida 60 Mbps", "Sin límite de datos", "Soporte prioritario 24/7", "Router Wi-Fi 6 Pro incluido", "Instalación express", "IP fija disponible"],
    color: "#00C6FF",
    description: "Para streamers, gamers y profesionales que exigen el máximo rendimiento.",
  },
  {
    id: "business",
    name: "Business",
    speed: "1 Gbps",
    price: 149.99,
    benefits: ["Velocidad de bajada 1 Gbps", "Velocidad de subida 200 Mbps", "Sin límite de datos", "Soporte empresarial dedicado", "Router empresarial incluido", "SLA garantizado 99.9%", "IP fija incluida", "Múltiples líneas disponibles"],
    color: "#00D97E",
    description: "Solución empresarial con máxima velocidad y disponibilidad garantizada.",
  },
];

const DEFAULT_ADMIN: User = {
  id: "admin-001",
  name: "Administrador",
  email: "admin@netplus.com",
  phone: "+1234567890",
  password: "admin123",
  address: "Oficina Central",
  activePlanId: null,
  planStartDate: null,
  planEndDate: null,
  isAdmin: true,
  payments: [],
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([DEFAULT_ADMIN]);
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [storedUser, storedUsers, storedPlans] = await Promise.all([
        AsyncStorage.getItem("@current_user"),
        AsyncStorage.getItem("@users"),
        AsyncStorage.getItem("@plans"),
      ]);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      else await AsyncStorage.setItem("@users", JSON.stringify([DEFAULT_ADMIN]));
      if (storedPlans) setPlans(JSON.parse(storedPlans));
      else await AsyncStorage.setItem("@plans", JSON.stringify(DEFAULT_PLANS));
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    const allUsers = await AsyncStorage.getItem("@users");
    const parsed: User[] = allUsers ? JSON.parse(allUsers) : [DEFAULT_ADMIN];
    const found = parsed.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      setUser(found);
      setUsers(parsed);
      await AsyncStorage.setItem("@current_user", JSON.stringify(found));
      return true;
    }
    return false;
  }

  async function register(data: Omit<User, "id" | "isAdmin" | "payments" | "createdAt">): Promise<boolean> {
    const allUsers = await AsyncStorage.getItem("@users");
    const parsed: User[] = allUsers ? JSON.parse(allUsers) : [DEFAULT_ADMIN];
    const exists = parsed.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return false;
    const newUser: User = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      isAdmin: false,
      payments: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...parsed, newUser];
    setUsers(updated);
    setUser(newUser);
    await AsyncStorage.setItem("@users", JSON.stringify(updated));
    await AsyncStorage.setItem("@current_user", JSON.stringify(newUser));
    return true;
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem("@current_user");
  }

  async function subscribeToPlan(planId: string, paymentMethod: string) {
    if (!user) return;
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);
    const payment: Payment = {
      id: Date.now().toString(),
      date: now.toISOString(),
      amount: plan.price,
      plan: plan.name,
      status: "paid",
      method: paymentMethod,
      invoiceNumber: "INV-" + Date.now().toString().slice(-8),
    };
    const updatedUser: User = {
      ...user,
      activePlanId: planId,
      planStartDate: now.toISOString(),
      planEndDate: endDate.toISOString(),
      payments: [payment, ...user.payments],
    };
    const allUsers = await AsyncStorage.getItem("@users");
    const parsed: User[] = allUsers ? JSON.parse(allUsers) : [];
    const updated = parsed.map(u => u.id === user.id ? updatedUser : u);
    setUser(updatedUser);
    setUsers(updated);
    await AsyncStorage.setItem("@current_user", JSON.stringify(updatedUser));
    await AsyncStorage.setItem("@users", JSON.stringify(updated));
  }

  async function addPayment(payment: Omit<Payment, "id" | "invoiceNumber">) {
    if (!user) return;
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      invoiceNumber: "INV-" + Date.now().toString().slice(-8),
    };
    const updatedUser = { ...user, payments: [newPayment, ...user.payments] };
    const allUsers = await AsyncStorage.getItem("@users");
    const parsed: User[] = allUsers ? JSON.parse(allUsers) : [];
    const updated = parsed.map(u => u.id === user.id ? updatedUser : u);
    setUser(updatedUser);
    setUsers(updated);
    await AsyncStorage.setItem("@current_user", JSON.stringify(updatedUser));
    await AsyncStorage.setItem("@users", JSON.stringify(updated));
  }

  async function updateUsers(newUsers: User[]) {
    setUsers(newUsers);
    await AsyncStorage.setItem("@users", JSON.stringify(newUsers));
  }

  async function updatePlans(newPlans: Plan[]) {
    setPlans(newPlans);
    await AsyncStorage.setItem("@plans", JSON.stringify(newPlans));
  }

  function getActivePlan(): Plan | null {
    if (!user?.activePlanId) return null;
    return plans.find(p => p.id === user.activePlanId) ?? null;
  }

  return (
    <AuthContext.Provider value={{ user, users, plans, isLoading, login, register, logout, subscribeToPlan, addPayment, updateUsers, updatePlans, getActivePlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
