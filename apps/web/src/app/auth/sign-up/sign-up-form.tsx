'use client'

import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@radix-ui/react-separator'

import githubIcon from '@/assets/github-icon.svg'
import { useFormState } from '@/hooks/use-form-state'
import { signUpAction } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { signInWithGithub } from '../actions'

export function SignUpForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(signUpAction)

  return (
      <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Sign In Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input name="name" id="name" />

          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" type="email" />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" id="password" />

          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
          name="password_confirmation"
            type="password"
            id="password_confirmation"
          />

          {errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password_confirmation[0]}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Create an account'
          )}
        </Button>

        <Button
          variant="link"
          className="size-small w-full"
          type="submit"
          asChild
        >
          <Link href="/auth/sign-in">Already have an account? Sign in</Link>
        </Button>
      </form>

      <Separator />

      <form action={signInWithGithub}>
        <Button type="submit" variant="outline" className="w-full">
          <Image
            src={githubIcon}
            alt="Github"
            className="dark-invert mr-8 size-4"
          />
          Sign up with Github
        </Button>
      </form>
    </div>
  )
}
