'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { useFormState } from '@/hooks/use-form-state'
import { createOrganizationAction, OrganizationSchema, updateOrganizationAction } from './actions'

interface OrganizationFormProps {
  isUpdating?: boolean
  initialData?: OrganizationSchema
}


export function OrganizationForm({
  isUpdating = false,
  initialData
}: OrganizationFormProps) {
  const formAction = isUpdating ? updateOrganizationAction : createOrganizationAction
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    formAction
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Save organization failed!</AlertTitle>
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
        <Label htmlFor="name">Organization Name</Label>
        <Input name="name" id="name" defaultValue={initialData?.name} />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="domain">Email domain</Label>
        <Input
          name="domain"
          id="domain"
          type="text"
          inputMode="url"
          placeholder="example.com"
          defaultValue={initialData?.domain ?? undefined}
        />

        {errors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.domain[0]}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <div className="translate-y-0.5">
            <Checkbox
              name="shouldAttachUsersByDomain"
              id="shouldAttachUsersByDomain"
              defaultChecked={initialData?.shouldAttachUsersByDomain}
            />
          </div>
          <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
            <span className="text-sm leading-none font-medium">
              Auto-join new members
            </span>
            <p>
              <span className="text-muted-foreground text-sm">
                Automatically add new members with this email domain to your
                organization.
              </span>
            </p>
          </label>
        </div>

        {errors?.shouldAttachUsersByDomain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.shouldAttachUsersByDomain[0]}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save organization'
        )}
      </Button>
    </form>
  )
}
