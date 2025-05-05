import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { roleSchema } from "@saas/auth";

export async function getMembers(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/members', {
        schema: {
            tags: ['Members'],
            summary: 'Get all organization members',
            description: 'This endpoint is used to get all members of an organization',
            security: [{ bearerAuth: [] }
            ],
            params: z.object({
                slug: z.string()
            }),
            response: {
                200: z.object({
                    members: z.array(
                        z.object({
                            userId: z.string().uuid(),
                            name: z.string().nullable(),
                            avatarUrl:z.string().url().nullable(),
                            email: z.string().email(),
                            id: z.string().uuid(),
                            role: roleSchema
                        })
                    )
                })
            }
        }
    },
        async (request, reply) => {

            const { slug } = request.params
            const userId = await request.getCurrentUserId()
            const { organization, membership } = await request.getUserMembership(slug)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('get', 'User')) {
                throw new UnauthorizedError('You are not allowed to see this organization members')
            }

            const members = await prisma.member.findMany({
                where: {
                    organizationId: organization.id,
                },
                select: {
                    id: true,
                    role: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatarUrl: true,
                        }


                    },

                },
                orderBy: {
                    role: 'asc'
                }
            })

            const membersWithRoles = members.map(({ user: { id: userId, ...user }, ...member }) => {
                return {
                    ...member,
                    ...user,
                    userId
                }
            }
            )

            return reply.status(200).send({ members: membersWithRoles })

        }
    )
}