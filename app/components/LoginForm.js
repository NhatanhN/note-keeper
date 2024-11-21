import baseStyles from "./baseStyles.module.css"
import styles from "./LoginForm.module.css"
import { useState } from "react"

export default function LoginForm({ isRegistering }) {
    const [statusMsg, setStatusMsg] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()

        console.log("login pressed")
        setStatusMsg("")
        const username = e.target.username.value
        const password = e.target.password.value

        const res = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        })

        if (!res.ok) {
            const { error } = await res.json()
            setStatusMsg(error)
            return
        }

        location.reload()
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setStatusMsg("")
        const username = e.target.username.value
        const email = e.target.email.value
        const password = e.target.password.value
        const confirmPassword = e.target.confirmPassword.value

        if (password != confirmPassword) {
            setStatusMsg("Passwords do not match")
            return
        }
        if (username.length < 3) {
            setStatusMsg("Username must be at least 3 characters")
            return
        }
        /* turned this off for easier testing
        if (password.length < 8) {
            setStatusMsg("Password must be at least 8 characters")
            return
        }
         */

        const res = await fetch("/api/user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        })
        
        if (!res.ok) {
            const { error } = await res.json()
            setStatusMsg(error)
            return
        }

        location.reload()
    }

    if (isRegistering) {
        return (
            <form onSubmit={(e) => handleRegister(e)}>
                <input
                    className={baseStyles.textInput}
                    id="username"
                    type="text"
                    name="username"
                    placeholder="username"
                    autoComplete="off"
                    required
                />
                <input
                    className={baseStyles.textInput}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="email"
                    autoComplete="off"
                    required
                />
                <input
                    className={baseStyles.textInput}
                    id="password"
                    type="password"
                    name="password"
                    placeholder="password"
                    required
                />
                <input
                    className={baseStyles.textInput}
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="confirm password"
                    required
                />
                <div className={styles.errMsgContainer}>
                    {statusMsg &&
                        <p className={`${baseStyles.errMsg} ${styles.errMsg}`}>{statusMsg}</p>
                    }
                </div>
                <button className={baseStyles.button} type="submit">Register</button>
            </form>
        )
    }

    return (
        <form onSubmit={(e) => handleLogin(e)}>
            <input
                className={baseStyles.textInput}
                id="username"
                type="text"
                name="username"
                placeholder="username or email"
                autoComplete="off"
                required
            />
            <input
                className={baseStyles.textInput}
                id="password"
                type="password"
                name="password"
                placeholder="password"
                required
            />
            <div className={styles.errMsgContainer}>
                {statusMsg &&
                    <p className={`${baseStyles.errMsg} ${styles.errMsg}`}>{statusMsg}</p>
                }
            </div>
            <button className={baseStyles.button} type="submit">Login</button>
        </form>
    )
} 