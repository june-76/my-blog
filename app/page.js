// app/page.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const POSTS_PER_PAGE = 10;

async function fetchPosts(page) {
    const files = fs.readdirSync(path.join(process.cwd(), "content"));

    const posts = files.map((filename) => {
        const slug = filename.replace(".md", "");
        const markdownWithMeta = fs.readFileSync(
            path.join("content", filename),
            "utf-8"
        );
        const { data: frontmatter } = matter(markdownWithMeta);

        const processedContent = remark()
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
    const { posts, currentPage, totalPages } = await fetchPosts(page);

    return (
        <>
            <section className="grid p-8 place-items-center">
                <div className="container grid grid-cols-1 gap-8 my-auto sm:grid-cols-2 lg:grid-cols-2">
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
                                        <img
                                            src={
                                                post.thumbnail ||
                                                "https://placehold.co/600x400"
                                            }
                                            alt={`Thumbnail for ${post.title}`}
                                            className="object-cover w-full h-full"
                                        />
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

            {/* 페이지 네비게이션 - 숫자 기반 */}
            <div className="pagination">
                {/* 이전 페이지 링크 */}
                {currentPage > 1 && (
                    <a href={`/?page=${currentPage - 1}`} className="prev-page">
                        이전
                    </a>
                )}

                {/* 페이지 번호 */}
                {[...Array(totalPages)].map((_, index) => (
                    <a
                        key={index}
                        href={`/?page=${index + 1}`}
                        className={`page-button ${
                            currentPage === index + 1 ? "active" : ""
                        }`}
                    >
                        {index + 1}
                    </a>
                ))}

                {/* 다음 페이지 링크 */}
                {currentPage < totalPages && (
                    <a href={`/?page=${currentPage + 1}`} className="next-page">
                        다음
                    </a>
                )}
            </div>
        </>
    );
}
