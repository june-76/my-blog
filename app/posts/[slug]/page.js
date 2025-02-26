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

// 댓글 API를 호출하는 함수 추가
async function fetchComments(postId) {
    const commentsApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments?postId=${postId}`;

    try {
        const response = await fetch(commentsApiUrl, {
            mode: "cors",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const comments = await response.json();
        console.log("Fetched comments:", comments);
        return comments;
    } catch (error) {
        console.error("Comments Fetch error:", error);
    }
}

function formatDate(dateString, lang) {
    const locale = lang === "jp" ? "ja-JP" : "ko-KR";

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(dateString));
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

                // 댓글을 가져오는 API 호출 추가 (렌더링은 하지 않고 콘솔에만 찍기)
                const comments = await fetchComments(slug);
                console.log("Comments:", comments); // 댓글을 콘솔에만 출력
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
                {lang === "kr"
                    ? "포스트를 찾을 수 없습니다."
                    : lang === "jp"
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
                                <h2 className="tracking-widest text-s title-font font-medium text-gray-400 mb-1">
                                    {postCategory}
                                </h2>
                                <h1 className="title-font text-xl sm:text-2xl font-bold text-gray-600 mb-2">
                                    {title}
                                </h1>
                                <p className="leading-relaxed text-gray-500 mb-10 text-sm sm:text-base">
                                    {formatDate(date, lang)}
                                </p>
                                <div
                                    className="leading-relaxed ext-gray-700"
                                    dangerouslySetInnerHTML={{
                                        __html: content,
                                    }}
                                ></div>
                                <p className="text-gray-400 mt-8">
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
