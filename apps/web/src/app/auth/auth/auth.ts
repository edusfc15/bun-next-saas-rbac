import { getMembership } from "@/app/http/get-membership";
import { getProfile } from "@/app/http/get-profile";
import { defineAbilityFor } from "@saas/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isAuthenticated() {
    return !!(await cookies()).get("token")?.value
}

export async function getCurrentMembership() {
    const org = await getCurrentOrg()
    if (!org) {
        return null
    }
    const { membership } = await getMembership(org)
    return membership

}

export async function getCurrentOrg() {
    const currentOrg = (await cookies()).get('org')?.value ?? null
    return currentOrg
}

export async function ability() {

    const membership = await getCurrentMembership()
    if (!membership) {
        return null
    }

    const ability = defineAbilityFor({id : membership.userId, role: membership.role})

    return ability

}

export async function auth() {
    const token = (await cookies()).get("token")?.value

    if (!token) {
        console.log("no token", token);

        redirect("/auth/sign-in")
    }

    try {
        const { user } = await getProfile()

        return { user }
    } catch { }

    redirect("/api/auth/sign-out")

}
