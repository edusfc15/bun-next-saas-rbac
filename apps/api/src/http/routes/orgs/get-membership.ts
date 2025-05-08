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
                        userId: z.string().uuid(),
                        organizationId: z.string()
                    })
                })
            }
        }
    },
        async (request) => {
            const { slug } = request.params as { slug: string };
            const { membership } = await request.getUserMembership(slug);

            return {
                membership: {
                    id: membership.id,
                    role: membership.role as typeof roleSchema._type,
                    userId: membership.userId,
                    organizationId: membership.organizationId,
                }
            };

        }
    )

}
