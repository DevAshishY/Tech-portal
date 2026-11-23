
# DSA Interview Notes

> Question-wise Data Structures & Algorithms notes (based on the W3Schools DSA tutorial).
> Each question: **short answer → real-life example → code (Python) → complexity → ⚠️ gotcha → 🎯 interview tip.**
> Questions marked **🆕** are extra interview topics and patterns added to your original notes.

## Table of Contents

| Part | Topic | Questions |
|---|---|---|
| A | Basics & Complexity | DSA-1 to DSA-8 |
| B | Arrays & Sorting | DSA-9 to DSA-18 |
| C | Searching | DSA-19 to DSA-21 |
| D | Linked Lists, Stacks, Queues & Hash Tables | DSA-22 to DSA-31 |
| E | Trees | DSA-32 to DSA-43 |
| F | Graphs | DSA-44 to DSA-58 |
| G | Other Algorithms, DP & Greedy | DSA-59 to DSA-68 |
| H | 🆕 More Structures & Interview Patterns | DSA-69 to DSA-84 |
| I | 🆕 Top Interview Problems | DSA-85 to DSA-113 |
| J | Cheat Sheets & Study Plan | DSA-114 to DSA-117 |

---

## Part A — Basics & Complexity

### DSA-1. What is DSA?

- **Data structure:** a way to store and organise data (array, linked list, tree, graph).
- **Algorithm:** step-by-step method to solve a problem (sorting, searching).

**Real-life:** a library. Shelves organised by topic = data structure. The method a librarian uses to find a book = algorithm.

🎯 The right choice turns "minutes" into "milliseconds" on large data.

### DSA-2. Primitive vs abstract data structures?

| Primitive | Abstract |
|---|---|
| built-in basic values | built from primitives, defined by behaviour |
| int, float, char, boolean | stack, queue, list, tree, graph |

**Real-life:** bricks (primitive) vs a house design (abstract).

### DSA-3. Where does "algorithm" come from?

From **al-Khwarizmi**, a Persian scholar (~800 AD).

### DSA-4. How do you find the lowest value in an array?

Assume the first is the minimum; update whenever something smaller appears.

**Real-life:** finding the shortest person in a queue by walking past everyone once.

```python
arr = [7, 12, 9, 4, 11]
min_val = arr[0]
for x in arr:
    if x < min_val:
        min_val = x
print(min_val)  # 4
```

**Time:** O(n) · **Space:** O(1)

### DSA-5. What is time complexity?

How the number of operations **grows** as input size n grows. Drop constants, keep the biggest term: `3n² + 5n + 2` → **O(n²)**.

**Real-life:** not "how many seconds", but "if the queue doubles, how much longer do I wait?"

### DSA-6. What is Big O notation?

An **upper bound** on growth, usually quoted for the worst case.

| Big O | Name | Example | n = 1,000 → ops |
|---|---|---|---|
| O(1) | constant | array access by index | 1 |
| O(log n) | logarithmic | binary search | ~10 |
| O(n) | linear | linear search, find min | 1,000 |
| O(n log n) | linearithmic | merge sort | ~10,000 |
| O(n²) | quadratic | bubble/selection/insertion sort | 1,000,000 |
| O(2ⁿ) | exponential | naive recursive Fibonacci | astronomically large |

**Real-life:** O(1) = opening a book at a bookmark. O(n) = reading every page. O(n²) = comparing every page with every other page.

### DSA-7. Best, average and worst case?

| Case | Meaning | Example (insertion sort) |
|---|---|---|
| Best | luckiest input | already sorted → O(n) |
| Average | random input | O(n²) |
| Worst | slowest input | reverse sorted → O(n²) |

🎯 Interviewers usually want the **worst case** unless they say otherwise.

### DSA-8. What is space complexity?

**Extra** memory needed as n grows.

| Algorithm | Extra space |
|---|---|
| Bubble sort (in place) | O(1) |
| Merge sort | O(n) |
| Recursion depth d | O(d) for the call stack |

**Real-life:** sorting cards in your hands (in place) vs laying them all out on a second table.

⚠️ Recursion uses stack space even if you create no arrays.

---

## Part B — Arrays & Sorting

### DSA-9. What is an array?

Elements in **contiguous** memory, accessed by index from 0.

| Operation | Time |
|---|---|
| read `arr[i]` | O(1) |
| append at end (dynamic array) | O(1) amortised |
| insert / delete in middle | O(n) (shifting) |

**Real-life:** numbered seats in a cinema row: find seat 7 instantly, but squeezing someone into the middle moves everyone.

### DSA-10. How does Bubble Sort work?

Compare neighbours and swap if out of order; the largest value "bubbles" to the end each pass.

**Real-life:** heavier bubbles sinking (or rising) one step at a time.

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
    return arr

bubble_sort([64, 34, 25, 12, 22])  # [12, 22, 25, 34, 64]
```

**Time:** O(n²) worst, O(n) best (early stop) · **Space:** O(1) · **Stable:** yes

### DSA-11. How does Selection Sort work?

Find the smallest in the unsorted part and **swap** it to the front.

**Real-life:** picking the shortest student each round and sending them to the front of the line.

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_i = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_i]:
                min_i = j
        arr[i], arr[min_i] = arr[min_i], arr[i]
    return arr
```

**Time:** O(n²) always · **Space:** O(1) · **Stable:** no

🎯 Fewest swaps (at most n−1), useful when writes are expensive.

### DSA-12. How does Insertion Sort work?

Take each value and **insert** it into the right place in the sorted part.

**Real-life:** sorting playing cards in your hand one by one.

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]  # shift right
            j -= 1
        arr[j + 1] = key
    return arr
```

**Time:** O(n²) worst, O(n) best (nearly sorted) · **Space:** O(1) · **Stable:** yes

🎯 Great for small or almost-sorted arrays; real-world sorts (Timsort) use it for small runs.

### DSA-13. How does Quicksort work?

Pick a **pivot**, partition (smaller left, larger right), recurse on both sides.

**Real-life:** a teacher says "everyone shorter than Ravi stand left, taller stand right", then repeats in each group.

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
    return arr
```

**Time:** O(n log n) average, O(n²) worst · **Space:** O(log n) average (O(n) worst) · **Stable:** no

⚠️ Last-element pivot on already-sorted data → O(n²). Use a **random** or median-of-three pivot.

### DSA-14. How does Counting Sort work?

Count occurrences of each value, then rebuild.

**Real-life:** counting votes per candidate, then reading out the tally in order.

```python
def counting_sort(arr):
    count = [0] * (max(arr) + 1)
    for x in arr:
        count[x] += 1
    result = []
    for value, c in enumerate(count):
        result.extend([value] * c)
    return result

counting_sort([4, 2, 2, 8, 3, 3, 1])  # [1, 2, 2, 3, 3, 4, 8]
```

