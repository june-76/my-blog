"use client"; // 클라이언트 컴포넌트임을 명시

import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-java";

export default function PostContent({ content }) {
    // 클라이언트 측에서 Prism.js 하이라이팅을 적용
    useEffect(() => {
        Prism.highlightAll(); // DOM이 준비된 후 하이라이팅 적용
    }, [content]);

    return (
        <div className="leading-relaxed text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}
