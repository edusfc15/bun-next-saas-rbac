import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-errors";
import { createSlug } from "@/utils/create-slug";

export async function createOrganization(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organizations', {
        schema: {
            tags: ['Organization'],
            summary: 'Create a new organization',
            description: 'Create a new organization',
            security: [
                {
                    bearerAuth: []
                }
            ],
            body: z.object({
                name: z.string().min(1).max(255),
                domain: z.string().nullish(),
                shouldAttachUsersByDomain: z.boolean().optional()
            }),
            response: {
                201: z.object({
                    organizationId: z.string()
                })
            }
        }
    },
        async (request, reply) => {

            const userId = await request.getCurrentUserId()
            const { name, domain, shouldAttachUsersByDomain } = request.body

            if (domain) {
                const organizationByDomain = await prisma.organization.findUnique({
                    where: { domain }
                })

                if (organizationByDomain) {
                    throw new BadRequestError('Another organization is already using this domain')
                    
                }
            }

            const organization = await prisma.organization.create({
                data: {
                    name,
                    slug: createSlug(name),
                    domain,
                    shouldAttachUsersByDomain,
                    ownerId: userId,
                    members: {
                        create: {
                            userId,
                            role: 'ADMIN'
                        }
                    }
                }
            })

        return reply.status(201).send({organizationId: organization.id })

        }
    )
}