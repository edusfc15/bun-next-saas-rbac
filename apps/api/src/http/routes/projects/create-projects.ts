import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { createSlug } from "@/utils/create-slug";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function createProject(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organizations/:slug/projects', {
        schema: {
            tags: ['Project'],
            summary: 'Create a new project',
            description: 'This endpoint is used to create a new project',
            security: [
                {
                    bearerAuth: []
                }
            ],
            body: z.object({
                name: z.string().min(1).max(255),
                description: z.string().min(1).max(255)
            }),
            params: z.object({
                slug: z.string().min(1).max(255)
            }),
            response: {
                201: z.object({
                    projectId: z.string()
                })
            }
        }
    },
        async (request, reply) => {

            const { slug } = request.params
            const userId = await request.getCurrentUserId()
            const { organization, membership } = await request.getUserMembership(slug)
            const { name, description } = request.body

            const { cannot } = getUserPermissions(userId, membership.role)

            if (cannot('create', 'Project')) {
                throw new UnauthorizedError('You do not have permission to create a project')
            }

            const project = await prisma.project.create({
                data: {
                    name,
                    description,
                    slug: createSlug(name),
                    organizationId: organization.id,
                    ownerId: userId,
                }
            })

            return reply.status(201).send({ projectId: project.id })

        }
    )
}