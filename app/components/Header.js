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
                    junefromjuly
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
                        margin: "0 20px",
                        padding: "0",
                        display: "flex",
                        gap: "10px",
                        overflowX: "auto", // 스크롤바가 필요할 때만 나타나도록 설정
                        whiteSpace: "nowrap",
                        scrollSnapType: "x mandatory",
                    }}
                >
                    <li style={{ scrollSnapAlign: "start" }}>
                        <Link
                            href="/"
                            style={{ color: "#fff", textDecoration: "none" }}
                        >
                            All
                        </Link>
                    </li>
                    {categories.map((category) => (
                        <li
                            key={category.slug}
                            style={{ scrollSnapAlign: "start" }}
                        >
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
            <style jsx>{`
                @media (min-width: 768px) {
                    nav ul {
                        overflow-x: visible; // PC 화면에서는 스크롤 제거
                        justify-content: center; // 넓은 화면에서 가운데 정렬
                    }
                }
            `}</style>
        </header>
    );
}
