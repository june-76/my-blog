import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";

const POSTS_PER_PAGE = 10;

const loadCategories = () => {
    const categoriesFilePath = path.join(
        process.cwd(),
        "content",
        "categories.json"
    );
    const categoriesData = fs.readFileSync(categoriesFilePath, "utf-8");
    return JSON.parse(categoriesData);
};

const loadPostsByCategory = (categorySlug, page) => {
    const postsDirectory = path.join(process.cwd(), "content");
    const postFiles = fs
        .readdirSync(postsDirectory)
        .filter((file) => file.endsWith(".md"));

    const posts = postFiles
        .map((file) => {
            const filePath = path.join(postsDirectory, file);
            const fileContents = fs.readFileSync(filePath, "utf-8");
            const { data } = matter(fileContents);

            // 섬네일 용도의 첫 번째 이미지 추출
            const processedContent = remark()
                .use(html)
                .processSync(fileContents);
            const contentHtml = processedContent.toString();
            const firstImageMatch = contentHtml.match(
                /<img[^>]+src="([^">]+)"/
            );
            const thumbnail = firstImageMatch ? firstImageMatch[1] : null;

            return {
                ...data,
                slug: file.replace(/\.md$/, ""),
                thumbnail,
            };
        })
        .filter((post) => post.category === categorySlug)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // 페이징 처리
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const selectedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    return {
        posts: selectedPosts,
        totalPages,
    };
};

// 동적 라우팅을 사용하여 slug 값에 따라 카테고리별 포스트를 다르게 표시하는 동적 페이지입니다.
export default async function CategoryPage({ params, searchParams }) {
    const { slug } = params;
    const categories = loadCategories();
    const page = parseInt(searchParams.page || "1", 10); // 페이지 번호 파라미터
    const { posts, totalPages } = loadPostsByCategory(slug, page);

    const currentCategory = categories.find(
        (category) => category.slug === slug
    );

    if (!currentCategory) {
        return <div>카테고리를 찾을 수 없습니다.</div>;
    }

    return (
        <>
            <section className="grid p-8 place-items-center">
                <div className="container grid grid-cols-1 gap-8 my-auto lg:grid-cols-2">
                    {posts.length === 0 ? (
                        <div>이 카테고리에는 아직 작성된 글이 없습니다.</div>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post.slug}
                                className="relative flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-none grid gap-2 item sm:grid-cols-2"
                            >
                                <div className="relative bg-clip-border rounded-xl overflow-hidden bg-white text-gray-700 m-0 p-4">
                                    <img
                                        src={
                                            post.thumbnail ||
                                            "https://placehold.co/600x400"
                                        }
                                        alt={`Thumbnail for ${post.title}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-6 px-2 sm:pr-6 sm:pl-4">
                                    <p className="block antialiased font-sans text-sm font-light leading-normal text-inherit mb-4 !font-semibold">
                                        {post.category}
                                    </p>
                                    <Link
                                        href={`/posts/${post.slug}`}
                                        className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900 mb-2 normal-case transition-colors hover:text-gray-700"
                                    >
                                        {post.title}
                                    </Link>
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

            {/* 페이지 네비게이션 */}
            <div className="pagination">
                {/* 이전 페이지 링크 */}
                {page > 1 && (
                    <Link
                        href={`/categories/${slug}?page=${page - 1}`}
                        className="prev-page"
                    >
                        이전
                    </Link>
                )}

                {/* 페이지 번호 */}
                {[...Array(totalPages)].map((_, index) => (
                    <Link
                        key={index}
                        href={`/categories/${slug}?page=${index + 1}`}
                        className={`page-button ${
                            page === index + 1 ? "active" : ""
                        }`}
                    >
                        {index + 1}
                    </Link>
                ))}

                {/* 다음 페이지 링크 */}
                {page < totalPages && (
                    <Link
                        href={`/categories/${slug}?page=${page + 1}`}
                        className="next-page"
                    >
                        다음
                    </Link>
                )}
            </div>
        </>
    );
}
