import { api } from "./api-client"

interface GetOrganizationsResponse {
    organizations: {
        name: string
        id: string
        slug: string
        avatarUrl: string | null
    }[]
}

export async function getOrganizations() {
    let result

    result = await api.get('organizations').json<GetOrganizationsResponse>();

    return result
}