import { createNote, getNote, updateNote, deleteNote } from "../databaseInterface";
import { verifyToken } from "@/app/api/authenticate";
import { cookies } from "next/headers";

export async function PUT(request) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })

    console.log("note:PUT -- request verified")

    const { title, content } = await request.json()
    const noteID = await createNote(userID, title, content)
    console.log(`note:PUT -- ${noteID}`)
    return new Response(JSON.stringify({ noteID }), { status: 200 })
}

export async function GET(request) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })

    const { noteID } = await request.json()
    const content = getNote(noteID)
    return new Response(content, { status: 200 })
}

export async function POST(request) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })

    const { noteID, content } = await request.json()
    console.log(`note:POST -- ${noteID} ${content}`)
    updateNote(noteID, content)
    return new Response("OK", { status: 200 })
}

export async function DELETE(request) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })
}