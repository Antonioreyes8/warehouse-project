/**
 * Represents an artist with a numerical score.
 * The MaxHeap will prioritize artists with the HIGHEST scores.
 */
export interface ScoredArtist {
	id: string;
	name: string;
	score: number;
	hotTakes?: string[];
}

/**
 * MaxHeap Implementation
 * * CONCEPT:
 * A Max Heap is a Complete Binary Tree where the parent node is always
 * greater than or equal to its children.
 * * DECISION: Array Representation
 * We use an array instead of a linked tree structure because it is
 * memory-efficient and allows for mathematical index calculation:
 * - Parent: Math.floor((i - 1) / 2)
 * - Left Child: (2 * i) + 1
 * - Right Child: (2 * i) + 2
 */
export class MaxHeap {
	private heap: ScoredArtist[] = [];

	/**
	 * Adds a new artist to the heap.
	 * Time Complexity: O(log n)
	 */
	insert(node: ScoredArtist) {
		// 1. Add to the end of the array to maintain the "Complete Tree" property
		this.heap.push(node);
		// 2. Move the element up to its correct position to restore the "Heap" property
		this.bubbleUp();
		// 3. Log for debugging
		console.log(`✨ Inserted: ${node.name} (Score: ${node.score})`);
		this.printHeap();
	}

	/**
	 * Restores the Max Heap property by moving the last element UP
	 * until it is no longer larger than its parent.
	 */
	private bubbleUp() {
		let index = this.heap.length - 1;

		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);

			// If the current node's score is less than or equal to parent, we are done.
			if (this.heap[index].score <= this.heap[parentIndex].score) break;

			// Otherwise, swap them and continue moving up
			[this.heap[index], this.heap[parentIndex]] = [
				this.heap[parentIndex],
				this.heap[index],
			];
			index = parentIndex;
		}
	}

	/**
	 * Removes and returns the artist with the highest score.
	 * Time Complexity: O(log n)
	 */
	extractMax(): ScoredArtist | null {
		if (this.heap.length === 0) return null;
		if (this.heap.length === 1) return this.heap.pop() || null;

		const max = this.heap[0];

		// 1. Move the last element to the root.
		// This is more efficient than shifting the whole array.
		this.heap[0] = this.heap.pop()!;

		// 2. Sink the new root down to its correct position.
		this.sinkDown();

		// 3. Log for debugging
		console.log(`🏆 TOP MATCH: ${max.name} with score ${max.score}`);

		return max;
	}

	/**
	 * Restores the Max Heap property by moving the root element DOWN
	 * until it is larger than both of its children.
	 */
	private sinkDown() {
		let index = 0;
		const length = this.heap.length;
		const element = this.heap[0];

		while (true) {
			const leftChildIdx = 2 * index + 1;
			const rightChildIdx = 2 * index + 2;
			let leftChild, rightChild;
			let swap = null;

			// Check if left child exists and is larger than the current element
			if (leftChildIdx < length) {
				leftChild = this.heap[leftChildIdx];
				if (leftChild.score > element.score) {
					swap = leftChildIdx;
				}
			}

			// Check if right child exists
			if (rightChildIdx < length) {
				rightChild = this.heap[rightChildIdx];
				if (
					// If we haven't swapped with left and right is bigger than root...
					(swap === null && rightChild.score > element.score) ||
					// ...OR if we were going to swap with left, but right is even BIGGER than left.
					(swap !== null &&
						rightChild.score > (leftChild as ScoredArtist).score)
				) {
					swap = rightChildIdx;
				}
			}

			// If no swaps were needed, the element is in its correct place
			if (swap === null) break;

			// Perform the swap and update index to continue sinking
			this.heap[index] = this.heap[swap];
			this.heap[swap] = element;
			index = swap;
		}
	}

	/**
	 * Prints the current heap state to console for debugging
	 */
	private printHeap() {
		const heapDisplay = this.heap
			.map((artist) => `${artist.name} (${artist.score})`)
			.join(" → ");
		console.log(`📊 Heap State: [${heapDisplay}]`);
	}
}
