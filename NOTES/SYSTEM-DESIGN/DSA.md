# DSA Notes (W3Schools DSA, Question-wise)

Oct 14, 2026 · @ashish yadav

Every topic from the [W3Schools DSA tutorial](https://www.w3schools.com/dsa/) as a question with a short answer.

## Section 1: DSA basics and time complexity

Code examples are in Python, like the W3Schools tutorial.

### Q1. What is DSA?

Data Structures and Algorithms. A data structure is a way to store and organize data (array, linked list, tree, graph). An algorithm is a step-by-step method to solve a problem (sorting, searching). Choosing the right ones makes programs much faster on large data.

### Q2. Primitive vs abstract data structures?

Primitive types are basic values built into the language: int, float, char, boolean. Abstract data structures are built from them and describe behaviour: stacks, queues, lists, trees, graphs.

### Q3. Where does the word "algorithm" come from?

From al-Khwarizmi, a Persian scholar who lived around the year 800.

### Q4. How do you find the lowest value in an array?

Start with the first element as the minimum, loop through the rest, and update it whenever you find something smaller. Time: O(n).

```python
arr = [7, 12, 9, 4, 11]
min_val = arr[0]
for x in arr:
    if x < min_val:
        min_val = x
print(min_val)  # 4
```

### Q5. What is time complexity?

A measure of how the number of operations grows as the input size n grows. We ignore constants and keep the biggest term.

### Q6. What is Big O notation?

It describes the *worst-case* upper bound of time complexity.

| Big O | Name | Example |
| --- | --- | --- |
| O(1) | Constant | Access an array element by index |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear search, find min |
| O(n log n) | Linearithmic | Merge sort, quicksort (average) |
| O(n²) | Quadratic | Bubble, selection, insertion sort |
| O(2ⁿ) | Exponential | Naive recursive Fibonacci |

### Q7. Best, average and worst case?

Best case is the luckiest input (e.g. an already-sorted array for insertion sort). Worst case is the slowest possible input. Average case is the expected time on random input. Big O usually refers to the worst case.

### Q8. What is space complexity?

How much extra memory an algorithm needs as n grows. Example: merge sort needs O(n) extra space; bubble sort needs O(1) (it sorts "in place").

## Section 2: Arrays and sorting algorithms

### Q9. What is an array?

A collection of elements stored in contiguous memory, accessed by index starting at 0. Reading `arr[i]` is O(1). Inserting or deleting in the middle is O(n) because elements must shift.

### Q10. How does Bubble Sort work?

Go through the array, compare neighbours, and swap them if they are in the wrong order. After each pass, the largest unsorted value "bubbles" to the end. Repeat n−1 times.

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:  # already sorted, stop early
            break
```

Time: O(n²) worst, O(n) best with the early-stop check. Space: O(1).

### Q11. How does Selection Sort work?

Find the smallest value in the unsorted part and move it to the front. Repeat for the rest of the array.

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_i = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_i]:
                min_i = j
        arr[i], arr[min_i] = arr[min_i], arr[i]
```

Time: O(n²) always. Tip: swapping (not removing and inserting) avoids extra shifting.

### Q12. How does Insertion Sort work?

Take one value at a time from the unsorted part and insert it into the correct place in the sorted part, like sorting playing cards in your hand.

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]  # shift right
            j -= 1
        arr[j + 1] = key
```

Time: O(n²) worst, O(n) best (nearly sorted data). Great for small or almost-sorted arrays.

### Q13. How does Quicksort work?

Pick a pivot, partition the array so smaller values go left and larger go right, then recursively sort both sides.

```python
def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quicksort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        p = partition(arr, low, high)
        quicksort(arr, low, p - 1)
        quicksort(arr, p + 1, high)
```

Time: O(n log n) average, O(n²) worst (e.g. already sorted with last-element pivot). Space: O(log n) for recursion.

### Q14. How does Counting Sort work?

Count how many times each value appears, then rebuild the array from the counts. Works only for non-negative integers in a small range.

```python
def counting_sort(arr):
    count = [0] * (max(arr) + 1)
    for x in arr:
        count[x] += 1
    result = []
    for value, c in enumerate(count):
        result.extend([value] * c)
    return result
