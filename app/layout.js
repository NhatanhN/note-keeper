import "./globals.css"

export const metadata = {
    title: "Note Keeper",
    description: "Online note taking app with tagging",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
