// app/api/postContents/route.js

import { fetchData } from "../../utils/api";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const lang = searchParams.get("lang") || "kr";

    console.log("postContents GET Called...", { postId, lang });

    if (!postId) {
        return new Response(JSON.stringify({ error: "postId는 필수입니다." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const data = await fetchData("postContents", { postId, lang });

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "데이터를 가져오는 중 오류가 발생했습니다.",
                details: error.message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
