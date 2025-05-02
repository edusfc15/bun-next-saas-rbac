import { compare } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-errors";

export async function authenticateWithPassword(app: FastifyInstance) {


    app.withTypeProvider<ZodTypeProvider>().post(
        '/sessions/password',
        {
            schema: {
                tags: ["Auth"],
                summary: "Authenticate with password",
                description: "This endpoint allows users to authenticate using their email and password. It validates the input, checks for the existence of the user, verifies the password, and returns a session token if successful.",
                body: z.object({
                    email: z.string().email(),
                    password: z.string().min(8).max(20),
                }),
                response: {
                    201: z.object({
                        token: z.string()
                    })
                }
            }
        },
        async (request, reply) => {
            console.log('BODY:', request.body)
            const { email, password } = request.body

            const userFromEmail = await prisma.user.findUnique({
                where: { email }
            })

            if (!userFromEmail) {
                throw new BadRequestError('Invalid credentials')
            }

            if (userFromEmail.passwordHash == null) {
                throw new BadRequestError('User does not have a password, use social login ')
            }

            const isPasswordValid = await compare(
                password,
                userFromEmail.passwordHash
            )

            if (!isPasswordValid) {
                throw new BadRequestError('Invalid credentials')
            }



            const token = await reply.jwtSign({}, {
                sign: {
                    sub: userFromEmail.id,
                    expiresIn: '7d'
                }
            })

            return reply.status(200).send({
                token
            })

        }
    )

}