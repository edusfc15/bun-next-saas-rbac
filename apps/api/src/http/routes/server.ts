import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { createAccount } from './auth/create-account'


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)
app.register(createAccount)

app.listen({ port: 3333 }, (err, address) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    app.log.info(`Server listening at ${address}`)
})
