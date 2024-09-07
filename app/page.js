// /app/page.js

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Analytics } from "@vercel/analytics/react";

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

        // 첫 번째 이미지 추출
        const processedContent = remark()
            .use(html)
            .processSync(markdownWithMeta);
        const contentHtml = processedContent.toString();
        const firstImageMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
        const thumbnail = firstImageMatch ? firstImageMatch[1] : null;

        return {
            slug,
            title: frontmatter.title || "Untitled",
            date: frontmatter.date || "No Date",
            description: frontmatter.description || "No Description",
            thumbnail, // 섬네일 추가
        };
    });

    // 유효한 포스트만 필터링
    const validPosts = posts.filter((post) => {
        return (
            post.title !== "Untitled" &&
            post.title.trim() !== "" &&
            post.date !== "No Date" &&
            post.date.trim() !== "" &&
            post.description !== "No Description" &&
            post.description.trim() !== ""
        );
    });

    return (
        <>
            <section className="grid min-h-screen p-8 place-items-center">
                <div className="container grid grid-cols-1 gap-8 my-auto lg:grid-cols-2">
                    {validPosts.length === 0 ? (
                        <div>작성된 포스트가 없습니다.</div>
                    ) : (
                        validPosts.map((post) => (
                            <div
                                key={post.slug}
                                className="relative flex-col bg-clip-border rounded-xl bg-transparent text-gray-700 shadow-none grid gap-2 item sm:grid-cols-2"
                            >
                                <div className="relative bg-clip-border rounded-xl overflow-hidden bg-white text-gray-700 shadow-lg m-0">
                                    <img
                                        src={
                                            post.thumbnail ||
                                            "https://via.placeholder.com/400"
                                        }
                                        alt={`Thumbnail for ${post.title}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-6 px-2 sm:pr-6 sm:pl-4">
                                    <p className="block antialiased font-sans text-sm font-light leading-normal text-inherit mb-4 !font-semibold">
                                        CATEGORY-1
                                    </p>
                                    <a
                                        href={`/posts/${post.slug}`}
                                        className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900 mb-2 normal-case transition-colors hover:text-gray-700"
                                    >
                                        {post.title}
                                    </a>
                                    <p className="block antialiased font-sans text-base leading-relaxed text-inherit mb-8 font-normal !text-gray-500">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src="https://via.placeholder.com/50"
                                            className="inline-block relative object-cover object-center !rounded-full w-12 h-12 rounded-lg"
                                            alt="Author"
                                        />
                                        <div>
                                            <p className="block antialiased font-sans text-base font-light leading-relaxed text-blue-gray-900 mb-0.5 !font-semibold">
                                                Author Name
                                            </p>
                                            <p className="block antialiased font-sans text-sm leading-normal text-gray-700 font-normal">
                                                {post.date}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
            <br />
            <a
                href="https://www.material-tailwind.com/magic-ai"
                target="_blank"
            >
                Generated with <b>Magic AI Blocks</b>
            </a>{" "}
            by{" "}
            <a href="https://www.creative-tim.com/" target="_blank">
                Creative Tim
            </a>
            .
            <br /> <br />
            <Analytics />
        </>
    );
}
