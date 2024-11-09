import styles from "./themeDropdown.module.css"

const switchTheme = (theme) => {
    console.log(theme)
}

export default function DropdownMenu() {
    return (
        <div className={styles.container}>
            <p>Select your theme</p>
            <br />
            <div className={styles.buttonContainer}>
                <button onClick={e => switchTheme("light")}>Light</button>
                <button onMouseDown={e => switchTheme("blue-filtered")}>Blue-filtered</button>
                <button onMouseDown={e => switchTheme("dark")}>Dark</button>
                <button onMouseDown={e => switchTheme("night")}>Night</button>
            </div>
        </div>
    )
}