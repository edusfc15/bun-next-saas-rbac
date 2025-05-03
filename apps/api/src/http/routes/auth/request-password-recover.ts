import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma";
import z from "zod";

export async function requestPasswordRecover(app: FastifyInstance) {


    app.withTypeProvider<ZodTypeProvider>().post('/password/recover', {
        schema: {
            tags: ["Auth"],
            summary: "Request password recovery",
            description: "This endpoint allows users to request a password recovery. It validates the JWT token and returns the user's profile data.",
            body: z.object({
                email: z.string().email(),
            }),
            response: {
                201: z.null()
            }
        }
    },
        async (request, reply) => {
            const { email } = request.body

            const userFromEmail = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if (!userFromEmail) {
                return reply.status(201).send()
            }

            const { id: code } = await prisma.token.create({
                data: {
                    userId: userFromEmail.id,
                    type: 'PASSWORD_RECOVER',
                }
            })

            //send email to user with the token

            console.log('Recover code: ', code);


            return reply.status(200).send()
        }
    )

}