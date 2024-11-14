import { createUser } from "@/app/api/databaseInterface"
import { generateToken } from "@/app/api/authenticate"

export async function POST(request) {
    const { username, email, password } = await request.json();
    try {
        const user = await createUser(username, email, password)
        const response = new Response({ status: 201 })
        const expirationTime = 8 * 60 * 60 // 4 hours
        const sessionToken = generateToken({ "userID": user.id }, expirationTime)
        response.headers.set("Set-Cookie", `sessionToken=${sessionToken}; Secure; SameSite=Strict; Path=/;`)
        response.headers.append("Set-Cookie", `username=${username}; Secure; SameSite=Strict; Path=/;`)
        return response
    } catch (error) {
        return new Response(`{ "error": "${error.message}" }`, { status: 500 })
    }
}