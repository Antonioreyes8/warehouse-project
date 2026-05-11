/**
 * Represents an artist with a numerical score.
 */
export interface ScoredArtist {
	id: string;
	name: string;
	score: number;
	hotTakes?: string[];
}

// --- DATA STRUCTURE 1: MAX HEAP (For Ranking) ---

// --- DATA STRUCTURE 1: MAX HEAP (For Ranking) ---

export class MaxHeap {
	private heap: ScoredArtist[] = [];

	/**
	 * WHAT: Adds a new artist and restores order.
	 * LOG: Shows the state after bubbleUp.
	 */
	insert(node: ScoredArtist) {
		this.heap.push(node);
		this.bubbleUp();

		// Log the state for debugging and demo purposes
		console.log(`✨ Inserted: ${node.name} (Score: ${node.score})`);
		this.printHeap();
	}

	private bubbleUp() {
		let index = this.heap.length - 1;
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);
			if (this.heap[index].score <= this.heap[parentIndex].score) break;
			[this.heap[index], this.heap[parentIndex]] = [
				this.heap[parentIndex],
				this.heap[index],
			];
			index = parentIndex;
		}
	}

	/**
	 * WHAT: Removes the top match and restores order.
	 * LOG: Shows how the last element "sinks" to the correct spot.
	 */
	extractMax(): ScoredArtist | null {
		if (this.heap.length === 0) return null;
		if (this.heap.length === 1) return this.heap.pop() || null;

		const max = this.heap[0];
		this.heap[0] = this.heap.pop()!;
		this.sinkDown();

		// Log the new state after the top match is removed
		console.log(`🏆 Extracted Max: ${max.name}`);
		this.printHeap();

		return max;
	}

	private sinkDown() {
		let index = 0;
		const length = this.heap.length;
		const element = this.heap[0];
		while (true) {
			const leftChildIdx = 2 * index + 1;
			const rightChildIdx = 2 * index + 2;
			let leftChild,
				rightChild,
				swap = null;

			if (leftChildIdx < length) {
				leftChild = this.heap[leftChildIdx];
				if (leftChild.score > element.score) swap = leftChildIdx;
			}
			if (rightChildIdx < length) {
				rightChild = this.heap[rightChildIdx];
				if (
					(swap === null && rightChild.score > element.score) ||
					(swap !== null &&
						rightChild.score > (leftChild as ScoredArtist).score)
				) {
					swap = rightChildIdx;
				}
			}
			if (swap === null) break;
			this.heap[index] = this.heap[swap];
			this.heap[swap] = element;
			index = swap;
		}
	}

	/**
	 * WHAT: Prints the current array representation of the heap.
	 * WHY: Crucial for the "Engineering Explanation" requirement in your presentation.
	 * WHEN: Called after any operation that modifies the heap structure.
	 */
	private printHeap() {
		const heapDisplay = this.heap
			.map((artist) => `${artist.name}(${artist.score})`)
			.join(" | ");
		console.log(`📊 Current Heap State: [ ${heapDisplay} ]`);
	}
}

// --- DATA STRUCTURE 2: AVL TREE (For Balanced Search) ---

class AVLNode {
	height: number = 1;
	left: AVLNode | null = null;
	right: AVLNode | null = null;
	constructor(public data: ScoredArtist) {}
}

export class ArtistSearchTree {
	private root: AVLNode | null = null;

	/**
	 * WHAT: Traverses the tree to find an artist by their name.
	 * WHY: Provides a $O(\log n)$ search, which is much faster than searching a standard list.
	 * WHEN: Used when the user types into the "Check Other Artist Scores" search bar.
	 */
	search(name: string): ScoredArtist | null {
		let current = this.root;
		const searchName = name.toLowerCase();

		while (current) {
			const currentName = current.data.name.toLowerCase();
			if (searchName === currentName) return current.data;
			current = searchName < currentName ? current.left : current.right;
		}
		return null;
	}

	/**
	 * WHAT: Public entry point to add an artist to the search tree.
	 * WHY: Encapsulates the complex recursive logic and updates the root of the tree.
	 * WHEN: Used during initial data processing to mirror all artists into the search engine.
	 */
	insert(artist: ScoredArtist) {
		this.root = this._insert(this.root, artist);
	}

	/**
	 * WHAT: Recursively finds the correct leaf for a new artist and triggers rebalancing.
	 * WHY: Ensures the tree remains a valid Binary Search Tree (ordered by name).
	 * WHEN: Called internally by the public insert method.
	 */
	private _insert(node: AVLNode | null, artist: ScoredArtist): AVLNode {
		if (!node) return new AVLNode(artist);

		if (artist.name.toLowerCase() < node.data.name.toLowerCase()) {
			node.left = this._insert(node.left, artist);
		} else {
			node.right = this._insert(node.right, artist);
		}

		// Update height and rebalance
		node.height =
			1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
		return this.rebalance(node);
	}

	/**
	 * WHAT: Checks the balance factor and performs rotations if necessary.
	 * WHY: This is the core of the AVL logic; it prevents the tree from becoming "skewed" or unbalanced.
	 * WHEN: Executed after every insertion to maintain $O(\log n)$ performance[cite: 1].
	 */
	private rebalance(node: AVLNode): AVLNode {
		const balance = this.getBalance(node);

		// Left Heavy - requires right rotation
		if (balance > 1) {
			if (this.getBalance(node.left!) < 0) {
				node.left = this.rotateLeft(node.left!);
			}
			return this.rotateRight(node);
		}
		// Right Heavy - requires left rotation
		if (balance < -1) {
			if (this.getBalance(node.right!) > 0) {
				node.right = this.rotateRight(node.right!);
			}
			return this.rotateLeft(node);
		}
		return node;
	}

	/**
	 * WHAT: Performs a right rotation around a node.
	 * WHY: To fix "Left-Left" or "Left-Right" imbalances in the tree.
	 * WHEN: Used internally during the rebalance process.
	 */
	private rotateRight(y: AVLNode): AVLNode {
		const x = y.left!;
		const T2 = x.right;
		x.right = y;
		y.left = T2;
		y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
		x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
		return x;
	}

	/**
	 * WHAT: Performs a left rotation around a node.
	 * WHY: To fix "Right-Right" or "Right-Left" imbalances in the tree.
	 * WHEN: Used internally during the rebalance process.
	 */
	private rotateLeft(x: AVLNode): AVLNode {
		const y = x.right!;
		const T2 = y.left;
		y.left = x;
		x.right = T2;
		x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
		y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
		return y;
	}

	/**
	 * WHAT: Safely returns the height of a node.
	 * WHY: Prevents null-pointer errors when calculating balance factors of leaf nodes.
	 * WHEN: Used during every insertion and rebalance check.
	 */
	private getHeight(node: AVLNode | null): number {
		return node ? node.height : 0;
	}

	/**
	 * WHAT: Calculates the difference in height between left and right subtrees.
	 * WHY: To determine if the tree is tilting too far in one direction (imbalance > 1 or < -1).
	 * WHEN: Called by the rebalance method to decide if rotations are needed.
	 */
	private getBalance(node: AVLNode | null): number {
		return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
	}
}
