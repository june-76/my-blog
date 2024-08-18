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

    return (
        <div>
            <ul>
                {posts.map((post) => (
                    <li key={post.slug}>
                        <a href={`/posts/${post.slug}`}>
                            <h2>{post.title}</h2>
                            <p>{post.date}</p>
                            <p>{post.description}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
