import rocketseatIcon from '@/assets/rocketseat-icon.svg'
import Image from 'next/image'
import { ProfileButton } from './profile-button'
import { Slash } from 'lucide-react'
import { OrganizationSwitcher } from './organization-switcher'
import { ability } from '@/app/auth/auth/auth'
import { Separator } from './ui/separator'
import { ThemeSwitcher } from './theme/theme-switcher'
import { ProjectSwitcher } from './project-switcher'

export async function Header() {
  const permissions = await ability()

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          alt="logo"
          src={rocketseatIcon}
          className="size-6 dark:invert"
        />

        <Slash className="text-border size-3 -rotate-[24deg]" />

        <OrganizationSwitcher />

        {permissions?.can('get', 'Project') && (
          <>
          <Slash className="text-border size-3 -rotate-[24deg]" />
          <ProjectSwitcher/>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-5" />

        <ProfileButton />
      </div>
    </div>
  )
}
