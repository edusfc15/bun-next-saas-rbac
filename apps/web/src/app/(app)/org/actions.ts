'use server'

import { getCurrentOrg } from '@/app/auth/auth/auth'
import { createOrganization } from '@/app/http/create-organizations'
import { updateOrganization } from '@/app/http/update-organization'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

const organizationSchema = z
    .object({
        name: z.string().min(4, { message: 'Please include at least 4 characters' }),
        domain: z.string().nullable().refine((value) => {
            if (value) {
                const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                return domainRegex.test(value)
            }
            return true
        }, { message: 'Please include a valid domain' }),
        shouldAttachUsersByDomain:
            z.union([z.literal('on'), z.literal('off'), z.boolean()])
                .transform((value) => value === true || value === 'on')
                .default(false)

    }).refine(
        (data) => {
            if (data.shouldAttachUsersByDomain && !data.domain) {
                return false
            }
            return true
        },
        {
            message: 'Please include a domain if you want to attach users by domain',
            path: ['domain'],
        }
    )

export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(data: FormData) {
    const result = organizationSchema.safeParse(Object.fromEntries(data))

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }

    const { name, domain, shouldAttachUsersByDomain } = result.data

    try {
        await createOrganization({
            name,
            domain,
            shouldAttachUsersByDomain,
        })

        revalidateTag('organizations')
    } catch (err) {
        if (err instanceof HTTPError) {
            const { message } = await err.response.json()

            return { success: false, message, errors: null }
        }

        console.error(err)

        return {
            success: false,
            message: 'Unexpected error, try again in a few minutes',
            errors: null,
        }
    }

    return { success: true, message: 'Organization created successfully', errors: null }

    //redirect('/auth/sign-in')
}
export async function updateOrganizationAction(data: FormData) {
    const currentOrg = await getCurrentOrg()
    const result = organizationSchema.safeParse(Object.fromEntries(data))

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }

    const { name, domain, shouldAttachUsersByDomain } = result.data

    try {
        await updateOrganization({
            org: currentOrg!,
            name,
            domain,
            shouldAttachUsersByDomain,
        })
        revalidateTag('organizations')
    } catch (err) {
        if (err instanceof HTTPError) {
            const { message } = await err.response.json()

            return { success: false, message, errors: null }
        }

        console.error(err)

        return {
            success: false,
            message: 'Unexpected error, try again in a few minutes',
            errors: null,
        }
    }

    return { success: true, message: 'Organization updated successfully', errors: null }

    //redirect('/auth/sign-in')
}
