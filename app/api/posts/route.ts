// app/api/posts/route.ts

export async function GET(req: Request) {
    try {
        const apiUrl = "http://52.79.251.88:3000/api/posts";
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("External API response:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("API 호출 중 에러 발생:", error);
        return new Response(
            JSON.stringify({ error: "API 호출 중 오류가 발생했습니다." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
