"use client";

import { redirect } from "next/navigation";

import { useAuth } from "@/components/auth-context";

export default function Home() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    redirect("/signin");
  }

  return redirect("/pantry");
}
