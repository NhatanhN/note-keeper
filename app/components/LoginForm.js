import baseStyles from "./baseStyles.module.css"
import styles from "./LoginForm.module.css"
import { useState } from "react"

export default function LoginForm({ isRegistering }) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [statusMsg, setStatusMsg] = useState("")

    const handleLogin = (e) => {
        e.preventDefault()
        setStatusMsg(statusMsg == "" ? "test message" : "");
        console.log("login")
    }

    const handleRegister = (e) => {
        e.preventDefault()
        setStatusMsg(statusMsg == "" ? "test message" : "");
        console.log("register")
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
                    required
                />
                <input
                    className={baseStyles.textInput}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="email"
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