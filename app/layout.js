// app/layout.js
import fs from "fs";
import path from "path";
import "./globals.css";
import Header from "./components/Header";

// 카테고리 데이터를 로드하는 함수(서버 사이드)
const loadCategories = () => {
    const categoriesFilePath = path.join(
        process.cwd(),
        "content",
        "categories.json"
    );
    const categoriesData = fs.readFileSync(categoriesFilePath, "utf-8");
    return JSON.parse(categoriesData);
};

export const metadata = {
    title: "junefromjuly",
    description: "june's blog",
};

export default function RootLayout({ children }) {
    // 서버 사이드에서만 카테고리 데이터 로드
    const categories = loadCategories();

    return (
        <html lang="ko">
            <body>
                {/* 헤더에 카테고리 데이터 전달 */}
                <Header categories={categories} />
                <main>{children}</main>
                <footer
                    class="mx-auto mt-32 w-full max-w-container px-4 sm:px-6 lg:px-8"
                    aria-labelledby="footer-heading"
                >
                    <div class="items-centers grid grid-cols-1 justify-between gap-4 border-t border-gray-100 py-6 md:grid-cols-2">
                        <p class="text-sm/6 text-gray-600 max-md:text-center">
                            여긴 뭘 적으면 좋을까
                        </p>
                        <div class="flex items-center justify-center space-x-4 text-sm/6 text-gray-500 md:justify-end">
                            <a href="#">Privacy policy</a>
                            <div class="h-4 w-px bg-gray-200"></div>
                            <a href="#">Terms</a>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
