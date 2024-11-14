import styles from "./page.module.css"

import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import NoteEditor from "./components/NoteEditor"
import { GlobalContextProvider } from "./applicationContexts/GlobalContext"

export default function Home() {

    return (
        <div className={`${styles.widescreenOrganization}`}>
            <GlobalContextProvider>
                <div className={styles.header}>
                    <Header />
                </div>
                <div className={styles.sidebar}>
                    <Sidebar />
                </div>
                <div className={styles.noteEditor}>
                    <NoteEditor />
                </div>

            </GlobalContextProvider>
        </div>
    );
}