**Time:** O(n + k) (k = value range) · **Space:** O(n + k)

⚠️ Only non-negative integers in a **small range**; bad when k ≫ n.

### DSA-15. How does Radix Sort work?

Sort digit by digit (ones → tens → hundreds) using a **stable** sort per digit.

**Real-life:** sorting post by PIN code: first by last digit, then second-last… using stable trays.

```python
def radix_sort(arr):
    exp = 1
    while max(arr) // exp > 0:
        buckets = [[] for _ in range(10)]
        for x in arr:
            buckets[(x // exp) % 10].append(x)
        arr = [x for b in buckets for x in b]
        exp *= 10
    return arr

radix_sort([170, 45, 75, 90, 802, 24, 2, 66])  # [2, 24, 45, 66, 75, 90, 170, 802]
```

**Time:** O(n·d) (d = number of digits) · **Space:** O(n + base)

### DSA-16. What is a stable sort?

Keeps **equal elements in their original order**.

**Real-life:** sorting students by marks; two students with 90 stay in their original roll-number order.

| Stable | Not stable (usual versions) |
|---|---|
| bubble, insertion, merge, counting, radix | selection, quicksort, heap sort |

🎯 Matters when sorting objects by one field after sorting by another.

### DSA-17. How does Merge Sort work?

**Divide and conquer:** split into halves until single elements, then merge back in order.

**Real-life:** two people each sort half the exam papers, then merge their piles by always taking the smaller top paper.

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
        if left[i] <= right[j]:   # <= keeps it stable
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]
```

**Time:** O(n log n) always · **Space:** O(n) · **Stable:** yes

### DSA-18. Which sorting algorithm should you choose?

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Quicksort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| Counting | O(n+k) | O(n+k) | O(n+k) | O(n+k) | ✅ |
| Radix | O(n·d) | O(n·d) | O(n·d) | O(n+b) | ✅ |

| Situation | Choose |
|---|---|
| small / nearly sorted | insertion |
| general purpose | quicksort or merge |
| guaranteed O(n log n) or stability | merge |
| small integer range | counting / radix |

🎯 Built-ins: Python `sorted()` and JS `Array.prototype.sort()` (V8) use **Timsort** (merge + insertion, stable, O(n log n)).

---

## Part C — Searching

### DSA-19. How does Linear Search work?

Check every element until found. Works on **unsorted** data.

**Real-life:** looking for your keys by checking every pocket.

```python
def linear_search(arr, target):
    for i, x in enumerate(arr):
        if x == target:
            return i
    return -1
```

**Time:** O(n)

### DSA-20. How does Binary Search work?

**Sorted data only.** Check the middle; discard the half that can't contain the target.

**Real-life:** finding a word in a dictionary by opening the middle and halving each time.

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

binary_search([1, 3, 5, 7, 9, 11], 7)  # 3
```

**Time:** O(log n): 1,000,000 elements → ~20 steps.

⚠️ Common bugs: `left < right` vs `left <= right`, forgetting `+1`/`-1` → infinite loop. In fixed-size-integer languages, use `left + (right - left) // 2` to avoid overflow.

### DSA-21. Linear vs binary search?

| Linear | Binary |
|---|---|
| unsorted OK | sorted only |
| O(n) | O(log n) |
| small data, one-time lookup | many searches on sorted data |

🎯 Sorting first costs O(n log n), worth it only if you search **many** times. For one lookup, a hash set (O(1)) is often best.

---

## Part D — Linked Lists, Stacks, Queues & Hash Tables

### DSA-22. What is a linked list?

A chain of **nodes**; each holds data and a pointer to the next. Nodes can be anywhere in memory.

**Real-life:** a treasure hunt: each clue tells you where the next one is.

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

a, b, c = Node(1), Node(2), Node(3)
a.next, b.next = b, c   # 1 → 2 → 3
```

### DSA-23. Types of linked lists?

| Type | Pointers | Real-life |
|---|---|---|
| Singly | next | a one-way train |
| Doubly | next + prev | browser back/forward history |
| Circular | last → first | a music playlist on repeat |

### DSA-24. Linked list operations?

Traverse, find min, insert, delete. Changing pointers is O(1) once you're at the position; **finding** it is O(n).

```python
def delete_node(head, target):
    if head and head.data == target:
        return head.next
    cur = head
    while cur and cur.next and cur.next.data != target:
        cur = cur.next
    if cur and cur.next:
        cur.next = cur.next.next
    return head

def print_list(head):
    out = []
    while head:
        out.append(head.data); head = head.next
    return out
```

**Real-life:** removing a person from a human chain: the people on either side just hold hands.

⚠️ Always handle the **empty list** and **deleting the head**.

### DSA-25. Array vs linked list?

| | Array | Linked list |
|---|---|---|
| Memory | contiguous | scattered nodes + pointers |
| Access by index | O(1) | O(n) |
| Insert/delete at start | O(n) | O(1) |
| Extra memory | none | pointer(s) per node |
| Cache friendly | ✅ | ❌ |

**Real-life:** array = numbered lockers in a row; linked list = a treasure hunt.

🎯 In practice arrays usually win due to CPU caching; linked lists shine for frequent inserts/removals at known positions (e.g. LRU cache).

### DSA-26. What is a stack?

**LIFO** (Last In, First Out). `push`, `pop`, `peek`, `isEmpty`, `size`: all O(1).

**Real-life:** a stack of plates: you take the top one.

```python
stack = []
stack.append(1)   # push
stack.append(2)
stack[-1]         # peek → 2
stack.pop()       # 2
```

**Uses:** undo, browser back, function call stack, balanced brackets (DSA-80), DFS.

### DSA-27. What is a queue?

**FIFO** (First In, First Out). `enqueue`, `dequeue`, `peek`.

**Real-life:** a line at a ticket counter.

```python
from collections import deque
q = deque()
q.append(1)    # enqueue
q.append(2)
q.popleft()    # 1
```

**Uses:** task scheduling, printer jobs, BFS, message queues.

⚠️ `list.pop(0)` is **O(n)**; use `deque.popleft()` (O(1)).

### DSA-28. Stacks/queues with arrays or linked lists?

Both work.

| Array | Linked list |
|---|---|
| simpler, memory-efficient, cache friendly | grows without resizing, O(1) dequeue without shifting |

### DSA-29. What is a hash table?

Stores data in **buckets**; a **hash function** turns a key into an index. Lookup/insert/delete **O(1) average**.

**Real-life:** a coat-check: your ticket number tells the attendant exactly which hook to go to.

```python
def hash_fn(key, size):
    return sum(ord(c) for c in key) % size

