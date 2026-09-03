export const SESSION_COOKIE = "rd_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!username || !password || password.length < 8) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD (min 8 chars) must be set.");
  }

  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters.");
  }

  return { username, password, secret };
}

export function usesSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
