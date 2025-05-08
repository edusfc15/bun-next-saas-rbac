import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ChevronDown, LogOut } from 'lucide-react'
import { auth } from '@/app/auth/auth/auth'

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/)
    const firstInitial = parts[0]?.[0]?.toUpperCase() || ''
    const lastInitial = parts.length > 1 ? parts[parts.length - 1][0]?.toUpperCase() || '' : ''
    return firstInitial + lastInitial
  }
  

export  async function ProfileButton() {
    const { user }  = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
        <Avatar className="size-8">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          {user.name && (
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          )}
        </Avatar>
        <ChevronDown className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild >
            <a href="api/auth/sign-out">
                <LogOut className="mr-2 size-4" />
                Sign out
            </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
