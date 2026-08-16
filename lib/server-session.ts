import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./client-session";

export async function getServerSessionId(): Promise<string> {
  const store = await cookies();
  return store.get(SESSION_COOKIE_NAME)?.value ?? "anonymous";
}
