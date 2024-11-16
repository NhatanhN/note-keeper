import bcrypt from "bcrypt"
import fs from "fs/promises"
import path from "path"
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

/* */

async function uploadImage(userID, noteID, file) {
    const imageDir = path.join(process.cwd(), "file-store", "images")
    const fileType = file.type.split("/")[1]
    const image = await db.image.create({
        data: {
            name: file.name,
            note: {
                connect: {
                    id: Number(noteID)
                }
            },
            uploader: {
                connect: {
                    id: userID
                }
            }
        }
    });
    const id = image.id
    await fs.writeFile(path.join(imageDir, `${id}.${fileType}`), Buffer.from(await file.arrayBuffer()))
    return id
}

async function getImage(imageID) {
    const location = path.join(process.cwd(), "file-store", "images", `${imageID}.png`)
    const imageData = await fs.readFile(location)
    return imageData
}

async function deleteImage(id) {
    const location = path.join(process.cwd(), "file-store", "images", `${id}.png`)
    await fs.unlink(location)
}

async function createUser(name, email, password) {
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
}

async function deleteUser(id) {
    const notes = await db.note.findMany({
        where: {
            uploader: {
                id: id
            }
        }
    })

    await db.user.delete({
        where: {
            id: id
        }
    })

    for (const note of notes) {
        await deleteNote(note.id)
    }
}

async function validateLogin(usernameOrEmail, password) {
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
}

/**
 * creates an empty note
 * 
 * @param {*} userID 
 * @param {*} title 
 * @returns 
 */
async function createNote(userID, title) {
    const noteDir = path.join(process.cwd(), "file-store", "notes")
    const note = await db.note.create({
        data: {
            name: title,
            uploader: {
                connect: {
                    id: userID
                }
            }
        }
    })
    const id = note.id
    await fs.writeFile(path.join(noteDir, `${id}`), "")
    return note
}

async function deleteNote(id) {
    const images = await db.image.findMany({
        where: {
            note: {
                id: id
            }
        }
    })

    await db.note.delete({
        where: {
            id: id
        }
    })

    for (const image of images) {
        await deleteImage(image.id)
    }
    
    const location = path.join(process.cwd(), "file-store", "notes", `${id}`)
    await fs.unlink(location)
}

/**
 * overwrites the note with the new contents
 * 
 * @param {*}} noteID 
 * @param {*} content 
 * @param {*} name 
 */
async function updateNote(noteID, content, name) {
    const noteDir = path.join(process.cwd(), "file-store", "notes")
    await fs.writeFile(path.join(noteDir, `${noteID}`), content)
    const note = await db.note.update({
        where: {
            id: noteID
        },
        data: {
            lastUpdatedOn: (new Date()).toISOString(),
            name: name
        }
    });
}

async function getNote(noteID) {
    const location = path.join(process.cwd(), "file-store", "notes", noteID)
    const noteData = await fs.readFile(location)
    return noteData
}

async function getNotesForUser(userID) {
    const notes = await db.note.findMany({
        where: {
            uploader: {
                id: userID
            }
        }
    });
    return notes
}

export {
    createUser,
    deleteUser,
    validateLogin,
    createNote,
    deleteNote,
    updateNote,
    getNote,
    uploadImage,
    getImage,
    getNotesForUser
}