import { Role } from "@saas/auth"
import { api } from "./api-client"

interface GetMembershipResponse {
    membership: {
        id: string
        role: Role
        organizationId: string
        userId: string
    }
}

export async function getMembership(org: string) {
    let result

    result = await api.get(`organizations/${org}/membership`).json<GetMembershipResponse>();

    return result
}