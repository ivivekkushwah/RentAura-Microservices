'use client';

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/auth/me", {
          credentials: "include", // 🔥 IMPORTANT
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const user = await res.json();

        // ❌ Not USER → redirect
        if (user.role !== "USER") {
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

  if (!authorized) return null;

  return <>{children}</>;
}