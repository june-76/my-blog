import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export default function Home({ posts }) {
    return (
        <div>
            <h1>My Blog</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link href={`/posts/${post.slug}`}>
                            <a>
                                <h2>{post.title}</h2>
                                <p>{post.date}</p>
                                <p>{post.description}</p>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export async function getStaticProps() {
    const files = fs.readdirSync(path.join("content"));

    const posts = files.map((filename) => {
        const slug = filename.replace(".md", "");

        const markdownWithMeta = fs.readFileSync(
            path.join("content", filename),
            "utf-8"
        );

        const { data: frontmatter } = matter(markdownWithMeta);

        return {
            slug,
            title: frontmatter.title,
            date: frontmatter.date,
            description: frontmatter.description,
        };
    });

    return {
        props: {
            posts,
        },
    };
}
