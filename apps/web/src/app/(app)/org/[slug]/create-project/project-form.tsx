'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useFormState } from '@/hooks/use-form-state'
import { Textarea } from '@/components/ui/textarea'
import { createProjectAction } from './actions'
import { queryClient } from '@/lib/react-query'
import { useParams } from 'next/navigation'

export function ProjectForm() {
  const { slug: org } = useParams<{ slug: string }>()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    createProjectAction
  )

  if (success) {
    queryClient.invalidateQueries({
      queryKey: [org, 'projects'],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Save project failed!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="success" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-3">
        <Label htmlFor="name">Project Name</Label>
        <Input name="name" id="name" />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" id="description" />

        {errors?.description && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.description[0]}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save project'
        )}
      </Button>
    </form>
  )
}
