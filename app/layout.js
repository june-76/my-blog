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
                <footer>
                    <p>생각해보니 여기 딱히 적을게 없잖아..?</p>
                </footer>
            </body>
        </html>
    );
}
