// app/page.js

async function fetchPosts(page, language = "kr") {
    const apiUrl = `http://localhost:3000/api/posts`; // Use absolute URL
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("API response data:", data);

    const filteredPosts = data.filter(
        (post) =>
            post.language === language ||
            (post.language === "" && language === "kr")
    );

    return {
        posts: filteredPosts,
        currentPage: 1,
        totalPages: 1,
    };
}

// Next.js 14의 새로운 방식: 페이지 데이터 가져오는 방식
export default async function HomePage({ searchParams }) {
    const page = parseInt(searchParams.page || "1", 10); // 페이지 번호 파라미터

    // 언어 파라미터를 searchParams에서 가져오거나 기본값으로 "kr" 설정
    const language = searchParams.lang || "kr";

    const { posts, currentPage, totalPages } = await fetchPosts(page, language);

    return (
        <>
            <section className="grid p-8 place-items-center">
                <div className="container grid grid-cols-1 gap-8 my-auto lg:grid-cols-2">
                    {posts.length === 0 ? (
                        <div>작성된 포스트가 없습니다.</div>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post.id}
                                className="relative flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-none grid gap-2 item sm:grid-cols-2"
                            >
                                <div className="relative bg-clip-border rounded-xl overflow-hidden bg-white text-gray-700 m-0 p-4">
                                    <a href={`/posts/${post.slug}`}>
                                        <div
                                            className="relative w-full"
                                            style={{ aspectRatio: "4/3" }}
                                        >
                                            <img
                                                src={
                                                    post.thumbnail ||
                                                    "https://placehold.co/600x400"
                                                }
                                                alt={`Thumbnail for ${post.title}`}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                    </a>
                                </div>
                                <div className="p-6 px-2 sm:pr-6 sm:pl-4">
                                    <p className="block antialiased font-sans text-sm font-light leading-normal text-inherit mb-4 !font-semibold">
                                        {post.category}
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
                                    <p className="block antialiased font-sans text-sm leading-normal text-gray-700 font-normal">
                                        {post.date}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <div className="pagination">
                {/* 이전 페이지 */}
                {currentPage > 1 && (
                    <a
                        href={`/?${
                            language === "kr" ? "" : `lang=${language}&`
                        }page=${currentPage - 1}`}
                        className="prev-page"
                    >
                        이전
                    </a>
                )}

                {/* 페이지 위치 지정 */}
                {[...Array(totalPages)].map((_, index) => (
                    <a
                        key={index}
                        href={`/?${
                            language === "kr" ? "" : `lang=${language}&`
                        }page=${index + 1}`}
                        className={`page-button ${
                            currentPage === index + 1 ? "active" : ""
                        }`}
                    >
                        {index + 1}
                    </a>
                ))}

                {/* 다음 페이지 */}
                {currentPage < totalPages && (
                    <a
                        href={`/?${
                            language === "kr" ? "" : `lang=${language}&`
                        }page={currentPage + 1}`}
                        className="next-page"
                    >
                        다음
                    </a>
                )}
            </div>
        </>
    );
}
