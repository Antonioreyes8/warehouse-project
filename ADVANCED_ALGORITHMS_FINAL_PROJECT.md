# Advanced Algorithms Final Project Report

## Project Overview

This project is a portfolio-quality recommendation engine built on a creative collaboration platform. The application uses a personality quiz to compare a users beliefs against a library of artist profiles and then ranks matching artists based on shared values.

The submission focuses on intentional use of data structures and algorithms, with a clear separation between data processing logic and UI components.

## Core Features

- Artist recommendation based on quiz answers
- Prioritized search results using a Max Heap
- Structured scoring and tie-breaking behavior
- Mock dataset representing many artist profiles
- Local state and result rendering in the App Router

## Data Structures Used

### 1. Max Heap

**Where used:** `lib/discovery/maxHeap.ts`

**Why used:**

- Prioritizes artists by score
- Efficiently supports repeated extraction of top matches
- Maintains a dynamic ordering as new scores are inserted

**Alternatives considered:**
- Sorting an array after all scores were computed (`O(n log n)`)
- Using a balanced search tree or priority queue 

**Tradeoffs:**

- Heap insertion/extraction is efficient (`O(log n)`) and ideal when the top result is needed repeatedly.
- A sorted array would be simpler, but insertions would cost `O(n)` and become expensive if the list is updated often.

### 2. Array of Artist Profiles

**Where used:** `app/discovery/quiz/result/page.tsx`

**Why used:**

- Simple sequential access to evaluate each artist
- Easily indexed for test data and score computation

**Alternatives considered:**

- Hash maps keyed by artist ID for constant-time lookup
- Trees or graphs for more complex relationship modeling

**Tradeoffs:**

- Arrays are fast and readable for a fixed dataset of artists.
- They are not optimized for frequent insertion/removal, but the dataset is static enough for this use case.

### Other Supporting Structures

- `Record<string, boolean>` to represent quiz answers and artist hot take flags
- Extracted `ExtendedScoredArtist` type for scored recommendations

## Algorithmic Complexity

### Key operations

#### Score Calculation

- Iterates through each artist and compares quiz answers.
- Time complexity: `O(a * q)` where `a` is the number of artists and `q` is the number of questions.
- Space complexity: `O(a)` to store the scored results.

#### Heap Insertions

- Each artist score is inserted into a Max Heap.
- Time complexity per insertion: `O(log a)`.
- Total time for all insertions: `O(a log a)`.

#### Extracting Top Matches

- Each extraction is `O(log a)`.
- If extracting the top `k` artists, the time is `O(k log a)`.

### Dominant operations

- Heap operations dominate when `a` grows large because the heap is the central structure for ranking.
- Score comparison is also important, but it remains linear with the number of artists.

## Collision / Failure Considerations

### When design degrades

- If the artist dataset grows by 100x, score calculation becomes the bottleneck unless parallelized.
- The current heap is in-memory and will consume `O(a)` space.

### Worst-case behavior

- Worst-case heap insertion and extraction are still `O(log a)`.
- The most expensive scenario is when all artists are inserted and many extractions are performed.

### Failure considerations

- If many artists share the same score, the heap still maintains a valid order, but additional tie-breaking logic may be required for deterministic output.
- The current implementation assumes `hot_takes` are boolean and the quiz answers are valid.

## Cyclomatic Complexity

### Entire Program

The project is small-to-medium in complexity:

- The quiz result logic contains a few branching conditions and loops.
- The Max Heap implementation is the most algorithmically complex portion.
- Estimated total cyclomatic complexity: `~20` across the entire feature.

### Most complex method

**`MaxHeap.extractMax()`**

- Branches: empty heap, single-element heap, larger heap
- Calls `sinkDown()` with additional comparisons and swaps
- Estimated complexity: `5`

**`MaxHeap.sinkDown()`**

- Branches for left child, right child, swap decisions
- Estimated complexity: `6`

### Reflection

The complexity is justified because the heap operations are fundamental to ranking and are more efficient than simpler O(n^2) approaches. If the dataset were larger, the score comparison phase would become the bigger issue.

## Performance Reflection

### Scale 100x

If the number of artists scaled by 100x:

- `O(a * q)` score calculation becomes slow unless optimized
- Heap memory use grows linearly with artists
- Repeated extractions remain manageable, but total runtime increases

### First optimization

1. Cache artist feature vectors or precompute score weights
2. Batch score calculations using a more compact representation
3. Replace the array scan with a selective retrieval strategy if artists are filtered by category first

## Max Heap Explanation

### How Max Heap Works

A Max Heap is a complete binary tree stored in an array. Each parent node has a value greater than or equal to its children.

### Array representation

- Parent index: `Math.floor((i - 1) / 2)`
- Left child index: `2 * i + 1`
- Right child index: `2 * i + 2`

### Insertion process (`insert` + `bubbleUp`)

1. Append the new node to the end of the array.
2. Compare it with its parent.
3. If the new node has a larger score, swap it with the parent.
4. Repeat until the node is in correct position.

This is called **bubble up** or **heapify-up**.

### Extraction process (`extractMax` + `sinkDown`)

1. Remove the root node, which is the maximum.
2. Move the last node in the array to the root.
3. Compare the root with its children.
4. Swap the root with the larger child if needed.
5. Repeat until the root is larger than both children.

This is called **sink down** or **heapify-down**.

### Rotations in the heap

While Max Heaps do not use tree rotations like AVL trees, they perform swap operations that move nodes up or down the tree. These swaps preserve the heap shape and restore the heap order property.

### Why Max Heap is a good fit here

- It provides efficient top-`k` retrieval.
- It is simpler to implement than a balanced tree.
- It naturally supports ranking by score.

## Real Implementation Notes

### Added mock artists

The quiz now has a large artist dataset so the recommendation flow is more realistic and demonstrates heap ranking on a richer input set.

### Example use in code

- `app/discovery/quiz/result/page.tsx`: quiz scoring logic and `MOCK_ARTISTS`
- `lib/discovery/maxHeap.ts`: heap implementation

## Conclusion

This project uses the Max Heap as the primary non-trivial data structure, with arrays and records supporting the quiz input and artist data. The design is intentionally simple and efficient, with clear algorithmic tradeoffs and a focus on the ranking use case.
