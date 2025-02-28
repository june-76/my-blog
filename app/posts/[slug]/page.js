"use client";

import { useEffect, useState } from "react";

// 포스트 데이터를 가져오는 함수 정의
async function fetchPostData(slug, lang) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/postContents?postId=${slug}&lang=${lang}`;
    try {
        const response = await fetch(apiUrl, { mode: "cors" });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

// 댓글 API 호출 함수
async function fetchComments(postId) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments?postId=${postId}`;
    try {
        const response = await fetch(apiUrl, { mode: "cors" });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

// 날짜 포맷 함수 정의
function formatDate(date, lang) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // 24시간 형식 유지
    };

    return new Date(date).toLocaleDateString(lang, options);
}

// 댓글 렌더링 함수
function renderComment(comment) {
    // depth 값에 따라 왼쪽 여백을 조정
    const commentStyle = {
        paddingLeft: `${comment.depth * 2}rem`, // depth가 1이면 2rem, 2이면 4rem, 3이면 6rem...
    };

    return (
        <div
            key={comment.id}
            className="comment p-3 border-t border-gray-200"
            style={commentStyle}
        >
            <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">{comment.name}</p>
                <p className="text-gray-500 text-sm">
                    {formatDate(comment.created_at, "kr")}
                </p>
            </div>
            <p className="text-gray-600 mt-1">{comment.content}</p>
            {/* 대댓글이 있을 경우 재귀적으로 자식 댓글을 렌더링 */}
            {comment && comment.length > 0 && (
                <div>{comment.map((reply) => renderComment(reply))}</div>
            )}
        </div>
    );
}

export default function PostPage({ params, searchParams }) {
    const { slug } = params;
    const lang = searchParams.lang || "kr";
    const [postData, setPostData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]); // 댓글 상태

    useEffect(() => {
        async function loadPostData() {
            try {
                // 포스트 데이터와 댓글을 동시에 가져오기
                const postData = await fetchPostData(slug, lang);
                setPostData(postData);

                // 댓글 데이터 가져오기
                const fetchedComments = await fetchComments(slug); // 슬러그를 postId로 사용
                setComments(fetchedComments);
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
                                    className="leading-relaxed text-gray-700"
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
                <div className="h-full rounded-xl bg-white overflow-hidden shadow-md mt-10 p-6">
                    {/* 댓글 입력 폼 */}
                    <div className="mb-6 rounded-lg mt-2">
                        {/* 이름 & 비밀번호 가로 배치 */}
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="작성자"
                                className="w-1/2 p-2 border rounded-md"
                                maxLength={20}
                            />
                            <input
                                type="password"
                                placeholder="비밀번호(6자 이상)"
                                className="w-1/2 p-2 border rounded-md"
                            />
                        </div>

                        {/* 댓글 입력란 & 작성 버튼 가로 배치 */}
                        <div className="flex gap-2">
                            <textarea
                                placeholder="내용을 입력하세요."
                                className="w-4/5 p-2 border rounded-md h-20 resize-none"
                            />
                            <button className="w-1/5 bg-gray-400 text-white py-2 rounded-md hover-highlight-bg hover:text-gray-600">
                                작성
                            </button>
                        </div>
                    </div>

                    {/* 댓글 목록 */}
                    <div className="comments-section">
                        {comments.map((comment) => renderComment(comment))}
                    </div>
                </div>
            </div>
        </section>
    );
}
