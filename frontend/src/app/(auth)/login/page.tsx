"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signInSchema } from '../../../schemas/signInSchema'
import api from '@/lib/api';

// ---------------- TYPES ----------------
type LoginFormValues = {
  email: string
  password: string
}


export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
  setLoading(true);

  try {
    await api.post("/auth/login", values);

    toast.success("Logged in successfully");

    // 🔥 GET USER INFO FROM BACKEND
    const res = await api.get("/auth/me");

    const role = res.data.role?.toLowerCase();

    if (role === "owner") {
      router.replace("/owner/dashboard");
    } else if (role === "user") {
      router.replace("/user/dashboard");
    } else {
      router.replace("/");
    }

  } catch (error: any) {
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded-xl shadow-md">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Login to RentAura
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PASSWORD */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BUTTON */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>

      {/* SIGN UP */}
      <div className="text-center text-sm mt-4">
        Don’t have an account?{" "}
        <a href="/sign-up" className="text-blue-600 hover:underline">
          Sign Up
        </a>
      </div>
    </div>
  )
}