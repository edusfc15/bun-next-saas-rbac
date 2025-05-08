'use client'

import Link from "next/link";
import Image from 'next/image'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import githubIcon from "@/assets/github-icon.svg";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  return (
    <form action="" className="space-y-4">
        <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" required className="border p-2 rounded" />
        </div>
       

        <Button className="w-full" type="submit">
            Recover Password
        </Button>

        <Button variant="link" className="w-full size-small" type="submit" asChild>
        <Link href="/auth/sign-in" >
            Sign in instead
        </Link>
      </Button>

        <Separator/>

        <Button type="button" variant="outline" className="w-full">
            <Image src={githubIcon} alt="Github" width={16} height={16} className="mr-2 dark:invert" />
            Sign In with Github
        </Button>
    </form>
  )
}
