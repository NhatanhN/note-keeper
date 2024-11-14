import bcrypt from "bcrypt"
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
const emailRegEx = /\w+@\w+\.\w+/

/* Helper functions */

async function hashPassword(plainPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

async function verifyPassword(plainPassword, hashedPassword) {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
}

/* User functions */

async function createUser(name, email, password) {
    try {
        if (!emailRegEx.test(email)) {
            throw new Error("Invalid email");
        }
        /* disable this for easier testing
        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters");
        }
         */
        if (name.length < 3) {
            throw new Error("Name must be at least 3 characters");
        }
        let existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { name: name },
                    { email: email }
                ]
            }
        });

        if (existingUser) {
            throw new Error("Name or email already taken");
        }

        const hashedPassword = await hashPassword(password);
        const user = await db.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });
        return user;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteUser(id) {

}

async function validateLogin(usernameOrEmail, password) {
    try {
        if (emailRegEx.test(usernameOrEmail)) {
            const user = await db.user.findUnique({
                where: {
                    email: usernameOrEmail
                }
            });
            if (user) {
                const match = await verifyPassword(password, user.password);
                return { "id": user.id };
            }
        } else {
            const user = await db.user.findUnique({
                where: {
                    name: usernameOrEmail
                }
            });
            if (user) {
                const match = await verifyPassword(password, user.password);
                return { "id": user.id };
            }
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

async function createNote() {

}

async function deleteNote() {

}

async function updateNote() {

}

async function getNote() {

}

async function uploadImage() {

}

export {
    createUser,
    deleteUser,
    validateLogin,
    createNote,
    deleteNote,
    updateNote,
    getNote,
    uploadImage
}