hash_fn("cat", 10)  # 2
```

### DSA-30. What is a collision and how is it handled?

Two keys land in the **same bucket**.

| Method | How | Real-life |
|---|---|---|
| Chaining | each bucket holds a list | two coats on one hook |
| Open addressing (linear probing) | try the next free slot | hook taken → use the next empty hook |

⚠️ Many collisions → O(n) worst case. Good hash functions + resizing (load factor) keep it O(1).

### DSA-31. Hash Set vs Hash Map?

| Hash Set | Hash Map |
|---|---|
| unique keys only | key → value |
| Python `set`, JS `Set` | Python `dict`, JS `Map` / object |
| "is it present?" | "what's the value for this key?" |

**Real-life:** set = guest list (who's invited). Map = seating chart (guest → table number).

🎯 The #1 interview trick: trade **space for time** with a hash map (DSA-81).

---

## Part E — Trees

### DSA-32. What is a tree?

Hierarchical nodes connected by edges, **no cycles**, one root.

**Real-life:** a family tree, a company org chart, folders on your computer, the HTML DOM.

### DSA-33. Key tree terms?

| Term | Meaning |
|---|---|
| Root | top node |
| Parent / child | node and nodes directly below |
| Leaf | node with no children |
| Edge | link between parent and child |
| Height | edges on the longest path root → leaf |
| Depth | edges from root to a node |
| Subtree | a node + all its descendants |

### DSA-34. What is a binary tree?

Each node has **at most two** children (left, right).

```python
class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
```

### DSA-35. Balanced, complete, full, perfect?

| Type | Rule |
|---|---|
| Balanced | every node's left/right heights differ by ≤ 1 |
| Complete | all levels full except maybe the last, filled left → right |
| Full | every node has 0 or 2 children |
| Perfect | all internal nodes have 2 children, all leaves same level |

**Real-life:** perfect = a tournament bracket with no byes.

### DSA-36. Ways to traverse a binary tree?

**BFS** (level by level) and **DFS** (pre-, in-, post-order).

| Traversal | Order | Use |
|---|---|---|
| Pre-order | Root → Left → Right | copy a tree, prefix expressions |
| In-order | Left → Root → Right | **BST in sorted order** |
| Post-order | Left → Right → Root | delete a tree, postfix expressions |
| Level-order (BFS) | level by level | shortest path, print by levels |

```python
def preorder(node, out):
    if node:
        out.append(node.data); preorder(node.left, out); preorder(node.right, out)
    return out

def inorder(node, out):
    if node:
        inorder(node.left, out); out.append(node.data); inorder(node.right, out)
    return out

def postorder(node, out):
    if node:
        postorder(node.left, out); postorder(node.right, out); out.append(node.data)
    return out
```

**Real-life:** pre-order = a manager announces themselves, then each team. Post-order = everyone below reports first, then the manager summarises.

### DSA-37. How is a binary tree stored in an array?

Root at index 0. For node `i`: left `2*i + 1`, right `2*i + 2`, parent `(i - 1) // 2`.

**Real-life:** seat numbers in a stadium calculated by a formula, no need for signposts.

🎯 Perfect for **complete** trees (heaps, DSA-69); sparse trees waste space.

### DSA-38. What is a Binary Search Tree (BST)?

For every node: left subtree **smaller**, right subtree **larger**. In-order traversal = sorted.

**Real-life:** a "higher or lower" guessing game: each answer cuts the options.

### DSA-39. BST search and insert?

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

### DSA-40. How do you delete from a BST?

1. **Leaf:** remove it.
2. **One child:** replace the node with its child.
3. **Two children:** copy the **in-order successor** (smallest in the right subtree), then delete that successor.

```python
def min_node(node):
    while node.left:
        node = node.left
    return node

def delete(node, data):
    if node is None:
        return None
    if data < node.data:
        node.left = delete(node.left, data)
    elif data > node.data:
        node.right = delete(node.right, data)
    else:
        if node.left is None:
            return node.right
        if node.right is None:
            return node.left
        succ = min_node(node.right)
        node.data = succ.data
        node.right = delete(node.right, succ.data)
    return node
```

**Real-life:** when a manager with two teams leaves, the most junior person from the right team moves up.

### DSA-41. BST time complexity?

**O(h)** (h = height). Balanced → **O(log n)**. Sorted inserts → a "linked list" → **O(n)**.

⚠️ Inserting `1, 2, 3, 4, 5` into a plain BST creates a straight line. That's why self-balancing trees exist.

### DSA-42. What is an AVL tree?

A **self-balancing BST**. Each node's **balance factor** (height difference of subtrees) must be −1, 0 or 1; rotations fix it after insert/delete. All operations **O(log n)**.

**Real-life:** a see-saw that automatically shifts kids to stay level.

🎯 Also know **Red-Black trees** (looser balance, fewer rotations; used in Java `TreeMap`, C++ `std::map`).

### DSA-43. The four AVL rotation cases?

| Case | Imbalance | Fix |
|---|---|---|
| LL | left child's left too tall | right rotation |
| RR | right child's right too tall | left rotation |
| LR | left child's right too tall | left-rotate child, then right-rotate |
| RL | right child's left too tall | right-rotate child, then left-rotate |

```python
def right_rotate(y):
    x = y.left
    y.left = x.right
    x.right = y
    # then update heights of y, then x
    return x
```

---

## Part F — Graphs

### DSA-44. What is a graph?

**Vertices** connected by **edges**. Can have cycles, no root.

**Real-life:** cities (vertices) and roads (edges); people and friendships.

### DSA-45. Types of graphs?

| Type | Meaning | Example |
|---|---|---|
| Undirected | edges both ways | Facebook friendship |
| Directed | one way | following on Instagram |
| Weighted | edges have cost | road distances |
| Connected | every vertex reachable | |
| DAG | directed, no cycles | task dependencies, course prerequisites |

### DSA-46. How do you represent a graph?

| | Adjacency matrix | Adjacency list |
|---|---|---|
| Structure | n×n grid | each vertex → list of neighbours |
| Memory | O(V²) | O(V + E) |
| Edge check | O(1) | O(degree) |
| Best for | dense graphs | sparse graphs (most real ones) |

```python
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"],
}
```

**Real-life:** matrix = a distance chart between every pair of cities. List = each city's list of direct roads.

### DSA-47. What is DFS (Depth-First Search)?

Go **deep** down one path, then backtrack. Recursion or a **stack**.

**Real-life:** exploring a maze by always taking the first unexplored turn until a dead end, then backing up.

```python
def dfs(graph, node, visited=None, order=None):
    if visited is None:
        visited, order = set(), []
    visited.add(node)
    order.append(node)
    for nb in graph[node]:
        if nb not in visited:
            dfs(graph, nb, visited, order)
    return order

dfs(graph, "A")  # ['A', 'B', 'D', 'C']
```

**Uses:** cycle detection, topological sort, connected components, maze/path existence.

### DSA-48. What is BFS (Breadth-First Search)?

Visit all neighbours first, **level by level**. Uses a **queue**. Finds the **shortest path in unweighted graphs**.

