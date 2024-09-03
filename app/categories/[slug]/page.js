// /app/category/page.js

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";

const loadCategories = () => {
    const categoriesFilePath = path.join(process.cwd(), "content", "categories.json");
    const categoriesData = fs.readFileSync(categoriesFilePath, "utf-8");
    return JSON.parse(categoriesData);
};

const loadPostsByCategory = (categorySlug) => {
    const postsDirectory = path.join(process.cwd(), "content");
    const postFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith(".md"));

    return postFiles
        .map(file => {
            const filePath = path.join(postsDirectory, file);
            const fileContents = fs.readFileSync(filePath, "utf-8");
            const { data } = matter(fileContents);

            // 첫 번째 이미지 추출
            const processedContent = remark().use(html).processSync(fileContents);
            const contentHtml = processedContent.toString();
            const firstImageMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
            const thumbnail = firstImageMatch ? firstImageMatch[1] : null;

            return {
                ...data,
                slug: file.replace(/\.md$/, ''),
                thumbnail, // 섬네일 추가
            };
        })
        .filter(post => post.category === categorySlug);
};

export default async function CategoryPage({ params }) {
    const { slug } = params;
    const categories = loadCategories();
    const posts = loadPostsByCategory(slug);
    const currentCategory = categories.find(category => category.slug === slug);

    if (!currentCategory) {
        return <div>카테고리를 찾을 수 없습니다.</div>;
    }

    return (
        <div>
            <h1>{currentCategory.name}</h1>
            <p className="category-description">{currentCategory.description}</p>
            <ul>
                {posts.map(post => (
                    <li key={post.slug} className="post-item">
                        <Link href={`/posts/${post.slug}`}>
                            {post.thumbnail && (
                                <img
                                    src={post.thumbnail}
                                    alt={`Thumbnail for ${post.title}`}
                                    className="thumbnail" // CSS 클래스 추가
                                />
                            )}
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
