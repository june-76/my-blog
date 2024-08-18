// app/posts/[slug]/page.js

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default async function PostPage({ params }) {
    const { slug } = params;
    const filePath = path.join(process.cwd(), "content", `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    return (
        <div>
            <h1>{frontmatter.title}</h1>
            <p>{frontmatter.date}</p>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}

// pages/posts/[slug]/page.js
// Next.js 13의 새로운 앱 디렉토리 구조에서는 props가 params로 전달되며
// pages 디렉토리에서는 getStaticPaths와 getStaticProps를 사용할 수 있습니다.
// 기존 방법에 맞춰 대체하여 사용할 수 있습니다.
