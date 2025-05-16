import { ability, getCurrentOrg } from '@/app/auth/auth/auth'
import { ProjectList } from './project-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function Projects() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {permissions?.can('create', 'Project') && (
          <Button size="sm" asChild>
            <Link href={`/org/${currentOrg}/create-project`}>
              <Plus className="mr-2 size-4" />
              Create Project
            </Link>
          </Button>
        )}
      </div>

      { permissions?.can('get', 'Project') ? (
        <ProjectList />
      ) : (
          <p className="text-sm text-muted-foreground">You do not have permission to view projects.</p>

      )}
    </div>
  )
}
