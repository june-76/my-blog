"use client";

import { useEffect, useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

// 임시 JSON 댓글 데이터
const mockComments = [
    {
        id: 1,
        post_id: 1,
        name: "홍길동",
        content: "첫 번째 댓글이에요!",
        is_admin: false,
        created_at: "2025-02-27 10:00:00",
        parent_comment_id: null,
        replies: [
            {
                id: 2,
                post_id: 1,
                name: "김철수",
                content: "첫 번째 댓글에 대한 대댓글",
                is_admin: false,
                created_at: "2025-02-27 10:05:00",
                parent_comment_id: 1,
                replies: [],
            },
            {
                id: 3,
                post_id: 1,
                name: "이영희",
                content: "또 다른 대댓글이에요",
                is_admin: false,
                created_at: "2025-02-27 10:10:00",
                parent_comment_id: 1,
                replies: [
                    {
                        id: 4,
                        post_id: 1,
                        name: "최지우",
                        content: "대댓글에 대한 대댓글!",
                        is_admin: true,
                        created_at: "2025-02-27 10:20:00",
                        parent_comment_id: 3,
                        replies: [],
                    },
                ],
            },
        ],
    },
    {
        id: 5,
        post_id: 1,
        name: "박수정",
        content: "두 번째 댓글이에요!",
        is_admin: true,
        created_at: "2025-02-27 11:00:00",
        parent_comment_id: null,
        replies: [],
    },
];

async function convertMarkdownToHtml(markdown) {
    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(markdown);

    return processedContent.toString().trim();
}

async function fetchPostData(postId, lang) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/postContents?postId=${postId}&lang=${lang}`;
    try {
        const response = await fetch(apiUrl, { mode: "cors" });
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

function renderComment(comment, level = 0) {
    return (
        <div
            key={comment.id}
            style={{ marginLeft: `${level * 20}px`, marginBottom: "12px" }}
        >
            <div>
                <strong>{comment.is_admin ? "운영자" : comment.name}</strong>{" "}
                <small>{formatDate(comment.created_at, "kr")}</small>
            </div>
            <p className="text-gray-700">{comment.content}</p>
            {comment.replies &&
                comment.replies.length > 0 &&
                comment.replies.map((reply) => renderComment(reply, level + 1))}
        </div>
    );
}

export default function PostPage({ params, searchParams }) {
    const { slug } = params;
    const lang = searchParams.lang || "kr";
    const [postData, setPostData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState(mockComments); // 임시 댓글 데이터 상태 추가

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
                <div className="h-full rounded-xl bg-white overflow-hidden shadow-md mt-10 p-8">
                    <div className="comments-section">
                        {comments.map((comment) => renderComment(comment))}
                    </div>
                </div>
            </div>
        </section>
    );
}
