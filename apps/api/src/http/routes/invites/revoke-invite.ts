import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { BadRequestError } from "../_errors/bad-request-errors";

export async function revokeInvite(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organizations/:slug/invites/:inviteId', {
        schema: {
            tags: ['Invite'],
            summary: 'Revoke an invite',
            description: 'This endpoint is used to revoke an invite',
            security: [{bearerAuth: []}
            ],

            params: z.object({
                slug: z.string(),
                inviteId: z.string().uuid(),
            }),
            response: {
                204: z.null()
            }
        }
    },
        async (request, reply) => {

            const { slug, inviteId } = request.params
            const userId = await request.getCurrentUserId()
            const { organization, membership } = await request.getUserMembership(slug)
            
            const { cannot } = getUserPermissions(userId, membership.role)
            
            if (cannot('delete', 'Invite')) {
                throw new UnauthorizedError('You are not allowed to revoke an invite')
            }

            const invite = await prisma.invite.findUnique({
                where: {
                    id: inviteId,
                    organizationId: organization.id
                }
            })

            if (!invite) {
                throw new BadRequestError(' Invite not found or already revoked')
                
            }
            
          await prisma.invite.delete({
                where: {
                    id: inviteId
                }
            })

            return reply.status(204).send()

        }
    )
}