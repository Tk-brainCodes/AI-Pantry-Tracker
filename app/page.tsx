"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

import { useAuth } from "@/components/auth-context";

export default function Home() {
  const { currentUser } = useAuth();

  useEffect(() => {
  if (currentUser) {
    redirect("/pantry"); 
   }
  }, [currentUser])

  return redirect("/signin");
}
