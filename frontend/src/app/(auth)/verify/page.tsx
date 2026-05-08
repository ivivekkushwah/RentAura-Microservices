'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { OtpInput } from '@/components/otp/OtpInput'

interface ApiErrorResponse {
  message?: string
}

export default function VerifyPage() {
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(60)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  const router = useRouter()

  // ✅ Check if email exists in localStorage — otherwise redirect
  useEffect(() => {
    const storedEmail = localStorage.getItem('verifyEmail')
    if (!storedEmail) {
      toast.error('Access denied. Please sign up first.')
      router.replace('/sign-up')
    } else {
      setEmail(storedEmail)
    }
  }, [router])

  // ✅ Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length !== 6 || !email) {
      toast.error('Please enter the full 6-digit code')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/verify-user', {
        email,
        verifyCode: otp,
      })

      toast.success(res.data?.message || 'Verification successful')

      setTimeout(() => {
        localStorage.removeItem('verifyEmail')
        router.push('/login')
      }, 1500)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        toast.error(axiosError.response?.data?.message || 'Invalid or expired code')
      } else if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    if (!email) return
    try {
      await axios.post('/api/resend-code', { email })
      toast.success('OTP resent successfully')
      setTimer(60)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>
        toast.error(axiosError.response?.data?.message || 'Failed to resend code')
      } else {
        toast.error('Failed to resend code')
      }
    }
  }

  // ✅ Don’t render anything until we’ve checked for email
  if (email === null) return null

  return (
    <div className="max-w-md mx-auto mt-12 p-6 rounded-xl shadow-md border bg-white dark:bg-neutral-900">
      <h2 className="text-2xl font-bold text-center mb-4">Verify Your Account</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Enter the 6-digit code sent to your email
      </p>

      <form onSubmit={handleVerify} className="space-y-6">
        <OtpInput value={otp} onChange={setOtp} />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground mt-4">
        {timer > 0 ? (
          <p>Resend code in {timer}s</p>
        ) : (
          <Button
            variant="link"
            size="sm"
            onClick={resendCode}
            className="p-0 text-primary"
          >
            Resend OTP
          </Button>
        )}
      </div>
    </div>
  )
}
