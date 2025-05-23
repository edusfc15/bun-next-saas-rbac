import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function getProjects(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/projects', {
        schema: {
            tags: ['Project'],
            summary: 'Get all organization projects',
            description: 'This endpoint is used to get all projects of an organization',
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
                    projects: z.array(
                        z.object({
                            name: z.string(),
                            id: z.string(),
                            slug: z.string(),
                            avatarUrl: z.string().nullable(),
                            ownerId: z.string(),
                            organizationId: z.string().uuid(),
                            description: z.string(),
                            createdAt: z.date(),
                            owner: z.object({
                                name: z.string().nullable(),
                                id: z.string().uuid(),
                                avatarUrl: z.string().nullable(),
                            })
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

            if (cannot('get', 'Project')) {
                throw new UnauthorizedError('You are not allowed to see this organization projects')
            }

            const projects = await prisma.project.findMany({
                where: {
                    organizationId: organization.id,
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    ownerId: true,
                    description: true,
                    avatarUrl: true,
                    organizationId: true,
                    createdAt: true,
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true,
                        }
                    },

                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            return reply.status(200).send({ projects })

        }
    )
}