---
title: "버블 정렬(Bubble Sort)"
date: "2023-05-28"
description: ""
category: "CS"
---

### 첫 회사 면접에서의 기억

알고리즘 카테고리의 첫번째 글은 버블 정렬로 정했다.
버블 정렬에 대해 정리하기 전 사담을 하자면,
버블 정렬은 내가 처음으로 재직한 회사의 면접에서 문제로 만났던 알고리즘이다.
<br />
대학 졸업 학기와 함께 웹 개발 중심의 집체 교육을 병행했고,
신입으로서 기술 면접에 대비해기 위해 기초적인 알고리즘을 공부했던 기억이 생생하다.
버블 정렬은 그 중 하나였다.
<br />
구직 기간동안 많은 면접을 본 건 아니었지만, 그 중 기술면접을 실시한 곳은 유일했다. 빈 용지에 버블 정렬을 사용한 코드를 작성하여 제출하는 것이었으므로 기술면접이라기에는 부족할 수 있겠다. 그럼에도 당시에는 그 회사에 취업을 결정한 이유 중 하나가 되었다.
<br />
아무튼 버블 정렬은 그 자체로는 잘 활용되지 않고, 실제로도 사용해본 적은 없지만 나에게는 잊을 수 없는 알고리즘이다.
<br />
그럼 추억이 있는 버블 정렬을 정리해보자.

### 버블 정렬(java code)

```java
public class BubbleSortExample {
    public static void main(String[] args) {
        int[] arr = {1, 6, 3, 9, 2};

        bubbleSort(arr);
    }

    public static void bubbleSort(int[] arr) {
        int n = arr.length;

        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void printArray(int[] arr) {
        for (int num : arr) {
            System.out.print(num + " ");
        }

        System.out.println();
        // 1 2 3 6 9
    }
}
```
