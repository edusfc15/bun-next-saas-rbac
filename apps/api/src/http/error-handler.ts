import { FastifyInstance } from "fastify"
import { ZodError } from "zod"
import { BadRequestError } from "./routes/_errors/bad-request-errors"
import { UnauthorizedError } from "./routes/_errors/unauthorized-error"

type FastifyErrorHanlder = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHanlder = (error, request, reply) => {

    if (error instanceof ZodError) {

        return reply.status(400).send({
            message: 'Validation error',
            errors: error.flatten().fieldErrors
        })
    }

    if (error instanceof BadRequestError) {
        return reply.status(400).send({
            message: error.message,
        })

    }

    if (error instanceof UnauthorizedError) {
        return reply.status(401).send({
            message: error.message,
        })
    }

    console.error(error)

    // send error to sentry or any other error tracking service

    reply.status(500).send({
        message: 'Internal server error',
    })

}