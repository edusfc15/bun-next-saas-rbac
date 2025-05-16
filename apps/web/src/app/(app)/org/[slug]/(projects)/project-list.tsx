import { getCurrentOrg, ability } from '@/app/auth/auth/auth'
import { getProjects } from '@/app/http/get-projects'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export async function ProjectList() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const { projects } = await getProjects(currentOrg!)

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id} className='flex flex-col justify-between'>
          <CardHeader>
            <CardTitle className='text-xl font-medium'>{project.name}</CardTitle>
            <CardDescription className="line-clamp-2 leading-relaxed">
              {project.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center gap-1.5">
            <Avatar className="size-4">
              {project.owner.avatarUrl ? (
                <AvatarImage src={project.owner.avatarUrl} />
              ) : (
                <AvatarFallback />
              )}
            </Avatar>

            <span className="text-muted-foreground text-xs truncate">
              <span className="text-foreground font-medium">
                {project.owner.name}
              </span>{' '}
              <span>{dayjs(project.createdAt).fromNow()}</span>
            </span>

            <Button variant="outline" size="xs" className="ml-auto">
              View <ArrowRight className="ml-2 size-3" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
