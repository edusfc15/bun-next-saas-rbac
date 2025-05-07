'use client'

import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@radix-ui/react-separator'

import githubIcon from '@/assets/github-icon.svg'

export default function SignUpPage() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" className="rounded border p-2" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" className="rounded border p-2" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input
          type="password"
          id="password_confirmation"
          className="rounded border p-2"
        />
      </div>

      <Button className="w-full" type="submit">
        Create account
      </Button>

      <Button variant="link" className="w-full size-small" type="submit" asChild>
        <Link href="/auth/sign-in" >
            Already have an account? Sign in
        </Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image
          src={githubIcon}
          alt="Github"
          className="dark-invert mr-8 size-4"
        />
        Sign up with Github
      </Button>
    </form>
  )
}