**Real-life:** ripples spreading out from a stone dropped in water.

```python
from collections import deque

def bfs(graph, start):
    visited, order = {start}, []
    q = deque([start])
    while q:
        node = q.popleft()
        order.append(node)
        for nb in graph[node]:
            if nb not in visited:
                visited.add(nb)
                q.append(nb)
    return order

bfs(graph, "A")  # ['A', 'B', 'C', 'D']
```

**DFS and BFS:** O(V + E).

⚠️ Mark visited **when adding** to the queue, not when popping, or nodes get queued many times.

### DSA-49. How do you detect a cycle?

- **Undirected:** DFS; reaching a visited vertex that **isn't your parent** = cycle. Or Union-Find (DSA-71).
- **Directed:** DFS with an "on current path" set; reaching a vertex already on the path = cycle.

```python
def has_cycle_directed(graph):
    visiting, done = set(), set()
    def dfs(u):
        visiting.add(u)
        for v in graph.get(u, []):
            if v in visiting or (v not in done and dfs(v)):
                return True
        visiting.discard(u); done.add(u)
        return False
    return any(dfs(u) for u in graph if u not in done)

has_cycle_directed({"A": ["B"], "B": ["C"], "C": ["A"]})  # True
```

**Real-life:** circular dependencies: A needs B, B needs C, C needs A.

### DSA-50. What is the shortest path problem?

Path with the **lowest total weight** between vertices.

| Situation | Algorithm |
|---|---|
| unweighted | **BFS** |
| non-negative weights | **Dijkstra** |
| negative weights | **Bellman-Ford** |
| all pairs | Floyd-Warshall |

**Real-life:** Google Maps finding the fastest route.

### DSA-51. How does Dijkstra's algorithm work?

All distances ∞ except source (0). Repeatedly take the closest unvisited vertex (min-heap) and **relax** its neighbours.

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