```

Time: O(n + k), where k is the range of values. Bad when k is much larger than n.

### Q15. How does Radix Sort work?

Sort numbers digit by digit, starting from the least significant digit (ones, then tens, then hundreds), using a *stable* sort (buckets) for each digit.

Time: O(n·k), where k is the number of digits. Works for non-negative integers.

### Q16. What is a stable sort?

A sort that keeps equal elements in their original order. Radix sort depends on this. Stable: bubble, insertion, merge, counting. Not stable (usual versions): selection, quicksort.

### Q17. How does Merge Sort work?

Divide and conquer: split the array in half until each piece has one element, then merge the pieces back together in sorted order.

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]
```

Time: O(n log n) in all cases. Space: O(n).

### Q18. Which sorting algorithm should you choose?

| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Bubble | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Quicksort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Counting | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes |
| Radix | O(n·k) | O(n·k) | O(n·k) | O(n+k) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |

Rule of thumb: small or nearly sorted → insertion; general purpose → quicksort or merge sort; guaranteed O(n log n) or stability → merge sort; small integer range → counting or radix.

## Section 3: Searching

### Q19. How does Linear Search work?

Check every element from start to end until you find the target. Works on unsorted arrays.

```python
def linear_search(arr, target):
    for i, x in enumerate(arr):
        if x == target:
            return i
    return -1
```

Time: O(n).

### Q20. How does Binary Search work?

Only on a **sorted** array. Look at the middle element: if it is the target, done; if the target is smaller, search the left half; otherwise search the right half. Each step halves the search space.

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

Time: O(log n). Example: 1,000,000 elements need at most about 20 steps.

### Q21. Linear vs binary search: when to use which?

Linear search for small or unsorted data, or a one-time lookup. Binary search when data is sorted and you search many times; if it isn't sorted, sorting first costs O(n log n).

## Section 4: Linked lists, stacks, queues and hash tables

### Q22. What is a linked list?

A chain of nodes. Each node holds data and a pointer to the next node. Nodes can be anywhere in memory (not contiguous like an array).

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
```

### Q23. What are the types of linked lists?

- Singly linked: each node points to the next.
- Doubly linked: each node points to next **and** previous.
- Circular: the last node points back to the first.

### Q24. What operations are done on a linked list?

Traversal (visit each node), finding the lowest value, inserting a node and deleting a node. To insert or delete, you just change pointers: O(1) once you have the right position, but finding it is O(n).

```python
def delete_node(head, target):
    if head.data == target:
        return head.next
    cur = head
    while cur.next and cur.next.data != target:
        cur = cur.next
    if cur.next:
        cur.next = cur.next.next
    return head
```

### Q25. Array vs linked list?

|  | Array | Linked list |
| --- | --- | --- |
| Memory | Contiguous | Scattered nodes + pointers |
| Access by index | O(1) | O(n) |
| Insert/delete at start | O(n) (shift) | O(1) |
| Extra memory | None | One or two pointers per node |
| Cache friendly | Yes | No |

### Q26. What is a stack?

A LIFO structure (Last In, First Out), like a stack of plates. Operations: `push` (add on top), `pop` (remove top), `peek` (look at top), `isEmpty`, `size`. All O(1).

Uses: undo, browser back button, function call stack, checking balanced brackets, DFS.

```python
stack = []
stack.append(1)  # push
stack.append(2)
stack.pop()      # 2
```

### Q27. What is a queue?

A FIFO structure (First In, First Out), like a line at a shop. Operations: `enqueue` (add at back), `dequeue` (remove from front), `peek`, `isEmpty`, `size`.

Uses: task scheduling, printer jobs, BFS.

```python
from collections import deque
q = deque()
q.append(1)   # enqueue
q.append(2)
q.popleft()   # 1
```

Note: using a Python list and `pop(0)` is O(n); `deque` is O(1).

### Q28. Can stacks and queues be built with arrays or linked lists?

Yes, both. Arrays are simpler and memory-efficient; linked lists grow without resizing and make dequeue O(1) without shifting.

### Q29. What is a hash table?

A structure that stores data in buckets using a **hash function** to turn a key into an index. Lookup, insert and delete are O(1) on average.

```python
def hash_fn(key, size):
    return sum(ord(c) for c in key) % size
