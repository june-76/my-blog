// app/layout.js

import "./globals.css";
import Header from "./components/Header";
import { Analytics } from "@vercel/analytics/react";
import { Ubuntu } from "next/font/google";
import { Noto_Sans_KR } from "next/font/google";
import { Orbit } from "next/font/google";

const ubuntu = Ubuntu({
    weight: "400",
    subsets: ["latin"],
});

const notoSansKR = Noto_Sans_KR({
    weight: "200",
    subsets: ["latin"],
});

const orbit = Orbit({
    weight: "400",
    subsets: ["latin"],
});

// 카테고리 하드코딩
const loadCategories = () => {
    return [
        {
            name: "Learning Notes",
            slug: "learning-notes",
        },
        {
            name: "Project Log",
            slug: "project-log",
        },
        {
            name: "CS / Algorithm",
            slug: "cs-algorithm",
        },
    ];
};

export const metadata = {
    title: "junefromjuly",
    description: "june's blog",
};

export default function RootLayout({ children }) {
    const categories = loadCategories();

    return (
        <html>
            <body className={`${orbit.className}`}>
                <Header categories={categories} />
                <main>{children}</main>
                <footer
                    className="mx-auto mt-32 w-full max-w-container px-4 sm:px-6 lg:px-8"
                    aria-labelledby="footer-heading"
                >
                    <div className="items-centers grid grid-cols-1 justify-between gap-4 border-t border-gray-100 py-6 md:grid-cols-2">
                        <p className="text-sm/6 text-gray-600 max-md:text-center">
                            © 2024 June. All rights reserved.
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-sm/6 text-gray-500 md:justify-end">
                            <a href="/">Privacy policy</a>
                            <div className="h-4 w-px bg-gray-200"></div>
                            <a href="/">Terms</a>
                        </div>
                    </div>
                </footer>
                {/* 웹 사이트 전체에서 트래킹 데이터를 수집합니다. */}
                <Analytics />
            </body>
        </html>
    );
}
