// app/page.js

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkBreaks from "remark-breaks";

const POSTS_PER_PAGE = 8;

async function fetchPosts(page, language = "kr") {
    // language 값이 숫자로 전달되지 않도록 문자열로 처리
    if (typeof language !== "string") {
        language = "kr"; // 기본값 "kr"로 설정
    }

    // 해당 언어 폴더 경로 설정
    const folderPath = path.join(process.cwd(), "content", language);

    // 경로 로그 추가
    console.log(`Looking for posts in: ${folderPath}`);

    // 해당 언어 폴더가 없으면 빈 배열 반환
    if (!fs.existsSync(folderPath)) {
        return { posts: [], currentPage: page, totalPages: 0 };
    }

    const files = fs.readdirSync(folderPath);

    const posts = files.map((filename) => {
        const slug = filename.replace(".md", "");
        const markdownWithMeta = fs.readFileSync(
            path.join(folderPath, filename),
            "utf-8"
        );
        const { data: frontmatter } = matter(markdownWithMeta);

        const processedContent = remark()
            .use(remarkBreaks)
            .use(html)
            .processSync(markdownWithMeta);
        const contentHtml = processedContent.toString();

        const firstImageMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
        const thumbnail = firstImageMatch ? firstImageMatch[1] : null;

        return {
            slug,
            title: frontmatter.title || "Untitled",
            category: frontmatter.category || "Uncategorized",
            date: frontmatter.date || "No Date",
            thumbnail,
        };
    });

    const validPosts = posts.filter(
        (post) => post.title !== "Untitled" && post.date !== "No Date"
    );

    validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const selectedPosts = validPosts.slice(
        startIndex,
        startIndex + POSTS_PER_PAGE
    );

    const totalPages = Math.ceil(validPosts.length / POSTS_PER_PAGE);

    return {
        posts: selectedPosts,
        currentPage: page,
        totalPages,
    };
}

// Next.js 14의 새로운 방식: 페이지 데이터 가져오는 방식
export default async function HomePage({ searchParams }) {
    const page = parseInt(searchParams.page || "1", 10); // 페이지 번호 파라미터

    // 언어 파라��터를 searchParams에서 가져오거나 기본값으로 "kr" 설정
    const language = searchParams.lang || "kr";

    const { posts, currentPage, totalPages } = await fetchPosts(page, language);

    return (
        <>
            <section className="grid p-8 place-items-center">
                <div className="container grid grid-cols-1 gap-8 my-auto lg:grid-cols-2">
                    {posts.length === 0 ? (
                        <div>작성된 포스트가 없습니다.</div>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post.slug}
                                className="relative flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-none grid gap-2 item sm:grid-cols-2"
                            >
                                <div className="relative bg-clip-border rounded-xl overflow-hidden bg-white text-gray-700 m-0 p-4">
                                    <a href={`/posts/${post.slug}`}>
                                        <div
                                            className="relative w-full"
                                            style={{ aspectRatio: "4/3" }}
                                        >
                                            <img
                                                src={
                                                    post.thumbnail ||
                                                    "https://placehold.co/600x400"
                                                }
                                                alt={`Thumbnail for ${post.title}`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                    </a>
                                </div>
                                <div className="p-6 px-2 sm:pr-6 sm:pl-4">
                                    <p className="block antialiased font-sans text-sm font-light leading-normal text-inherit mb-4 !font-semibold">
                                        {post.category}
                                    </p>
                                    <a
                                        href={`/posts/${post.slug}`}
                                        className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900 mb-2 normal-case transition-colors hover:text-gray-700"
                                    >
                                        {post.title}
                                    </a>
                                    <p className="block antialiased font-sans text-base leading-relaxed text-inherit mb-8 font-normal !text-gray-500">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="block antialiased font-sans text-base font-light leading-relaxed text-blue-gray-900 mb-0.5 !font-semibold">
                                                June
                                            </p>
                                            <p className="block antialiased font-sans text-sm leading-normal text-gray-700 font-normal">
                                                {post.date}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <div className="pagination">
                {/* 이전 페이지 */}
                {currentPage > 1 && (
                    <a
                        href={`/?${
                            language === "kr" ? "" : `lang=${language}&`
                        }page=${currentPage - 1}`}
                        className="prev-page"
                    >
                        이전
                    </a>
                )}

                {/* 페이지 위치 지정 */}
                {[...Array(totalPages)].map((_, index) => (
                    <a
                        key={index}
                        href={`/?${
                            language === "kr" ? "" : `lang=${language}&`
                        }page=${index + 1}`}
                        className={`page-button ${
                            currentPage === index + 1 ? "active" : ""
                        }`}
                    >
                        {index + 1}
                    </a>
                ))}

                {/* 다음 페이지 */}
                {currentPage < totalPages && (
                    <a
                        href={`/?${
                            language === "kr" ? "" : `lang=${language}&`
                        }page=${currentPage + 1}`}
                        className="next-page"
                    >
                        다음
                    </a>
                )}
            </div>
        </>
    );
}
