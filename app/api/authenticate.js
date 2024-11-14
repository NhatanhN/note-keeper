import jwt from "jsonwebtoken"

/**
 * Signs a token with the given payload and expiration time.
 * 
 * @param {JSON} payload 
 * @param {String | Number} expirationTime time until expiry in seconds
 * @returns the signed token
 */
function generateToken(payload, expirationTime) {
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: expirationTime })
    return token
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        return decoded
    } catch (err) {
        return null
    }
}

export {
    generateToken,
    verifyToken
}