g = {"A": [("B", 4), ("C", 1)], "B": [("D", 1)], "C": [("B", 2), ("D", 5)], "D": []}
dijkstra(g, "A")  # {'A': 0, 'B': 3, 'C': 1, 'D': 4}
```

**Time:** O((V + E) log V)

**Real-life:** water flooding outward from the source, always reaching the nearest point first.

⚠️ **Not** for negative edge weights.

### DSA-52. How does Bellman-Ford work?

Relax **every edge V−1 times**. One more pass that still improves a distance = **negative cycle**.

```python
def bellman_ford(vertices, edges, src):  # edges: [(u, v, w)]
    dist = {v: float("inf") for v in vertices}
    dist[src] = 0
    for _ in range(len(vertices) - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            raise ValueError("Negative cycle")
    return dist
```

**Time:** O(V·E). Slower, but handles **negative weights**.

**Real-life:** currency exchange: a negative cycle = an arbitrage loop that makes money forever.

### DSA-53. What is a Minimum Spanning Tree (MST)?

Edges that connect **all vertices** of a weighted undirected graph with the **smallest total weight** and no cycles. Always **V−1 edges**.

**Real-life:** laying the least cable to connect every house in a village.

### DSA-54. How does Prim's algorithm work?

Start anywhere; repeatedly add the **cheapest edge** from the tree to a new vertex (min-heap).

**Time:** O(E log V) · Best for **dense** graphs.

**Real-life:** growing one road network outward from the capital.

### DSA-55. How does Kruskal's algorithm work?

Sort edges by weight; add smallest first, **skip edges that make a cycle** (Union-Find).

```python
def kruskal(n, edges):  # edges: [(w, u, v)], vertices 0..n-1
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    total, mst = 0, []
    for w, u, v in sorted(edges):
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv
            total += w
            mst.append((u, v, w))
    return total, mst

kruskal(4, [(1, 0, 1), (3, 1, 2), (4, 0, 2), (2, 2, 3)])  # (6, [(0, 1, 1), (2, 3, 2), (1, 2, 3)])
```

**Time:** O(E log E) · Best for **sparse** graphs.

| Prim | Kruskal |
|---|---|
| grows one tree | picks edges globally |
| dense graphs | sparse graphs, can build a forest |

### DSA-56. What is the maximum flow problem?

Most "flow" from a **source** to a **sink** in a directed graph with edge **capacities**.

**Real-life:** the most water through a network of pipes, or traffic through roads.

### DSA-57. How does Ford-Fulkerson work?

While an **augmenting path** exists in the residual graph (DFS), push flow equal to the path's smallest capacity; update residual capacities including **reverse edges**.

🎯 Reverse edges let the algorithm "undo" earlier bad choices.

### DSA-58. Edmonds-Karp?

Ford-Fulkerson using **BFS** (shortest augmenting path). Guarantees **O(V·E²)**, independent of capacity values.

---

## Part G — Other Algorithms, DP & Greedy

### DSA-59. What is the Euclidean algorithm?

GCD by replacing `(a, b)` with `(b, a % b)` until `b` is 0.

```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

gcd(120, 25)  # 5
```

**Time:** O(log min(a, b))

**Real-life:** the largest square tile that fits a 120×25 floor exactly.

🎯 LCM: `a * b // gcd(a, b)`.

### DSA-60. What is Huffman coding?

**Lossless compression**: frequent characters get short codes, rare ones long codes.

1. Count frequencies.
2. Put each char in a **min-heap**.
3. Repeatedly join the two smallest under a new node.
4. Left = 0, right = 1 → codes.

```python
import heapq
from collections import Counter

def huffman(text):
    heap = [[f, [ch, ""]] for ch, f in Counter(text).items()]
    heapq.heapify(heap)
    while len(heap) > 1:
        lo, hi = heapq.heappop(heap), heapq.heappop(heap)
        for pair in lo[1:]: pair[1] = "0" + pair[1]
        for pair in hi[1:]: pair[1] = "1" + pair[1]
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    return {ch: code for ch, code in heap[0][1:]}
```

**Real-life:** Morse code: the common letter "E" is a single dot.

🎯 Codes are **prefix-free** (none is the start of another), so decoding is unambiguous. It's **greedy**.

### DSA-61. What is the Traveling Salesman Problem (TSP)?

Shortest route visiting **every city once** and returning. **NP-hard**.

| Approach | Time | Optimal? |
|---|---|---|
| Brute force | O(n!) | ✅ (tiny n only) |
| DP (Held-Karp) | O(n²·2ⁿ) | ✅ |
| Nearest neighbour (greedy) | O(n²) | ❌ often good enough |

**Real-life:** a delivery driver planning the day's route.

### DSA-62. What is 0/1 Knapsack?

Items with weight + value; bag with a weight limit; each item **taken fully or not** (0/1). Maximise value.

```python
def knapsack(weights, values, cap):
    n = len(values)
    dp = [[0] * (cap + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(cap + 1):
            dp[i][w] = dp[i - 1][w]                       # skip item
            if weights[i - 1] <= w:                       # take item
                dp[i][w] = max(dp[i][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])
    return dp[n][cap]

knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7)  # 9
```

**Time:** O(n·W) (vs O(2ⁿ) brute force)

**Real-life:** packing a cabin bag with a 7 kg limit to carry the most valuable items.

⚠️ Greedy (best value/weight first) is **wrong** for 0/1 knapsack, but correct for **fractional** knapsack.

### DSA-63. What is memoization?

**Top-down:** normal recursion + a cache so each subproblem is solved once.

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

fib(50)  # 12586269025
```

O(2ⁿ) → **O(n)**.

**Real-life:** writing answers in a notebook so you never redo the same sum.

⚠️ A mutable default like `def fib(n, memo={})` works but is a well-known Python gotcha (the dict is shared across calls); `lru_cache` is cleaner.

### DSA-64. What is tabulation?

**Bottom-up:** fill a table from the smallest subproblems up; no recursion.

```python
def fib_tab(n):
    if n <= 1:
        return n
    table = [0] * (n + 1)
    table[1] = 1
    for i in range(2, n + 1):
        table[i] = table[i - 1] + table[i - 2]
    return table[n]
```

🎯 Often space can be cut to O(1) by keeping only the last two values.

**Real-life:** building a staircase one step at a time from the ground up.

### DSA-65. Memoization vs tabulation?

| | Memoization | Tabulation |
|---|---|---|
| Direction | top-down | bottom-up |
| Uses | recursion + cache | loops + table |
| Solves | only needed subproblems | all subproblems |
| Risk | stack overflow on deep recursion | none from recursion |

### DSA-66. What is dynamic programming (DP)?

For problems with:

- **Overlapping subproblems:** same smaller problem repeats.
- **Optimal substructure:** best answer built from best sub-answers.

Store sub-results instead of recomputing.

**Real-life:** planning a trip by remembering the best route to each city you've already worked out.

🎯 Recipe: define the **state** → write the **recurrence** → set **base cases** → choose memo or table → optimise space.

Examples: Fibonacci, knapsack, longest common subsequence, coin change, edit distance, Bellman-Ford.

### DSA-67. What is a greedy algorithm?

Takes the **best-looking choice now**, never reconsiders.

| Greedy is optimal | Greedy is NOT optimal |
|---|---|
| Dijkstra, Prim, Kruskal, Huffman, activity selection | TSP (nearest neighbour), 0/1 knapsack, coin change with odd coins |

**Real-life:** giving change with the largest coin first works for ₹10/5/2/1, but not for coins 1, 3, 4 (amount 6: greedy 4+1+1, best 3+3).

### DSA-68. Greedy vs DP?

| Greedy | DP |
|---|---|
| one choice per step, no going back | considers all choices per subproblem |
| fast, simple | slower, more memory |
| correct only with the **greedy-choice property** | correct with overlapping subproblems + optimal substructure |

🎯 In interviews: try greedy, then look for a **counter-example**; if you find one, switch to DP.

---

## Part H — 🆕 More Structures & Interview Patterns

### DSA-69. 🆕 What is a heap / priority queue?

A **complete binary tree** (stored in an array) where the parent is always ≤ children (**min-heap**) or ≥ (**max-heap**).

| Operation | Time |
|---|---|
| peek min/max | O(1) |
| push / pop | O(log n) |
| build from array | O(n) |

```python
import heapq
nums = [5, 1, 8, 3]
heapq.heapify(nums)
heapq.heappush(nums, 0)
heapq.heappop(nums)        # 0 (smallest)
heapq.nlargest(2, [5, 1, 8, 3])  # [8, 5]
```

**Real-life:** a hospital emergency room: the most urgent patient is always seen next.

🎯 Classic uses: **top-K** elements, Dijkstra, merge K sorted lists, scheduling. Python only has a min-heap; push negatives for a max-heap.

### DSA-70. 🆕 What is a Trie (prefix tree)?

A tree where each edge is a character; paths spell words. Insert/search in **O(word length)**.

```python
class Trie:
    def __init__(self):
        self.root = {}
    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True
    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node:
                return False
            node = node[ch]
        return True

t = Trie(); t.insert("apple")
t.starts_with("app")  # True
```

**Real-life:** phone keyboard autocomplete and search suggestions.

### DSA-71. 🆕 What is Union-Find (Disjoint Set Union)?

Tracks which elements are in the **same group**. `find` (group leader) and `union` (merge groups) are nearly **O(1)** with path compression + union by rank.

```python
class DSU:
    def __init__(self, n):
        self.parent, self.rank = list(range(n)), [0] * n
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression
        return self.parent[x]
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False          # already connected → would form a cycle
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True
```

**Real-life:** merging friend groups: "are Asha and Ravi in the same group yet?"

**Uses:** Kruskal, cycle detection, number of connected components.

### DSA-72. 🆕 What is topological sort?

An order of a **DAG's** vertices where every edge goes **before → after**. Kahn's algorithm (BFS on in-degrees):

```python
from collections import deque

def topo_sort(graph):
    indeg = {u: 0 for u in graph}
    for u in graph:
        for v in graph[u]:
            indeg[v] += 1
    q = deque([u for u in graph if indeg[u] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    if len(order) != len(graph):
        raise ValueError("Cycle: no valid order")
    return order

topo_sort({"html": ["css"], "css": ["js"], "js": ["react"], "react": []})
# ['html', 'css', 'js', 'react']
```

**Real-life:** course prerequisites, build order of packages (npm), task dependencies.

### DSA-73. 🆕 What is recursion, and what can go wrong?

A function that calls itself on a **smaller** input, with a **base case** to stop.

```python
def factorial(n):
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)
```

**Real-life:** Russian dolls: open one, find a smaller one, until the tiniest.

⚠️ Missing/wrong base case → infinite recursion → **stack overflow**. Python's default limit is ~1000 calls; JS also has a call-stack limit. Convert deep recursion to loops.

### DSA-74. 🆕 What is backtracking?

Build a solution step by step; **undo** (backtrack) when a choice can't lead to a valid answer.

```python
def subsets(nums):
    result, path = [], []
    def go(i):
        if i == len(nums):
            result.append(path[:]); return
        path.append(nums[i]); go(i + 1)   # choose
        path.pop(); go(i + 1)             # un-choose
    go(0)
    return result

subsets([1, 2])  # [[1, 2], [1], [2], []]
```

**Real-life:** trying keys on a key-ring: if one doesn't fit, put it back and try the next.

**Uses:** subsets, permutations, N-Queens, Sudoku, word search.

### DSA-75. 🆕 What is the two-pointer technique?

Two indexes moving through the data (from both ends, or same direction) to avoid nested loops: O(n²) → **O(n)**.

```python
def pair_with_sum(sorted_arr, target):
    l, r = 0, len(sorted_arr) - 1
    while l < r:
        s = sorted_arr[l] + sorted_arr[r]
        if s == target:
            return l, r
        if s < target:
            l += 1
        else:
            r -= 1
    return None

pair_with_sum([1, 2, 4, 7, 11], 15)  # (2, 4)
```

**Real-life:** two people searching a shelf from opposite ends and meeting in the middle.

**Uses:** pair sum in sorted array, reverse a string, remove duplicates, palindrome check, container with most water.

### DSA-76. 🆕 What is the sliding window technique?

Keep a **window** over a contiguous part of the array/string and slide it, updating results incrementally.

```python
def max_sum_k(arr, k):
    window = sum(arr[:k])
    best = window
    for i in range(k, len(arr)):
        window += arr[i] - arr[i - k]   # add new, remove old
        best = max(best, window)
    return best

max_sum_k([2, 1, 5, 1, 3, 2], 3)  # 9

def longest_unique_substring(s):
    seen, left, best = {}, 0, 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        best = max(best, right - left + 1)
    return best

longest_unique_substring("abcabcbb")  # 3
```

**Real-life:** a train window: as the train moves, one view enters and one leaves.

**Uses:** max/min sum of size k, longest substring without repeats, smallest subarray with sum ≥ X.

### DSA-77. 🆕 What are prefix sums?

Precompute running totals so any range sum is **O(1)**.

```python
arr = [3, 1, 4, 1, 5]
prefix = [0]
for x in arr:
    prefix.append(prefix[-1] + x)   # [0, 3, 4, 8, 9, 14]

def range_sum(i, j):                # sum of arr[i..j]
    return prefix[j + 1] - prefix[i]

range_sum(1, 3)  # 6
```

**Real-life:** an odometer: distance between two towns = reading at B − reading at A.

### DSA-78. 🆕 Fast & slow pointers (cycle in a linked list)?

Move one pointer 1 step and another 2 steps; if they meet, there's a **cycle** (Floyd's algorithm). Also finds the **middle** of a list.

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False

def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow
```

**Real-life:** a fast runner on a circular track eventually laps the slow runner.

### DSA-79. 🆕 How do you reverse a linked list?

```python
def reverse(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev
```

**Time:** O(n) · **Space:** O(1)

**Real-life:** turning a conga line around by having each person face the one behind them.

🎯 One of the most asked questions; also be able to do it recursively.

### DSA-80. 🆕 Valid parentheses (stack)?

```python
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif not stack or stack.pop() != pairs[ch]:
            return False
    return not stack

is_valid("{[()]}")  # True
is_valid("([)]")    # False
```

**Real-life:** every opened door must be closed in reverse order as you walk back out.

### DSA-81. 🆕 Two Sum (hash map)?

Find two numbers that add up to a target, in **O(n)** instead of O(n²).

```python
def two_sum(nums, target):
    seen = {}                 # value → index
    for i, x in enumerate(nums):
        if target - x in seen:
            return seen[target - x], i
        seen[x] = i
    return None

two_sum([2, 7, 11, 15], 9)  # (0, 1)
```

**Real-life:** at a party, each person asks "is my perfect partner already here?" by checking the guest list.

🎯 Pattern: **"have I seen the complement before?"** → hash map.

### DSA-82. 🆕 Maximum subarray (Kadane's algorithm)?

```python
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)   # extend or restart
        best = max(best, cur)
    return best

max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])  # 6  ([4, -1, 2, 1])
```

**Time:** O(n)

**Real-life:** a stock-trading streak: if your running total goes negative, start fresh.

### DSA-83. 🆕 Binary search variations?

Binary search also finds **boundaries** and answers on a **range of values**.

```python
def first_occurrence(arr, target):
    lo, hi, ans = 0, len(arr) - 1, -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] >= target:
            if arr[mid] == target:
                ans = mid
            hi = mid - 1
        else:
            lo = mid + 1
    return ans

first_occurrence([1, 2, 2, 2, 3], 2)  # 1
```

Also: search in a rotated sorted array, square root, "minimum capacity to ship in D days" (binary search on the answer). Python's `bisect` module does left/right boundaries.

**Real-life:** guessing a number between 1 and 100 with "too high / too low" hints.

### DSA-84. 🆕 How do you approach a coding interview problem?

1. **Clarify:** inputs, outputs, constraints, edge cases (empty, duplicates, negatives, huge n).
2. **Examples:** walk through one small case by hand.
3. **Brute force first:** state its complexity.
4. **Optimise:** look for a pattern (table below).
5. **Code** cleanly, with good names.
6. **Test:** normal case, edge cases; trace through the code.
7. **State complexity:** time and space.

| Clue in the problem | Try |
|---|---|
| sorted array, pair/triplet | two pointers, binary search |
| contiguous subarray/substring | sliding window, prefix sum, Kadane |
| "have I seen this?" / counting | hash map / set |
| top K, smallest/largest K | heap |
| all combinations / permutations | backtracking |
| shortest path, levels | BFS |
| connectivity, cycles, components | DFS, Union-Find |
| dependencies / order | topological sort |
| "max/min ways", overlapping subproblems | DP |
| prefixes / autocomplete | trie |
| matching brackets, "next greater element" | stack |

**Real-life:** a doctor: ask questions, examine, try a simple treatment, then refine.

---

## Part I — 🆕 Top Interview Problems

> The most frequently asked problems, grouped by data structure. Learn the **pattern**, not just the answer.

### Arrays & Strings

### DSA-85. 🆕 Valid anagram?

Same letters, same counts (`"listen"` / `"silent"`).

```python
from collections import Counter

def is_anagram(a, b):
    return Counter(a) == Counter(b)

is_anagram("listen", "silent")  # True
```

**Time:** O(n) · (sorting both is O(n log n))

**Real-life:** two bags of Scrabble tiles with exactly the same letters.

### DSA-86. 🆕 Valid palindrome (ignore spaces/punctuation)?

```python
def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1
        while l < r and not s[r].isalnum(): r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l, r = l + 1, r - 1
    return True

is_palindrome("A man, a plan, a canal: Panama")  # True
```

**Pattern:** two pointers · **Time:** O(n) · **Space:** O(1)

**Real-life:** reading a word from both ends at once.

### DSA-87. 🆕 Move zeros to the end (keep order)?

```python
def move_zeros(nums):
    pos = 0
    for x in nums:
        if x != 0:
            nums[pos] = x; pos += 1
    for i in range(pos, len(nums)):
        nums[i] = 0
    return nums

move_zeros([0, 1, 0, 3, 12])  # [1, 3, 12, 0, 0]
```

**Pattern:** two pointers (write index) · **Time:** O(n) · in place

### DSA-88. 🆕 Best time to buy and sell stock?

Buy once, sell later; maximise profit.

```python
def max_profit(prices):
    lowest, best = float("inf"), 0
    for p in prices:
        lowest = min(lowest, p)
        best = max(best, p - lowest)
    return best

max_profit([7, 1, 5, 3, 6, 4])  # 5 (buy 1, sell 6)
```

**Time:** O(n)

**Real-life:** remembering the cheapest price you've seen so far and checking today's profit.

### DSA-89. 🆕 Merge overlapping intervals?

```python
def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]])  # [[1, 6], [8, 10], [15, 18]]
```

**Time:** O(n log n) (sorting)

**Real-life:** combining overlapping meetings in a calendar into busy blocks.

### DSA-90. 🆕 Product of array except self (no division)?

```python
def product_except_self(nums):
    n = len(nums)
    out = [1] * n
    left = 1
    for i in range(n):
        out[i] = left; left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        out[i] *= right; right *= nums[i]
    return out

product_except_self([1, 2, 3, 4])  # [24, 12, 8, 6]
```

**Pattern:** prefix × suffix products · **Time:** O(n)

### DSA-91. 🆕 Majority element (Boyer-Moore voting)?

Element appearing more than n/2 times, in O(1) space.

```python
def majority(nums):
    candidate, count = None, 0
    for x in nums:
        if count == 0:
            candidate = x
        count += 1 if x == candidate else -1
    return candidate

majority([2, 2, 1, 1, 1, 2, 2])  # 2
```

**Real-life:** opposing voters cancel each other out in pairs; the majority is left standing.

### DSA-92. 🆕 Top K frequent elements?

```python
import heapq
from collections import Counter

def top_k_frequent(nums, k):
    return [x for x, _ in Counter(nums).most_common(k)]
    # or: heapq.nlargest(k, count.keys(), key=count.get)

top_k_frequent([1, 1, 1, 2, 2, 3], 2)  # [1, 2]
```

**Pattern:** hash map + heap · **Time:** O(n log k)

**Real-life:** trending hashtags.

### DSA-93. 🆕 Kth largest element?

```python
import heapq

def kth_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)   # keep only the k largest
    return heap[0]

kth_largest([3, 2, 1, 5, 6, 4], 2)  # 5
```

**Time:** O(n log k) · Quickselect gives O(n) average.

### Linked Lists

### DSA-94. 🆕 Merge two sorted linked lists?

```python
def merge_lists(a, b):
    dummy = tail = Node(0)
    while a and b:
        if a.data <= b.data:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next
```

**Pattern:** **dummy head** node (avoids special-casing the first node) · **Time:** O(n + m)

**Real-life:** merging two sorted queues at a ticket counter into one.

### DSA-95. 🆕 Remove the Nth node from the end?

```python
def remove_nth_from_end(head, n):
    dummy = Node(0); dummy.next = head
    fast = slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        fast, slow = fast.next, slow.next
    slow.next = slow.next.next
    return dummy.next
```

**Pattern:** two pointers with a **gap of n** · one pass, O(n)

**Real-life:** two people walking with a fixed rope between them; when the first reaches the end, the second is n steps behind.

### Stacks, Queues & Design

### DSA-96. 🆕 Min stack (get minimum in O(1))?

```python
class MinStack:
    def __init__(self):
        self.stack = []          # (value, min so far)
    def push(self, x):
        m = min(x, self.stack[-1][1]) if self.stack else x
        self.stack.append((x, m))
    def pop(self):
        return self.stack.pop()[0]
    def get_min(self):
        return self.stack[-1][1]

s = MinStack(); s.push(5); s.push(2); s.push(8)
s.get_min()  # 2
```

**Real-life:** each plate in the stack has a sticky note: "smallest plate at or below me".

### DSA-97. 🆕 Next greater element (monotonic stack)?

```python
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []                       # indexes waiting for a bigger number
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            result[stack.pop()] = x
        stack.append(i)
    return result

next_greater([2, 1, 2, 4, 3])  # [4, 2, 4, -1, -1]
```

**Time:** O(n) (each index pushed and popped once)

**Real-life:** people in a queue looking ahead for the first taller person.

🎯 Same pattern: daily temperatures, stock span, largest rectangle in histogram.

### DSA-98. 🆕 Design an LRU cache? ⭐

Get/put in **O(1)**; evict the **least recently used** item when full.

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap, self.data = capacity, OrderedDict()
    def get(self, key):
        if key not in self.data:
            return -1
        self.data.move_to_end(key)          # mark as recently used
        return self.data[key]
    def put(self, key, value):
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.cap:
            self.data.popitem(last=False)   # evict oldest

c = LRUCache(2); c.put(1, "a"); c.put(2, "b"); c.get(1); c.put(3, "c")
c.get(2)  # -1 (evicted)
```

**Real-life:** a small desk that holds 2 books; when you need a third, the one you haven't touched longest goes back to the shelf.

🎯 Under the hood: **hash map + doubly linked list**. Interviewers may ask you to build it without `OrderedDict` (in JS, a `Map` keeps insertion order and works the same way).

### DSA-99. 🆕 Queue using two stacks?

```python
class MyQueue:
    def __init__(self):
        self.inbox, self.outbox = [], []
    def push(self, x):
        self.inbox.append(x)
    def pop(self):
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())
        return self.outbox.pop()

q = MyQueue(); q.push(1); q.push(2)
q.pop()  # 1
```

**Time:** O(1) amortised

**Real-life:** pouring a stack of plates into another stack flips their order.

### Trees

### DSA-100. 🆕 Maximum depth of a binary tree?

```python
def max_depth(node):
    if not node:
        return 0
    return 1 + max(max_depth(node.left), max_depth(node.right))
```

**Time:** O(n)

### DSA-101. 🆕 Invert (mirror) a binary tree?

```python
def invert(node):
    if node:
        node.left, node.right = invert(node.right), invert(node.left)
    return node
```

**Real-life:** looking at the tree in a mirror.

### DSA-102. 🆕 Validate a BST?

```python
def is_valid_bst(node, low=float("-inf"), high=float("inf")):
    if not node:
        return True
    if not (low < node.data < high):
        return False
    return (is_valid_bst(node.left, low, node.data) and
            is_valid_bst(node.right, node.data, high))
```

⚠️ Checking only `left < node < right` for direct children is **wrong**; every node must fit the range set by **all** its ancestors.

### DSA-103. 🆕 Level-order traversal (list of levels)?

```python
from collections import deque

def level_order(root):
    if not root:
        return []
    result, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):        # process one level
            node = q.popleft()
            level.append(node.data)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result
