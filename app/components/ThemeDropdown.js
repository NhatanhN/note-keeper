import styles from "./themeDropdown.module.css"
import { useContext } from "react"
import { GlobalContext } from "../applicationContexts/GlobalContext"


export default function DropdownMenu() {
    const { setTheme } = useContext(GlobalContext)

    const setThemeAndCookieToo = (theme) => {
        setTheme(theme)
        document.cookie = `theme=${theme}; Secure; SameSite=Strict; Path=/;`
    }

    return (
        <div className={styles.container}>
            <p>Select your theme</p>
            <br />
            <div className={styles.buttonContainer}>
                <button onClick={e => setThemeAndCookieToo("light")}>Light</button>
                <button onMouseDown={e => setThemeAndCookieToo("dark")}>Dark</button>
                <button onMouseDown={e => setThemeAndCookieToo("night")}>Night</button>
            </div>
        </div>
    )
}