---
title: "루프 언롤링"
date: "2025-01-07 10:33"
description: ""
category: "learning-notes"
---

```c
for (int i = 0; i < 4; i++) {
    array[i] = array[i] * 2;
}
```

```c
array[0] = array[0] * 2;
array[1] = array[1] * 2;
array[2] = array[2] * 2;
array[3] = array[3] * 2;
```

