'use client';

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OwnerLayoutProps {
  children: ReactNode;
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/auth/me", {
          credentials: "include", // 🔥 REQUIRED for cookies
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const user = await res.json();

        // ❌ Not OWNER → redirect
        if (user.role !== "OWNER") {
          router.replace("/");
          return;
        }

        // ✅ Authorized
        setAuthorized(true);

      } catch (err) {
        console.error("Invalid token");
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  // ⛔ prevent flicker
  if (!authorized) return null;

  return <>{children}</>;
}