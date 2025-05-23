import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-errors";
import { auth } from "@/http/middlewares/auth";

export async function acceptInvite(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>()
        .register(auth)
        .post('/invites/:inviteId/accept', {
            schema: {
                tags: ['Invite'],
                summary: 'Accept an invite',
                description: 'This endpoint is used to accept an invite',
                params: z.object({
                    inviteId: z.string().uuid(),
                }),
                response: {
                    204: z.null()
                }
            }
        },
            async (request, reply) => {
                const userId = await request.getCurrentUserId()
                const { inviteId } = request.params

                const invite = await prisma.invite.findUnique({
                    where: {
                        id: inviteId
                    },
                })

                if (!invite) {
                    throw new BadRequestError('Invite not found or expired')
                }

                const user = await prisma.user.findUnique({
                    where: {
                        id: userId
                    }
                })
                if (!user) {
                    throw new BadRequestError('User not found')
                }

                if (user.email !== invite.email) {
                    throw new BadRequestError('This invite belongs to another user')
                }

                await prisma.$transaction([
                    prisma.member.create({
                        data: {
                            userId,
                            organizationId: invite.organizationId,
                            role: invite.role
                        }
                    }),
                    prisma.invite.delete({
                        where: {
                            id: inviteId
                        }
                    }),

                ])

                return reply.status(204).send()

            }
        )
}