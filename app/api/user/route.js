import { getNotesForUser } from "../databaseInterface"
import { verifyToken } from "../authenticate"
import { cookies } from "next/headers"

export async function GET(response) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })

    const notes = await getNotesForUser(userID)

    return new Response(JSON.stringify(notes), { status: 200 })
}