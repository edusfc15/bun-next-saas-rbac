import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"; z

export async function getOrganizationBilling(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/billing', {
        schema: {
            tags: ['Billing'],
            summary: 'Get billing information of an organization',
            description: 'This endpoint is used to get billing information of an organization',
            security: [
                {
                    bearerAuth: []
                }
            ],
            params: z.object({
                slug: z.string()
            }),
            response: {
               200: z.object({
                    billing: z.object({
                        seats: z.object({
                            amountOfMembers: z.number(),
                            unit: z.number(),
                            price: z.number()
                        }),
                        projects: z.object({
                            amount: z.number(),
                            unit: z.number(),
                            price: z.number()
                        }),
                        total: z.number()
                    })
                })
            }
        }
    },
        async (request) => {

            const { slug } = request.params
            const userId = await request.getCurrentUserId()

            const { organization, membership } = await request.getUserMembership(slug)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('get', 'Billing')) {
                throw new Error('You are not allowed to get billing information of this organization')
            }

            const [amountOfMembers, amountOfProjects] = await Promise.all([
                prisma.member.count({
                    where: {
                        organizationId: organization.id,
                        role: { not: 'BILLING' }
                    }
                }),

                prisma.project.count({
                    where: {
                        organizationId: organization.id,
                    }
                }),
            ])

            return {
                billing: {
                    seats: {
                        amountOfMembers,
                        unit: 10,
                        price: 10 * amountOfMembers
                    },
                    projects: {
                        amount: amountOfProjects,
                        unit: 20,
                        price: 20 * amountOfProjects,
                    },
                    total: (10 * amountOfMembers) + (20 * amountOfProjects),
                }

            }
        }
    )
}