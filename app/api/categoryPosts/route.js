// app/api/categoryPosts/route.js

import { fetchData } from "../../utils/api";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const lang = searchParams.get("lang") || "en";
    const category = searchParams.get("category") || "";

    console.log("categoryPosts GET Called...", { page, lang, category });

    try {
        const data = await fetchData("categoryPosts", { page, lang, category });

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
