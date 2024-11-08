import basestyles from "./baseStyles.module.css"
import styles from "./noteEditor.module.css"

export default function NoteEditor() {
    return (
        <div className={`${basestyles.container} ${styles.container}`}>
            hello note editor
        </div>
    )
}