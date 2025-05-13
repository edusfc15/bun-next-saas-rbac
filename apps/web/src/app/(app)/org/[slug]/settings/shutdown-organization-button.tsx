import { getCurrentOrg } from '@/app/auth/auth/auth'
import { shutdownOrganization } from '@/app/http/shutdown-organization'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

export function ShutdownOrganizationButton() {
  async function handleShutdown() {
    'use server'
    const currentOrg = await getCurrentOrg()

    await shutdownOrganization({ org: currentOrg! })

    redirect('/')
  }

  return (
    <form action={handleShutdown}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="mr-2 size-4" />
        Shutdown Organization
      </Button>
    </form>
  )
}
