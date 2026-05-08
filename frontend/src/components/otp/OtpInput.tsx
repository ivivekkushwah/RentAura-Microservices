'use client'

import { Input } from '@/components/ui/input'
import {  useRef } from 'react'

interface OtpInputProps {
  value: string
  onChange: (val: string) => void
  length?: number
}

export const OtpInput = ({ value, onChange, length = 6 }: OtpInputProps) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (val: string, i: number) => {
    if (!/^\d?$/.test(val)) return

    const newValue = value.split('')
    newValue[i] = val
    const joined = newValue.join('')
    onChange(joined)

    if (val && i < length - 1) {
      inputs.current[i + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          ref={(el) => { inputs.current[i] = el }}
          className="w-12 h-12 text-xl text-center font-bold tracking-widest"
        />
      ))}
    </div>
  )
}
