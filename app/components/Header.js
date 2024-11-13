// app/components/Header.js

// components 폴더는 그 자체로 라우팅되지 않으며, 재사용 가능한 컴포넌트들이 위치하는 곳입니다.

// 해당 컴포넌트는 CSR임을 명시합니다.
"use client";

import Link from "next/link";
import "../globals.css";

// categories props를 받습니다. (카테고리 정보를 담고 있는 배열)
export default function Header({ categories = [] }) {
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
                    {categories.length === 0 ? (
                        <li>
                            <span className="category-link">
                                No categories available
                            </span>
                        </li>
                    ) : (
                        categories.map((category) => (
                            <li key={category.slug}>
                                <Link
                                    href={`/categories/${category.slug}`}
                                    className="category-link"
                                >
                                    {category.name}
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </nav>
        </header>
    );
}
