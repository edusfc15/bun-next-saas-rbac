'use server'

import { getCurrentOrg } from '@/app/auth/auth/auth'
import { createProject } from '@/app/http/create-project'
// import { createProject } from '@/app/http/create-projects'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

const projectSchema = z
    .object({
        name: z.string().min(4, { message: 'Please include at least 4 characters' }),
        description: z.string()

    })

export async function createProjectAction(data: FormData) {
    const currentOrg = await getCurrentOrg()
    const result = projectSchema.safeParse(Object.fromEntries(data))

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }

    const { name, description } = result.data

    try {
        await createProject({
            org: currentOrg!,
            name,
            description
        })

        revalidateTag(`${currentOrg}/projects`)

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

    return { success: true, message: 'Project created successfully', errors: null }

    //redirect('/auth/sign-in')
}
