// app/components/Header.js

"use client";

import Link from "next/link";
import "../globals.css";

export default function Header({ categories }) {
    return (
        <header>
            <div className="header-links">
                <Link href="/" className="site-link">
                    junefromjuly
                </Link>
                <Link href="/about" className="about-link">
                    About
                </Link>
            </div>
            <nav>
                <ul className="category-list">
                    <li>
                        <Link href="/" className="category-link">
                            All
                        </Link>
                    </li>
                    {categories.map((category) => (
                        <li key={category.slug}>
                            <Link
                                href={`/categories/${category.slug}`}
                                className="category-link"
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
