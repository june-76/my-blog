// app/posts/[slug]/page.js

async function fetchPostData(postId, lang) {
    const apiUrl = `http://52.79.251.88:3000/api/postContents?postId=${postId}&lang=${lang}`;
    console.log("API URL:", apiUrl); // API 요청 경로를 로그로 확인
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export default async function PostPage({ params, searchParams }) {
    const { slug } = params;

    console.log(`slug: ${slug}`);
    console.log(`searchParams:`, searchParams);

    const postId = slug; // slug를 postId로 사용
    const lang = searchParams.lang || "kr";

    console.log(`lang: ${lang}`); // lang 파라미터를 로그로 확인

    let postData;

    try {
        postData = await fetchPostData(postId, lang);
    } catch (error) {
        return <div>오류 발생: {error.message}</div>;
    }

    if (!postData) {
        return <div>포스트를 찾을 수 없습니다.</div>;
    }

    const {
        title,
        content,
        category: postCategory,
        date,
        description,
    } = postData;

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-12 mx-auto max-w-2xl sm:max-w-4xl">
                <div className="flex flex-wrap -m-4">
                    <div className="w-full p-4 mx-auto">
                        <div className="h-full rounded-xl bg-white overflow-hidden shadow-md">
                            <div className="p-8">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                    {postCategory || "카테고리 없음"}
                                </h2>
                                <h1 className="title-font text-xl sm:text-2xl font-medium text-gray-600 mb-4">
                                    {title}
                                </h1>
                                <p className="leading-relaxed text-gray-500 mb-4 text-sm sm:text-base">
                                    {new Date(date).toLocaleDateString("ko-KR")}
                                </p>
                                <p
                                    className="text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: content,
                                    }}
                                ></p>
                                <p className="text-gray-400 mt-4">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
