// app/layout.js
import fs from "fs";
import path from "path";
import "./globals.css";
import Header from "./components/Header";

// 카테고리 데이터를 로드하는 함수
const loadCategories = () => {
    const categoriesFilePath = path.join(process.cwd(), "content", "categories.json");
    const categoriesData = fs.readFileSync(categoriesFilePath, "utf-8");
    return JSON.parse(categoriesData);
};

export default function RootLayout({ children }) {
    const categories = loadCategories(); // 서버에서 카테고리 데이터 로드

    return (
        <html lang="en">
            <body>
                <Header categories={categories} /> {/* 헤더에 카테고리 데이터 전달 */}
                <main>{children}</main>
                <footer>
                    <p>여기는 뭘 쓸까</p>
                </footer>
            </body>
        </html>
    );
}
