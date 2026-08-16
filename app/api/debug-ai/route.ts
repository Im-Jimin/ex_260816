import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function GET() {
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasSupabaseUrl = !!process.env.SUPABASE_URL;
  const hasSupabaseKey = !!process.env.SUPABASE_SECRET_KEY;

  let anthropicError: string | null = null;
  let anthropicOk = false;

  if (hasAnthropicKey) {
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const res = await client.messages.create({
        model: "claude-sonnet-5",
        max_tokens: 16,
        messages: [{ role: "user", content: "ping" }],
      });
      anthropicOk = res.stop_reason === "end_turn";
    } catch (e) {
      anthropicError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({ hasAnthropicKey, hasSupabaseUrl, hasSupabaseKey, anthropicOk, anthropicError });
}
