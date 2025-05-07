'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ClipboardCopyIcon,
  EyeIcon,
  PlusIcon,
  Sparkles,
  LogOutIcon,
} from 'lucide-react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

interface LinkItem {
  _id: string
  title: string
  isLatest: boolean
}

export default function Dashboard() {
  const router = useRouter()
  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* fetch links */
  useEffect(() => {
    api
      .get<LinkItem[]>('/employee/links', { withCredentials: true })
      .then((res) => setLinks(res.data))
      .catch((e) =>
        setError(e.response?.data?.error || 'Failed to load links.')
      )
      .finally(() => setLoading(false))
  }, [])

  /* sweet‑alert copy */
  const copy = (txt: string) =>
    navigator.clipboard.writeText(txt).then(() =>
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Link copied',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      })
    )

  /* logout handler */
  const handleLogout = async () => {
    localStorage.clear()
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Logged out',
      showConfirmButton: false,
      timer: 1200,
    })
    router.push('/employee/login')
  }

  if (loading) return <p className="text-center mt-10">Loading links…</p>
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* title row */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold">Available Links</h1>
        <Button
          size="sm"
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-1"
        >
          <LogOutIcon className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* link cards */}
      <div
        className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto"
      >
        {links.map((link) => {
          const latest = link.isLatest

          return (
            <Card
              key={link._id}
              className={`relative p-6 space-y-4 transition transform
              ${latest
                  ? 'bg-gradient-to-br from-blue-50 to-white ring-2 ring-blue-400 hover:shadow-2xl'
                  : 'bg-gradient-to-br from-gray-50 to-white ring-1 ring-gray-200 hover:ring-gray-400 hover:shadow-md'
                }
              `}
            >
              {latest && (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-blue-500/90 px-3 py-[2px] text-xs font-medium text-white">
                  <Sparkles className="h-4 w-4" /> Latest
                </span>
              )}

              <p className="text-lg font-semibold break-words">{link.title}</p>

              <div className="flex flex-wrap gap-2">
                {latest ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copy(link.title)}
                      className="flex items-center gap-1 bg-white/70 backdrop-blur hover:bg-white"
                    >
                      <ClipboardCopyIcon className="h-4 w-4" />
                      Copy Link
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(`/employee/links?id=${link._id}`)
                      }
                      className="flex items-center gap-1"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Entry
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(`/employee/links?id=${link._id}`)
                    }
                    className="flex items-center gap-1"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View Entries
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
