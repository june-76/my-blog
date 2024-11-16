// app/components/Header.js

// components 폴더는 그 자체로 라우팅되지 않으며, 재사용 가능한 컴포넌트들이 위치하는 곳입니다.
// Header.js 컴포넌트는 최초 로드 시에는 SSR로 처리됩니다.
// 그 이후에는 CSR가 활성화되어, SPA와 유사하게 동작합니다.

// 해당 컴포넌트는 CSR임을 명시합니다.
"use client";

// Link 컴포넌트는 클라이언트 측 라우팅을 처리합니다.
// Link 컴포넌트를 사용하면 페이지 간 네비게이션이 CS에서 이루어집니다.
// 때문에, 페이지를 새로고침하지 않아도 빠르고 부드럽게 이동할 수 있습니다.
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
                            Home
                        </Link>
                    </li>
                    {categories.length === 0 ? (
                        <li>
                            <span className="category-link">
                                카테고리가 비어 있습니다.
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
