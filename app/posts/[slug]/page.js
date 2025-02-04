"use client";

import { useEffect, useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

async function convertMarkdownToHtml(markdown) {
    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(markdown);

    return processedContent.toString().trim();
}

async function fetchPostData(postId, lang) {
    console.log("Fetching post data for postId:", postId);

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/postContents?postId=${postId}&lang=${lang}`;
    if (process.env.NODE_ENV === "development") {
        console.log("API URL:", apiUrl);
    }

    try {
        const response = await fetch(apiUrl, {
            mode: "cors",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        data.content = await convertMarkdownToHtml(data.content);

        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
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

export default function PostPage({ params, searchParams }) {
    const { slug } = params;
    const lang = searchParams.lang || "kr";
    const [postData, setPostData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPostData() {
            try {
                const data = await fetchPostData(slug, lang);
                setPostData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        loadPostData();
    }, [slug, lang]);

    if (loading) {
        return <div className="grid p-20 place-items-center">Loading...</div>;
    }

    if (error) {
        return <div>오류 발생: {error}</div>;
    }

    if (!postData) {
        return (
            <div>
                {language === "kr"
                    ? "포스트를 찾을 수 없습니다."
                    : language === "jp"
                    ? "投稿がありません。"
                    : "Post not found."}
            </div>
        );
    }

    const {
        title,
        content,
        category: postCategory,
        date,
        description,
    } = postData;

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-12 mx-auto max-w-2xl sm:max-w-4xl">
                <div className="flex flex-wrap -m-4">
                    <div className="w-full p-4 mx-auto">
                        <div className="h-full rounded-xl bg-white overflow-hidden shadow-md">
                            <div className="p-8">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                    {postCategory || "카테고리 없음"}
                                </h2>
                                <h1 className="title-font text-xl sm:text-2xl font-medium text-gray-600 mb-4">
                                    {title}
                                </h1>
                                <p className="leading-relaxed text-gray-500 mb-4 text-sm sm:text-base">
                                    {formatDate(date)}
                                </p>
                                <div
                                    className="text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: content,
                                    }}
                                ></div>
                                <p className="text-gray-400 mt-4">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
