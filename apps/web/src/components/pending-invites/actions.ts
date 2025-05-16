'use server'

import { acceptInvite } from "@/app/http/accept-invite";
import { rejectInvite } from "@/app/http/reject-invite";
import { revalidateTag } from "next/cache";

export async function acceptInviteAction(inviteId: string) {
    await acceptInvite(inviteId);

    revalidateTag('organizations');
}

export async function rejectInviteAction(inviteId: string) {
    await rejectInvite(inviteId);

    revalidateTag('organizations');
}