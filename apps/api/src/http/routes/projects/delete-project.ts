import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { BadRequestError } from "../_errors/bad-request-errors";
import { projectSchema } from "@saas/auth";

export async function deleteProject(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organizations/:slug/projects/:projectId', {
        schema: {
            tags: ['Project'],
            summary: 'Delete a project',
            description: 'This endpoint is used delete a project',
            security: [
                {
                    bearerAuth: []
                }
            ],
            params: z.object({
                slug: z.string().min(1).max(255),
                projectId: z.string().uuid()
            }),
            response: {
                204: z.null()
            }
        }
    },
        async (request, reply) => {

            const { slug, projectId } = request.params
            const userId = await request.getCurrentUserId()
            const { organization, membership } = await request.getUserMembership(slug)

            const project = await prisma.project.findUnique({
                where: {
                    id: projectId,
                    organizationId: organization.id
                }
            })

            if (!project) {
                throw new BadRequestError('Project not found')
            }

            const { cannot } = getUserPermissions(userId, membership.role)
            const authProject = projectSchema.parse(project)

            if (cannot('delete', authProject)) {
                throw new UnauthorizedError('You are not allowed to delete this project')
            }

           await prisma.project.delete({
                where: {
                    id: projectId,
                }
            })

            return reply.status(204).send()
        }
    )
}