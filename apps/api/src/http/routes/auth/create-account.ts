import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function createAccount(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        "/users", {
        schema: {
            tags: ["Auth"],
            summary: "Create a new user",
            description: "This endpoint allows the creation of a new user by providing a name, email, and password. It validates the input, checks for duplicate emails, hashes the password, and stores the user in the database.",
            body: z.object({
                name: z.string().min(3).max(20),
                email: z.string().email(),
                password: z.string().min(6).max(20),
            })
        }
    },
        async (request, reply) => {
            const { name , email, password } = request.body

            const userWithSameEmail = await prisma.user.findUnique({
                where: { email }
            })

            const [,domain] = email.split('@')

            const autoJoinOrganization = await prisma.organization.findFirst({
                where: {
                    domain,
                    shouldAttachUsersByDomain: true
                }
            })
            
            if (userWithSameEmail) {
                throw new Error('User already exists')
            }

            const passwordHash = await hash(password, 6)

            await prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    member_on: autoJoinOrganization 
                    ?{
                        create: {
                            organizationId: autoJoinOrganization.id
                        }
                    } : undefined,
                    
                }
            })

            return reply.status(201).send()

        }
    )
}
