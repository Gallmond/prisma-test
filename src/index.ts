
import { PrismaClient, Store, User } from '@prisma/client'
const prisma = new PrismaClient()

const createUser = async (name:string, email:string): Promise<User> => {
  return await prisma.user.create({
    data: {
      name,
      email
    }
  })
}

const createStore = async (name: string, description: string, userId: int): Promis<Store> => {
  return await prisma.store.create({
    data: {
      name,
      description,
      user: { connect: { id: userId } }
    }
  })
}

const run = async () => {
  // delete all
  await prisma.store.deleteMany({})
  await prisma.user.deleteMany({})

  // create a user
  const testUser = await createUser('testUser', 'test@domain.com')
  console.log({ testUser })

  // create two linked stores
  // nb: prisma.store.createMany doesn't work on sqlite
  await createStore('testStore', 'testStoreDesc', testUser.id)
  await createStore('testStore1', 'testStore1Desc', testUser.id)
  await createStore('testStore2', 'testStore2Desc', testUser.id)

  // get the store via the user
  const retrievedUser = await prisma.user.findFirstOrThrow({ where: { name: 'testUser' }, include: { stores: true } })
  console.log({ retrievedUser })

  const linkedStores = retrievedUser.stores
  console.log({ linkedStores })

  // get the user via a store
  const lastStore = linkedStores[linkedStores.length - 1]

  const store = await prisma.store.findUniqueOrThrow({ where: { id: lastStore.id }, include: { user: true } })
  const parentUser = store.user
  console.log({ store, parentUser })
}
run()
