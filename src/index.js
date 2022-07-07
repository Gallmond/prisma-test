"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.create({
        data: {
            name,
            email
        }
    });
});
const createStore = (name, description, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.store.create({
        data: {
            name,
            description,
            user: { connect: { id: userId } }
        }
    });
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    // delete all
    yield prisma.store.deleteMany({});
    yield prisma.user.deleteMany({});
    // create a user
    const testUser = yield createUser('testUser', 'test@domain.com');
    console.log({ testUser });
    // create two linked stores
    // nb: prisma.store.createMany doesn't work on sqlite
    yield createStore('testStore', 'testStoreDesc', testUser.id);
    yield createStore('testStore1', 'testStore1Desc', testUser.id);
    yield createStore('testStore2', 'testStore2Desc', testUser.id);
    // get the store via the user
    const retrievedUser = yield prisma.user.findFirstOrThrow({ where: { name: 'testUser' }, include: { stores: true } });
    console.log({ retrievedUser });
    const linkedStores = retrievedUser.stores;
    console.log({ linkedStores });
    // get the user via a store
    const lastStore = linkedStores[linkedStores.length - 1];
    const store = yield prisma.store.findUniqueOrThrow({ where: { id: lastStore.id }, include: { user: true } });
    const parentUser = store.user;
    console.log({ store, parentUser });
});
run();
