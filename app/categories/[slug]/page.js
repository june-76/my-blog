// app/categories/[slug]/page.js

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

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
            return { ...data, slug: file.replace(/\.md$/, '') };
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
            <p>{currentCategory.description}</p>
            <ul>
                {posts.map(post => (
                    <li key={post.slug}>
                        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
