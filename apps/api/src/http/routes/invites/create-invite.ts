import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/bad-request-errors";

export async function createInvite(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organizations/:slug/invites', {
        schema: {
            tags: ['Invite'],
            summary: 'Create a new invite',
            description: 'This endpoint is used to create a new invite',
            security: [{bearerAuth: []}
            ],
            body: z.object({
                email: z.string().email(),
                role: roleSchema
            }),
            params: z.object({
                slug: z.string().min(1).max(255)
            }),
            response: {
                201: z.object({
                    inviteId: z.string()
                })
            }
        }
    },
        async (request, reply) => {

            const { slug } = request.params
            const userId = await request.getCurrentUserId()
            const { organization, membership } = await request.getUserMembership(slug)
            
            const { cannot } = getUserPermissions(userId, membership.role)
            
            if (cannot('create', 'Invite')) {
                throw new UnauthorizedError('You are not allowed to create an invite')
            }

            const { email, role } = request.body

            const [, domain] = email.split('@')

            if (organization.shouldAttachUsersByDomain && organization.domain == domain) {
                throw new BadRequestError(`Users with the domain ${domain} will join the organization automatically on login` )
            }

            const inviteWithSameEmail = await prisma.invite.findUnique({
                where: {
                    email_organizationId: {
                        email,
                        organizationId: organization.id
                    }
                }
            })

            if (inviteWithSameEmail) {
                throw new BadRequestError('An invite with this email already exists')
                
            }
            
            const memberWithSameEmail = await prisma.member.findFirst({
                where: {
                    organizationId: organization.id,
                    user: {
                        email
                    }
                }
            })

            if (memberWithSameEmail) {
                throw new BadRequestError('A member with this email already belongs to your organization')
            }

            const invite = await prisma.invite.create({
                data: {
                    email,
                    role,
                    organizationId: organization.id,
                    authorId: userId,

                }
            })

            return reply.status(201).send({ inviteId: invite.id })

        }
    )
}