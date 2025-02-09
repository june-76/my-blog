"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

async function fetchAllPosts(page, language = "kr") {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        throw new Error(
            "Environment variable NEXT_PUBLIC_API_BASE_URL is not defined."
        );
    }

    let apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/allPosts?page=${page}&lang=${language}`;
    if (process.env.NODE_ENV === "development") {
        console.log("API URL:", apiUrl);
    }

    try {
        const response = await fetch(apiUrl, { mode: "cors" });
        if (!response.ok) {
            throw new Error(`error: ${response.status}`);
        }

        const data = await response.json();
        if (process.env.NODE_ENV === "development") {
            console.log("data:", data);
        }

        return {
            posts: Array.isArray(data.posts) ? data.posts : data,
            currentPage: data.currentPage || page,
            totalPages: data.totalPages || 1,
        };
    } catch (error) {
        console.error("error:", error);
        throw error;
    }
}

function formatDate(dateString) {
    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(dateString));
}

export default function PageContent() {
    const searchParams = useSearchParams();
    const pageParam = parseInt(searchParams.get("page"), 10) || 1;
    const langParam = searchParams.get("lang") || "kr";

    if (process.env.NODE_ENV === "development") {
        console.log(`pageParam: ${pageParam}, langParam: ${langParam}`);
    }

    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(langParam);

    useEffect(() => {
        async function loadPosts() {
            try {
                setLoading(true);
                const { posts, currentPage, totalPages } = await fetchAllPosts(
                    pageParam,
                    language
                );
                setPosts(posts);
                setCurrentPage(currentPage);
                setTotalPages(totalPages);
            } catch (error) {
                console.error("error:", error);
            } finally {
                setLoading(false);
            }
        }
        loadPosts();
    }, [language]);

    if (loading)
        return <div className="grid p-20 place-items-center">Loading...</div>;

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
                                : "No posts in this category."}
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post.id}
                                className="relative flex-col bg-clip-border rounded-xl bg-f5f5f5 text-gray-700 shadow-none grid gap-2 sm:grid-cols-2"
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
                                    <p className="block antialiased text-sm font-light leading-normal text-inherit mb-4 font-semibold">
                                        {post.category}
                                    </p>
                                    <a
                                        href={`/posts/${post.id}?lang=${language}`}
                                        className="block antialiased tracking-normal text-xl font-semibold leading-snug text-blue-gray-900 mb-2 normal-case transition-colors hover:text-gray-700"
                                    >
                                        {post.title}
                                    </a>
                                    <p className="block antialiased text-base leading-relaxed text-inherit mb-8 font-normal text-gray-500">
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
            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => {
                    return (
                        <a
                            key={`page-${index}`}
                            href={`/?lang=${language}&page=${index + 1}`}
                            className={`page-button ${
                                Number(currentPage) === index + 1
                                    ? "active"
                                    : ""
                            }`}
                        >
                            {index + 1}
                        </a>
                    );
                })}
            </div>
        </>
    );
}
