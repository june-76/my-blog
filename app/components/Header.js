// app/components/Header.js

"use client";

import Link from "next/link";
import "../globals.css";

export default function Header({ categories }) {
    return (
        <header>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginLeft: "1%",
                }}
            >
                <Link
                    href="/"
                    style={{
                        fontSize: "20px",
                        fontStyle: "italic",
                        color: "#ddd",
                        textDecoration: "none",
                    }}
                >
                    fromhelianthus
                </Link>
                <Link
                    href="/about"
                    style={{
                        fontSize: "16px",
                        fontStyle: "italic",
                        color: "#fff",
                        textDecoration: "none",
                        marginTop: "4px",
                    }}
                >
                    About
                </Link>
            </div>
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
                            All
                        </Link>
                    </li>
                    {categories.map((category) => (
                        <li key={category.slug}>
                            <Link
                                href={`/categories/${category.slug}`}
                                style={{
                                    color: "#fff",
                                    textDecoration: "none",
                                }}
                            >
                                {category.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
