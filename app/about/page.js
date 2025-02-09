import Image from "next/image";

export default function AboutPage({ searchParams }) {
    const language = searchParams.lang || "kr";

    const content = {
        kr: {
            title: "지금은 공사중!",
            description1:
                "지난 기간 notion, velog, 지면 등에 기록한 내용들을 모아 정리하고 있습니다. 아이디어를 구현하거나, 문제를 발견하고 해결하는 것에 관심이 있습니다. 주로 Java, Javascript를 활용합니다.",
            description2:
                "이 블로그는 Next.js, AWS, Vercel으로 제작되었습니다.",
            role: "Software Engineer",
        },
        jp: {
            title: "工事中です！",
            description1:
                "これまでのnotion、velog、紙面などに記録した内容を集めて整理しています。アイデアを実現したり、問題を発見して解決することに興味があります。主にJavaとJavaScriptを活用しています。",
            description2:
                "このブログは Next.js、AWS、Vercelを使って作成されました。",
            role: "Software Engineer",
        },
    };

    return (
        <div className="max-w-xl mx-auto my-10 b p-5">
            <Image
                className="rounded-full mx-auto"
                src="https://avatars.githubusercontent.com/u/165984445?v=4"
                alt="Profile picture"
                width={128}
                height={128}
            />
            <h2 className="text-center text-2xl font-semibold mt-3">June</h2>
            <p className="text-center text-gray-600 mt-1">
                {content[language].role}
            </p>
            <div className="flex justify-center mt-5">
                <a
                    href="https://github.com/june-76"
                    className="text-grey-600 mx-3 hover-highlight"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
                <a
                    href=""
                    className="text-grey-600 mx-3 hover-highlight"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    LinkedIn
                </a>
                <a
                    href="https://x.com/junefromjuly"
                    className="text-grey-600 mx-3 hover-highlight"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Twitter
                </a>
            </div>
            <div className="mt-10">
                <h3 className="text-xl font-semibold">
                    {content[language].title}
                </h3>
                <p className="text-gray-600">
                    {content[language].description1}
                </p>
            </div>
            <div className="mt-10">
                <p className="text-gray-600">
                    {content[language].description2}
                </p>
            </div>
        </div>
    );
}
