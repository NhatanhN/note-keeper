import { cookies } from "next/headers";
import { light, dark, night } from "./themes";
import "./globals.css"

export const metadata = {
    title: "Note Keeper",
    description: "Online note taking app with tagging",
};

export default async function RootLayout({ children }) {
    const cookieStore = await cookies()
    const theme = cookieStore.get("theme").value


    return (
        <html lang="en"
            style={theme == "light" ? {...light}
                : theme == "dark" ? {...dark}
                : {...night}
            }
        >
            <body>
                {children}
            </body>
        </html>
    );
}