```

**Real-life:** reading an org chart floor by floor.

### DSA-104. 🆕 Lowest common ancestor in a BST?

```python
def lca_bst(node, p, q):
    while node:
        if p < node.data and q < node.data:
            node = node.left
        elif p > node.data and q > node.data:
            node = node.right
        else:
            return node        # paths split here
```

**Real-life:** the closest common boss of two employees.

### Graphs & Grids

### DSA-105. 🆕 Number of islands?

Count groups of connected `1`s in a grid.

```python
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    def sink(r, c):
        if 0 <= r < rows and 0 <= c < cols and grid[r][c] == "1":
            grid[r][c] = "0"
            sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)
    return count

num_islands([list("11000"), list("11000"), list("00100"), list("00011")])  # 3
```

**Pattern:** DFS/BFS on a grid · **Time:** O(rows × cols)

**Real-life:** counting islands on a map by colouring each one as you find it.

### DSA-106. 🆕 Shortest path in a grid?

```python
from collections import deque

def shortest_path(grid, start, end):     # 0 = free, 1 = wall
    rows, cols = len(grid), len(grid[0])
    q, seen = deque([(start, 0)]), {start}
    while q:
        (r, c), d = q.popleft()
        if (r, c) == end:
            return d
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0 and (nr, nc) not in seen:
                seen.add((nr, nc))
                q.append(((nr, nc), d + 1))
    return -1

