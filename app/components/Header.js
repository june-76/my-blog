// app/components/Header.js
import Link from "next/link";
import "../globals.css";

export default function Header() {
    return (
        <header>
            <h1>my blog</h1>
            <nav>
                <ul
                    style={{
                        listStyleType: "none",
                        margin: "0",
                        padding: "0",
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <li>
                        <Link
                            href="/"
                            style={{ color: "#fff", textDecoration: "none" }}
                        >
                            posts
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/about"
                            style={{ color: "#fff", textDecoration: "none" }}
                        >
                            about
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
