import { getSupabase } from "./supabase";

export type SearchResultType = "single_match" | "multi_match" | "ai_fallback" | "empty";
export type ViewSource = "local" | "ai";

export async function logSearch(sessionId: string, query: string, resultType: SearchResultType) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("search_logs").insert({ session_id: sessionId, query, result_type: resultType });
  } catch {
    // 로깅 실패가 사용자 경험을 막으면 안 되므로 조용히 무시
  }
}

export async function logItemView(
  sessionId: string,
  itemId: string,
  itemName: string,
  categoryId: string | undefined,
  source: ViewSource
) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("item_views").insert({
      session_id: sessionId,
      item_id: itemId,
      item_name: itemName,
      category_id: categoryId ?? null,
      source,
    });
  } catch {
    // 로깅 실패가 사용자 경험을 막으면 안 되므로 조용히 무시
  }
}

export async function logCompletion(
  sessionId: string,
  itemId: string,
  itemName: string,
  categoryId: string | undefined,
  region: string | null,
  points: number,
  carbonSavingG: number
) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("disposal_completions").insert({
      session_id: sessionId,
      item_id: itemId,
      item_name: itemName,
      category_id: categoryId ?? null,
      region,
      points,
      carbon_saving_g: carbonSavingG,
    });
  } catch {
    // 로깅 실패가 사용자 경험을 막으면 안 되므로 조용히 무시
  }
}