shortest_path([[0, 0, 0], [1, 1, 0], [0, 0, 0]], (0, 0), (2, 0))  # 6
```

**Pattern:** BFS (unweighted → shortest steps)

### Dynamic Programming

### DSA-107. 🆕 Climbing stairs (1 or 2 steps)?

```python
def climb_stairs(n):
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return a

climb_stairs(5)  # 8
```

**Recurrence:** `ways(n) = ways(n-1) + ways(n-2)` (it's Fibonacci).

**Real-life:** counting the ways to climb stairs one or two steps at a time.

### DSA-108. 🆕 Coin change (fewest coins)?

```python
def coin_change(coins, amount):
    dp = [0] + [float("inf")] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1

coin_change([1, 3, 4], 6)  # 2 (3 + 3), greedy would give 3 (4 + 1 + 1)
```

**Time:** O(amount × coins)

### DSA-109. 🆕 House robber (no two adjacent)?

```python
def rob(houses):
    prev, cur = 0, 0
    for h in houses:
        prev, cur = cur, max(cur, prev + h)   # skip or take
    return cur

rob([2, 7, 9, 3, 1])  # 12 (2 + 9 + 1)
```

**Real-life:** picking non-neighbouring houses on a street to collect the most donations.

### DSA-110. 🆕 Longest increasing subsequence?

```python
from bisect import bisect_left

