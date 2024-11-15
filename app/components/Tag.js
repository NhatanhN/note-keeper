import styles from "./tag.module.css"

export default function Tag({ name, removeTag }) {

    return (
        <div className={styles.container}>
            <p>{name}</p>
            <button className={styles.button} onClick={() => removeTag(name)}>✖</button>
        </div>
    )
}