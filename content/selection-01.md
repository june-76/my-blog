---
title: "선택 정렬(Selection Sort)"
date: "2023-05-29"
description: ""
category: "Algorithm"
---

### 선택 정렬

기초적인 알고리즘인 버블 정렬을 이해했다면 선택 정렬도 쉽게 알 수 있다.
버블 정렬과 달리, 선택 정렬은 '인덱스'를 이용해 요소의 위치를 필요할 때에만 바꾸므로
비교적 낮은 난이도의 알고리즘 문제를 풀이할 때 활용하기 좋다.

### 선택 정렬(java code)

```java
public class SelectionSortExample {
    public static void main(String[] args) {
        int[] arr = {1, 6, 3, 9, 2};

        selectionSort(arr);
        printArray(arr);
    }

    public static void selectionSort(int[] arr) {
        int n = arr.length;

        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;

            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }

            if (minIndex != i) {
                int temp = arr[i];
                arr[i] = arr[minIndex];
                arr[minIndex] = temp;
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
