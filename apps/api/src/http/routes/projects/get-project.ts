import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { createSlug } from "@/utils/create-slug";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { BadRequestError } from "../_errors/bad-request-errors";

export async function getProject(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:orgSlug/projects/:projectSlug', {
        schema: {
            tags: ['Project'],
            summary: 'Get a project details',
            description: 'This endpoint is used to get a project details',
            security: [
                {
                    bearerAuth: []
                }
            ],
            params: z.object({
                orgSlug: z.string(),
                projectSlug: z.string()
            }),
            response: {
                200: z.object({
                    project: z.object({
                        name: z.string(),
                        id: z.string(),
                        slug: z.string(),
                        avatarUrl: z.string().url().nullable(),
                        ownerId: z.string(),
                        organizationId: z.string().uuid(),
                        description: z.string(),
                        owner: z.object({
                            name: z.string().nullable(),
                            id: z.string().uuid(),
                            avatarUrl: z.string().url().nullable(),
                        })
                    })
                })
            }
        }
    },
        async (request, reply) => {

            const { orgSlug, projectSlug } = request.params
            const userId = await request.getCurrentUserId()
            const { organization, membership } = await request.getUserMembership(orgSlug)

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('get', 'Project')) {
                throw new UnauthorizedError('You do not have permission to see this project')
            }

            const project = await prisma.project.findUnique({
                where: {
                    slug: projectSlug,
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
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true,
                        }
                    },

                }
            })

            if (!project) {
                throw new BadRequestError('Project not found')
            }

            return reply.status(200).send({ project })

        }
    )
}