import styles from "./themeDropdown.module.css"
import { useContext } from "react"
import { GlobalContext } from "../applicationContexts/GlobalContext"


export default function DropdownMenu() {
    const { setTheme } = useContext(GlobalContext)


    return (
        <div className={styles.container}>
            <p>Select your theme</p>
            <br />
            <div className={styles.buttonContainer}>
                <button onClick={e => setTheme("light")}>Light</button>
                <button onMouseDown={e => setTheme("blue-filtered")}>Blue-filtered</button>
                <button onMouseDown={e => setTheme("dark")}>Dark</button>
                <button onMouseDown={e => setTheme("night")}>Night</button>
            </div>
        </div>
    )
}