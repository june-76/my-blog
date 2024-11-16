// app/posts/[slug]/PostContent.js

// 해당 컴포넌트는 CSR임을 명시합니다.
"use client";

import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-java";

// 개별 포스트의 콘텐츠를 렌더링하는 클라이언트 컴포넌트입니다.
// HTML 자체는 SSR되어 전달됩니다.
export default function PostContent({ content }) {
    useEffect(() => {
        Prism.highlightAll();
    }, [content]);

    return (
        <div className="leading-relaxed text-gray-700">
            {/* 위험성이 있어 개선이 필요합니다. DOMPurify 사용은 검토중입니다. */}
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}
