import { api } from "./api-client"

interface GetBillingResponse {
    billing: {
        seats: {
            amountOfMembers: number;
            unit: number;
            price: number;
        };
        projects: {
            unit: number;
            price: number;
            amount: number;
        };
        total: number;
    }
}

export async function getBilling(org: string) {
    let result

    result = await api.get(`organizations/${org}/billing`
    ).json<GetBillingResponse>();

    return result
}