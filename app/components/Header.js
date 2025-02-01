// app/components/Header.js

// components 폴더는 그 자체로 라우팅되지 않으며, 재사용 가능한 컴포넌트들이 위치하는 곳입니다.
// Header.js 컴포넌트는 최초 로드 시에는 SSR로 처리됩니다.
// 그 이후에는 CSR가 활성화되어, SPA와 유사하게 동작합니다.

// 해당 컴포넌트는 CSR임을 명시합니다.
"use client";

import { Suspense } from "react"; // Suspense import 추가
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation"; // URL에서 searchParams를 가져오는 훅
import "../globals.css";

// categories props를 받습니다. (카테고리 정보를 담고 있는 배열)
export default function Header({ categories = [] }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HeaderContent categories={categories} />
        </Suspense>
    );
}

function HeaderContent({ categories }) {
    const searchParams = useSearchParams(); // 현재 검색 파라미터 가져오기
    const pathname = usePathname(); // 현재 경로 가져오기
    const language = searchParams.get("lang") || "kr";

    console.log("Current pathname:", pathname);

    // 현재 활성화된 카테고리 확인 함수
    const isActiveCategory = (categorySlug) => {
        if (categorySlug === "home") {
            // 홈페이지인 경우 ('/' 경로)
            return pathname === "/";
        }
        return pathname.includes(`/categories/${categorySlug}`);
    };

    // 언어 토글 함수: 현재 언어가 'kr'이면 'jp'로, 'jp'이면 'kr'로 변경
    const toggleLanguage = () => {
        const newLang = language === "kr" ? "jp" : "kr";
        const newUrl = newLang === "kr" ? pathname : `${pathname}?lang=jp`;

        // URL을 변경하고 페이지 이동
        window.location.href = newUrl; // URL을 직접 설정하여 페이지 이동
    };

    // 특정 경로에서 언어 토글 컨테이너를 숨기기 위한 조건
    const hideLanguageToggle = pathname.startsWith("/posts");

    return (
        <header>
            <div className="header-links">
                <Link href="/" className="site-link">
                    junefromjuly
                </Link>
                <Link
                    href="/about"
                    className={`about-link ${
                        pathname === "/about" ? "highlight" : ""
                    }`}
                    style={pathname === "/about" ? { color: "#fade27" } : {}}
                >
                    About
                </Link>
            </div>
            <nav>
                <ul className="category-list">
                    <li>
                        <Link
                            href={language === "kr" ? "/" : "/?lang=jp"}
                            className={`category-link ${
                                isActiveCategory("home") ? "active" : ""
                            }`}
                        >
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
                                    href={
                                        language === "kr"
                                            ? `/categories/${category.slug}`
                                            : `/categories/${category.slug}?lang=${language}`
                                    }
                                    className={`category-link ${
                                        isActiveCategory(category.slug)
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    {category.name}
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </nav>

            {!hideLanguageToggle && (
                <div className="language-toggle-container">
                    <button
                        className="language-switch-button"
                        onClick={toggleLanguage}
                        aria-label="Toggle Language"
                    >
                        <span
                            className={`switch-option kr ${
                                language === "kr" ? "active" : ""
                            }`}
                        >
                            KR
                        </span>
                        <span
                            className={`switch-option jp ${
                                language === "jp" ? "active" : ""
                            }`}
                        >
                            JP
                        </span>
                        <span
                            className={`switch-slider ${
                                language === "jp" ? "jp-active" : ""
                            }`}
                        ></span>
                    </button>
                </div>
            )}
        </header>
    );
}
