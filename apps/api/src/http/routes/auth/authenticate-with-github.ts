import { prisma } from "@/lib/prisma";
import { env } from "@saas/env";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function authenticateWithGithub(app: FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().post(
        '/sessions/github',
        {
            schema: {
                tags: ["Auth"],
                summary: "Authenticate with github",
                description: "This endpoint allows users to authenticate using their github account. It validates the input, checks for the existence of the user, verifies the password, and returns a session token if successful.",
                body: z.object({
                    code: z.string()
                }),
                response: {
                    201: z.object({
                        token: z.string()
                    })
                }
            }
        },
        async (request, reply) => {
            const { code } = request.body

            const githubOAuthURL = new URL('https://github.com/login/oauth/access_token')
            githubOAuthURL.searchParams.append('client_id', env.GITHUB_OAUTH_CLIENT_ID)
            githubOAuthURL.searchParams.append('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET)
            githubOAuthURL.searchParams.append('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI)
            githubOAuthURL.searchParams.append('code', code)

            const githubAccessTokenData = await fetch(githubOAuthURL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                }
            })

            const githubAccessTokenResponse = await githubAccessTokenData.json()

            const { access_token } = z.object
                ({
                    access_token: z.string(),
                    token_type: z.literal('bearer'),
                    scope: z.string()
                }).parse(githubAccessTokenResponse)

            const githubUserResponse = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                }
            }
            )

            const githubUserData = await githubUserResponse.json()

            const { id : githubId, name, email, avatar_url : avatarUrl } = z.object({
                id: z.number().int().transform(String),
                avatar_url: z.string().url(),
                name: z.string().nullable(),
                email: z.string().email().nullable(),
            }).parse(githubUserData)

            if (email == null) {
                throw new Error('Your github account does not have an email, and need this to authenticate')
            }

            let user = await prisma.user.findUnique({
                where: {
                    email
                }
            })
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        avatarUrl,
                    }
                })
            }

            let account = await prisma.account.findUnique({
                where: {
                    provider_userId: {
                        provider: 'GITHUB',
                        userId: user.id
                    }
                }
            })

            if (!account) {
                account = await prisma.account.create({
                    data: {
                        provider: 'GITHUB',
                        userId: user.id,
                        providerAccountId: githubId,
                    }
                })
            }

            const token = await reply.jwtSign({}, {
                sign: {
                    sub: user.id,
                    expiresIn: '7d'
                }
            })

            return reply.status(200).send({
                token
            })


        }
    )

}