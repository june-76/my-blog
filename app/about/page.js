// app/about/page.js

// Next.js의 파일 기반 라우팅 기능에 의해, about 폴더는 /about 경로를 생성합니다.
// junefromjuly.blog/about 접근 시 about 폴더의 page.js 파일이 렌더링됩니다. (SSR)
// 폴더 내의 page.js 파일은 해당 경로의 기본 페이지를 담당합니다. (라우트의 엔트리 포인트)

import Image from "next/image";

export default function AboutPage({ searchParams }) {
    const language = searchParams.lang || "kr"; // URL 쿼리 파라미터에서 언어 설정을 가져옴

    const content = {
        kr: {
            title: "지금은 공사중!",
            description:
                "지난 2년 동안 notion, velog, 지면에 기록한 내용들을 모아 정리하고 있습니다.",
            role: "소프트웨어 엔지니어",
        },
        jp: {
            title: "工事中です！",
            description:
                "過去2年間のnotion、velog、紙面に記録した内容を集めて整理しています。",
            role: "ソフトウェアエンジニア",
        },
    };

    return (
        <div className="max-w-lg mx-auto my-10 bg-white rounded-lg shadow-md p-5">
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
                    className="text-blue-500 hover:text-blue-700 mx-3"
                >
                    GitHub
                </a>
                <a href="" className="text-blue-500 hover:text-blue-700 mx-3">
                    LinkedIn
                </a>
                <a
                    href="https://x.com/junefromjuly"
                    className="text-blue-500 hover:text-blue-700 mx-3"
                >
                    Twitter
                </a>
            </div>
            <div className="mt-5">
                <h3 className="text-xl font-semibold">
                    {content[language].title}
                </h3>
                <p className="text-gray-600 mt-2">
                    {content[language].description}
                </p>
            </div>
        </div>
    );
}
