// app/layout.js

import fs from "fs";
import path from "path";
import "./globals.css";
import Header from "./components/Header";
import { Analytics } from "@vercel/analytics/react";

const loadCategories = () => {
    // 루트 디렉토리 내에 있는 content 폴더 내의 categories.json 파일을 찾습니다.
    const categoriesFilePath = path.join(
        process.cwd(),
        "content",
        "categories.json"
    );

    // 찾은 파일의 내용을 읽어옵니다.
    const categoriesData = fs.readFileSync(categoriesFilePath, "utf-8");

    return JSON.parse(categoriesData);
};

export const metadata = {
    title: "junefromjuly",
    description: "june's blog",
};

// SSR Functional Component
// childer: 부모 컴포넌트로부터 전달 받은 자식 요소
export default function RootLayout({ children }) {
    const categories = loadCategories();

    return (
        <html lang="ko">
            <body>
                {/* 헤더에 카테고리 데이터 전달 */}
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
