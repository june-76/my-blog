// app/page.js

async function fetchAllPosts(page, language = "kr") {
    // const apiUrl = `http://localhost:3000/api/allPosts?page=${page}&lang=${language}`;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/allPosts?page=${page}&lang=${language}`;
    console.log("API URL:", apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();

    // console.log("allPosts API response data:", data);

    // data.posts가 배열인지 확인하고, 배열이 아니면 빈 배열로 초기화
    const postsArray = Array.isArray(data.posts) ? data.posts : data;

    // console.log("Posts array:", postsArray);

    const filteredPosts = postsArray.filter(
        (post) => post.language === language || !post.language
    );

    // console.log("Filtered posts:", filteredPosts);

    return {
        posts: filteredPosts,
        currentPage: data.currentPage || page, // 실제 페이지 번호로 설정
        totalPages: data.totalPages || 1, // 총 페이지 수는 실제 값으로 업데이트 필요
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

// Next.js 14의 새로운 방식: 페이지 데이터 가져오는 방식
export default async function HomePage({ searchParams }) {
    const page = parseInt(searchParams.page || "1", 10); // 페이지 번호 파라미터
    const language = searchParams.lang || "kr"; // 언어 파라미터를 searchParams에서 가져오거나 기본값으로 "kr" 설정

    console.log("HomePage called with params:", { page, language });

    const { posts, currentPage, totalPages } = await fetchAllPosts(
        page,
        language
    );

    // console.log("HomePage fetched posts:", posts);

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
                                className="relative flex-col bg-clip-border rounded-xl bg-f5f5f5 text-gray-700 shadow-none grid gap-2 item sm:grid-cols-2"
                            >
                                <div className="relative bg-clip-border rounded-xl overflow-hidden text-gray-700 m-0 p-4">
                                    <img
                                        src={
                                            post.thumbnail ||
                                            "https://placehold.co/600x400"
                                        }
                                        alt={`Thumbnail for ${post.title}`}
                                        className="object-cover w-full h-full p-2"
                                    />
                                </div>
                                <div className="p-6 px-2 sm:pr-6 sm:pl-4">
                                    <p className="block antialiased text-sm font-light leading-normal text-inherit mb-4 !font-semibold">
                                        {post.category}
                                    </p>
                                    <a
                                        href={`/posts/${post.id}?lang=${language}`}
                                        className="block antialiased tracking-normal text-xl font-semibold leading-snug text-blue-gray-900 mb-2 normal-case transition-colors hover:text-gray-700"
                                    >
                                        {post.title}
                                    </a>
                                    <p className="block antialiased text-base leading-relaxed text-inherit mb-8 font-normal !text-gray-500">
                                        {post.description}
                                    </p>
                                    <p className="block antialiased text-sm leading-normal text-gray-700 font-normal">
                                        {formatDate(post.date)}
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
                        href={`/?lang=${language}&page=${currentPage - 1}`}
                        className="prev-page"
                    >
                        이전
                    </a>
                )}

                {/* 페이지 위치 지정 */}
                {[...Array(totalPages)].map((_, index) => (
                    <a
                        key={`page-${index}`}
                        href={`/?lang=${language}&page=${index + 1}`}
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
                        href={`/?lang=${language}&page=${currentPage + 1}`}
                        className="next-page"
                    >
                        다음
                    </a>
                )}
            </div>
        </>
    );
}
