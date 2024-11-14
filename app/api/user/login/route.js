import { validateLogin } from "@/app/api/databaseInterface"
import { generateToken } from "@/app/api/authenticate"

export async function POST(request) {
    const { username, password } = await request.json()
    const user = await validateLogin(username, password)

    if (user) {
        const response = new Response({ status: 200 })
        const expirationTime = 8 * 60 * 60 // 4 hours
        const sessionToken = generateToken({ "userID": user.id }, expirationTime)
        response.headers.set("Set-Cookie", `sessionToken=${sessionToken}; Secure; SameSite=Strict; Path=/;`)
        response.headers.append("Set-Cookie", `username=${username}; Secure; SameSite=Strict; Path=/;`)
        return response
    } else {
        return new Response("{ \"error\": \"Invalid username or password\" }", { status: 401 })
    }
}