import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { hash } from "bcryptjs";


export async function resetPassword(app: FastifyInstance) {


    app.withTypeProvider<ZodTypeProvider>().post('/password/reset', {
        schema: {
            tags: ["Auth"],
            summary: "",
            description: "This endpoint allows users to retrieve their profile information. It validates the JWT token and returns the user's profile data.",
            body: z.object({
                code: z.string(),
                password: z.string().min(6).max(20),
            }),
            response: {
                201: z.null()
            }
        }
    },
        async (request, reply) => {
            const { code, password } = request.body

            const tokenFromCode = await prisma.token.findUnique({
                where: {
                    id: code
                }
            })

            if (!tokenFromCode) {
                throw new  UnauthorizedError('Invalid token')
            }

            const passwordHash = await hash(password, 6)
            //send email to user with the token

            await prisma.$transaction([
                prisma.token.delete({
                    where: {
                        id: code
                    }
                }),
                prisma.user.update({
                    where: {
                        id: tokenFromCode.userId
                    },
                    data: {
                        passwordHash
                    }
                })
    
            ])

            return reply.status(204).send()
        }
    )

}