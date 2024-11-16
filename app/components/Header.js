"use client"

import { useEffect, useState } from "react"

import basestyles from "./baseStyles.module.css"
import styles from "./header.module.css"
import Image from "next/image"
import ThemeDropdown from "./ThemeDropdown"
import GearDropdown from "./GearDropdown"

export default function Header() {
    const [username, setUsername] = useState("")
    const [themeDropdownVisible, setThemeDropdownVisible] = useState(false)
    const [gearDropdownVisible, setGearDropdownVisible] = useState(false)
    const [playThemeRevealAnim, setPlayThemeRevealAnim] = useState(false)
    const [playGearRevealAnim, setPlayGearRevealAnim] = useState(false)

    useEffect(() => {
        if (document.cookie.includes("username")) {
            for (let cookie of document.cookie.split("; ")) {
                if (cookie.includes("username")) {
                    setUsername(cookie.split("=")[1])
                }
            }
        } else {
            setUsername("guest")
        }
    }, [])

    const toggleDropdown = (selection) => {
        if (selection == "theme") {
            if (themeDropdownVisible) {
                setPlayThemeRevealAnim(false)
                setTimeout(() => {
                    setThemeDropdownVisible(false)
                }, 200)
            } else {
                setThemeDropdownVisible(true)
                setPlayThemeRevealAnim(true)
                setPlayGearRevealAnim(false)
                setTimeout(() => {
                    setGearDropdownVisible(false)
                }, 200)
            }
        } else {
            if (gearDropdownVisible) {
                setPlayGearRevealAnim(false)
                setTimeout(() => {
                    setGearDropdownVisible(false)
                }, 200)
            } else {
                setGearDropdownVisible(true)
                setPlayGearRevealAnim(true)
                setPlayThemeRevealAnim(false)
                setTimeout(() => {
                    setThemeDropdownVisible(false)
                }, 200)
            }
        }

    }

    return (
        <div className={`${basestyles.container} ${styles.container}`}>
            <p className={styles.title}>{username}</p>
            <div className={styles.spacing} />
            <div>
                <div
                    className={`${styles.dropdownButton} ${playThemeRevealAnim ? styles.placeholderAnim : ""}`}
                    onClick={() => toggleDropdown("theme")}
                >
                    <Image
                        src="/paint.svg"
                        width={40}
                        height={40}
                        alt="themes"
                    />
                </div>
                {themeDropdownVisible &&
                    <div className={`${styles.dropdownMenu} ${playThemeRevealAnim ? styles.revealDropdown : ""}`}>
                        <ThemeDropdown />
                    </div>
                }
            </div>
            <div>
                <div
                    onClick={() => toggleDropdown("gear")}
                    className={`${styles.dropdownButton} ${playGearRevealAnim ? styles.placeholderAnim : ""}`}
                >
                    <Image
                        src="/gear.svg"
                        width={40}
                        height={40}
                        alt="settings"
                    />
                </div>
                {gearDropdownVisible &&
                    <div className={`${styles.dropdownMenu} ${playGearRevealAnim ? styles.revealDropdown : ""}`}>
                        <GearDropdown />
                    </div>}
            </div>
        </div>
    )
}