```

### Q30. What is a collision and how is it handled?

A collision is when two keys hash to the same bucket. Common fixes:

- Chaining: each bucket holds a list of entries.
- Open addressing: find another free slot (e.g. linear probing).

With too many collisions, operations slow down to O(n) in the worst case.

### Q31. Hash Set vs Hash Map?

A Hash Set stores only unique keys (Python `set`): "is this item present?". A Hash Map stores key–value pairs (Python `dict`): "what is the value for this key?".

## Section 5: Trees

### Q32. What is a tree?

A hierarchical structure of nodes connected by edges, with no cycles. Example: a file system or an HTML DOM.

### Q33. What are the key tree terms?

- Root: the top node.
- Parent / child: a node and the nodes directly below it.
- Leaf: a node with no children.
- Edge: link between parent and child.
- Height: number of edges on the longest path from root to a leaf.
- Depth: number of edges from the root to a node.
- Subtree: a node plus all its descendants.

### Q34. What is a binary tree?

A tree where each node has at most two children: left and right.

```python
class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
```

### Q35. What are balanced, complete, full and perfect binary trees?

- Balanced: left and right subtree heights differ by at most 1 for every node.
- Complete: all levels full except maybe the last, which fills left to right.
- Full: every node has 0 or 2 children.
- Perfect: all internal nodes have 2 children and all leaves are on the same level.

### Q36. What are the ways to traverse a binary tree?

Two families: Breadth-First (level by level) and Depth-First. Depth-First has three orders:

| Traversal | Order | Common use |
| --- | --- | --- |
| Pre-order | Root → Left → Right | Copy a tree, prefix expressions |
| In-order | Left → Root → Right | Get BST values in sorted order |
| Post-order | Left → Right → Root | Delete a tree, postfix expressions |

```python
def preorder(node):
    if node:
        print(node.data)
        preorder(node.left)
        preorder(node.right)

def inorder(node):
    if node:
        inorder(node.left)
        print(node.data)
        inorder(node.right)

def postorder(node):
    if node:
        postorder(node.left)
        postorder(node.right)
        print(node.data)
```

### Q37. How can a binary tree be stored in an array?

Put the root at index 0. For a node at index i: left child at `2*i + 1`, right child at `2*i + 2`, parent at `(i - 1) // 2`. Best for complete trees (like heaps); sparse trees waste space.

### Q38. What is a Binary Search Tree (BST)?

A binary tree where, for every node, all values in the left subtree are smaller and all values in the right subtree are larger. In-order traversal gives sorted output.

### Q39. How do you search and insert in a BST?

Start at the root; go left if the value is smaller, right if larger. Insert where you hit an empty spot.

```python
def search(node, target):
    if node is None or node.data == target:
        return node
    if target < node.data:
        return search(node.left, target)
    return search(node.right, target)

def insert(node, data):
    if node is None:
        return TreeNode(data)
    if data < node.data:
        node.left = insert(node.left, data)
    elif data > node.data:
        node.right = insert(node.right, data)
    return node
```

### Q40. How do you delete a node from a BST?

Three cases:

1. Leaf: just remove it.
2. One child: replace the node with its child.
3. Two children: replace its value with the in-order successor (smallest value in the right subtree), then delete that successor.

### Q41. What is the time complexity of BST operations?

O(h), where h is the height. Balanced: O(log n). Unbalanced (e.g. inserting already-sorted values makes a "linked list"): O(n).

### Q42. What is an AVL tree?

A self-balancing BST. Every node stores a **balance factor** = height(right) − height(left), which must stay −1, 0 or 1. After an insert or delete, rotations restore balance. All operations stay O(log n).

### Q43. What are the four AVL rotation cases?

| Case | Imbalance | Fix |
| --- | --- | --- |
| Left-Left (LL) | Left child's left side too tall | One right rotation |
| Right-Right (RR) | Right child's right side too tall | One left rotation |
| Left-Right (LR) | Left child's right side too tall | Left rotation on child, then right rotation |
| Right-Left (RL) | Right child's left side too tall | Right rotation on child, then left rotation |

```python
def right_rotate(y):
    x = y.left
    y.left = x.right
    x.right = y
    # update heights of y, then x
    return x
```

## Section 6: Graphs

### Q44. What is a graph?

A set of vertices (nodes) connected by edges. Unlike trees, graphs can have cycles and no root. Examples: social networks, road maps, the internet.

### Q45. What are the types of graphs?

- Undirected: edges go both ways (friendship).
- Directed: edges have a direction (following someone on social media).
- Weighted: edges have a cost (distance between cities).
- Connected: every vertex can reach every other vertex.
- Cyclic / acyclic: has / has no cycles. A directed acyclic graph is a DAG.

### Q46. How do you represent a graph?

