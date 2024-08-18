// app/layout.js
import "./globals.css";
import Header from "./components/Header";
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Header /> {/* Header 컴포넌트 사용 */}
                <main>{children}</main>
                <footer>
                    <p>여기는 뭘 쓸까</p>
                </footer>
            </body>
        </html>
    );
}
