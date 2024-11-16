import { uploadImage, getImage } from "../databaseInterface";
import { verifyToken } from "../authenticate";
import { cookies } from "next/headers";

export async function POST(request) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })

    const formData = await request.formData();
    const file = formData.get("image");
    const noteID = formData.get("noteID");
    if (file.size > 2000000) return new Response("File too large", { status: 400 })
    if (!file || !file.arrayBuffer) return new Response("Bad Request", { status: 400 })

    const imageID = await uploadImage(userID, noteID, file)
    return new Response(JSON.stringify({ imageID }), { status: 200 })
}

export async function GET(request) {
    const sessionToken = (await cookies()).get("sessionToken").value
    if (!sessionToken) return new Response("Unauthorized", { status: 401 })
    const { userID } = verifyToken(sessionToken)
    if (!userID) return new Response("Unauthorized", { status: 401 })

    const requestParams = new URL(request.url)
    const imageID = requestParams.searchParams.get("imageID")
    if (!imageID) return new Response("Bad Request", { status: 400 })

    const imageData = await getImage(imageID)
    if (!imageData) return new Response("Not Found", { status: 404 })
    return new Response(imageData, { status: 200 })
}