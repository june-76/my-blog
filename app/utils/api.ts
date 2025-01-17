// app/utils/api.ts

export async function fetchData(
    apiPath: string,
    queryParams: Record<string, string | number> = {}
) {
    const query = new URLSearchParams(
        Object.entries(queryParams).reduce((acc, [key, value]) => {
            if (value !== undefined) acc[key] = String(value);

            return acc;
        }, {} as Record<string, string>)
    ).toString();

    const apiUrl = `http://52.79.251.88:3000/api/${apiPath}${
        query ? `?${query}` : ""
    }`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`fetchData Error (${apiPath}):`, error);
        throw new Error("데이터를 가져오는 중 오류가 발생했습니다.");
    }
}
