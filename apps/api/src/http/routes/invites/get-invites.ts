import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/bad-request-errors";

export async function getInvites(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/invites', {
        schema: {
            tags: ['Invite'],
            summary: 'Get all organization invites',
            description: 'This endpoint is used to create a new invite',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string().min(1).max(255)
            }),
            response: {
                201: z.object({
                    invites: z.array(
                        z.object({
                            id: z.string().uuid(),
                            email: z.string().email(),
                            role: roleSchema,
                            createdAt: z.date(),
                            author: z.object({
                                id: z.string().uuid(),
                                name: z.string().nullable()
                            }).nullable(),
                        })
                    )
                })
            }
        }
    },
        async (request) => {

            const { slug } = request.params
            const userId = await request.getCurrentUserId()
            const { organization, membership } = await request.getUserMembership(slug)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('get', 'Invite')) {
                throw new UnauthorizedError('You are not allowed to see the organization invites')
            }


            const invites = await prisma.invite.findMany({
                where: {
                    organizationId: organization.id
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            return { invites }

        }
    )
}