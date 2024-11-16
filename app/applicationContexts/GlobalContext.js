"use client"

import { createContext } from "react"
import { useState, useEffect } from "react"
import { light, dark, night } from "@/app/themes"

/**
 * Global context for the application. Reads information from cookies. Whenever
 * the cookie updates, the page should be refreshed so those changes can be
 * reflected in the context
 * 
 * @field {string} theme - the theme of the application
 * @field {function} setTheme - function to set the theme of the application
 * @field {string} username - the username of the user
 */
const GlobalContext = createContext()

function GlobalContextProvider({ children }) {
    const [theme, setTheme] = useState("light")
    const [username, setUsername] = useState(null)

    // runs on every rerender (every refresh)
    useEffect(() => {
        const cookies = document.cookie.split("; ")
        setUsername(null)
        for (let cookie in cookies) {
            if (cookies[cookie].split("=")[0].trim() == "username") {
                setUsername(cookies[cookie].split("=")[1])
            }
            if (cookies[cookie].split("=")[0].trim() == "theme") {
                setTheme(cookies[cookie].split("=")[1])
            }
        }

        if (theme == "light") {
            changeTheme(light)
        } else if (theme == "dark") {
            changeTheme(dark)
        } else if (theme == "night") {
            changeTheme(night)
        }
    })

    const changeTheme = (theme) => {
        const root = document.documentElement
        const test = theme
        for (let key of Object.entries(test)) {
            root.style.setProperty(key[0], key[1])
        }
    }

    return (
        <GlobalContext.Provider value={{ theme, setTheme, username }}>
            {children}
        </GlobalContext.Provider>
    )
}

export { GlobalContext, GlobalContextProvider }