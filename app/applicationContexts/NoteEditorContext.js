"use client"

import { createContext } from "react"
import { useState } from "react"

/**
 * Context for the note editor
 * 
 * @field {string} font - font of the note editor
 * @field {Number} fontSize - font size of the note editor
 */
const NoteContext = createContext()

function NoteContextProvider({ children }) {
    const [font, setFont] = useState("arial")
    const [fontSize, setFontSize] = useState(18)

    return (
        <NoteContext.Provider value={{ font, setFont, fontSize, setFontSize }}>
            {children}
        </NoteContext.Provider>
    )
}

export { NoteContext, NoteContextProvider }