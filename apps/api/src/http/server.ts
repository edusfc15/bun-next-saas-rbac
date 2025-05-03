import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { jsonSchemaTransform, serializerCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { createAccount } from './routes/auth/create-account'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import fastifyJwt from '@fastify/jwt'
import { getProfile } from './routes/auth/get-profile'
import { errorHandler } from './error-handler'
import z, { ZodType } from 'zod'
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'
import { env } from '@saas/env'

const validatorCompiler = ({ schema }: { schema: ZodType<any> }) => {
    return (data: unknown) => {
        const result = schema.safeParse(data)
        if (!result.success) {
            throw result.error
        }
        return result.data
    }
}
const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Next.js Saas',
            description: 'Full stack saas application with multitenancy',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT authorization header',
                }
            }
        }
    },
    transform: jsonSchemaTransform,

});

app.register(fastifySwaggerUi,
    {
        routePrefix: '/docs'
    }
)

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
})
app.register(fastifyCors)

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)


app.listen({ port: env.SERVER_PORT }, (err, address) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})
