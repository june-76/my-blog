// app/components/Header.js
"use client"; // 클라이언트 컴포넌트로 설정

import Link from "next/link";
import "../globals.css";

export default function Header({ categories }) {
    return (
        <header>
            <h1>MY BLOG ^^</h1>
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
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/about"
                            style={{ color: "#fff", textDecoration: "none" }}
                        >
                            About
                        </Link>
                    </li>
                    {categories.map((category) => (
                        <li key={category.slug}>
                            <Link
                                href={`/categories/${category.slug}`}
                                style={{ color: "#fff", textDecoration: "none" }}
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
