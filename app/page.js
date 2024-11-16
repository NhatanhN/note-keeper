"use client"

import styles from "./page.module.css"

import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import NoteEditor from "./components/NoteEditor"
import { GlobalContextProvider } from "./applicationContexts/GlobalContext"
import { useState } from "react"

export default function Home() {
    // [noteid, notename]
    const [activeNote, setActiveNote] = useState([-1, ""])
    // for forcibly updating the sidebar whenever a note is saved
    const [forceUpdate, setForceUpdate] = useState(false)

    return (
        <div className={`${styles.widescreenOrganization}`}>
            <GlobalContextProvider>
                <div className={styles.header}>
                    <Header />
                </div>
                <div className={styles.sidebar}>
                    <Sidebar setActiveNote={setActiveNote} forceUpdate={forceUpdate}/>
                </div>
                <div className={styles.noteEditor}>
                    <NoteEditor
                        noteID={activeNote[0]}
                        noteName={activeNote[1]}
                        forceUpdate={forceUpdate}
                        setForceUpdate={setForceUpdate}
                    />
                </div>
            </GlobalContextProvider>
        </div>
    );
}
