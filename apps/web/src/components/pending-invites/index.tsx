'use client'

import { Check, UserPlus2, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getPendingInvites } from '@/app/http/get-pending-invites'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { acceptInviteAction, rejectInviteAction } from './actions'
import { rejectInvite } from '@/app/http/reject-invite'
import { queryClient } from '@/lib/react-query'

dayjs.extend(relativeTime)

export function PendingInvites() {
  const [isOpen, setIsOpen] = useState(false)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <UserPlus2 className="size-4" />
          <span className="sr-only">Pending Invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="block text-sm font-medium">
          Pending Invites ({data?.invites.length ?? 0})
        </span>

        {(data?.invites?.length ?? 0) === 0 && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            You have no pending invites.
          </p>
        )}

        {data?.invites.map((invite) => (
          <div className="space-y-2" key={invite.id}>
            <p className="text-muted-foreground text-sm leading-relaxed">
              <span className="text-foreground font-medium">
                {invite?.author?.name ?? 'Someone'}{' '}
              </span>{' '}
              invited you to join{' '}
              <span className="text-foreground font-medium">
                {invite?.organization.name}
              </span>
              . <span>{dayjs(invite?.createdAt).fromNow()}</span>
            </p>
            <div className="flex gap-1">
              <Button
                onClick={() => handleAcceptInvite(invite.id)}
                size="xs"
                variant="outline"
              >
                <Check className="mr-1.5 size-3" />
                Accept
              </Button>
              <Button
                onClick={() => handleRejectInvite(invite.id)}
                size="xs"
                variant="ghost"
                className="text-muted-foreground"
              >
                <X className="mr-1.5 size-3" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
