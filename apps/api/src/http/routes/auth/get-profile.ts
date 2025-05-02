import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-errors";

export async function getProfile(app: FastifyInstance) {


    app.withTypeProvider<ZodTypeProvider>().get('/profile', {
        schema: {
            tags: ["Auth"],
            summary: "Get authenticated user profile",
            description: "This endpoint allows users to retrieve their profile information. It validates the JWT token and returns the user's profile data.",
            response: {
                404: z.object({
                                    message: z.string()
                                }),
                200: z.object({
                    user: z.object({
                        id: z.string().uuid(),
                        name: z.string().nullable(),
                        email: z.string().email(),
                        avatarUrl: z.string().url().nullable(),
                    })
                })
            }
        }
    },
        async (request, reply) => {
            const { sub } = await request.jwtVerify<{ sub: string }>()

            const user = await prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                },
                where: {
                    id: sub
                    ,
                }
            })

            if (!user) {
                throw new BadRequestError('User not found')
            }

            return reply.status(200).send( { user })
        }
    )

}