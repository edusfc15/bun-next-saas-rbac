import { Button } from './ui/button'
import { ability, getCurrentOrg } from '@/app/auth/auth/auth'
import { NavLink } from './nav-link'

export async function Tabs() {
  const currentOrg = await getCurrentOrg()
  const permisions = await ability()

  const canGetBilling = permisions?.can('get', 'Billing')
  const canUpdateOrganization = permisions?.can('update', 'Organization')
  
  const canGetMembers = permisions?.can('get', 'User')
  const canGetProjects = permisions?.can('get', 'Project')

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        {canGetProjects && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border border border-transparent data-[current=true]:border-b-2"
          >
            <NavLink href={`/org/${currentOrg}`}>Projects</NavLink>
          </Button>
        )}

        {canGetMembers && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border border border-transparent data-[current=true]:border-b-2"
          >
            <NavLink href={`/org/${currentOrg}/members`}>Members</NavLink>
          </Button>
        )}
        {(canUpdateOrganization || canGetBilling) && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border border border-transparent data-[current=true]:border-b-2"
          >
            <NavLink href={`/org/${currentOrg}/settings`}>
              Settings & Billings
            </NavLink>
          </Button>
        )}
      </nav>
    </div>
  )
}
