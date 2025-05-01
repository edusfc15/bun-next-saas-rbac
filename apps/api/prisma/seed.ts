import { PrismaClient } from "../src/generated/prisma";

import { hash } from 'bcryptjs'

import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function seed() {

    await prisma.project.deleteMany()
    await prisma.member.deleteMany()
    await prisma.organization.deleteMany()
    await prisma.user.deleteMany()

    const passwordHash = await hash('12345678', 1)

    const [user, anotherUser, anotherUser2] = await Promise.all([
        prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@acme.com',
                avatarUrl: 'https://i.pravatar.cc/150?u=1',
                passwordHash: passwordHash
            }
        }),
        prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                avatarUrl: faker.image.avatar(),
                passwordHash: passwordHash
            }
        }),
        prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                avatarUrl: faker.image.avatar(),
                passwordHash: passwordHash
            }
        })
    ])

    await prisma.organization.create({
        data: {
            name: 'Acme Inc.(Admin)',
            slug: 'acme-admin',
            domain: 'acme.com',
            avatarUrl: faker.image.avatar(),
            shouldAttachUsersByDomain: true,
            ownerId: user.id,
            projects: {
                createMany: {
                    data: [{
                        name: faker.lorem.words(5),
                        slug: faker.lorem.slug(5),
                        description: faker.lorem.paragraph(1),
                        avatarUrl: faker.image.avatar(),
                        ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
                    },
                    {
                        name: faker.lorem.words(5),
                        slug: faker.lorem.slug(5),
                        description: faker.lorem.paragraph(1),
                        avatarUrl: faker.image.avatar(),
                        ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
                    },
                    {
                        name: faker.lorem.words(5),
                        slug: faker.lorem.slug(5),
                        description: faker.lorem.paragraph(1),
                        avatarUrl: faker.image.avatar(),
                        ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
                    }
                    ]
                }
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: user.id,
                            role: 'ADMIN'
                        },
                        {
                            userId: anotherUser.id,
                            role: 'MEMBER'
                        },
                        {
                            userId: anotherUser2.id,
                            role: 'MEMBER'
                        }
                    ]
                }

            }
        }
    })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc.(Member)',
            slug: 'acme-member',
            avatarUrl: faker.image.avatar(),
            ownerId: user.id,
            projects: {
                createMany: {
                    data: [{
                        name: faker.lorem.words(5),
                        slug: faker.lorem.slug(5),
                        description: faker.lorem.paragraph(1),
                        avatarUrl: faker.image.avatar(),
                        ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
                    },
                    {
                        name: faker.lorem.words(5),
                        slug: faker.lorem.slug(5),
                        description: faker.lorem.paragraph(1),
                        avatarUrl: faker.image.avatar(),
                        ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
                    },
                    {
                        name: faker.lorem.words(5),
                        slug: faker.lorem.slug(5),
                        description: faker.lorem.paragraph(1),
                        avatarUrl: faker.image.avatar(),
                        ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
                    }
                    ]
                }
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: user.id,
                            role: 'MEMBER'
                        },
                        {
                            userId: anotherUser.id,
                            role: 'ADMIN'
                        },
                        {
                            userId: anotherUser2.id,
                            role: 'MEMBER'
                        }
                    ]
                }

            }
        }
    })

    await prisma.organization.create({
        data: {
            name: 'Acme Inc.(Billing)',
            slug: 'acme-billing',
            avatarUrl: faker.image.avatar(),
            ownerId: user.id,
            projects: {
                createMany: {
                    data: [{
                        name: faker.lorem.words(5),
                        slug: faker.lorem.slug(5),
                        description: faker.lorem.paragraph(1),
                        avatarUrl: faker.image.avatar(),
                        ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
                    },
                    {
                        name: faker.lorem.words(5),
                        slug: faker.lorem.slug(5),
                        description: faker.lorem.paragraph(1),
                        avatarUrl: faker.image.avatar(),
                        ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
                    },
                    {
                        name: faker.lorem.words(5),
                        slug: faker.lorem.slug(5),
                        description: faker.lorem.paragraph(1),
                        avatarUrl: faker.image.avatar(),
                        ownerId: faker.helpers.arrayElement([user.id, anotherUser.id, anotherUser2.id]),
                    }
                    ]
                }
            },
            members: {
                createMany: {
                    data: [
                        {
                            userId: user.id,
                            role: 'BILLING'
                        },
                        {
                            userId: anotherUser.id,
                            role: 'ADMIN'
                        },
                        {
                            userId: anotherUser2.id,
                            role: 'MEMBER'
                        }
                    ]
                }

            }
        }
    })
}

seed().then(() => {
    console.log('Seeding complete!')
    prisma.$disconnect()
})

