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

// 댓글 추가 API 호출 함수
async function addComment(postId, name, password, content) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments`;
    const payload = { postId, name, password, content };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
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

// 댓글 수정 및 삭제 함수
function handleEdit(commentId) {
    console.log("수정할 댓글 ID:", commentId);
    // 수정 로직을 추가 (예: 수정 폼을 보여주기)
}

function handleDelete(commentId) {
    console.log("삭제할 댓글 ID:", commentId);
    // 삭제 로직을 추가 (예: 삭제 요청 보내기)
}

// 댓글 렌더링 함수
function renderComment(comment) {
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

            {/* 수정/삭제 버튼 추가 */}
            <div className="flex justify-end gap-1 text-sm">
                <button
                    onClick={() => handleEdit(comment.id)}
                    className="border text-gray p-1 rounded-md hover-highlight-bg"
                >
                    수정
                </button>
                <button
                    onClick={() => handleDelete(comment.id)}
                    className="border text-gray p-1 rounded-md hover-highlight-bg"
                >
                    삭제
                </button>
            </div>

            {/* 대댓글이 있을 경우 재귀적으로 댓글 렌더링 */}
            {comment.replies && comment.replies.length > 0 && (
                <div>
                    {comment.replies.map((reply) => renderComment(reply))}
                </div>
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
    const [comments, setComments] = useState([]);
    const [name, setName] = useState("작성자"); // 작성자 상태
    const [password, setPassword] = useState(""); // 비밀번호 상태
    const [content, setContent] = useState(""); // 댓글 내용 상태
    const [submitDisabled, setSubmitDisabled] = useState(true); // 버튼 비활성화 상태

    useEffect(() => {
        async function loadPostData() {
            try {
                const postData = await fetchPostData(slug, lang);
                setPostData(postData);
                const fetchedComments = await fetchComments(slug);
                setComments(fetchedComments);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        loadPostData();
    }, [slug, lang]);

    useEffect(() => {
        // 유효성 검사: 작성자, 비밀번호, 댓글 내용이 조건을 만족하는지 체크
        if (name.length > 0 && password.length >= 6 && content.length > 0) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [name, password, content]);

    const handleCommentSubmit = async () => {
        if (!submitDisabled) {
            try {
                const newComment = await addComment(
                    slug,
                    name,
                    password,
                    content
                );
                setComments([...comments, newComment]); // 새 댓글 추가
                setName(""); // 입력 값 초기화
                setPassword("");
                setContent("");
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

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
        content: postContent,
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
                                        __html: postContent,
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
                    <div className="rounded-lg mt-2 mb-2">
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="작성자"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-1/2 p-2 border rounded-md"
                                maxLength={20}
                            />
                            <input
                                type="password"
                                placeholder="비밀번호(6자 이상)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-1/2 p-2 border rounded-md"
                            />
                        </div>

                        <div className="flex gap-2">
                            <textarea
                                placeholder="내용을 입력하세요."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-4/5 p-2 border rounded-md h-20 resize-none"
                            />
                            <button
                                onClick={handleCommentSubmit}
                                className={`w-1/5 bg-gray-400 text-white rounded-md hover-highlight-bg hover:text-gray-600 ${
                                    submitDisabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                disabled={submitDisabled}
                            >
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
