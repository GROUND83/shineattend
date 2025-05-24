import { cookies } from "next/headers";
import * as jose from "jose";

const COOKIE_NAME = "admin-auth";
const ATTEND_COOKIE_NAME = "attend-auth";
// 32바이트(256비트) 키 생성
const SECRET_KEY = new TextEncoder().encode(
  (process.env.JWT_SECRET || "your-secret-key").padEnd(32, "0").slice(0, 32)
);

// 쿠키 값 암호화
export async function encryptCookie(value: string) {
  const token = await new jose.EncryptJWT({ value })
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .encrypt(SECRET_KEY);
  return token;
}

// 쿠키 값 복호화
export async function decryptCookie(token: string) {
  try {
    const { payload } = await jose.jwtDecrypt(token, SECRET_KEY);
    return payload.value as string;
  } catch {
    return null;
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const encryptedValue = cookieStore.get(COOKIE_NAME)?.value;
  if (!encryptedValue) return false;

  const decryptedValue = await decryptCookie(encryptedValue);
  console.log("decryptedValue", decryptedValue);
  return decryptedValue === process.env.ADMIN_PASSWORD;
}

export function authenticate(password: string) {
  return password === process.env.ADMIN_PASSWORD;
}
export function attendauthenticate(password: string) {
  console.log("password", password);
  return password === process.env.ATTEND_PASSWORD;
}
export async function isAttendAuthenticated() {
  const cookieStore = await cookies();
  const encryptedValue = cookieStore.get(ATTEND_COOKIE_NAME)?.value;
  if (!encryptedValue) return false;

  const decryptedValue = await decryptCookie(encryptedValue);
  console.log("decryptedValue", decryptedValue);
  return decryptedValue === process.env.ATTEND_PASSWORD;
}
