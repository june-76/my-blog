import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link"; // Link 컴포넌트 추가
import PostContent from "./PostContent"; // 클라이언트 컴포넌트 불러오기

// 카테고리 데이터를 불러오는 함수
const loadCategories = () => {
    const categoriesFilePath = path.join(
        process.cwd(),
        "content",
        "categories.json"
    );
    const categoriesData = fs.readFileSync(categoriesFilePath, "utf-8");
    return JSON.parse(categoriesData);
};

// 동적 경로에 해당하는 페이지
export default async function PostPage({ params }) {
    const { slug } = params;

    const filePath = path.join(process.cwd(), "content", `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return <h1>포스트를 찾을 수 없습니다.</h1>;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    if (!frontmatter.title || !frontmatter.date) {
        return <h1>유효하지 않은 포스트입니다.</h1>;
    }

    // Markdown을 HTML로 변환
    const htmlContent = marked(content);

    // 카테고리 데이터 로드
    const categories = loadCategories();
    const postCategory = categories.find(
        (category) => category.slug === frontmatter.category
    );

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-12 mx-auto max-w-lg sm:max-w-2xl">
                <div className="flex flex-wrap -m-4">
                    <div className="w-full p-4 mx-auto">
                        <div className="h-full rounded-xl bg-white overflow-hidden shadow-md">
                            <div className="p-6">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                    {postCategory ? (
                                        <Link
                                            href={`/categories/${postCategory.slug}`}
                                            className="hover:underline"
                                        >
                                            {postCategory.name}
                                        </Link>
                                    ) : (
                                        "카테고리 없음"
                                    )}
                                </h2>
                                <h1 className="title-font text-xl sm:text-2xl font-medium text-gray-600 mb-4">
                                    {frontmatter.title}
                                </h1>
                                <p className="leading-relaxed text-gray-500 mb-4 text-sm sm:text-base">
                                    {frontmatter.date}
                                </p>
                                <PostContent content={htmlContent} />{" "}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Next.js 13의 동적 경로 지정 함수 (Server Component에서는 `generateStaticParams` 사용)
export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), "content");
    const filenames = fs.readdirSync(postsDirectory);

    return filenames.map((filename) => ({
        slug: filename.replace(/\.md$/, ""),
    }));
}