|  | Adjacency matrix | Adjacency list |
| --- | --- | --- |
| Structure | n×n grid; cell \[i\]\[j\] = edge or weight | Each vertex keeps a list of neighbours |
| Memory | O(V²) | O(V + E) |
| Check edge i–j | O(1) | O(degree) |
| Best for | Dense graphs | Sparse graphs (most real graphs) |

```python
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"],
}
```

### Q47. What is DFS (Depth-First Search)?

Go as deep as possible along one path, then backtrack. Uses recursion or a stack.

```python
def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    print(node)
    for nb in graph[node]:
        if nb not in visited:
            dfs(graph, nb, visited)
```

### Q48. What is BFS (Breadth-First Search)?

Visit all neighbours first, then their neighbours, level by level. Uses a queue. Finds the shortest path (fewest edges) in an unweighted graph.

```python
from collections import deque

def bfs(graph, start):
    visited = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        print(node)
        for nb in graph[node]:
            if nb not in visited:
                visited.add(nb)
                q.append(nb)
```

Both DFS and BFS run in O(V + E).

### Q49. How do you detect a cycle in a graph?

- Undirected graph: DFS; if you reach a visited vertex that is not the parent you came from, there is a cycle. Union-Find also works.
- Directed graph: DFS with a "currently on the recursion stack" set; reaching a vertex already on the stack means a cycle.

### Q50. What is the shortest path problem?

Finding the path with the lowest total weight between vertices. Key algorithms: Dijkstra and Bellman-Ford.

### Q51. How does Dijkstra's algorithm work?

From the source, set all distances to infinity except the source (0). Repeatedly pick the unvisited vertex with the smallest distance, and update ("relax") its neighbours' distances.

```python
import heapq

def dijkstra(graph, src):  # graph: {u: [(v, w), ...]}
    dist = {v: float("inf") for v in graph}
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return dist
```

Time: O((V + E) log V) with a priority queue. Does **not** work with negative edge weights.

### Q52. How does Bellman-Ford work?

Relax every edge V−1 times. Then do one more pass: if any distance still improves, there is a negative cycle.

Time: O(V·E). Slower than Dijkstra, but handles negative weights and detects negative cycles.

### Q53. What is a Minimum Spanning Tree (MST)?

A subset of edges that connects all vertices of a weighted, undirected, connected graph with the smallest total weight and no cycles. It always has V−1 edges.

### Q54. How does Prim's algorithm work?

Start from any vertex. Repeatedly add the cheapest edge that connects a vertex in the tree to a vertex outside it. Time: O(E log V) with a priority queue.

### Q55. How does Kruskal's algorithm work?

Sort all edges by weight. Add edges from smallest to largest, skipping any edge that would create a cycle (checked with Union-Find). Time: O(E log E).

Prim vs Kruskal: Prim grows one tree and suits dense graphs; Kruskal works edge by edge and suits sparse graphs (it can also find a minimum spanning forest).

### Q56. What is the maximum flow problem?

In a directed graph where each edge has a capacity, find the most "flow" that can go from a source to a sink (e.g. water through pipes, data through a network).

### Q57. How does Ford-Fulkerson work?

While there is an augmenting path from source to sink in the residual graph (found with DFS), push as much flow as the path's smallest capacity allows, then update residual capacities, including reverse edges.

### Q58. How is Edmonds-Karp different?

It is Ford-Fulkerson using **BFS** to find the shortest augmenting path each time. This guarantees O(V·E²) time, independent of capacity values.

## Section 7: Other algorithms and techniques

### Q59. What is the Euclidean algorithm?

A fast way to find the greatest common divisor (GCD) of two numbers: replace (a, b) with (b, a mod b) until b is 0. Then a is the GCD.

```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

gcd(120, 25)  # 5
```

Time: O(log(min(a, b))).

### Q60. What is Huffman coding?

A lossless compression method. Frequent characters get short binary codes and rare characters get long codes.

1. Count each character's frequency.
2. Put each character in a min-priority queue as a leaf node.
3. Repeatedly take the two lowest-frequency nodes and join them under a new node with their combined frequency.
4. When one tree is left, go left = 0 and right = 1 to read each character's code.

No code is a prefix of another (prefix-free), so decoding is unambiguous. It is a greedy algorithm.

### Q61. What is the Traveling Salesman Problem (TSP)?

Find the shortest route that visits every city exactly once and returns to the start. It is NP-hard.

- Brute force: try every route, O(n!) — only works for very few cities.
- Greedy (nearest neighbour): always go to the closest unvisited city. Fast, O(n²), but not always optimal.

