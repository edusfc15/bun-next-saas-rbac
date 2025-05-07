'use client'

import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@radix-ui/react-separator'

import githubIcon from '@/assets/github-icon.svg'
import { signInWithEmailAndPassword } from './actions'
import { useActionState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function SignInForm() {
  const [{ errors, message, success }, formAction, isPending] = useActionState(
    signInWithEmailAndPassword,
    { success: false, message: null, errors: null }
  )
  return (

    <form action={formAction} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Sign In Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />

        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />

        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        )}

        <Link
          href="/auth/forgot-password"
          className="text-foreground text-xs font-medium hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Sign In With Email'
        )}
      </Button>

      <Button
        variant="link"
        className="size-small w-full"
        type="submit"
        asChild
      >
        <Link href="/auth/sign-up">Create a new account</Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
        Sign In with Github
      </Button>
    </form>
  )
}
