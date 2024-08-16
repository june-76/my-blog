import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export default async function PostPage({ params }) {
    const { slug } = params;
    const filePath = path.join(process.cwd(), "content", `${slug}.md`);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    return (
        <div>
            <h1>{frontmatter.title}</h1>
            <p>{frontmatter.date}</p>
            <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>
    );
}

// 서버에서 직접 데이터 패칭
export async function generateStaticParams() {
    const files = fs.readdirSync(path.join(process.cwd(), "content"));

    const paths = files.map((filename) => ({
        slug: filename.replace(".md", ""),
    }));

    return paths.map((path) => ({ params: path }));
}
