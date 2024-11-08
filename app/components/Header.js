import basestyles from "./baseStyles.module.css"
import styles from "./header.module.css"

export default function Header() {
    return (
        <div className={`${basestyles.container} ${styles.container}`}>
            hello header
        </div>
    )
}