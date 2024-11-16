"use client"

import basestyles from "./baseStyles.module.css"
import styles from "./sidebar.module.css"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Sidebar({ setActiveNote, forceUpdate }) {
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    /**
     * const notes: {
     *  id: number;
     *  dateUploaded: Date;
     *  lastUpdatedOn: Date;
     *  name: string;
     *  uploaderID: string;
     * }[]
     */
    const [notes, setNotes] = useState([])

    useEffect(() => {
        (async () => {
            const isLoggedIn = document.cookie.includes("sessionToken")
            setIsLoggedIn(isLoggedIn)
            let res, data
            res = await fetch("/api/user")
            data = await res.json()
            setNotes(data)
            setIsLoading(false)
        })()
    }, [forceUpdate])


    const addNote = async () => {
        const createNoteRes = await fetch("/api/note", {
            method: "PUT",
            body: JSON.stringify({ title: "unnamed note" })
        })
        const newNote = await createNoteRes.json()
        setActiveNote([newNote.note.id, newNote.note.name])
        setNotes([...notes, newNote.note])
    }

    const switchNote = (note) => {
        setActiveNote(note)
    }

    return (
        <div className={`${basestyles.container} ${isLoggedIn ? styles.container : ""}`}>
            {isLoading ? <>
            </> : !isLoggedIn ? <>
                log in to view your saved notes
            </> : <>
                <div className={styles.iconContainer}>
                    <div className={styles.icon} onClick={() => addNote()}>
                        <Image
                            src="/add.svg"
                            width={30}
                            height={30}
                            alt="add new note"
                        />
                    </div>
                </div>
                {notes?.map((note, index) => {
                    return <div key={index} className={styles.note} onClick={() => switchNote([note.id, note.name])}>
                        <div className={styles.title}>{note.name}</div>
                    </div>
                })}
            </>}
        </div>
    )
}