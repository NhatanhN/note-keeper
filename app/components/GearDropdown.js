import styles from "./gearDropdown.module.css"
import baseStyles from "./baseStyles.module.css"
import { useState, useContext } from "react"
import { GlobalContext } from "../applicationContexts/GlobalContext"
import LoginForm from "./LoginForm"

export default function GearDropdown() {
    const SCREENS = {
        WELCOME: "welcome",
        LOGIN: "login",
        REGISTER: "register",
        SETTINGS: "settings"
    }

    const { username } = useContext(GlobalContext)

    const [displayedScreen, setDisplayedScreen] = useState(username ? SCREENS.SETTINGS : SCREENS.WELCOME)

    const changeScreen = (screen) => {
        setDisplayedScreen(screen)
    }

    const logout = () => {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        document.cookie = "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        location.reload()
    }

    return (
        <div className={styles.container}>
            {/**if not logged in */}
            {displayedScreen == SCREENS.WELCOME &&
                <>
                    <p>Welcome</p>
                    <br />
                    <div className={styles.buttonContainer}>
                        <button
                            className={`${baseStyles.button} ${styles.button}`}
                            onClick={() => changeScreen(SCREENS.LOGIN)}
                        >
                            Login
                        </button>
                        <button
                            className={`${baseStyles.button} ${styles.button}`}
                            onClick={() => changeScreen(SCREENS.REGISTER)}
                        >
                            Register
                        </button>
                    </div>
                </>
            }
            {displayedScreen == SCREENS.LOGIN &&
                <>
                    <div className={styles.header}>
                        <p>Login</p>
                        <div className={styles.spacing} />
                        <button
                            className={`${baseStyles.button} ${styles.button}`}
                            onClick={() => changeScreen(SCREENS.WELCOME)}
                        >
                            Back
                        </button>

                    </div>
                    <br />
                    <div className={styles.buttonContainer}>
                        <LoginForm />
                    </div>
                </>
            }
            {displayedScreen == SCREENS.REGISTER &&
                <>
                    <div className={styles.header}>
                        <p>Register</p>
                        <div className={styles.spacing} />
                        <button
                            className={`${baseStyles.button} ${styles.button}`}
                            onClick={() => changeScreen(SCREENS.WELCOME)}
                        >
                            Back
                        </button>

                    </div>
                    <br />
                    <div className={styles.buttonContainer}>
                        <LoginForm isRegistering={true} />
                    </div>
                </>
            }

            {/**if logged in */}
            {displayedScreen == SCREENS.SETTINGS &&
                <>
                    <p>Settings</p>
                    <br />
                    <div className={styles.buttonContainer}>
                        <button
                            className={`${baseStyles.button} ${styles.button}`}
                            onClick={logout}
                        >
                            Log out
                        </button>
                    </div>
                </>
            }
        </div>
    )
}