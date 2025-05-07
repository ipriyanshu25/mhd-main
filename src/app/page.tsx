'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    /* localStorage is available only after hydration */
    const employeeId = localStorage.getItem('employeeId')

    if (employeeId) {
      router.replace('/employee/dashboard')
    } else {
      router.replace('/employee/login')
    }
  }, [router])

  /* Render nothing while the redirect happens */
  return null
}