### Q62. What is the 0/1 Knapsack problem?

You have items with a weight and a value, and a bag with a weight limit. Choose items (each taken fully or not at all: 0 or 1) to get the highest total value without exceeding the limit.

- Brute force: try all 2ⁿ combinations.
- Memoization or tabulation (dynamic programming): O(n·W), where W is the capacity.

```python
def knapsack(weights, values, cap):
    n = len(values)
    dp = [[0] * (cap + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(cap + 1):
            dp[i][w] = dp[i - 1][w]  # skip item
            if weights[i - 1] <= w:  # take item
                dp[i][w] = max(dp[i][w],
                               values[i - 1] + dp[i - 1][w - weights[i - 1]])
    return dp[n][cap]
```

### Q63. What is memoization?

Top-down: write the normal recursive solution, but store (cache) each result so it's never computed twice.

```python
def fib(n, memo={}):
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]
```

This turns naive Fibonacci from O(2ⁿ) into O(n).

### Q64. What is tabulation?

Bottom-up: solve the smallest subproblems first and fill a table up to the answer, with no recursion.

```python
def fib(n):
    if n <= 1:
        return n
    table = [0] * (n + 1)
    table[1] = 1
    for i in range(2, n + 1):
        table[i] = table[i - 1] + table[i - 2]
    return table[n]
```

### Q65. Memoization vs tabulation?

|  | Memoization | Tabulation |
| --- | --- | --- |
| Direction | Top-down | Bottom-up |
| Uses | Recursion + cache | Loops + table |
| Solves | Only subproblems needed | All subproblems |
| Risk | Stack overflow on deep recursion | None from recursion |

### Q66. What is dynamic programming (DP)?

A technique for problems that have both:

- **Overlapping subproblems**: the same smaller problem is solved again and again.
- **Optimal substructure**: the best answer is built from best answers to subproblems.

DP stores sub-results (memoization or tabulation) instead of recomputing them. Examples: Fibonacci, 0/1 knapsack, shortest paths (Bellman-Ford).

### Q67. What is a greedy algorithm?

One that makes the best-looking choice at each step without looking back, hoping it leads to the best overall answer.

- Greedy gives the optimal answer for: Dijkstra, Prim, Kruskal, Huffman coding.
- Greedy is not always optimal for: TSP (nearest neighbour), 0/1 knapsack.

### Q68. Greedy vs dynamic programming?

Greedy takes one choice per step and never reconsiders: fast and simple, but only correct when the problem has the "greedy choice property". DP considers all choices for each subproblem: slower, but guarantees the optimal answer when subproblems overlap.

## Section 8: Complexity cheat sheet

### Q69. What are the time complexities of the main data structures?

| Structure | Access | Search | Insert | Delete |
| --- | --- | --- | --- | --- |
| Array | O(1) | O(n) | O(n) | O(n) |
| Linked list | O(n) | O(n) | O(1) at head | O(1) at head |
| Stack / Queue | O(n) | O(n) | O(1) | O(1) |
| Hash table | — | O(1) avg, O(n) worst | O(1) avg | O(1) avg |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) |
| BST (unbalanced) | O(n) | O(n) | O(n) | O(n) |
| AVL tree | O(log n) | O(log n) | O(log n) | O(log n) |

### Q70. What are the time complexities of the main algorithms?

| Algorithm | Time | Notes |
| --- | --- | --- |
| Linear search | O(n) | Any array |
| Binary search | O(log n) | Sorted array only |
| BFS / DFS | O(V + E) | Adjacency list |
| Dijkstra | O((V + E) log V) | No negative weights |
| Bellman-Ford | O(V·E) | Negative weights OK, detects negative cycles |
| Prim | O(E log V) | MST, dense graphs |
| Kruskal | O(E log E) | MST, sparse graphs, Union-Find |
| Edmonds-Karp | O(V·E²) | Max flow with BFS |
| Euclidean GCD | O(log min(a, b)) |  |
| TSP brute force | O(n!) | Exact but very slow |
| 0/1 Knapsack (DP) | O(n·W) | W = capacity |

Sorting algorithm complexities are in Q18.

### Q71. How should I study these notes?

One section per day: read each answer, then close the doc and write the code for each algorithm from memory. Use the animations and "Try it Yourself" editor in the [W3Schools DSA tutorial](https://www.w3schools.com/dsa/) to see each algorithm step by step.
