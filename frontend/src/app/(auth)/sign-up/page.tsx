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
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signUpSchema } from '@/schemas/signUpSchema'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUp() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      role: 'user',
    },
  })

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: SignUpFormValues) => {
    setLoading(true)
    try {

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.fullname, // ✅ FIXED
          email: data.email,
          password: data.password,
          role: data.role.toUpperCase(), // ✅ USER / OWNER
        }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      // ⚠️ Backend returns STRING, not JSON
      const result = await res.text();

      toast.success(result || "Account created successfully");

      router.replace("/login");

    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded-xl shadow-md">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Create an Account
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* FULL NAME */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* ROLE */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="user" />
                      <label htmlFor="user">User</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="owner" id="owner" />
                      <label htmlFor="owner">Owner</label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {/* BUTTON */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>
      </Form>

      {/* LOGIN */}
      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600">
          Login
        </a>
      </p>

    </div>
  )
}