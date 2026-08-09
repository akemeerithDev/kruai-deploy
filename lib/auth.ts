// Auth client — รองรับทั้ง Supabase (production) และ Local storage (demo)
// เพื่อให้ทดสอบได้ทันทีโดยไม่ต้องตั้ง Supabase

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface User {
  id: string;
  email: string;
  name: string;
  tier: "free" | "basic" | "pro";
  credits: number;
  creditsResetAt: string;
  createdAt: string;
}

export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

// ============ Demo mode (localStorage) ============
const DEMO_USERS_KEY = "kruai_demo_users";
const DEMO_SESSION_KEY = "kruai_demo_session";

interface DemoUser {
  id: string;
  email: string;
  name: string;
  password: string; // ในงานจริงห้ามเก็บ plain password!
  tier: "free" | "basic" | "pro";
  credits: number;
  creditsResetAt: string;
  createdAt: string;
}

function getDemoUsers(): DemoUser[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(DEMO_USERS_KEY);
  const users: DemoUser[] = raw ? JSON.parse(raw) : [];

  // Admin account (default user) — สร้างอัตโนมัติถ้ายังไม่มี
  const ADMIN_EMAIL = "suraches";
  if (!users.find((u) => u.email === ADMIN_EMAIL)) {
    users.push({
      id: "admin_suraches_001",
      email: ADMIN_EMAIL,
      name: "ผู้ดูแลระบบ (Suraches)",
      password: "Ake0896887477",
      tier: "pro", // Admin = Pro tier (ไม่จำกัด)
      credits: 999999,
      creditsResetAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    });
  }

  return users;
}

function saveDemoUsers(users: DemoUser[]) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

function getNextMonthReset(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function getDefaultCredits(tier: "free" | "basic" | "pro"): number {
  return tier === "free" ? 5 : tier === "basic" ? 50 : 999999;
}

export async function signUp(input: {
  email: string;
  password: string;
  name: string;
}): Promise<{ user: User | null; error: string | null }> {
  if (isSupabaseEnabled) {
    // TODO: implement supabase auth
    return { user: null, error: "Supabase not implemented in demo" };
  }

  // Demo mode
  const users = getDemoUsers();
  if (users.find((u) => u.email === input.email)) {
    return { user: null, error: "อีเมลนี้ถูกใช้แล้ว" };
  }

  const newUser: DemoUser = {
    id: `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: input.email,
    name: input.name,
    password: input.password,
    tier: "free",
    credits: getDefaultCredits("free"),
    creditsResetAt: getNextMonthReset(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveDemoUsers(users);

  const session = { userId: newUser.id };
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));

  return {
    user: userToPublic(newUser),
    error: null,
  };
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<{ user: User | null; error: string | null }> {
  if (isSupabaseEnabled) {
    return { user: null, error: "Supabase not implemented in demo" };
  }

  const users = getDemoUsers();
  // รองรับ login ด้วย username หรือ email
  const user = users.find(
    (u) => (u.email === input.email || u.email === input.email.toLowerCase()) && u.password === input.password
  );
  if (!user) {
    return { user: null, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  }

  // Reset credits ถ้าเลยเดือน
  if (new Date(user.creditsResetAt) < new Date()) {
    user.credits = getDefaultCredits(user.tier);
    user.creditsResetAt = getNextMonthReset();
    saveDemoUsers(users);
  }

  localStorage.setItem(
    DEMO_SESSION_KEY,
    JSON.stringify({ userId: user.id })
  );
  return { user: userToPublic(user), error: null };
}

export function signOut() {
  if (isSupabaseEnabled) {
    // TODO
  }
  localStorage.removeItem(DEMO_SESSION_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const sessionRaw = localStorage.getItem(DEMO_SESSION_KEY);
  if (!sessionRaw) return null;
  const session = JSON.parse(sessionRaw);
  const users = getDemoUsers();
  const user = users.find((u) => u.id === session.userId);
  return user ? userToPublic(user) : null;
}

function userToPublic(u: DemoUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    tier: u.tier,
    credits: u.credits,
    creditsResetAt: u.creditsResetAt,
    createdAt: u.createdAt,
  };
}

// ============ Credits ============
export function consumeCredit(): { success: boolean; remaining: number; error?: string } {
  if (typeof window === "undefined") return { success: false, remaining: 0, error: "Server side" };

  const user = getCurrentUser();
  if (!user) {
    return { success: false, remaining: 0, error: "กรุณาเข้าสู่ระบบ" };
  }
  if (user.tier === "pro") {
    return { success: true, remaining: 999999 };
  }
  if (user.credits <= 0) {
    return {
      success: false,
      remaining: 0,
      error: "เครดิตหมด กรุณาอัปเกรดแพ็กเกจ",
    };
  }

  const users = getDemoUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx].credits -= 1;
    saveDemoUsers(users);
  }

  return { success: true, remaining: user.credits - 1 };
}

export function upgradeTier(tier: "basic" | "pro"): User | null {
  if (typeof window === "undefined") return null;
  const user = getCurrentUser();
  if (!user) return null;

  const users = getDemoUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx].tier = tier;
    users[idx].credits = getDefaultCredits(tier);
    users[idx].creditsResetAt = getNextMonthReset();
    saveDemoUsers(users);
  }

  return getCurrentUser();
}
