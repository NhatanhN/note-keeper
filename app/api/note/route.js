import { createNote, getNote, updateNote, deleteNote } from "../databaseInterface";
import { verifyToken } from "@/app/api/authenticate";
import { cookies } from "next/headers";

/**
 * creates an empty note and returns it
 * 
 * @param {*} request 
 * @returns metadata about the newly created note
 */
export async function PUT(request) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })

    const { title } = await request.json()
    const note = await createNote(userID, title)
    return new Response(JSON.stringify({ note }), { status: 200 })
}

/**
 * gets the contents of a note and returns it
 * 
 * @param {*} request 
 * @returns 
 */
export async function GET(request) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })

    const searchParams = new URL(request.url).searchParams
    const noteID = searchParams.get("noteID")
    const content = await getNote(noteID)
    return new Response(content, { status: 200 })
}

/**
 * overwrites the contents of a note
 *
 * @param {*} request
 * @returns
 */
export async function POST(request) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })

    const { noteID, content, name } = await request.json()
    updateNote(noteID, content, name)
    return new Response("OK", { status: 200 })
}

/**
 * deletes a note and all images associated with it
 * 
 * @param {*} request 
 * @returns 
 */
export async function DELETE(request) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })

    const { noteID } = await request.json()
    deleteNote(noteID)
    return new Response("OK", { status: 200 })
}