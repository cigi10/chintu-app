"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const onboarded = localStorage.getItem("chintu-onboarded");
    router.replace(onboarded ? "/dashboard" : "/onboarding");
  }, []);
  return null;
}