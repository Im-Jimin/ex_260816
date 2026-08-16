"use client";

import { useEffect } from "react";
import { getOrCreateSessionId } from "@/lib/client-session";

export default function SessionInit() {
  useEffect(() => {
    getOrCreateSessionId();
  }, []);

  return null;
}
