---
title: "프리즘~~~~~~~~~ 테스트"
date: "2024-10-23"
description: ""
category: "Daily"
---

![섬네일 이미지](/thumbnail/temp.png)

# CORS Test (8.26)

네. 일단 개념은 대충 이해했지만 실제로 테스트를 해봐야 제대로 이해가 될거 같습니다. cors를 설정했을 때와 아닐 때 어떻게 다른지 직접 봐야겠죠

### ChatGPT의 말:

ChatGPT

맞습니다! CORS 설정을 직접 해보는 것이 개념을 이해하는 데 큰 도움이 됩니다. CORS의 작동 방식은 실제로 실험해 보는 것이 가장 효과적이니까요. CORS가 설정되었을 때와 그렇지 않을 때의 차이를 직접 확인하면 더 깊이 있는 이해가 가능할 것입니다.

### CORS 설정을 테스트하는 방법

1. **API 서버 만들기**:

    - 간단한 API 서버를 만들어서 CORS를 설정해 보세요. Node.js와 Express.js를 사용해 보시면 좋습니다.

    **예시 코드** (CORS가 설정된 간단한 Express.js 서버):

    ```jsx
    javascript코드 복사
    const express = require('express');
    const cors = require('cors');

    const app = express();

    // CORS 설정
    app.use(cors({
      origin: 'http://localhost:3000', // Next.js 애플리케이션의 주소
    }));

    app.get('/api/data', (req, res) => {
      res.json({ message: 'Hello from CORS-enabled API!' });
    });

    app.listen(4000, () => {
      console.log('API server is running on http://localhost:4000');
    });

    ```

2. **Next.js 애플리케이션 만들기**:

    - Next.js 애플리케이션을 생성하고 API를 호출하는 페이지를 만들어 보세요.

    **예시 코드** (API 호출을 포함한 Next.js 페이지):

    ```jsx
    javascript코드 복사
    // pages/index.js
    import { useEffect, useState } from 'react';
    import axios from 'axios';

    const HomePage = () => {
      const [data, setData] = useState(null);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:4000/api/data');
            setData(response.data);
          } catch (err) {
            setError(err.message);
          }
        };
        fetchData();
      }, []);

      return (
        <div>
          <h1>CORS Test</h1>
          {error ? (
            <p>Error: {error}</p>
          ) : (
            <p>Data: {data?.message}</p>
          )}
        </div>
      );
    };

    export default HomePage;

    ```

3. **CORS 설정 여부 테스트**:
    - 위의 API 서버가 실행 중일 때, Next.js 애플리케이션을 실행합니다.
    - **CORS가 설정된 경우**: 정상적으로 데이터가 출력될 것입니다.
    - **CORS가 설정되지 않은 경우**: 브라우저의 개발자 도구를 통해 CORS 오류 메시지가 나타나고 데이터가 로드되지 않을 것입니다.
4. **CORS 설정 변경하기**:
    - API 서버의 CORS 설정을 변경하여 특정 출처만 허용하거나 아예 CORS 설정을 제거해 보세요. 각 경우에 대해 Next.js 애플리케이션에서의 동작을 확인하면 CORS의 작동 방식에 대한 이해가 더욱 깊어질 것입니다.

### 결과 확인

-   **CORS가 활성화된 경우**: API 요청이 성공적으로 이루어지고, 응답 데이터를 받는 것을 확인할 수 있습니다.
-   **CORS가 비활성화된 경우**: "CORS 정책 위반"과 같은 오류가 발생하며, API에 대한 요청이 차단됩니다.

이렇게 실제로 코드를 작성하고 테스트해보면, CORS의 개념과 작동 방식을 더 명확히 이해할 수 있을 것입니다. 실습을 통해 발견하는 점들이 많으니 꼭 시도해보시길 추천합니다! 추가적인 질문이나 도움이 필요하면 언제든지 말씀해 주세요.
