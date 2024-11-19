// app/posts/[slug]/page.js

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Link from "next/link";
// HTML로 변환된 콘텐츠를 표시하기 위한 클라이언트 컴포넌트를 불러옵니다.
import PostContent from "./PostContent";

const loadCategories = () => {
    const categoriesFilePath = path.join(
        process.cwd(),
        "content",
        "categories.json"
    );
    const categoriesData = fs.readFileSync(categoriesFilePath, "utf-8");
    return JSON.parse(categoriesData);
};

// 페이지 렌더링을 담당하는 SSR 함수형 컴포넌트입니다.
export default async function PostPage({ params }) {
    const { slug } = params;

    const filePath = path.join(process.cwd(), "content", `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return <h1>포스트를 찾을 수 없습니다.</h1>;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    // 제목이나 날짜가 없는 경우 유효하지 않은 포스트로 간주
    if (!frontmatter.title || !frontmatter.date) {
        return <h1>유효하지 않은 포스트입니다.</h1>;
    }

    // 마크다운 콘텐츠를 HTML 문자열로 변환
    const htmlContent = marked(content);

    // 카테고리 데이터 로드
    const categories = loadCategories();

    // 현재 포스트의 category와 일치하는 카테고리를 찾습니다.
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

// 정적 경로(Static Paths)를 사전에 정의하기 위한 '빌드 프로세스 전용 함수'입니다.
// SSR/CSR와 별개로 빌드 타임에만 실행됩니다.
export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), "content");
    const filenames = fs.readdirSync(postsDirectory);

    return filenames.map((filename) => ({
        slug: filename.replace(/\.md$/, ""),
    }));
}

// 카테고리 페이지 (categories/[slug]/page.js)
// CSR로 동적 처리: 사용자가 어떤 카테고리를 클릭할지 예측하기 어렵고, 카테고리 자체가 동적으로 추가/변경될 가능성이 큽니다.
// 런타임에서 필요한 데이터만 서버 요청으로 가져오면 충분하므로 경로를 미리 정의하지 않아도 됩니다.

// 개별 포스트 페이지 (posts/[slug]/page.js)
// SSG로 정적 생성: 포스트는 작성 후 자주 변경되지 않고, 각 페이지가 검색 엔진에 최적화(SEO)되는 것이 중요합니다.
// 빌드 타임에 slug를 기반으로 모든 경로를 미리 설정(generateStaticParams)해 두고, 정적으로 렌더링된 HTML을 제공하면 페이지 로드 속도와 SEO 점수가 향상됩니다.

// SSR, CSR, ISR, SSG + generateStaticParams 모든 방법이 가능합니다.
// 장단점이 있으므로, 적절히 사용하는 것이 중요합니다.
