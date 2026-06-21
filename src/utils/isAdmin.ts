const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export function isAdmin(email: string | null | undefined): boolean {
  if (!email || !ADMIN_EMAIL) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
