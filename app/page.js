// app/page.js

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default async function HomePage() {
    // 데이터 패칭
    const files = fs.readdirSync(path.join(process.cwd(), "content"));

    const posts = files.map((filename) => {
        const slug = filename.replace(".md", "");
        const markdownWithMeta = fs.readFileSync(
            path.join("content", filename),
            "utf-8"
        );
        const { data: frontmatter } = matter(markdownWithMeta);

        return {
            slug,
            title: frontmatter.title || "Untitled",
            date: frontmatter.date || "No Date",
            description: frontmatter.description || "No Description",
        };
    });

    // 유효한 포스트만 필터링
    const validPosts = posts.filter(post => {
        return post.title !== "Untitled" && 
               post.title.trim() !== "" && 
               post.date !== "No Date" && 
               post.date.trim() !== "" && 
               post.description !== "No Description" && 
               post.description.trim() !== "";
    });

    return (
        <div>
            <ul>
                {validPosts.length === 0 ? (
                    <li>작성된 포스트가 없습니다.</li>
                ) : (
                    validPosts.map((post) => (
                        <li key={post.slug}>
                            <a href={`/posts/${post.slug}`}>
                                <h2>{post.title}</h2>
                                <p>{post.date}</p>
                                <p>{post.description}</p>
                            </a>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