def lis(nums):
    tails = []                       # smallest tail for each length
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)

lis([10, 9, 2, 5, 3, 7, 101, 18])  # 4 (2, 3, 7, 18)
```

**Time:** O(n log n) (simple DP version is O(n²))

### DSA-111. 🆕 Longest common subsequence?

```python
def lcs(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[-1][-1]

lcs("abcde", "ace")  # 3
```

**Time:** O(n·m)

**Real-life:** `git diff` finds the longest common lines between two versions of a file.

### Bits & Recursion

### DSA-112. 🆕 Bit manipulation basics?

| Trick | Code | Example |
|---|---|---|
| is even | `x & 1 == 0` | |
| power of two | `x > 0 and x & (x - 1) == 0` | 8 → True |
| find the single number (others appear twice) | XOR all | `a ^ a = 0` |
| count set bits | `bin(x).count("1")` | 7 → 3 |

```python
from functools import reduce

def single_number(nums):
    return reduce(lambda a, b: a ^ b, nums)

single_number([4, 1, 2, 1, 2])  # 4
```

**Real-life:** XOR is a light switch: pressing twice cancels out.

### DSA-113. 🆕 Flatten a nested list (recursion)?

```python
def flatten(items):
    out = []
    for x in items:
        if isinstance(x, list):
            out.extend(flatten(x))
        else:
            out.append(x)
    return out

flatten([1, [2, [3, [4]], 5]])  # [1, 2, 3, 4, 5]
```

**Real-life:** unpacking boxes inside boxes onto one table.

🎯 Very common in **JavaScript** interviews too (`arr.flat(Infinity)` and its polyfill).

---

## Part J — Cheat Sheets & Study Plan

### DSA-114. Data structure complexities

| Structure | Access | Search | Insert | Delete |
|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) |
| Linked list | O(n) | O(n) | O(1) at head | O(1) at head |
| Stack / Queue | O(n) | O(n) | O(1) | O(1) |
| Hash table | — | O(1) avg, O(n) worst | O(1) avg | O(1) avg |
| BST (balanced) / AVL | O(log n) | O(log n) | O(log n) | O(log n) |
| BST (unbalanced) | O(n) | O(n) | O(n) | O(n) |
| Heap | O(1) peek | O(n) | O(log n) | O(log n) pop |
| Trie | — | O(L) | O(L) | O(L) |

### DSA-115. Algorithm complexities

| Algorithm | Time | Notes |
|---|---|---|
| Linear search | O(n) | any array |
| Binary search | O(log n) | sorted only |
| BFS / DFS | O(V + E) | adjacency list |
| Dijkstra | O((V + E) log V) | no negative weights |
| Bellman-Ford | O(V·E) | negative weights, detects negative cycles |
| Prim | O(E log V) | MST, dense |
| Kruskal | O(E log E) | MST, sparse, Union-Find |
| Topological sort | O(V + E) | DAG only |
| Edmonds-Karp | O(V·E²) | max flow |
| Euclidean GCD | O(log min(a, b)) | |
| TSP brute force | O(n!) | exact, tiny n |
| 0/1 Knapsack (DP) | O(n·W) | W = capacity |

Sorting complexities: DSA-18.

### DSA-116. Quick interview answers

| Question | Answer |
|---|---|
| Array vs linked list? | O(1) index access vs O(1) insert at known position |
| Stack vs queue? | LIFO vs FIFO |
| Why is a hash map O(1)? | hash function jumps straight to the bucket (average) |
| BFS vs DFS? | level-by-level with a queue (shortest unweighted path) vs deep-first with a stack |
| Dijkstra vs Bellman-Ford? | faster, no negative weights vs slower, handles negatives |
| Prim vs Kruskal? | grow one tree (dense) vs sort edges + Union-Find (sparse) |
| Stable sort? | equal elements keep their order |
| Quicksort worst case? | O(n²) with bad pivots → random pivot |
| Merge sort trade-off? | always O(n log n) but O(n) extra space |
| DP vs greedy? | all choices + reuse vs best local choice |
| Memo vs tabulation? | top-down recursion + cache vs bottom-up table |

### DSA-117. How should you study these notes?

- **One part per day**; say each answer aloud in 30–60 seconds.
- Close the notes and **write each algorithm from memory**.
- Practise patterns (Part H) on LeetCode-style problems: start with easy two-pointer, sliding window, hash map and BFS/DFS questions.
- Use the animations in the [W3Schools DSA tutorial](https://www.w3schools.com/dsa/) to watch each algorithm step by step.
- Before the interview, re-read DSA-84 and DSA-114 to DSA-116.
