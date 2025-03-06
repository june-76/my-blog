"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

async function fetchPostData(slug, lang) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/postContents?postId=${slug}&lang=${lang}`;
    try {
        const response = await fetch(apiUrl, { mode: "cors" });
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

async function fetchComments(postId) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments?postId=${postId}`;
    try {
        const response = await fetch(apiUrl, { mode: "cors" });
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

async function addComment(postId, name, password, content) {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments`;
    const payload = { postId, name, password, content };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

function formatDate(date, lang) {
    return new Date(date).toLocaleDateString(lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}

export default function PostPage({ params, searchParams }) {
    const { slug } = params;
    const lang = searchParams.lang || "kr";
    const [postData, setPostData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [name, setName] = useState(lang === "kr" ? "작성자" : "作成者");
    const [password, setPassword] = useState("");
    const [content, setContent] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(true);

    useEffect(() => {
        async function loadPostData() {
            try {
                const postData = await fetchPostData(slug, lang);
                setPostData(postData);
                setComments(await fetchComments(slug));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        loadPostData();
    }, [slug, lang]);

    useEffect(() => {
        setSubmitDisabled(
            !(name.length > 0 && password.length >= 6 && content.length > 0)
        );
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
                setComments([...comments, newComment]);
                setName("");
                setPassword("");
                setContent("");
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    if (loading)
        return <div className="grid p-20 place-items-center">Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!postData)
        return (
            <div>
                {lang === "kr"
                    ? "포스트를 찾을 수 없습니다."
                    : "Post not found."}
            </div>
        );

    const {
        title,
        content: postContent,
        postCategory,
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
                                <div className="leading-relaxed text-gray-700">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            code({
                                                inline,
                                                className,
                                                children,
                                                ...props
                                            }) {
                                                const language =
                                                    className?.replace(
                                                        "language-",
                                                        ""
                                                    );
                                                return !inline ? (
                                                    <SyntaxHighlighter
                                                        language={language}
                                                    >
                                                        {String(
                                                            children
                                                        ).replace(/\n$/, "")}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code
                                                        className={className}
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            },
                                            p({ children }) {
                                                return (
                                                    <p
                                                        style={{
                                                            whiteSpace:
                                                                "pre-line",
                                                        }}
                                                    >
                                                        {children}
                                                    </p>
                                                );
                                            },
                                            img({ src, alt }) {
                                                return (
                                                    <Image
                                                        src={src}
                                                        alt={alt}
                                                        width={600}
                                                        height={400}
                                                        layout="responsive"
                                                    />
                                                );
                                            },
                                        }}
                                    >
                                        {postContent}
                                    </ReactMarkdown>
                                </div>
                                <p className="text-gray-400 mt-8">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-full rounded-xl bg-white overflow-hidden shadow-md mt-10 p-6">
                    <div className="rounded-lg mt-2 mb-2">
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder={
                                    lang === "kr" ? "작성자" : "作成者"
                                }
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-1/2 p-2 border rounded-md"
                                maxLength={20}
                            />
                            <input
                                type="password"
                                placeholder={
                                    lang === "kr"
                                        ? "비밀번호(6자 이상)"
                                        : "パスワード（6文字以上）"
                                }
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-1/2 p-2 border rounded-md"
                            />
                        </div>
                        <div className="flex gap-2">
                            <textarea
                                placeholder={
                                    lang === "kr"
                                        ? "내용을 입력하세요."
                                        : "内容を入力してください。"
                                }
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-4/5 p-2 border rounded-md h-20 resize-none"
                            />
                            <button
                                onClick={handleCommentSubmit}
                                className={`w-1/5 bg-gray-400 text-white rounded-md hover-highlight-bg hover:text-gray-600 $$
                                {submitDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""}`}
                                disabled={submitDisabled}
                            >
                                {lang === "kr" ? "작성" : "投稿"}
                            </button>
                        </div>
                    </div>
                    <div className="comments-section">
                        {comments.map((comment) => renderComment(comment))}
                    </div>
                </div>
            </div>
        </section>
    );
}
