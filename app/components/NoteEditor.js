"use client"

import { useState, useEffect, useContext } from "react"
import { NoteContext } from "../applicationContexts/NoteEditorContext"
import basestyles from "./baseStyles.module.css"
import styles from "./noteEditor.module.css"
import Image from "next/image"

export default function NoteEditor({ noteID, noteName, forceUpdate, setForceUpdate }) {
    /* context */
    const { font, fontSize } = useContext(NoteContext)

    /* note metadata state */
    const [name, setName] = useState(noteName)

    /* gui + other state */
    const [saveModalVisible, setSaveModalVisible] = useState(false)
    const [playSaveRevealAnim, setPlaySaveRevealAnim] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [playDeleteRevealAnim, setPlayDeleteRevealAnim] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [saveStatus, setSaveStatus] = useState("")

    useEffect(() => {
        (async () => {
            if (noteID != -1) {
                const res = await fetch(`/api/note?noteID=${noteID}`)
                const editor = document.getElementById("editor")
                editor.innerHTML = await res.text()
            }
            setIsLoggedIn(document.cookie.includes("sessionToken"))
            setName(noteName)
            setIsLoading(false)
        })()
    }, [noteID, noteName])

    /* overlay functions */

    const toggleSaveModal = () => {
        setSaveStatus("")
        if (saveModalVisible) {
            setPlaySaveRevealAnim(false)
            setTimeout(() => {
                setSaveModalVisible(false)
            }, 200)
        } else {
            setSaveModalVisible(true)
            setPlaySaveRevealAnim(true)
        }
    }

    const toggleDeleteModal = () => {
        if (noteID == -1) return
        if (deleteModalVisible) {
            setPlayDeleteRevealAnim(false)
            setTimeout(() => {
                setDeleteModalVisible(false)
            }, 200)
        } else {
            setDeleteModalVisible(true)
            setPlayDeleteRevealAnim(true)
        }
    }

    const preventEventPropagation = (e) => {
        e.stopPropagation()
    }

    /* note editor functions */

    const saveNote = async (e) => {
        e.preventDefault()
        const note = document.getElementById("editor")
        const title = e.target.title.value
        setSaveStatus("saving ...")

        let id = noteID
        if (id == -1) {
            // creates a new, empty note
            const createNoteRes = await fetch("/api/note", {
                method: "PUT",
                body: JSON.stringify({ title: title })
            })

            id = (await createNoteRes.json()).note.id
        }

        for (const node of note.childNodes) {
            if (node.nodeName == "IMG" && node.src.includes("blob:")) {
                const imgData = await (await fetch(node.src)).blob();
                const formData = new FormData();
                formData.append("image", imgData, `${title}.png`);
                formData.append("noteID", id);

                const createImageRes = await fetch("/api/image", {
                    method: "POST",
                    body: formData
                });

                const { imageID } = await createImageRes.json();
                node.src = `${window.location.href}api/image?imageID=${imageID}`;
            }
        }

        await fetch(`/api/note/`, {
            method: "POST",
            body: JSON.stringify({ noteID: id, name: name, content: note.innerHTML })
        })

        if (name != noteName) {
            setForceUpdate(!forceUpdate)
        }
        setSaveStatus("saved")
    }

    const deleteNote = async () => {
        await fetch(`/api/note`, {
            method: "DELETE",
            body: JSON.stringify({ noteID: noteID })
        })

        location.reload()
    }

    const downloadNote = () => {
        if (!isLoggedIn) return
        window.print()
    }

    const handleNewLines = (e) => {
        if (e.key == "Enter") {
            e.preventDefault()
            const selection = window.getSelection()
            if (!selection.rangeCount) return
            const range = selection.getRangeAt(0)
            const br = document.createElement("br")
            range.insertNode(br)
            range.setStartAfter(br)
        }
    }

    const handlePaste = async (e) => {
        e.preventDefault()

        const selection = window.getSelection()
        if (!selection.rangeCount) return
        selection.deleteFromDocument()

        for (const clipboardItem of e.clipboardData.items) {
            if (clipboardItem.type.startsWith("image/")) {
                const img = document.createElement("img")
                img.src = URL.createObjectURL(clipboardItem.getAsFile())
                selection.getRangeAt(0).insertNode(img)
            } else if (clipboardItem.type.startsWith("text/plain")) {
                await new Promise((resolve) => {
                    clipboardItem.getAsString((text) => {
                        const textNode = document.createTextNode(text)
                        selection.getRangeAt(0).insertNode(textNode)
                        resolve()
                    })
                })
            }
        }

        selection.collapseToEnd()
    }

    const toggleBold = () => {
        const selection = window.getSelection()
        if (!selection.rangeCount || selection.isCollapsed) return
        const range = selection.getRangeAt(0)

        let node = range.commonAncestorContainer
        node = node.nodeType == Node.TEXT_NODE ? node.parentElement : node
        const isAlreadyBold = node.closest("b")

        if (isAlreadyBold) {
            unwrapElement(range, "b")
        } else {
            wrapWithElement(range, "b")
        }

        clearSelection()
    }

    const toggleItalic = () => {
        const selection = window.getSelection()
        if (!selection.rangeCount || selection.isCollapsed) return
        const range = selection.getRangeAt(0)

        let node = range.commonAncestorContainer
        node = node.nodeType == Node.TEXT_NODE ? node.parentElement : node
        const isAlreadyItalic = node.closest("i")

        if (isAlreadyItalic) {
            unwrapElement(range, "i")
        } else {
            wrapWithElement(range, "i")
        }

        clearSelection()
    }

    const wrapWithElement = (range, tagName) => {
        let leftElement = range.startContainer
        leftElement = leftElement.nodeType == Node.TEXT_NODE ? leftElement.parentElement : leftElement
        let rightElement = range.endContainer
        rightElement = rightElement.nodeType == Node.TEXT_NODE ? rightElement.parentElement : rightElement

        const fragment = range.extractContents()
        let string = convertFragmentToString(fragment)
        const tagRegex = new RegExp(`<${tagName}>|<\/${tagName}>`, "g")
        string = string.replaceAll(tagRegex, "")

        if (leftElement.tagName == tagName && rightElement.tagName == tagName) {
            leftElement.innerHTML += string
            leftElement.innerHTML += rightElement.innerHTML
        } else if (leftElement.tagName == tagName) {
            leftElement.innerHTML += string
        } else if (rightElement.tagName == tagName) {
            rightElement.innerHTML = string + rightElement.innerHTML
        } else {
            const element = document.createElement(tagName)
            element.innerHTML = string
            range.insertNode(element)
        }

        // removes empty elements
        if (leftElement.innerHTML == "") leftElement.remove()
        if (rightElement.innerHTML == "") rightElement.remove()
    }

    // at the moment, just clears any formatting
    const unwrapElement = (range, tagName) => {
        const node = range.commonAncestorContainer
        const parentElement = node.nodeType == Node.TEXT_NODE ? node.parentElement : node
        const formattingElement = parentElement.closest(tagName)

        const fragment = range.extractContents()
        const string = convertFragmentToString(fragment)
        formattingElement.insertAdjacentHTML("afterend", string)
    }

    const convertFragmentToString = (fragment) => {
        const temp = document.createElement("div")
        temp.append(fragment)
        return temp.innerHTML
    }

    const clearSelection = () => {
        const selection = window.getSelection()
        selection.removeAllRanges()
    }

    return (
        <div className={`${basestyles.container} ${styles.container}`}>
            {deleteModalVisible &&
                <div
                    className={`${styles.deleteModalContainer} ${playDeleteRevealAnim ? styles.revealModal : ""}`}
                    onClick={() => toggleDeleteModal()}
                >
                    <div
                        className={`${styles.deleteModal} ${playDeleteRevealAnim ? styles.revealModal : ""}`}
                        onClick={(e) => preventEventPropagation(e)}
                    >
                        <p>Are you sure you want to delete this note?</p> <br />
                        <div className={styles.deleteButtonContainer}>
                            <button className={`${basestyles.button} ${styles.button}`} onClick={() => deleteNote()}>yes</button>
                            <div className={styles.spacing} />
                            <button className={`${basestyles.button} ${styles.button}`} onClick={() => toggleDeleteModal()}>no</button>
                        </div>
                    </div>
                </div>
            }
            {saveModalVisible &&
                <div className={`${styles.modal} ${playSaveRevealAnim ? styles.revealModal : ""}`}>
                    {isLoggedIn ?
                        <>
                            <form onSubmit={saveNote}>
                                <label htmlFor="title">Save your note</label>
                                <br />
                                <input
                                    className={`${basestyles.textInput} ${styles.textInput}`}
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="note title"
                                    required
                                    autoComplete="off"
                                />
                                <div className={styles.saveButtonContainer}>
                                    <button className={`${basestyles.button} ${styles.button}`} type="submit">save</button>
                                    <p className={styles.saveStatus}>{saveStatus}</p>
                                </div>
                            </form>
                        </> : <>
                            <p>You must be logged in to save your note</p>
                        </>
                    }
                </div>
            }
            <div className={styles.overlay}>
                <div className={styles.formatPalette}>
                    <div className={styles.icon} onClick={() => toggleBold()}>
                        <Image
                            src="/bold.svg"
                            width={40}
                            height={40}
                            alt="bold text"
                        />
                    </div>
                    <div className={styles.icon} onClick={() => toggleItalic()}>
                        <Image
                            src="/italic.svg"
                            width={35}
                            height={35}
                            alt="italicize text"
                        />
                    </div>
                </div>
                <div className={styles.icon} onClick={() => toggleDeleteModal()}>
                    <Image
                        src="/trash.svg"
                        width={35}
                        height={35}
                        alt="trash note"
                    />
                </div>
                <div className={styles.icon} onClick={downloadNote}>
                    <Image
                        src="/download.svg"
                        width={40}
                        height={40}
                        alt="download note"
                    />
                </div>
                <div className={styles.icon} onClick={() => toggleSaveModal()}>
                    <Image
                        src="/save.svg"
                        width={35}
                        height={35}
                        alt="save icon"
                    />
                </div>
            </div>
            {isLoading ? <div className={styles.note}>Loading ... </div>
                : <div
                    contentEditable
                    id="editor"
                    onPaste={handlePaste}
                    onKeyDown={handleNewLines}
                    className={styles.note}
                    spellCheck="false"
                    style={{ fontFamily: font, fontSize: fontSize + "px" }}
                />
            }

        </div>
    )
}