import { auth } from "@/http/middlewares/auth";
import { roleSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";


export async function getMembership(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/membership', {
        schema: {
            tags: ['Organization'],
            description: 'Get the membership of the current user in the organization',
            security: [
                { bearerAuth: [] }
            ],
            params: z.object({
                slug: z.string()
            }),
            response: {
                200: z.object({
                    membership: z.object({
                        id: z.string(),
                        role: roleSchema,
                        organizationId: z.string()
                    })
                })
            }
        }
    },
        async (request) => {
            const { slug } = request.params
            const { membership } = await request.getUserMembership(slug)

            return {
                membership: {
                    id: membership.id,
                    role: roleSchema.parse(membership.role),
                    organizationId: membership.organizationId,
                }
            }


        }
    )

}
