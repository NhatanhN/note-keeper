import styles from "./gearDropdown.module.css"
import baseStyles from "./baseStyles.module.css"
import { useState, useContext } from "react"
import { GlobalContext } from "../applicationContexts/GlobalContext"
import { NoteContext } from "../applicationContexts/NoteEditorContext"
import LoginForm from "./LoginForm"

export default function GearDropdown() {
    const SCREENS = {
        WELCOME: "welcome",
        LOGIN: "login",
        REGISTER: "register",
        SETTINGS: "settings"
    }

    const { username } = useContext(GlobalContext)
    const { setFont, setFontSize, font, fontSize } = useContext(NoteContext)

    const [displayedScreen, setDisplayedScreen] = useState(username ? SCREENS.SETTINGS : SCREENS.WELCOME)

    const changeScreen = (screen) => {
        setDisplayedScreen(screen)
    }

    const handleFontChange = (e) => {
        setFont(e.target.value)
    }

    const handleFontSizeChange = (e) => {
        setFontSize(e.target.value)
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
                    <label htmlFor="font">Font: </label>
                    <select className={styles.select} onChange={handleFontChange} name="font" id="font" defaultValue={font}>
                        <option value="verdana">verdana</option>
                        <option value="arial">arial</option>
                        <option value="times new roman">times new roman</option>
                        <option value="georgia">georgia</option>
                        <option value="courier new">courier new</option>
                    </select>
                    <br />
                    <label htmlFor="font size">Size: </label>
                    <select className={styles.select} onChange={handleFontSizeChange} name="font-size" id="font-size" defaultValue={fontSize}>
                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="16">16</option>
                        <option value="18">18</option>
                        <option value="20">20</option>
                        <option value="22">22</option>
                        <option value="24">24</option>
                        <option value="26">26</option>
                    </select>
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