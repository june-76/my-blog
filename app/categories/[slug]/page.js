// app/categories/[slug]/page.js

import dotenv from "dotenv";

dotenv.config();

async function fetchCategoryPosts(category, page, language = "kr") {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categoryPosts?category=${category}&page=${page}&lang=${language}`;
    console.log("API URL:", apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();
    return {
        posts: data.posts || [],
        currentPage: page,
        totalPages: data.totalPages || 1,
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

export default async function CategoryPage({ params, searchParams }) {
    const { slug } = params;
    const page = parseInt(searchParams.page || "1", 10);
    const language = searchParams.lang || "kr";

    const { posts, currentPage, totalPages } = await fetchCategoryPosts(
        slug, // category 키로 전달
        page,
        language
    );

    return (
        <>
            <section className="grid p-8 place-items-center">
                <div className="container grid grid-cols-1 gap-8 my-auto lg:grid-cols-2">
                    {posts.length === 0 ? (
                        <div>이 카테고리에는 아직 작성된 글이 없습니다.</div>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={`page-${post.id}`}
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
                                    <a
                                        href={`/posts/${post.id}?lang=${language}`}
                                        className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900 mb-2 normal-case transition-colors hover:text-gray-700"
                                    >
                                        {post.title}
                                    </a>
                                    <p className="block antialiased font-sans text-base leading-relaxed text-inherit mb-8 font-normal !text-gray-500">
                                        {post.description}
                                    </p>
                                    <p className="block antialiased text-sm leading-normal text-gray-700 font-normal">
                                        {formatDate(post.date)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* 페이지 네비게이션 */}
            <div className="pagination">
                {currentPage > 1 && (
                    <a
                        href={`/categories/${slug}?page=${
                            currentPage - 1
                        }&lang=${language}`}
                        className="prev-page"
                    >
                        이전
                    </a>
                )}

                {[...Array(totalPages)].map((_, index) => (
                    <a
                        key={index}
                        href={`/categories/${slug}?page=${
                            index + 1
                        }&lang=${language}`}
                        className={`page-button ${
                            currentPage === index + 1 ? "active" : ""
                        }`}
                    >
                        {index + 1}
                    </a>
                ))}

                {currentPage < totalPages && (
                    <a
                        href={`/categories/${slug}?page=${
                            currentPage + 1
                        }&lang=${language}`}
                        className="next-page"
                    >
                        다음
                    </a>
                )}
            </div>
        </>
    );
}
