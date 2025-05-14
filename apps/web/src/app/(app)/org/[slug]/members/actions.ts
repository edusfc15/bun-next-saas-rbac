'use server'

import { getCurrentOrg } from "@/app/auth/auth/auth"
import { removeMember } from "@/app/http/remove-member"
import { revalidateTag } from "next/cache"

export async function removeMemberAction(memberId: string) {
    const currentOrg = await getCurrentOrg()

    await removeMember({ org :currentOrg!, memberId })

    revalidateTag(`${currentOrg}/members`)
}