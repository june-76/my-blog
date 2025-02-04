"use client";

import { useEffect, useState } from "react";

async function fetchCategoryPosts(page, language = "kr", category) {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        throw new Error(
            "Environment variable NEXT_PUBLIC_API_BASE_URL is not defined."
        );
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categoryPosts?page=${page}&lang=${language}&category=${category}`;
    if (process.env.NODE_ENV === "development") {
        console.log("API URL:", apiUrl);
    }

    const response = await fetch(apiUrl, {
        mode: "cors",
    });
    const data = await response.json();

    const postsArray = Array.isArray(data.posts) ? data.posts : data;

    const filteredPosts = postsArray.filter(
        (post) => post.language === language || !post.language
    );

    return {
        posts: filteredPosts,
        currentPage: data.currentPage || page,
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

export default function CategoryPage({ searchParams, params }) {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const page = parseInt(searchParams.page || "1", 10);
    const language = searchParams.lang || "kr";
    const category = params.slug;

    useEffect(() => {
        async function loadPosts() {
            try {
                const { posts, currentPage, totalPages } =
                    await fetchCategoryPosts(page, language, category);
                setPosts(posts);
                setCurrentPage(currentPage);
                setTotalPages(totalPages);
            } catch (error) {
                console.error("Error fetching category posts:", error);
            } finally {
                setLoading(false);
            }
        }
        loadPosts();
    }, [page, language, category]);

    if (loading) {
        return <div className="grid p-20 place-items-center">Loading...</div>;
    }

    return (
        <>
            <section className="grid p-8 place-items-center">
                <div className="container grid grid-cols-1 gap-8 my-auto lg:grid-cols-2">
                    {posts.length === 0 ? (
                        <div>
                            {language === "kr"
                                ? "작성된 글이 없습니다."
                                : language === "jp"
                                ? "投稿がありません。"
                                : "No posts in thie category."}
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post.id}
                                className="relative flex-col bg-clip-border rounded-xl bg-f5f5f5 text-gray-700 shadow-none grid gap-2 item sm:grid-cols-2"
                            >
                                <div className="relative bg-clip-border rounded-xl overflow-hidden text-gray-700 m-0 p-4">
                                    <img
                                        src={
                                            post.thumbnail ||
                                            "https://placehold.co/600x400"
                                        }
                                        alt={`Thumbnail for ${post.title}`}
                                        className="object-cover w-full h-full p-2"
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
                        href={`/categories/${category}?page=${
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
                        href={`/categories/${category}?page=${
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
                        href={`/categories/${category}?page=${
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
