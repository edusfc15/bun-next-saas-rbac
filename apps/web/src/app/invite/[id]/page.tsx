import { auth, isAuthenticated } from '@/app/auth/auth/auth'
import { acceptInvite } from '@/app/http/accept-invite'
import { getInvite } from '@/app/http/get-invite'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckCircle, LogIn, LogOut } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

dayjs.extend(relativeTime)

interface InvitePageProps {
  params: {
    id: string
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const inviteId = params.id

  const { invite } = await getInvite(inviteId)
  const isUserAuthenticated = await isAuthenticated()

  let currentUserEmail = null

  if (isUserAuthenticated) {
    const { user } = await auth()
    currentUserEmail = user?.email
  }

  const isUserAuthenticatedWithSameEmailFromInvite =
    currentUserEmail === invite?.email

  async function signInFromInvite() {
    'use server'
    ;(await cookies()).set('inviteId', inviteId)

    redirect(`/auth/sign-in?email=${invite?.email}`)
  }

  async function acceptInviteAction() {
    'use server'

    await acceptInvite(inviteId)

    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite?.author?.avatarUrl && <></>}
            <AvatarFallback />
          </Avatar>

          <p className="text-muted-foreground text-center leading-relaxed text-balance">
            <span className="text-foreground font-medium">
              {invite?.author?.name ?? 'Someone'}{' '}
            </span>{' '}
            invited you to join{' '}
            <span className="text-foreground font-medium">
              {invite?.organization.name}
            </span>
            .{' '}
            <span className="text-xs">
              {dayjs(invite?.createdAt).fromNow()}
            </span>
          </p>
        </div>
        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button type="submit" variant="secondary" className="w-full">
              <LogIn className="mr-2 size-4" />
              Sign in to accept the invite
            </Button>
          </form>
        )}

        {isUserAuthenticatedWithSameEmailFromInvite && (
          <form action={acceptInviteAction}>
            <Button type="submit" variant="secondary" className="w-full">
              <CheckCircle className="mr-2 size-4" />
              Join {invite.organization.name}
            </Button>
          </form>
        )}

        {isUserAuthenticated && !isUserAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center leading-relaxed text-balance">
              This invite was sent to{' '}
              <span className="text-foreground font-medium">
                {invite?.email}
              </span>{' '}
              but you are signed in as{' '}
              <span className="text-foreground font-medium">
                {currentUserEmail}
              </span>
              . Please sign out to accept the invite.
            </p>
            <div className="space-y-2">
              <Button
                className="w-full"
                variant="secondary"
                onClick={signInFromInvite}
                asChild
              >
                <a href="/api/auth/sign-out">
                  <LogOut className="mr-2 size-4" />
                  Sign out from {currentUserEmail}
                </a>
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={signInFromInvite}
                asChild
              >
                <Link href="/">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
