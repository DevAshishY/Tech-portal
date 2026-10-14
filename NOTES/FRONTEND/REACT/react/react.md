# React — Complete Interview Guide (Question-wise)

> Every React topic, from basics to senior/architecture level, written as **numbered interview questions** in learning order.
> Each answer follows the same pattern: **short answer → explanation/code → ⚠️ gotchas → 🎯 interview tip**.
> Current as of **React 19.2** (Oct 2025), **React Compiler 1.0** and **React Router v7**.
> Written for an experienced frontend engineer: it skips JavaScript basics and focuses on how React thinks and what senior interviews ask.

---

## How to Use This Guide (3-Week Plan)

| Week | Questions | Focus | Practice |
|---|---|---|---|
| 1 | Q1–Q63 | Fundamentals, rendering, internals, hooks | Todo app with filters; search box with debounce + race-condition handling |
| 2 | Q64–Q123 | Patterns, refs, forms, React 19, state, routing, data, SSR/RSC | Small app: routing, protected routes, validated form, paginated list, theme context |
| 3 | Q124–Q183 | Suspense, performance, security, testing, a11y, from-scratch, machine coding, architecture | Profile & optimise your app; write RTL tests; 2 timed machine-coding problems per day |

**Senior interviews usually have four rounds:**
1. **Fundamentals:** rendering, hooks, reconciliation
2. **Machine coding:** build a widget live (Part X)
3. **Frontend system design:** architecture, state, performance, scale (Part Y)
4. **Experience and behavioural:** tie every answer back to real trade-offs from your 12 years

**Answer structure for senior questions:** requirements → options → trade-offs → choice → how you'd measure it.

---

## Table of Contents

| Part | Topic | Questions |
|---|---|---|
| A | [Fundamentals & Mental Model](#part-a--fundamentals--mental-model) | Q1–Q17 |
| B | [State & Rendering](#part-b--state--rendering) | Q18–Q26 |
| C | [Under the Hood — VDOM, Reconciliation, Fiber, Concurrency](#part-c--under-the-hood--vdom-reconciliation-fiber-concurrency) | Q27–Q41 |
| D | [Hooks](#part-d--hooks) | Q42–Q63 |
| E | [Component Patterns](#part-e--component-patterns) | Q64–Q80 |
| F | [Refs](#part-f--refs) | Q81–Q84 |
| G | [Forms](#part-g--forms) | Q85–Q88 |
| H | [React 19, 19.2 & the Compiler](#part-h--react-19-192--the-compiler) | Q89–Q95 |
| I | [State Management](#part-i--state-management) | Q96–Q102 |
| J | [Routing](#part-j--routing) | Q103–Q107 |
| K | [Data Fetching & Real-time](#part-k--data-fetching--real-time) | Q108–Q110 |
| L | [Rendering Strategies — SSR, Hydration, Server Components](#part-l--rendering-strategies--ssr-hydration-server-components) | Q111–Q123 |
| M | [Suspense In Depth](#part-m--suspense-in-depth) | Q124–Q127 |
| N | [Performance](#part-n--performance) | Q128–Q137 |
| O | [Authentication & Security](#part-o--authentication--security) | Q138–Q140 |
| P | [Styling](#part-p--styling) | Q141 |
| Q | [TypeScript with React](#part-q--typescript-with-react) | Q142–Q144 |
| R | [Testing](#part-r--testing) | Q145–Q147 |
| S | [Accessibility](#part-s--accessibility) | Q148–Q151 |
| T | [Error Handling & Observability](#part-t--error-handling--observability) | Q152–Q153 |
| U | [State Machines, Animations & i18n](#part-u--state-machines-animations--i18n) | Q154–Q157 |
| V | [Tooling, Env Vars & Deployment](#part-v--tooling-env-vars--deployment) | Q158–Q159 |
| W | [Class Components & Lifecycle](#part-w--class-components--lifecycle) | Q160–Q162 |
| X | [Build It From Scratch & Machine Coding](#part-x--build-it-from-scratch--machine-coding) | Q163–Q173 |
| Y | [Architecture & System Design (Senior)](#part-y--architecture--system-design-senior) | Q174–Q179 |
| Z | [Summary — Mistakes, Decision Guide, Rules, JS Refresher](#part-z--summary--mistakes-decision-guide-rules) | Q180–Q183 |

---

## Part A — Fundamentals & Mental Model

### Q1. What is React, and why use it?
React is an open-source JavaScript **library** (not a framework) for building UIs from reusable, composable **components**. It is **declarative**: you describe *what* the UI should look like for a given state and React handles *how* to update the DOM.

The one formula to remember:

```
UI = f(state)
```

You never touch the DOM to update the UI. You change **state**, React calls your component function again, and React works out the minimal set of DOM changes.

| Advantages | Disadvantages |
|---|---|
| Component reuse and composition | Only the view layer: you choose the router, state and data tools yourself (or use a framework) |
| Predictable UI (always a function of state) | Overkill for very small or static sites |
| Huge ecosystem and community | JSX and the rendering model have a learning curve |
| Easy to test (RTL, Vitest/Jest) | Ecosystem churn: patterns change often |
| Cross-platform (React Native) | |

🎯 Because React only handles the view, frameworks like **Next.js** and **React Router v7 (framework mode)** bundle routing, data loading and SSR choices for you.

### Q2. Declarative vs imperative?
- **Imperative** (vanilla DOM/jQuery): script each step: `createElement`, `appendChild`, `classList.add`…
- **Declarative** (React): describe the end state in JSX; React figures out the steps.

🎯 The benefit is **predictability**: the UI is always a pure function of state, so the DOM can't drift out of sync with your data.

### Q3. How does React map to what I already know (jQuery / Angular / Vue)?

| You know | React equivalent | Note |
|---|---|---|
| `$('#el').text(x)` / `el.innerHTML = ...` | `setState(x)` → JSX re-renders | Never mutate the DOM directly |
| Angular two-way binding `[(ngModel)]` | Controlled input: `value` + `onChange` | Data flows **one way**: down via props, up via callbacks |
| Angular `@Input()` / `@Output()` | Props / callback props (`onSave`) | |
| Angular services + DI | Custom hooks + Context | |
| Angular `ngOnInit` / `ngOnDestroy` | `useEffect(() => { ...; return cleanup }, [])` | |
| Vue `computed` | Compute during render (or `useMemo` if expensive) | **Don't** store derived data in state |
| Vue `watch` | Usually **nothing**: derive, or handle it in the event. `useEffect` only for syncing with external systems | Most common mistake from experienced devs |
| RxJS streams | Usually not needed; TanStack Query covers server state | |
| Templates (`*ngIf`, `v-for`) | Plain JS: `&&`, ternary, `.map()` | JSX is just JavaScript |
| Global event bus | Lift state up / Context / store | |

### Q4. What is a SPA (Single Page Application)?
One HTML shell (`index.html` with `<div id="root">`). JavaScript swaps content on navigation without full page reloads. Client-side routing (React Router) maps URLs to components.

### Q5. React vs Angular?

| | React | Angular |
|---|---|---|
| Type | Library (view layer) | Full, opinionated framework |
| Data binding | One-way | Two-way available |
| Language | JS or TS, JSX | TypeScript-first, templates |
| Built-ins | Pick your own router, state, HTTP | DI, router, HTTP client, forms built in |
| Reactivity | Re-render + diff | Change detection / signals |

### Q6. React vs React Native?
- **React (react-dom):** web UIs in the browser, using HTML and CSS.
- **React Native:** native **mobile** apps (iOS/Android) with native components like `View` and `Text`, shipped via app stores.

They share the same component model, hooks and state ideas, but use different renderers.

### Q7. How do you set up a React project today, and what's the folder structure?
- **Vite:** `npm create vite@latest my-app -- --template react-ts` → `npm run dev`
- **Framework:** Next.js, or React Router v7 in framework mode
- ⚠️ **Create React App was deprecated in Feb 2025.** You'll only meet it in legacy projects.

```
index.html          ← single page with <div id="root">
src/main.tsx        ← createRoot(document.getElementById("root")).render(<StrictMode><App/></StrictMode>)
src/App.tsx         ← root component
public/             ← static files served as-is (favicon, robots.txt, images)
node_modules/       ← dependencies from package.json
```

**Feature-based folders** scale better than type-based ones in large apps:

```
src/features/cart/{components,hooks,api,cart.slice.ts,index.ts}
src/shared/{ui,lib,hooks}
```

### Q8. What is JSX, and how is it compiled?
JSX is syntax sugar. A compiler (Babel, SWC or esbuild) turns it into function calls, because browsers only understand JS:

```jsx
<Button kind="primary">Save</Button>
// compiles to (new JSX transform):
jsx(Button, { kind: "primary", children: "Save" })
```

JSX is **an expression that returns a plain object** (a "React element") describing the UI.

### Q9. What are the rules of JSX?
- One root element per return → use a Fragment `<>...</>` to avoid wrapper divs.
- `className` instead of `class`, `htmlFor` instead of `for`, camelCase events (`onClick`).
- `{}` embeds any JS **expression**, but not statements (no `if`/`for` inside → use `&&`, ternary or `.map()`).
- Self-close empty tags: `<img />`.
- Values are **escaped** by default (XSS-safe).

### Q10. What is a component?
A function that takes **props** and returns JSX. The name must be **Capitalised**, because lowercase means an HTML tag.

```jsx
function UserCard({ name, role = "Engineer", children }) {   // default via JS default param
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{role}</p>
      {children}
    </div>
  );
}
```

Function components are the default today; class components are legacy (Q160).

### Q11. What are props, and what are the rules?
Props are the inputs a parent passes to a child.
- **Read-only.** Never mutate them.
- Data flows **down** (parent → child).
- Defaults come from JS default parameters (`defaultProps` on function components was removed in React 19).
- Anything can be a prop: strings, objects, functions, JSX.

### Q12. How does a child send data to its parent?
There's no "reverse prop". The parent passes a **callback**, and the child calls it:

```jsx
function Parent() {
  const [selected, setSelected] = useState(null);
  return <List onSelect={setSelected} />;   // child calls onSelect(item)
}
```

### Q13. What is `children`, and why is composition important?
`children` is whatever you put between a component's tags. It lets a component wrap content without knowing what it is (cards, layouts, modals).
React has **no component inheritance** in practice. Reuse comes from composition (`children`, "slot" props like `header={<Title/>}`) and custom hooks.

### Q14. How do you do conditional rendering, and what's the `0` gotcha?

```jsx
{isLoading && <Spinner />}
{error ? <ErrorMsg /> : <Data />}
```

⚠️ `{count && <Badge />}` renders a literal **`0`** when count is 0. Use `{count > 0 && ...}`.
Avoid nested ternaries; extract them to a variable or a component.

### Q15. Why do lists need keys, and why not use the index?

```jsx
{users.map(u => <UserCard key={u.id} name={u.name} />)}
```

Keys identify list items across renders, so React can match, move and reuse them.
⚠️ Using the array **index** as the key breaks when the list is re-ordered, filtered or has items inserted. React reuses the wrong component's state and DOM (for example, input text ends up in the wrong row). The index is only safe for static lists. Keys only need to be unique **among siblings**.

### Q16. What's the difference between state and props?

| Props | State |
|---|---|
| Inputs from the parent | The component's own memory |
| Read-only | Changed via its setter |
| Owned by the parent | Owned by the component |

Both trigger a re-render when they change.

### Q17. What are Fragments?
`<>...</>` or `<Fragment>` group children without adding an extra DOM node. Use the long form `<Fragment key={id}>` when you need a key inside a list.

---

## Part B — State & Rendering

### Q18. What triggers a re-render?
1. The component's **state changes** (via its setter)
2. Its **parent re-renders** (by default, children re-render even if their props didn't change)
3. A **context** it reads changes

Props changing is *not* a separate trigger. Props only change because the parent re-rendered.

### Q19. What's the difference between the render phase and the commit phase?
- **Render phase:** React calls your function and builds a new element tree. It must be **pure** (no side effects). It can be interrupted and restarted in concurrent mode.
- **Commit phase:** React applies the minimal DOM changes, attaches refs, then runs effects. It's synchronous.

A component can **render without changing the DOM** at all.

### Q20. Why does `console.log` show the old value after `setState`? (State as a snapshot)

```jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
  console.log(count); // still 0, this render's snapshot
}
// Result: count = 1, not 3
```

Each render has its **own** `count` constant. The setter **schedules** a re-render with the new value; the current function keeps its old value.

### Q21. What is the updater function form of `setState`?
Use it when the next state depends on the previous one:

```jsx
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);   // Result: 3
```

React queues the updaters and runs them in order on the next render.

### Q22. What is automatic batching, and what is `flushSync`?
React 18+ **batches** all state updates in the same tick (in event handlers, promises, `setTimeout` and native listeners) into **one** re-render. Before React 18, batching only happened inside React event handlers.
To force a synchronous update (rarely needed, e.g. scrolling to a just-added item), use `flushSync(() => setX(...))` from `react-dom`.

### Q23. Why must you never mutate state?

```jsx
// ❌ same reference, React bails out and nothing re-renders
user.name = "New"; setUser(user);
items.push(x);     setItems(items);

// ✅ new reference
setUser({ ...user, name: "New" });
setItems([...items, x]);
setItems(items.filter(i => i.id !== id));
setItems(items.map(i => i.id === id ? { ...i, done: true } : i));
```

React compares state with `Object.is` (reference equality). Same reference means "nothing changed". **Immer** lets you write "mutating" code that produces new objects; Redux Toolkit uses it internally.

### Q24. Where should state live?
- **Colocate:** keep state in the lowest component that needs it.
- **Lift up:** if two siblings need it, move it to their closest common parent and pass it down.
- **Global** (Context/store) only when many distant components need it.

### Q25. What is derived state, and why shouldn't you sync it?

```jsx
// ❌ redundant state + effect to sync it
const [fullName, setFullName] = useState("");
useEffect(() => setFullName(first + " " + last), [first, last]);

// ✅ just compute it during render
const fullName = first + " " + last;
```

Syncing causes an extra render and risks bugs where the two copies disagree. **If you can compute it, don't store it.**

### Q26. How do you reset a component's state?
Change its **`key`**. A new key means React treats it as a different component, so it remounts with fresh state:

```jsx
<ProfileForm key={userId} userId={userId} />
```

This is better than an effect that watches `userId` and resets each field by hand.

---

## Part C — Under the Hood — VDOM, Reconciliation, Fiber, Concurrency

### Q27. What is the Virtual DOM?
JSX produces plain JS objects describing the UI (the "virtual DOM"). On each render React compares the new tree with the previous one and computes the **minimal real-DOM mutations**. Real DOM operations are expensive and JS object comparisons are cheap.

> Senior nuance: the VDOM isn't "faster than the DOM". Hand-written, optimal DOM code is faster. Its value is that you write **declarative** code and get *good-enough* performance without managing updates by hand.

### Q28. What is reconciliation, and how does the diffing algorithm work?
A full tree diff costs O(n³). React uses two **heuristics** to get to O(n):
1. **Different element type → throw away the whole subtree** and rebuild it (`<div>` → `<section>`, or `<A>` → `<B>`). All state below is lost.
2. **Same type → keep the DOM node or instance**, update the changed props, and recurse into the children.
3. **Keys** match children across renders, so React can move or reuse them.

Then the commit phase applies the minimal patch.

### Q29. Why must you never define a component inside another component?

```jsx
function Parent() {
  function Child() { ... }      // ❌ new function = new TYPE every render
  return <Child />;
}
```

Every render creates a new component type, so React unmounts and remounts it each time. State resets, inputs lose focus, and performance suffers. Define components at module level.

### Q30. What is Fiber, and what problem does it solve?
Fiber has been React's reconciliation engine since React 16. The old "stack" reconciler recursed synchronously, so a big update blocked the main thread until it finished.
Fiber turns rendering into a **loop over a linked list of units of work** ("fibers") that can be **paused, prioritised, aborted and resumed**. That makes concurrent features possible: transitions, Suspense and selective hydration.

### Q31. What is inside a fiber, and what is double buffering?
Each component instance or host element (`<div>`) is backed by a fiber object:

| Field | Meaning |
|---|---|
| `type` / `key` | Which component or tag this is, and its key |
| `child`, `sibling`, `return` | Pointers forming the tree (`return` is the parent) |
| `pendingProps` / `memoizedProps` | Props for this render / props from the last committed render |
| `memoizedState` | For function components, the **linked list of hooks** |
| `updateQueue` | Pending state updates and effects |
| `flags` | What to do in commit (placement, update, deletion…) |
| `lanes` | Priority of pending work (Q38) |
| `alternate` | The twin fiber in the other tree |

**Double buffering:** React keeps two trees.
- **current:** what's on screen now.
- **work-in-progress (WIP):** the tree being built for the next render.

On commit React swaps the pointers so the WIP tree becomes `current`. You never see a half-built UI.

### Q32. How are hooks stored internally?

```
fiber.memoizedState → [useState hook] → [useEffect hook] → [useMemo hook] → null
                         { memoizedState: 0, queue: {...}, next: ● }
```

On every render React walks this list **in call order**. This is the real reason hooks can't be conditional: a skipped call shifts every hook after it onto the wrong node.

### Q33. What does React's work loop look like?

```
render phase (interruptible):
  for each fiber:  beginWork(fiber)     → call component, diff children
                   completeWork(fiber)  → create/prepare DOM nodes, bubble flags up
  (check shouldYield() between fibers when rendering concurrently)

commit phase (synchronous, never interrupted):
  1. before mutation  → getSnapshotBeforeUpdate
  2. mutation         → apply DOM inserts/updates/deletes, detach old refs
  3. layout           → attach refs, useLayoutEffect, componentDidMount/Update
  then later          → useEffect (passive effects) are flushed after paint
```

### Q34. When exactly does React skip (bail out of) rendering a component?

| Situation | Result |
|---|---|
| `setState(sameValue)` (`Object.is` equal) | Bails out, though React **may** still call your component once before deciding |
| Parent re-rendered but returned the **same element object** for this child | Skipped ("same element reference" optimisation) |
| Component wrapped in `memo` and props are shallow-equal | Skipped |
| `memo(Comp, arePropsEqual)` returns `true` | Skipped (custom comparison) |
| Context value unchanged (`Object.is`) | Consumers not re-rendered for that context |

### Q35. Why doesn't content passed as `children` re-render when the parent's state changes?

```jsx
function SlowParent({ children }) {
  const [pos, setPos] = useState(0);
  return <div onMouseMove={e => setPos(e.clientX)}>{pos}{children}</div>;
}

function App() {
  return <SlowParent><ExpensiveTree /></SlowParent>;
}
```

`<ExpensiveTree />` was created by **App**, not by SlowParent. When SlowParent's state changes, `children` is the **same element object** as before, so React skips it with no `memo` needed.
🎯 This is the most elegant fix for many performance problems: **lift content up and pass it as children**.

### Q36. Why does passing a new object or function break `memo`?

```jsx
<MemoChild style={{ color: "red" }} />       // new object each render → memo useless
<MemoChild onClick={() => doThing()} />       // new function each render → memo useless
```

`memo` compares props shallowly by reference. Fixes: `useMemo`/`useCallback`, hoist constants outside the component, or the React Compiler (Q95).

### Q37. Does `memo` stop context updates?
**No.** When a provider's value changes, React walks **down** the tree to find consumers and re-renders them, even through `memo` boundaries.
Mitigations: split contexts, memoise the value object, or use a selector-based store (`useSyncExternalStore`).

### Q38. What are lanes?
**Lanes** are update priorities stored as **bitmasks** (31 bits), so React can batch, merge and compare priorities with cheap bitwise operations.

| Lane (roughly) | Comes from |
|---|---|
| **SyncLane** | Discrete user events: click, keydown, input |
| **InputContinuousLane** | Continuous events: mousemove, scroll, drag |
| **DefaultLane** | Updates outside events: `setTimeout`, fetch callbacks |
| **TransitionLanes** | `startTransition`, `useTransition`, `useDeferredValue` |
| **RetryLanes** | Re-trying suspended content |
| **IdleLane / OffscreenLane** | Hidden content (`<Activity mode="hidden">`), lowest priority |

### Q39. What is concurrent rendering? Is every render interruptible?
Concurrent rendering means React can prepare UI in the background, **interrupt** it for higher-priority updates, and **abandon** it.

```
User types "a"   → SyncLane update
startTransition(() => setFilter("a")) → TransitionLane render starts…
User types "ab"  → SyncLane update arrives mid-render
  → React throws away the half-done transition render,
    commits the urgent input update first,
    then restarts the transition with the latest value.
```

The **Scheduler** runs work in chunks of about **5 ms** and yields to the browser (via `MessageChannel`).
> Senior nuance: **only transition (and retry/idle) work is time-sliced.** Sync and default updates still render in one go. You opt in with transitions.

This is why render must be **pure**: React may call your component several times and discard the results.

### Q40. What is tearing, and how does `useSyncExternalStore` prevent it?
**Tearing:** during a concurrent render that yields, an external mutable store (a Redux store, a global variable) changes, so part of the UI shows the old value and part shows the new one.
`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` detects a store change mid-render and re-renders **synchronously** so the UI is consistent.

⚠️ `getSnapshot` must return the **same reference** when nothing changed. Returning a new object each call causes an infinite loop and the error *"The result of getSnapshot should be cached"*.

### Q41. What are synthetic events, and how does event delegation work in React?
React wraps native events in a cross-browser `SyntheticEvent` (same API everywhere).
- Since **React 17**, listeners are attached to the **root container** instead of `document`. That makes micro-frontends and multiple React versions on one page safer.
- **Event pooling was removed** in v17, so you can read `e.target` asynchronously.
- Events bubble through the **React tree**, even across portals (Q69).

---

## Part D — Hooks

### Q42. What are the Rules of Hooks, and why do they exist?
1. Only call hooks at the **top level**: not in conditions, loops or nested functions.
2. Only call them from **components** or **custom hooks** (`useXxx`).

**Why:** React stores hook state in an **ordered linked list** per component (Q32) and matches state to hooks by **call order**. A conditional hook shifts the order and hands the wrong state to the wrong hook.
*(Exception: `use()` in React 19 can be called conditionally.)* The ESLint plugin `eslint-plugin-react-hooks` enforces these rules.

### Q43. How does `useState` work, and what is lazy initialisation?

```jsx
const [count, setCount] = useState(0);
setCount(5);                 // replace
setCount(c => c + 1);        // updater (based on previous)

// lazy initialiser: the function runs only on the FIRST render
const [data, setData] = useState(() => JSON.parse(localStorage.getItem("data")) ?? []);
```

⚠️ `useState(expensive())` runs `expensive()` on **every** render (the result is just ignored after the first). Pass the function itself: `useState(expensive)`.
⚠️ Unlike class `setState`, the hook **replaces** the value; it doesn't merge objects.

### Q44. What is `useReducer`, and when should you prefer it over `useState`?
Use it when the next state depends on complex logic, several related values change together, or you want "state machine"-style actions.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "added":   return [...state, { id: crypto.randomUUID(), text: action.text, done: false }];
    case "toggled": return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case "deleted": return state.filter(t => t.id !== action.id);
    default: throw new Error("Unknown action " + action.type);
  }
}
const [todos, dispatch] = useReducer(reducer, []);
dispatch({ type: "added", text: "Learn React" });
```

The reducer must be **pure**. Bonus: `dispatch` is stable, so it's safe to pass down without `useCallback`.

### Q45. What is `useEffect`, and how does the dependency array work?
An effect **syncs a component with something outside React**: network, subscriptions, timers, `document.title`, third-party widgets, analytics. It runs **after paint**.

```jsx
useEffect(() => { ... });            // after EVERY render (rarely what you want)
useEffect(() => { ... }, []);        // after mount only
useEffect(() => { ... }, [a, b]);    // after mount + whenever a or b changes (Object.is compare)
```

**Include every reactive value used inside.** The `exhaustive-deps` lint rule enforces this, so trust it. Missing dependencies cause stale values.

### Q46. How does effect cleanup work?

```jsx
useEffect(() => {
  const id = setInterval(() => setSeconds(s => s + 1), 1000);
  return () => clearInterval(id);    // runs before the next effect run AND on unmount
}, []);
```

Anything with a lifetime (listeners, sockets, timers, subscriptions, observers) must be cleaned up, or you get memory leaks and duplicate handlers.

### Q47. Why does my effect run twice in development?
`<StrictMode>` in development runs every effect **mount → cleanup → mount again** to expose missing cleanups. If your effect breaks when it runs twice, the bug is in the effect (usually a missing cleanup), not in StrictMode. Production runs it once.

### Q48. How do you fetch data in an effect safely? (race conditions, async)

```jsx
useEffect(() => {
  const controller = new AbortController();
  (async () => {                                   // effect callback itself can't be async
    try {
      const res = await fetch(`/api/users/${id}`, { signal: controller.signal });
      if (!res.ok) throw new Error(res.statusText);
      setUser(await res.json());
    } catch (e) {
      if (e.name !== "AbortError") setError(e);
    }
  })();
  return () => controller.abort();                 // stale request cancelled when id changes
}, [id]);
```

- **Why not `useEffect(async () => ...)`?** An async function returns a Promise, but React expects the return value to be a cleanup function (or nothing).
- **Race condition:** without the abort, switching quickly from id 1 → 2 can show **user 1's data** if request 1 resolves last.

> In real apps use **TanStack Query** or a framework loader. Interviewers still ask you to hand-roll this.

### Q49. When do you NOT need an effect?

| Situation | ❌ Effect | ✅ Instead |
|---|---|---|
| Value computed from props/state | Effect + setState | Compute during render |
| Expensive computation | Effect + setState | `useMemo` |
| Reset state when a prop changes | Effect watching the prop | `key={prop}` on the component |
| Respond to a user action (submit, click) | Effect watching a flag | Do it in the **event handler** |
| Notify the parent of a change | Effect calling `onChange` | Call `onChange` in the same handler |

### Q50. Effect vs event handler: how do you decide?
- **Event handlers** handle *specific user actions* ("the user clicked Buy").
- **Effects** handle synchronisation that should happen **because the component is on screen** ("while this chat is visible, stay connected").

🎯 If the code runs "because the user did X", it belongs in the handler.

### Q51. What are stale closures, and what is `useEffectEvent`?
A **stale closure** is a function that captured an old render's values. Example: an interval callback that always sees `count = 0`.

The problem: you want to show a toast with the latest `theme` when a chat connects, but `theme` changing shouldn't reconnect.

```jsx
const onConnected = useEffectEvent(() => {
  showToast("Connected!", theme);       // always sees the latest theme
});

useEffect(() => {
  const conn = connect(roomId);
  conn.on("connected", onConnected);
  return () => conn.disconnect();
}, [roomId]);                            // theme is NOT a dependency
```

`useEffectEvent` (stable in **React 19.2**) creates a non-reactive function that reads the latest props and state. Before 19.2 the workaround was storing the latest value in a ref. Only call it from inside effects.

### Q52. `useEffect` vs `useLayoutEffect`?

| `useEffect` | `useLayoutEffect` |
|---|---|
| Runs **after** paint | Runs **before** paint, synchronously |
| Doesn't block the browser | Blocks painting |
| The default for everything | Measuring the DOM / positioning (tooltips) to avoid a visible flicker |

### Q53. What is `useContext`?
It reads the nearest provider's value for a context, without passing props through every level (Q97).
⚠️ Every consumer re-renders when the value changes (`Object.is`). In React 19, `use(Context)` does the same and can be called conditionally.

### Q54. What is `useRef`, and how does it differ from `useState`?

```jsx
// 1. DOM access
const inputRef = useRef(null);
<input ref={inputRef} />;
inputRef.current.focus();

// 2. A mutable value that survives renders without causing one (timer id, previous value)
const timerId = useRef(null);
timerId.current = setInterval(tick, 1000);
```

| `useRef` | `useState` |
|---|---|
| Persists across renders | Persists across renders |
| Changing `.current` does **not** re-render | Setting it **does** re-render |
| For values the UI doesn't display | For values the UI displays |

### Q55. What is `useMemo`, and when should you use it?
It caches the result of an expensive calculation between renders:

```jsx
const sorted = useMemo(() => sortBig(items, sortKey), [items, sortKey]);
```

Use it only for **measurably expensive** work, or to keep an object reference stable for a `memo` child or effect dependency. Don't memoise cheap calculations; the comparison has a cost too. React may discard the cache, so treat it as a performance hint, not a guarantee.

### Q56. What is `useCallback`? `useMemo` vs `useCallback` vs `memo`?

```jsx
const handleSelect = useCallback(id => setSelected(id), []);   // stable function identity
```

| API | Caches | Use for |
|---|---|---|
| `useMemo(fn, deps)` | A **value** | Expensive computations, stable objects |
| `useCallback(fn, deps)` | A **function** | Functions passed to `memo` children or used in effect deps |
| `memo(Component)` | A **component's render** | Skip re-render when props are shallow-equal |

`useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`. `useCallback` is useless unless the receiver is memoised or uses the function as a dependency.

### Q57. What is `useId`?
It generates a stable, unique, **SSR-safe** ID for accessibility attributes:

```jsx
const id = useId();
<label htmlFor={id}>Email</label><input id={id} />
```

⚠️ Don't use it for list keys.

### Q58. What is `useImperativeHandle`?
It customises what a parent receives through a `ref`, exposing a small API instead of the raw DOM node:

```jsx
function VideoPlayer({ ref, src }) {                 // React 19: ref is a normal prop
  const videoRef = useRef(null);
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
  }), []);
  return <video ref={videoRef} src={src} />;
}

const player = useRef(null);
<VideoPlayer ref={player} src="..." />
<button onClick={() => player.current.play()}>Play</button>
```

Use it only for imperative actions (focus, scroll, play, reset). If something could be a prop, make it a prop.

### Q59. What are `useDebugValue` and `useInsertionEffect`?
- `useDebugValue(value)` labels a custom hook's value in React DevTools. Dev only.
- `useInsertionEffect` fires before layout effects so **CSS-in-JS libraries** can inject `<style>` tags early. App code almost never needs it.

### Q60. What is `useTransition`?
It marks **your own** state update as low-priority (non-urgent), so urgent updates like typing stay responsive:

```jsx
const [isPending, startTransition] = useTransition();

function onTabClick(next) {
  startTransition(() => setTab(next));     // expensive re-render, can be interrupted
}
{isPending && <Spinner />}
```

⚠️ Never wrap the input's own `onChange` state update; wrap only the expensive derived update. Transitions also keep visible content on screen instead of showing a Suspense fallback (Q126).

### Q61. What is `useDeferredValue`, and how does it differ from `useTransition`?
It returns a **lagging copy** of a value. React first renders with the old value, then re-renders with the new one in the background:

```jsx
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => search(bigList, deferredQuery), [deferredQuery]);
const isStale = query !== deferredQuery;
```

| `useTransition` | `useDeferredValue` |
|---|---|
| You **own the setter** and wrap the update | You only **receive the value** (e.g. a prop) |

### Q62. When do you use `useSyncExternalStore`?
To subscribe to a **non-React store** (browser APIs, a global store) safely under concurrent rendering (Q40):

```jsx
function useOnlineStatus() {
  return useSyncExternalStore(
    cb => { window.addEventListener("online", cb); window.addEventListener("offline", cb);
            return () => { window.removeEventListener("online", cb); window.removeEventListener("offline", cb); }; },
    () => navigator.onLine,          // client snapshot
    () => true                       // server snapshot (SSR)
  );
}
```

State libraries (Redux, Zustand) use it internally; app code uses it rarely.

### Q63. What are custom hooks?
Functions starting with `use` that call other hooks. They're **the main way to reuse stateful logic**.

```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {          // lazy initialiser runs once
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
```

Custom hooks share **logic**, not **state**: each component that calls the hook gets its own copy. They replaced most HOCs and render props.

---

## Part E — Component Patterns

### Q64. What is prop drilling, and how do you avoid it?
Prop drilling is passing props through many intermediate components that don't use them, just so a deep child can. Fixes, best option first:
1. **Composition:** pass the *component* down instead of the data (`<Layout sidebar={<UserMenu user={user}/>} />`). Often overlooked, often the best fix.
2. **Context:** for widely needed, slowly changing data (theme, auth, locale).
3. **A state library** (Zustand/Redux): for large, frequently updated global state.
4. Custom hooks that read shared state.

### Q65. Controlled vs uncontrolled components?

| | Controlled | Uncontrolled |
|---|---|---|
| Source of truth | React state (`value` + `onChange`) | The DOM (`defaultValue`, read via `ref` or `FormData`) |
| Good for | Instant validation, formatting, dependent fields | Simple forms, React 19 form Actions, performance |
| Gotcha | `value` without `onChange` → React **warns** and the field is read-only | Switching from undefined → defined `value` gives an "uncontrolled to controlled" warning |

### Q66. What are compound components?
A group of components that share implicit state through context and form one flexible API. Very common in design-system questions.

```jsx
const TabsContext = createContext(null);

function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>;
}
function Tab({ value, children }) {
  const { active, setActive } = use(TabsContext);
  return (
    <button role="tab" aria-selected={active === value} onClick={() => setActive(value)}>
      {children}
    </button>
  );
}
function Panel({ value, children }) {
  const { active } = use(TabsContext);
  return active === value ? <div role="tabpanel">{children}</div> : null;
}
Tabs.Tab = Tab; Tabs.Panel = Panel;

<Tabs defaultValue="a">
  <Tabs.Tab value="a">Profile</Tabs.Tab>
  <Tabs.Tab value="b">Settings</Tabs.Tab>
  <Tabs.Panel value="a">...</Tabs.Panel>
  <Tabs.Panel value="b">...</Tabs.Panel>
</Tabs>
```

(React 19: `<TabsContext value>` replaces `<TabsContext.Provider value>`, and `use(Context)` works like `useContext`.)

### Q67. What is a Higher-Order Component (HOC)?
A function that takes a component and returns an enhanced one. It's used for cross-cutting concerns (auth guards, logging, injecting data).

```jsx
function withAuth(Component) {
  return function Protected(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return <Component {...props} />;
  };
}
const ProtectedDashboard = withAuth(Dashboard);
```

The naming convention is `withXxx`. Downsides: "wrapper hell", unclear prop sources, name clashes. **Custom hooks replaced most HOCs**, but you'll still see them in old code and in `connect()` from react-redux.

### Q68. What are render props?
A component takes a function prop that returns JSX. The component owns the logic and the consumer controls the rendering:

```jsx
<DataFetcher url="/api/user" render={data => <Profile data={data} />} />
```

Mostly replaced by custom hooks.

### Q69. What is a Portal?
`createPortal(jsx, domNode)` renders children into a DOM node **outside** the parent hierarchy. It's used for modals, toasts and tooltips, to escape `overflow: hidden` and `z-index` stacking.
⚠️ React events still bubble through the **React tree**, not the DOM tree. A click inside a portal reaches the React parent's `onClick`.

### Q70. What does `<StrictMode>` do?
It's a dev-only wrapper with **no production effect**. It double-invokes render functions, runs effects mount → cleanup → mount, and warns about deprecated APIs, to surface impure renders and missing cleanups early.

### Q71. What are error boundaries?
Components that catch errors during **rendering, lifecycle methods and constructors** of their subtree and show a fallback UI instead of a blank screen.
- They do **not** catch errors in event handlers, async code (`setTimeout`, promises), SSR, or the boundary itself.
- They're still **class-only** (`static getDerivedStateFromError` + `componentDidCatch`), with no hook equivalent. In practice, use the `react-error-boundary` package:

```jsx
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Dashboard />
</ErrorBoundary>
```

Advanced usage: Q152.

### Q72. How do lazy loading and code splitting work?

```jsx
const AdminPanel = lazy(() => import("./AdminPanel"));

<Suspense fallback={<Spinner />}>
  <AdminPanel />
</Suspense>
```

- The bundler creates a separate chunk, which is downloaded only when it's rendered.
- Split by **route** first, then by heavy, rarely used features (charts, editors, modals).
- Plain dynamic `import("./heavy")` works for non-component code too.

### Q73. What are prop getters?
A headless-hook pattern that returns functions producing props. The consumer's handlers are **composed** with yours instead of overwriting them.

```jsx
const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args));

function toggleReducer(state, action) {
  switch (action.type) {
    case "toggle": return { on: !state.on };
    case "reset":  return { on: false };
    default: throw new Error(`Unknown action: ${action.type}`);
  }
}

function useToggle({ reducer = toggleReducer, initialOn = false } = {}) {
  const [{ on }, dispatch] = useReducer(reducer, { on: initialOn });
  const toggle = () => dispatch({ type: "toggle" });
  const getTogglerProps = ({ onClick, ...props } = {}) => ({
    "aria-pressed": on,
    onClick: callAll(onClick, toggle),
    ...props,
  });
  return { on, toggle, reset: () => dispatch({ type: "reset" }), getTogglerProps };
}

const { on, getTogglerProps } = useToggle();
<button {...getTogglerProps({ onClick: () => track("toggled") })}>{on ? "On" : "Off"}</button>
```

Used by Downshift and many headless libraries.

### Q74. What is the state reducer pattern?
**Inversion of control:** consumers can override internal state transitions without forking the component. Using `useToggle` from Q73:

```jsx
const [clicks, setClicks] = useState(0);
const tooMany = clicks >= 4;

const { on, getTogglerProps } = useToggle({
  reducer(state, action) {
    if (action.type === "toggle" && tooMany) return state;   // block the change
    return toggleReducer(state, action);                     // otherwise default behaviour
  },
});
```

### Q75. How do you build a component that works both controlled and uncontrolled?
The same way native inputs work: `value`/`onChange` *or* `defaultValue`.

```jsx
function useControllableState({ value, defaultValue, onChange }) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setValue = useCallback(next => {
    const resolved = typeof next === "function" ? next(current) : next;
    if (!isControlled) setInternal(resolved);
    onChange?.(resolved);
  }, [isControlled, current, onChange]);

  return [current, setValue];
}

// <Accordion defaultValue="a" />                       uncontrolled
// <Accordion value={v} onValueChange={setV} />          controlled
```

⚠️ Warn in dev if a component switches between controlled and uncontrolled. React does the same for inputs.

### Q76. What is a polymorphic `as` prop? (TypeScript)

```tsx
type BoxProps<C extends React.ElementType> = {
  as?: C;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<C>, "as" | "children">;

function Box<C extends React.ElementType = "div">({ as, ...props }: BoxProps<C>) {
  const Component = as ?? "div";
  return <Component {...props} />;
}

<Box as="a" href="/docs">Docs</Box>        // href type-checked because as="a"
<Box as="button" onClick={go}>Go</Box>
```

### Q77. What is the `asChild` / Slot pattern (Radix, shadcn/ui)?
Instead of an `as` prop, the component merges its behaviour and props **into its child element**:

```jsx
function Slot({ children, ...slotProps }) {
  if (!isValidElement(children)) return null;
  const childProps = children.props;
  return cloneElement(children, {
    ...slotProps,
    ...childProps,
    className: [slotProps.className, childProps.className].filter(Boolean).join(" "),
    onClick: callAll(childProps.onClick, slotProps.onClick),
  });
}

function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className="btn" {...props} />;
}

<Button asChild><a href="/home">Home</a></Button>    // renders <a class="btn" href="/home">
```

(The real Radix Slot also merges refs and style.)

### Q78. What are headless components?
Components or hooks that ship **behaviour + accessibility** without markup or styles: Radix primitives, React Aria, Downshift's `useCombobox`, TanStack Table. Consumers bring their own design. This is the dominant design-system architecture today.

### Q79. How would you design a reusable Modal or Select for a design system?
**Modal:**
- Portal to `document.body`
- `role="dialog"`, `aria-modal`, `aria-labelledby`
- Focus moves into the dialog, focus is trapped inside, and focus returns to the trigger on close
- `Esc` closes; scroll lock; `inert` background
- Controlled `open` + `onClose`
- Mention the native `<dialog>` element with `showModal()` as an option

**Select:**
- Compound components (`Select.Trigger`, `Select.Option`)
- Controlled + uncontrolled support (Q75)
- Prop getters or headless hooks for behaviour (Q73)
- Full ARIA listbox/combobox pattern + keyboard support (Q149)
- `asChild` for custom triggers (Q77); portal for the popup; generics for option value types

Working code for the modal is in Q171.

### Q80. What are PropTypes, and are they still used?
PropTypes were runtime prop-type checks (`Button.propTypes = { label: PropTypes.string.isRequired }`), the pre-TypeScript convention.
⚠️ **React 19 removed propTypes checking entirely**; the checks are silently ignored. Use **TypeScript** (Part Q).

---

## Part F — Refs

### Q81. What are callback refs, and what changed in React 19?
A **callback ref** is a function instead of a ref object; React calls it with the DOM node when it attaches.
- **React 19:** the callback can **return a cleanup function**, called on detach.
- Before 19, it was called with `null` on detach.

```jsx
function useElementSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useCallback(node => {               // stable → doesn't re-attach every render
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(node);
    return () => ro.disconnect();                 // React 19 ref cleanup
  }, []);
  return [ref, size];
}

const [ref, { width }] = useElementSize();
<div ref={ref}>{width}px wide</div>
```

Use callback refs when you need to **react to a node appearing** (measure, observe, focus a conditionally rendered input). `useRef` + `useEffect` misses nodes that mount later.

### Q82. How do you merge refs (your ref + the consumer's ref)?

```jsx
function mergeRefs(...refs) {
  return node => {
    refs.forEach(ref => {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    });
  };
}

function Input({ ref, ...props }) {
  const localRef = useRef(null);
  const merged = useMemo(() => mergeRefs(localRef, ref), [ref]);
  useEffect(() => { localRef.current?.focus(); }, []);
  return <input ref={merged} {...props} />;
}
```

### Q83. What is "ref as a prop"? Is `forwardRef` still needed?
In **React 19**, function components receive `ref` as a normal prop:

```jsx
function MyInput({ ref, ...props }) { return <input ref={ref} {...props} />; }
```

`forwardRef` still works but is no longer required, and it will be deprecated in the future. In React 18 and earlier you needed `forwardRef((props, ref) => ...)`.

### Q84. Why shouldn't you read or write refs during render?
It makes the render impure: the output depends on a mutable value React doesn't track. StrictMode and the React Compiler can expose bugs. Read and write refs in **effects and event handlers**.
The one accepted exception is lazy initialisation: `if (ref.current === null) ref.current = new Thing()`.

---

## Part G — Forms

### Q85. How do you build a form the classic way?
This pattern is still everywhere, including interviews:

```jsx
function Signup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.includes("@")) return setError("Invalid email");
    setPending(true);
    try { await api.signup(email); }
    catch (err) { setError(err.message); }
    finally { setPending(false); }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button disabled={pending}>Sign up</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

### Q86. How do forms work with React 19 Actions (`useActionState`, `useFormStatus`)?

```jsx
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

async function signupAction(prevState, formData) {
  const email = formData.get("email");
  if (!email.includes("@")) return { error: "Invalid email" };
  await api.signup(email);
  return { error: null };
}

function SubmitButton() {
  const { pending } = useFormStatus();          // reads the PARENT <form>'s status
  return <button disabled={pending}>{pending ? "Saving…" : "Sign up"}</button>;
}

function Signup() {
  const [state, formAction, isPending] = useActionState(signupAction, { error: null });
  return (
    <form action={formAction}>
      <input name="email" />
      <SubmitButton />
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
```

- `useActionState(fn, initialState)` → `[state, formAction, isPending]`. `fn` receives `(prevState, formData)`.
- `useFormStatus()` → `{ pending, data, method, action }`. It must be called in a component **rendered inside** the `<form>`.
- React handles pending state and submission sequencing, and **automatically resets uncontrolled fields** after a successful action. No `preventDefault` needed.

### Q87. What is `useOptimistic`?
It shows the expected result **instantly** while an Action runs, and reverts automatically if the Action fails:

```jsx
const [optimisticTodos, addOptimistic] = useOptimistic(
  todos,
  (current, newTodo) => [...current, { ...newTodo, sending: true }]
);

async function add(formData) {
  const todo = { text: formData.get("text") };
  addOptimistic(todo);            // UI updates now
  await saveTodo(todo);           // if this throws, the optimistic item disappears
}
<form action={add}>...</form>
```

Call `addOptimistic` inside an Action or a transition.

### Q88. Which form libraries are used in real apps?
- **React Hook Form:** uncontrolled inputs, minimal re-renders. The current favourite.
- **Zod** (or Yup): schema validation, shareable with the backend and typed for TypeScript.
- **Formik:** older and controlled, with more re-renders.
- For validating as the user types: controlled inputs, validate in `onChange`/`onBlur`, errors in state.

---

## Part H — React 19, 19.2 & the Compiler

### Q89. What's new in React 19 (Dec 2024)?

| Feature | In one line |
|---|---|
| **Actions** | Async functions in transitions/forms; React tracks pending, errors and optimistic state (Q91) |
| `useActionState` | Form/Action state + pending (Q86) |
| `useFormStatus` | Pending status of the parent form (Q86) |
| `useOptimistic` | Instant UI, auto-revert on failure (Q87) |
| `use()` | Read a Promise or Context during render; can be conditional (Q90) |
| **ref as a prop** | `forwardRef` not needed (Q83) |
| Ref cleanup | Ref callbacks can return cleanup (Q81) |
| `<Context value>` | Use the context directly as the provider |
| Document metadata | `<title>`, `<meta>`, `<link>` anywhere in the tree are hoisted to `<head>` |
| Stylesheets | `<link rel="stylesheet" precedence="...">` dedupes styles and controls their order |
| Resource preloading | `preload`, `preinit`, `preconnect`, `prefetchDNS` from `react-dom` |
| Better hydration | One clear diff for mismatches; tolerates elements injected by browser extensions |
| Root error options | `createRoot(el, { onCaughtError, onUncaughtError, onRecoverableError })` |
| Server Components & Server Functions | Stable, used through frameworks (Part L) |

### Q90. What is `use()`, and what's its main gotcha?
`use(resource)` reads a **Promise** (suspends until it resolves) or a **Context** during render. Unlike hooks, it **can be called conditionally** or inside loops.

```jsx
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);       // suspends → nearest <Suspense> shows fallback
  return comments.map(c => <p key={c.id}>{c.text}</p>);
}
```

⚠️ In a **Client** Component, don't create the promise during render (`use(fetch(...))`). Each render makes a new promise, so it suspends forever. The promise must be **cached or stable**: created in a Server Component, a loader or a cache, and passed down (see Q166).

### Q91. What are Actions?
Functions (usually async) passed to `startTransition`, a form's `action`, or `useActionState`. React automatically manages:
- **pending state** (`isPending`, `useFormStatus`)
- **errors** (thrown errors reach error boundaries)
- **optimistic updates** (`useOptimistic`)
- **sequencing** of multiple submissions

```jsx
const [isPending, startTransition] = useTransition();
startTransition(async () => {
  const err = await updateName(name);
  if (err) setError(err);
});
```

### Q92. What other React 19 DOM features should you know?

```jsx
// Metadata anywhere in the tree → hoisted into <head>
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="description" content={post.summary} />
      <h1>{post.title}</h1>
    </article>
  );
}

// Stylesheet ordering + dedupe
<link rel="stylesheet" href="/theme.css" precedence="default" />

// Resource hints
import { preload, preconnect } from "react-dom";
preconnect("https://api.example.com");
preload("/fonts/inter.woff2", { as: "font" });
```

### Q93. What was removed or changed in React 19? ("Do you keep up?" question)
- `ReactDOM.render` / `hydrate` removed → `createRoot` / `hydrateRoot`
- **`propTypes` checks removed** (silently ignored) → TypeScript
- `defaultProps` on function components removed → JS default parameters
- String refs and the legacy context API removed
- `act` moved to `react`; `react-test-renderer` deprecated
- `Context.Provider` → `<Context>` (the old form still works)

### Q94. What's new in React 19.1 / 19.2 (2025)?

| Feature | In one line |
|---|---|
| `<Activity mode="visible\|hidden">` | Hide UI while **keeping its state** (tabs, back navigation); pre-render hidden content at low priority |
| `useEffectEvent` | Non-reactive "event" logic inside effects (Q51) |
| `cacheSignal` | Server Components: know when a `cache()` lifetime ends, to abort work |
| Partial pre-rendering | Pre-render the static shell, resume with dynamic parts later |
| Performance tracks | React-specific tracks in the Chrome DevTools Performance panel |

```jsx
<Activity mode={tab === "settings" ? "visible" : "hidden"}>
  <Settings />            {/* keeps its form state while hidden */}
</Activity>
```

### Q95. What is the React Compiler?
A build-time plugin (**v1.0, Oct 2025**) that **automatically memoises** components and values, roughly what you'd do by hand with `memo`, `useMemo` and `useCallback`.
- With it enabled, most manual memoisation becomes unnecessary.
- It requires code that follows the **Rules of React**: pure render, no mutation of props/state, hooks rules.
- Code it can't safely optimise is skipped.

🎯 *"How does the Compiler change how you write code?"* You write plain code and stop sprinkling memo hooks. Purity and immutability become even more important, and lint rules catch violations.

---

## Part I — State Management

### Q96. How do you classify state? (Senior answers start here.)

| Kind | Example | Tool |
|---|---|---|
| **Local UI state** | Open/closed, input text | `useState` / `useReducer` |
| **Shared UI state** | Theme, sidebar, current user | Context (or Zustand) |
| **Server state** (cache of backend data) | Users list, product details | **TanStack Query** / SWR / RTK Query / framework loaders |
| **URL state** | Filters, page, selected tab | Router search params (shareable, bookmarkable) |
| **Form state** | Field values, validation | React Hook Form / Actions |
| **Complex global client state** | Large editor, multi-step workflows | Redux Toolkit / Zustand |

> **Key insight:** most of what teams put in Redux was actually **server state**. Moving it to TanStack Query (caching, dedup, refetch, invalidation) usually removes most of the global store.

### Q97. How does the Context API work, and what are its performance issues?

```jsx
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);   // stable value
  return <ThemeContext value={value}><Page /></ThemeContext>;
}

function Toolbar() {
  const { theme, setTheme } = useContext(ThemeContext);
}
```

**Performance:** *every* consumer re-renders when the value changes, even through `memo` (Q37). Mitigations:
- Split contexts (a state context and a dispatch context; one per concern)
- Memoise the value object
- For high-frequency updates, use a store with **selectors**

Context is a **dependency-injection** mechanism, not a state manager. It just passes values down.

### Q98. How does Redux Toolkit work?

```jsx
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    added(state, action) { state.items.push(action.payload); },   // Immer makes this safe
    removed(state, action) { state.items = state.items.filter(i => i.id !== action.payload); },
  },
});
export const { added, removed } = cartSlice.actions;
const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// <Provider store={store}><App/></Provider>
const items = useSelector(s => s.cart.items);   // re-renders only when this slice changes
const dispatch = useDispatch();
dispatch(added(product));
```

Flow: **UI → dispatch(action) → middleware → reducer → new state → selectors → UI**. Async work goes through `createAsyncThunk` (thunks are built in) or **RTK Query**. Redux internals: Q164–Q165.

### Q99. Redux vs Context?

| Context | Redux / Zustand |
|---|---|
| Passes values down (dependency injection) | A real store with **selector-based subscriptions** |
| Every consumer re-renders on any change | Components re-render only when their selected slice changes |
| No devtools or middleware | Middleware, devtools, time-travel debugging |
| Good for theme, auth, locale | Good for large, frequently updated global state |

Choose based on update frequency, team size and debugging needs.

### Q100. What is Zustand?
A lightweight, very popular store: no provider and minimal boilerplate.

```jsx
const useCart = create(set => ({
  items: [],
  add: item => set(s => ({ items: [...s.items, item] })),
}));

const items = useCart(s => s.items);      // selector-based subscription
const add = useCart(s => s.add);
```

Other options: **Jotai** (atoms), **MobX** (observables), **XState** (state machines, Q154).

### Q101. What is server state, and why use TanStack Query?
Server state is data owned by the backend: it can be stale, shared and changed by others. It needs **caching, dedup, background refetch, retries, invalidation and pagination**, and TanStack Query gives you all of that.

```jsx
const { data, isPending, error } = useQuery({
  queryKey: ["user", id],
  queryFn: ({ signal }) => fetch(`/api/users/${id}`, { signal }).then(r => r.json()),
  staleTime: 60_000,
});

const qc = useQueryClient();
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => qc.invalidateQueries({ queryKey: ["user", id] }),
});
```

Alternatives: SWR, RTK Query, framework loaders (Next.js, React Router).

### Q102. How do you decide on a state management solution? (Senior)
1. **Classify the state first** (Q96). Most "global state" is really server cache → TanStack Query.
2. Put URL-worthy state in the URL.
3. Keep the rest **local** and lift only when needed.
4. Use a store only for real cross-cutting client state. Pick it by update frequency, devtools needs, team familiarity and bundle size.

🎯 Rule of thumb: start local, add Context for slow-changing shared values, and add a store only when you can name the problem it solves.

---

## Part J — Routing

### Q103. How does React Router work (v6/v7)?
React has no built-in router; **React Router** is the de-facto standard.
> **Versions:** v6 introduced `<Routes>`, `element` and `useNavigate`. **v7 (Nov 2024)** merged with Remix and is current: import from `"react-router"` (`react-router-dom` still works). It runs as a plain library (below) or as a full framework with loaders and SSR.

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router";

<BrowserRouter>
  <nav><Link to="/">Home</Link> <Link to="/users/1">User 1</Link></nav>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users/:id" element={<UserDetail />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

- `<BrowserRouter>` uses the HTML5 history API (clean URLs, no `#`).
- `<Routes>` renders the best match; `path="*"` is the 404 route.
- `<Link>` navigates client-side without a reload (unlike `<a href>`).

### Q104. How do nested routes and `<Outlet>` work?

```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />                 {/* "/" */}
    <Route path="users/:id" element={<UserDetail />} />
  </Route>
</Routes>

function Layout() {
  return <><nav><NavLink to="/">Home</NavLink></nav><Outlet /></>;   // child route renders here
}
```

`<NavLink>` adds an active class or style automatically.

### Q105. How do you read params, query strings and navigate in code?

| Need | API |
|---|---|
| Route params `/users/:id` | `const { id } = useParams()` |
| Query string `?page=2` | `const [params, setParams] = useSearchParams(); params.get("page")` |
| Navigate in code | `const navigate = useNavigate(); navigate("/login")` |
| Current location | `useLocation()` |
| Lazy route | `lazy(() => import(...))` + Suspense, or route `lazy` in data routers |

### Q106. How do you build protected routes?

```jsx
function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

<Route element={<RequireAuth />}>
  <Route path="dashboard" element={<Dashboard />} />
</Route>
```

After login, redirect back to `location.state.from`. ⚠️ This is UX only. **The server must enforce authorisation** (Q140).

### Q107. What changed from React Router v5 → v6/v7?

| v5 | v6/v7 |
|---|---|
| `<Switch>` | `<Routes>` |
| `component={Comp}` | `element={<Comp />}` (JSX, so props can be passed) |
| `useHistory()` | `useNavigate()` |
| `<Redirect>` | `<Navigate>` |
| Relative routes awkward | Nested routes + `<Outlet>` |

---

## Part K — Data Fetching & Real-time

### Q108. `fetch` vs `axios`?

| | `fetch` | `axios` |
|---|---|---|
| Built-in | ✅ native | 3rd-party |
| JSON | `await res.json()` | Automatic |
| HTTP errors | **Doesn't reject on 4xx/5xx**, so check `res.ok` | Rejects on non-2xx |
| Interceptors | Write a wrapper | Built-in (auth headers, 401 handling) |
| Cancel | `AbortController` | `AbortController` (`signal`) |

### Q109. How do you implement pagination and infinite scroll?

| Style | How |
|---|---|
| Page-based | `page` in state or (better) the **URL**; fetch `?page=2&limit=20`; **replace** the list |
| Cursor / infinite | Keep `cursor` + `hasMore`; an `IntersectionObserver` on a sentinel element fetches the next page and **appends** it |

- Prefer `IntersectionObserver` over scroll listeners (no layout thrash).
- For 1,000+ rows, **virtualise** (Q136).
- TanStack Query's `useInfiniteQuery` handles caching and dedup.

Full code: Q170.

### Q110. WebSocket vs Server-Sent Events: how do you do real-time in React?

```jsx
useEffect(() => {
  const ws = new WebSocket("wss://example.com/live");
  ws.onmessage = e => setMessages(prev => [...prev, JSON.parse(e.data)]);
  ws.onerror = err => console.error(err);
  return () => ws.close();                    // always clean up
}, []);
```

- **WebSocket:** two-way (chat, collaboration, multiplayer).
- **SSE (`EventSource`):** server → client only (notifications, live feeds, LLM streaming). Simpler, works over HTTP, auto-reconnects.
- In production: reconnect with backoff and heartbeats, and push incoming messages into your query cache or store. Libraries: `socket.io-client`.

---

## Part L — Rendering Strategies — SSR, Hydration, Server Components

### Q111. CSR vs SSR vs SSG vs Streaming vs RSC?

| Mode | Where it renders | JS shipped | Best for |
|---|---|---|---|
| **CSR** (client-side rendering) | Browser | All of it | Dashboards and apps behind a login |
| **SSR** (server-side rendering) | Server HTML per request → **hydrated** in the browser | All of it | SEO + fast first paint for dynamic pages |
| **SSG** (static generation) | At build time | All of it | Marketing pages, docs, blogs |
| **Streaming SSR** | Server sends HTML in chunks as `<Suspense>` boundaries resolve | All of it | Slow data shouldn't block the whole page |
| **React Server Components (RSC)** | Server only | **Zero** for those components | Data-heavy, mostly-static UI |

### Q112. What is hydration?
React attaches event handlers and state to **server-rendered HTML** so it becomes interactive (`hydrateRoot`). React expects the client's first render to produce the **same output** as the server's.

### Q113. What causes hydration mismatches, and how do you fix them?

| Cause | Fix |
|---|---|
| `Date.now()`, `Math.random()`, locale formatting differs | Render on the client only (set in `useEffect`), or pass the server value down |
| `typeof window !== "undefined"` branches in render | `useEffect`, or `useSyncExternalStore` with a `getServerSnapshot` |
| Invalid HTML nesting (`<div>` inside `<p>`) | Fix the markup; the browser "repairs" it differently from React |
| Browser extensions injecting nodes | React 19 tolerates most of these |
| Intentional difference (a timestamp) | `suppressHydrationWarning` on that one element |

Client-only rendering, the SSR-safe way:

```jsx
const subscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);  // false on server & during hydration
}
```

### Q114. What is streaming SSR, and how is it implemented?
Classic SSR is a waterfall: fetch **all** data → render **all** HTML → load **all** JS → hydrate **all**. Each step waits for the slowest part.
With streaming plus `<Suspense>`, React sends the **shell** immediately with fallbacks in place. As each boundary's data resolves, it streams that HTML plus a tiny inline script that swaps it in.

```js
import { renderToPipeableStream } from "react-dom/server";

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ["/main.js"],
  onShellReady() { res.setHeader("content-type", "text/html"); pipe(res); },  // stream ASAP
  onShellError() { res.status(500).send("<h1>Error</h1>"); },
  onError(err) { console.error(err); },
});
// Edge / web streams: renderToReadableStream(<App />)
// Static (wait for everything, e.g. SSG): prerender / prerenderToNodeStream from "react-dom/static"
// 19.2: prerender can postpone dynamic parts and resume() later (partial pre-rendering)
```

### Q115. What is selective hydration?
With streaming SSR, each Suspense boundary **hydrates independently**, so one slow part doesn't block the rest. If the user **clicks** a not-yet-hydrated area, React **prioritises hydrating that boundary** and replays the event. This improves INP.

### Q116. Server Components vs Client Components?

| | Server Component (default in RSC frameworks) | Client Component (`"use client"`) |
|---|---|---|
| Runs | Server only | Server (SSR) + browser |
| `async/await` data directly in the component | ✅ | ❌ (use `use()` or query libraries) |
| Hooks, state, effects, event handlers | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Access DB / secrets | ✅ | ❌ |
| JS shipped to the browser | **None** | Yes |

```jsx
// Server Component
export default async function ProductPage({ params }) {
  const product = await db.product.find(params.id);   // runs on the server
  return <><ProductInfo product={product} /><AddToCart id={product.id} /></>;
}

// AddToCart.jsx
"use client";
export function AddToCart({ id }) { const [qty, setQty] = useState(1); /* ... */ }
```

### Q117. What do `"use client"` and `"use server"` mean, and what are the composition rules?
- `"use client"` (top of a module) marks a **boundary**: that module and everything it imports become client code.
- `"use server"` marks **Server Functions** (Actions) that the client can call, for example as a form `action`.

```jsx
// ✅ A server component passes a server-rendered tree INTO a client component as children
<ClientTabs>
  <ServerRenderedReport />
</ClientTabs>

// ❌ A client component can't import a server component directly
//    (the import would turn it into client code)
```

Push `"use client"` as far **down** the tree as possible (to leaf components) to keep JS small.

### Q118. What is the RSC payload, and what can cross the server → client boundary?
Server Components don't send HTML to React; they send a serialised **description of the UI tree** (the RSC payload, a streaming JSON-like format):
- Server component output → resolved into plain elements
- Client component → a **reference** ("module X, export Y") plus its props
- The client runtime downloads the referenced modules and stitches the tree together

On first load the framework sends **both** SSR'd HTML and the payload. On client navigation it fetches **only the payload**, so there's no full reload and client state is kept.

**Props that can cross the boundary:**
- ✅ Primitives, plain objects, arrays, `Date`, `Map`, `Set`, typed arrays, **Promises** (unwrap with `use()`), JSX, **Server Functions**
- ❌ Plain functions/closures, class instances, `Symbol`s (except `Symbol.for`), DOM nodes

### Q119. What are `cache()` and `server-only`?

```js
import "server-only";                 // build fails if a client module imports this file
import { cache } from "react";

export const getUser = cache(async id => {      // dedupes calls within ONE request
  return db.user.findUnique({ where: { id } });
});
```

`cache()` is **per-request** memoisation in Server Components. It is not a cross-request cache; that's the framework's job (e.g. Next.js data cache). In 19.2, `cacheSignal()` tells you when that cache lifetime ends.

### Q120. What are the security risks of Server Actions / Server Functions?
Every `"use server"` function becomes a **public HTTP endpoint** that anyone can call with any arguments, not just your form.

```js
"use server";
export async function deletePost(postId) {
  const session = await auth();                         // 1. authenticate
  if (!session) throw new Error("Unauthorized");
  const id = z.string().uuid().parse(postId);           // 2. validate input
  const post = await db.post.find(id);
  if (post.authorId !== session.userId) throw new Error("Forbidden");   // 3. authorise
  await db.post.delete(id);
}
```

- **Don't leak data through props.** Everything passed to a client component is visible in the payload, so map DB rows to DTOs (never pass a `user` row containing `passwordHash`).
- Keep secrets in `server-only` modules.
- **Patch promptly.** In Dec 2025 a critical remote-code-execution bug (CVE-2025-55182, "React2Shell") was found in the RSC payload decoding of the `react-server-dom-*` packages (19.0–19.2.0), followed by DoS and source-exposure fixes.

### Q121. SSR vs RSC: what's the difference?
- **SSR** renders components to **HTML** for a fast first paint, but **all** of their JS still ships and hydrates.
- **RSC** components **never ship JS**; only their rendered output (the payload) is sent.

They work **together**: RSC decides *what runs where*, and SSR turns the initial tree into HTML.

### Q122. Islands architecture vs RSC?
- **Islands** (Astro): the page is static HTML, and only marked widgets hydrate independently.
- **RSC**: conceptually similar (server parts have no JS, client parts hydrate), but the boundaries live **inside one React tree**, and client navigation works without full reloads.

### Q123. How do loading and error states work with Server Components?
- Wrap async Server Components in `<Suspense fallback={...}>`. Streaming shows the fallback, then the content.
- Use error boundaries for rejected data.
- Next.js adds file conventions: `loading.js` (an automatic Suspense boundary) and `error.js` (an automatic error boundary). Those are **Next.js features, not React**.

---

## Part M — Suspense In Depth

### Q124. How does Suspense work?
When a component needs something that isn't ready, it **suspends**: conceptually, it *throws* a promise. React catches it at the nearest `<Suspense>` boundary above, shows the `fallback`, and re-tries rendering when the promise settles. (Modern React uses an internal exception rather than literally throwing your promise, but the mental model holds.)

Things that suspend:
- `lazy()` components while their code loads
- `use(promise)` with a pending promise
- Suspense-enabled data libraries (TanStack Query `useSuspenseQuery`, Relay, framework loaders)
- Async Server Components

> Fetching in `useEffect` does **not** suspend; you manage loading state yourself.

### Q125. How do you decide where to put Suspense boundaries?

```jsx
<Suspense fallback={<PageSkeleton />}>          {/* outer: first load */}
  <Header />
  <Suspense fallback={<FeedSkeleton />}>        {/* feed loads independently */}
    <Feed />
  </Suspense>
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar />
  </Suspense>
</Suspense>
```

- **One boundary:** everything appears together (no "popcorn" effect, but the slowest part blocks everything).
- **Many boundaries:** parts appear as they're ready (faster first content, more layout shift).
- Design it like a designer: which pieces should appear together? React also briefly **throttles** revealing nested content to avoid flicker.

### Q126. How do transitions interact with Suspense?

```jsx
const [isPending, startTransition] = useTransition();
function selectTab(next) {
  startTransition(() => setTab(next));    // if <Tab> suspends, keep showing the OLD tab
}
```

- **Without** a transition: already-visible content is replaced by the fallback (jarring).
- **With** a transition: React keeps the old UI on screen (dim it with `isPending`) until the new UI is ready.

This is why routers wrap navigations in transitions.

### Q127. How do you combine Suspense with error boundaries, and how do you reset a boundary?

```jsx
<ErrorBoundary fallback={<p>Couldn't load feed</p>}>
  <Suspense fallback={<FeedSkeleton />}>
    <Feed />
  </Suspense>
</ErrorBoundary>
```

Suspense handles **pending**; error boundaries handle **rejected**. Always pair them.
**Reset** by giving the boundary a `key`. When it changes, you get fresh state and a fresh fallback:

```jsx
<Suspense key={userId} fallback={<Spinner />}><Profile id={userId} /></Suspense>
```

---

## Part N — Performance

### Q128. How do you approach React performance? (The method)
1. **Measure:** React DevTools Profiler ("why did this render?", highlight updates), the Chrome Performance panel (React tracks in 19.2), Lighthouse, Core Web Vitals (**LCP, INP, CLS**), `<Profiler onRender>`.
2. **Fix the structure:**
   - Move state **down**, close to where it's used
   - Lift content **up** as `children` (Q35)
   - Split large contexts
   - Derive instead of syncing
3. **Then memoise** where it measurably helps, or let the **React Compiler** do it (Q95).

⚠️ Don't optimise prematurely. Memoisation adds complexity and costs memory and comparisons.

### Q129. Show how `React.memo` prevents a re-render.

```jsx
const Child = memo(function Child() {
  console.log("child render");
  return <p>I only render once</p>;
});

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Child />   {/* no props → memo skips its re-render */}
    </>
  );
}
```

Clicking re-renders `App`, but "child render" is logged only once. Pass a new object or inline function to `Child` and `memo` stops working (Q36).

### Q130. What performance techniques should you know?

| Technique | Why |
|---|---|
| `memo` / `useMemo` / `useCallback` | Skip renders / expensive work (Q55–Q56) |
| Code splitting (`lazy`, route-level) | Smaller initial bundle → better LCP |
| Virtualisation | Render only the visible rows of big lists (Q136) |
| `useTransition` / `useDeferredValue` | Keep typing responsive while expensive UI updates (INP) |
| Debounce / throttle | Fewer requests and renders for search and scroll |
| State colocation | Fewer components affected by each update |
| Image optimisation | `loading="lazy"`, proper sizes, modern formats |
| `<Activity>` (19.2) | Keep hidden tabs' state without re-mounting cost |
| Server Components | Less client JS |

**Common mistakes:** wrapping everything in `memo`, memoising cheap calculations, inline objects as props to memoised children, storing derived data in state, guessing instead of profiling.

### Q131. A page feels slow. How do you debug it?
1. Reproduce it, then **profile** (React Profiler + Performance panel).
2. Identify the bottleneck: **network**, **JS/bundle size**, **render count** or **render cost**.
3. Apply the matching fix:

| Bottleneck | Fix |
|---|---|
| Network | Caching, prefetch |
| Bundle | Code splitting |
| Render count | Move state, split context, memo |
| Render cost | Virtualise, transitions |

4. **Re-measure** to confirm the fix.

### Q132. What are long tasks and INP, and how do you break up long work?
**INP (Interaction to Next Paint)** measures how quickly the page responds visually to input; over about 200 ms is poor. The causes are long JS tasks (over 50 ms) on the main thread.

```js
const yieldToMain = () =>
  globalThis.scheduler?.yield?.() ?? new Promise(resolve => setTimeout(resolve, 0));

async function processInChunks(items, work) {
  for (let i = 0; i < items.length; i++) {
    work(items[i]);
    if (i % 200 === 0) await yieldToMain();      // let the browser handle input/paint
  }
}
```

React-level tools: `useTransition` / `useDeferredValue` for heavy re-renders, virtualisation for big DOMs.

### Q133. How do you use Web Workers with React?
Move CPU-heavy work off the main thread:

```js
// worker.js
self.onmessage = e => {
  const result = heavySortAndFilter(e.data);
  self.postMessage(result);
};

// component (Vite syntax)
useEffect(() => {
  const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  worker.onmessage = e => setResult(e.data);
  worker.postMessage(bigData);
  return () => worker.terminate();
}, [bigData]);
```

Good for parsing large files, search indexing, image processing and heavy data transforms. **Comlink** makes workers feel like async function calls.

### Q134. What causes memory leaks in React apps, and how do you find them?

| Cause | Fix |
|---|---|
| Listeners, intervals or subscriptions without cleanup | Return a cleanup from the effect |
| Unaborted fetches setting state after unmount | `AbortController` |
| Global caches / Maps growing forever | Limit their size (LRU), use `WeakMap` for object keys |
| Closures in long-lived callbacks capturing big data | Avoid capturing; clear refs |
| Detached DOM nodes held by third-party libraries | Call the library's `destroy()` in cleanup |

**How to find them:** Chrome DevTools → Memory → take a heap snapshot → repeat the action 5 times → take another snapshot → compare and look for growing counts and "Detached" DOM nodes.

### Q135. How do you optimise bundle size?
- **Analyse:** `rollup-plugin-visualizer` (Vite), `source-map-explorer`.
- **Tree-shaking needs ES modules.** Import specific functions (`lodash-es/debounce`), and avoid barrel files that pull in whole libraries.
- **Budgets in CI:** `size-limit` fails the PR when the bundle grows past a threshold.
- **Split** by route, then by heavy components. **Prefetch** likely-next routes on hover or idle.
- Replace heavy dependencies: moment → `date-fns` / `Intl`, lodash → native methods.

### Q136. How do you render a list with 10,000+ rows?
**Virtualise it:** render only the visible rows plus a small buffer.

```jsx
import { useVirtualizer } from "@tanstack/react-virtual";

function BigList({ rows }) {
  const parentRef = useRef(null);
  const v = useVirtualizer({ count: rows.length, getScrollElement: () => parentRef.current, estimateSize: () => 36 });
  return (
    <div ref={parentRef} style={{ height: 400, overflow: "auto" }}>
      <div style={{ height: v.getTotalSize(), position: "relative" }}>
        {v.getVirtualItems().map(item => (
          <div key={item.key} style={{ position: "absolute", top: 0, transform: `translateY(${item.start}px)`, height: item.size }}>
            {rows[item.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

Alternatives: `react-window`, or CSS `content-visibility: auto` for long, non-interactive pages.

### Q137. How would you improve LCP and INP? (Senior)
- **LCP (Largest Contentful Paint):**
  - SSR/SSG/streaming
  - Preload the hero image and fonts
  - Code split, CDN, fewer render-blocking resources
  - Optimised images
- **INP (Interaction to Next Paint):**
  - Break up long tasks (Q132)
  - `useTransition` for expensive updates, debounce
  - Virtualisation
  - Web Workers
  - Reduce hydration cost (RSC, selective hydration)

🎯 *"Your dashboard's INP is 600 ms."* Record the interaction, find the long task, and attribute it:
- React render → transitions, memo, virtualisation, smaller updates
- Heavy JS → worker, chunking
- Layout thrash → batch DOM reads and writes

Ship the fix, then **verify with field data** (web-vitals / RUM, Q153).

---

## Part O — Authentication & Security

### Q138. How does JWT authentication work in a React SPA?
1. Log in → POST credentials → the server returns a token. A **JWT** is `header.payload.signature`, base64-encoded and **signed, not encrypted**, so nothing secret goes in the payload.
2. Store the token (Q139).
3. Attach it to requests: `Authorization: Bearer <token>` via an axios interceptor or fetch wrapper.
4. Guard routes (Q106).
5. Handle expiry: catch **401** globally → refresh the token via a refresh endpoint → retry, or log out. (You can decode `exp` with `jwt-decode`.)
6. Log out: clear the token and invalidate it server-side.

### Q139. Where should you store the token?

| Storage | Pro | Con |
|---|---|---|
| `localStorage` | Simple, survives reload | **Any XSS can steal it** |
| In memory (state/context) | Not persisted anywhere | Still readable by XSS *while the page is open*; lost on reload → needs a silent refresh |
| **HttpOnly, Secure, SameSite cookie** | JS can't read it at all | Needs CSRF protection (SameSite + CSRF token); set by the server |

🎯 **Common senior answer:** short-lived access token in memory + refresh token in an HttpOnly cookie.

### Q140. What security issues should React developers know?
- React **escapes** values in JSX by default, so `{userInput}` is safe.
- `dangerouslySetInnerHTML` bypasses that → **sanitise** first (DOMPurify).
- `href={userUrl}` can be `javascript:...` → validate URL schemes.
- Client-side env vars are **public** (Q158). Never ship secrets.
- Auth checks in the UI are for UX only. **The server must enforce authorisation.**
- Server Actions are public endpoints (Q120).
- Add a Content Security Policy (CSP), keep dependencies patched, and audit the supply chain (`npm audit`, lockfiles).

---

## Part P — Styling

### Q141. What are the ways to style React components?

| Approach | Notes |
|---|---|
| Inline `style={{ ... }}` | Dynamic values only; no pseudo-classes or media queries |
| Plain / global CSS | Simple; global namespace clashes |
| **CSS Modules** (`Button.module.css`) | Class names scoped per file at build time (`Button_primary__a1b2c`) |
| **Tailwind CSS** | Utility classes; very popular; no naming problems |
| CSS-in-JS (styled-components, Emotion) | Dynamic styles via props; runtime cost and RSC friction → declining |
| Zero-runtime CSS-in-JS (vanilla-extract, Panda, StyleX) | Typed, extracted at build time |
| Component libraries | MUI, Ant Design, Chakra; headless options: Radix, React Aria, shadcn/ui |

```jsx
import styles from "./Button.module.css";
<button className={`${styles.btn} ${primary ? styles.primary : ""}`}>Save</button>
```

---

## Part Q — TypeScript with React

### Q142. How do you type props, state, refs and events?

```tsx
type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";             // union instead of enum
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"button">;    // inherit all native button props

function Button({ label, variant = "primary", ...rest }: ButtonProps) {
  return <button className={variant} {...rest}>{label}</button>;
}

const [user, setUser] = useState<User | null>(null);          // annotate when the initial value doesn't reveal the type
const inputRef = useRef<HTMLInputElement>(null);
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
```

### Q143. How do you write a generic component?

```tsx
function List<T>({ items, render }: { items: T[]; render: (item: T) => React.ReactNode }) {
  return <ul>{items.map(render)}</ul>;
}

<List items={users} render={u => <li key={u.id}>{u.name}</li>} />   // T inferred as User
```

Polymorphic components: Q76.

### Q144. What are the common TypeScript + React interview points?

| Q | A |
|---|---|
| `interface` vs `type` | Both describe shapes. `interface` merges declarations and can `extends`; `type` handles unions and intersections. Pick one convention per team. |
| `React.FC`? | Optional; most teams now type props directly. |
| `ReactNode` vs `ReactElement` vs `JSX.Element` | `ReactNode` = anything renderable (string, number, null, elements); use it for `children`. `ReactElement` = an element object only. |
| `any` vs `unknown` | `any` disables checking. `unknown` forces you to narrow before use. Prefer `unknown`. |
| `void` vs `never` | `void` = returns nothing. `never` = never returns (throws or loops forever). |
| Discriminated unions | `{ status: "loading" } \| { status: "success"; data: T } \| { status: "error"; error: Error }` models async state safely |
| Enums | Prefer string-literal unions (`"sm" \| "md"`), which are lighter and tree-shakeable |

---

## Part R — Testing

### Q145. How do you test React apps? (Stack & philosophy)
- **Stack:**
  - **Vitest** (with Vite) or **Jest** as the test runner
  - **React Testing Library** (RTL) + `@testing-library/user-event` for components
  - **MSW** to mock the network
  - **Playwright** or Cypress for E2E
- **Philosophy:** test what the **user** sees and does, not implementation details (no testing of internal state or hook calls).
- **Testing trophy:** many integration-style component tests, some unit tests for pure logic, a few critical-path E2E tests, and static analysis (TypeScript, ESLint) at the base.

### Q146. Show a component test.

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("increments the counter", async () => {
  const user = userEvent.setup();
  render(<Counter />);
  await user.click(screen.getByRole("button", { name: /increment/i }));
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});

test("loads user", async () => {
  render(<UserProfile id="1" />);                                  // network mocked with MSW
  expect(await screen.findByText("Ashish")).toBeInTheDocument();  // findBy* waits for async
});
```

### Q147. What are the key RTL concepts?

| Concept | Key point |
|---|---|
| Query priority | `getByRole` > `getByLabelText` > `getByText` > … > `getByTestId` (last resort) |
| `getBy` / `queryBy` / `findBy` | Throws if missing / returns null (for asserting absence) / async wait |
| `userEvent` vs `fireEvent` | `userEvent` simulates real interaction (focus, keystrokes). Prefer it |
| Mocking | `vi.fn()`/`jest.fn()` for callbacks; mock the **network with MSW** rather than mocking modules |
| Hooks | `renderHook()` from RTL |
| Enzyme | Dead; no React 18+ support |
| Beyond units | Vitest browser mode, Storybook interaction tests, visual regression (Chromatic) |

---

## Part S — Accessibility

### Q148. What are the accessibility essentials in React?

| Topic | Key point |
|---|---|
| Semantic HTML first | `<button>` not `<div onClick>`; `<nav>`, `<main>`, headings in order |
| Labels | Every input needs a `<label htmlFor>`; use `useId()` for SSR-safe IDs |
| Keyboard | Everything operable with Tab / Enter / Space / Esc; visible focus styles |
| Focus management | Move focus on route change and when a modal opens; restore it on close |
| ARIA | Only when HTML can't express it (`aria-expanded`, `aria-live`, `role="dialog"`). *No ARIA is better than bad ARIA.* |
| Live regions | `aria-live="polite"` for async status messages and toasts |
| Tools | `eslint-plugin-jsx-a11y`, axe DevTools, Lighthouse, screen readers (NVDA, VoiceOver) |

> Reference: the **WAI-ARIA Authoring Practices Guide (APG)** has the exact keyboard and ARIA spec for every widget.

### Q149. How do you build an accessible combobox / autocomplete?

```jsx
function Combobox({ options, onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));

  function onKeyDown(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && active >= 0) { onSelect(filtered[active]); setOpen(false); }
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div>
      <input
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
        onKeyDown={onKeyDown}
      />
      {open && (
        <ul id={listId} role="listbox">
          {filtered.map((o, i) => (
            <li key={o.value} id={`${listId}-${i}`} role="option" aria-selected={i === active}
                onMouseDown={() => { onSelect(o); setOpen(false); }}>
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- **Focus stays on the input**; `aria-activedescendant` tells screen readers which option is "virtually focused".
- `onMouseDown` (not `onClick`) so the input's blur doesn't close the list first.
- In production, add a proper label and announce result counts with an `aria-live` region.

### Q150. What is roving tabindex?
Used for toolbars, menus, tab lists and grids. Only **one** item in the group is tabbable (`tabIndex=0`); the rest get `-1`. Arrow keys move focus within the group, and Tab leaves it.

```jsx
function Toolbar({ items }) {
  const [focused, setFocused] = useState(0);
  const refs = useRef([]);

  function onKeyDown(e) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    const next = (focused + dir + items.length) % items.length;
    setFocused(next);
    refs.current[next].focus();
  }

  return (
    <div role="toolbar" onKeyDown={onKeyDown}>
      {items.map((item, i) => (
        <button key={item.id} ref={el => { refs.current[i] = el; }}
                tabIndex={i === focused ? 0 : -1} onClick={item.action}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
```

### Q151. How do you trap focus in a modal?
Tab and Shift+Tab must cycle **within** the dialog. Options:
- Find the first and last focusable elements and wrap focus around on Tab.
- Use the native **`<dialog>` + `showModal()`**: built-in focus containment, `Esc` handling and a backdrop.
- Use the `focus-trap-react` package.

Also set **`inert`** on background content and **restore focus** to the trigger on close (Q171).

---

## Part T — Error Handling & Observability

### Q152. How do you design error handling across an app?

| Layer | Catches | Tool |
|---|---|---|
| Error boundaries (route + widget level) | Render errors | `react-error-boundary` |
| `useErrorBoundary().showBoundary(err)` | Async/event errors you want shown in a boundary | `react-error-boundary` |
| Data layer | Fetch failures, retries | TanStack Query `onError`, retry, `throwOnError` |
| HTTP interceptors | 401 → refresh/logout, 5xx → toast | axios interceptors / fetch wrapper |
| Root options | Anything uncaught | `createRoot(el, { onUncaughtError, onCaughtError, onRecoverableError })` |
| Global | Non-React errors | `window.onerror`, `unhandledrejection` |

```jsx
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong: {error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

<ErrorBoundary
  FallbackComponent={Fallback}
  resetKeys={[userId]}                          // auto-reset when userId changes
  onError={(error, info) => reportToSentry(error, info.componentStack)}
>
  <UserPanel userId={userId} />
</ErrorBoundary>

// inside an event handler / async code:
const { showBoundary } = useErrorBoundary();
save().catch(showBoundary);
```

### Q153. How do you monitor a React app in production?
- **Errors:** Sentry (or similar) with source maps uploaded in CI, release tagging, and user/session context.
- **Real-user performance (RUM):**

```js
import { onLCP, onINP, onCLS } from "web-vitals";
const send = metric => navigator.sendBeacon("/analytics", JSON.stringify(metric));
onLCP(send); onINP(send); onCLS(send);
```

- **React-specific:** `<Profiler onRender>` can sample render timings in production builds with profiling enabled.
- **Session replay** (Sentry, LogRocket) with PII masking.

---

## Part U — State Machines, Animations & i18n

### Q154. How do you avoid "impossible states"? (State machines)
Boolean soup (`isLoading`, `isError`, `isSuccess`) allows impossible combinations, like loading *and* error at once. Model state as a **finite state machine** or **discriminated union**.

```jsx
const machine = {
  idle:    { FETCH: "loading" },
  loading: { RESOLVE: "success", REJECT: "error", CANCEL: "idle" },
  success: { FETCH: "loading" },
  error:   { RETRY: "loading" },
};

function reducer(state, event) {
  const next = machine[state.status][event.type];
  if (!next) return state;                         // invalid transition → ignored
  return {
    status: next,
    data: event.type === "RESOLVE" ? event.data : state.data,
    error: event.type === "REJECT" ? event.error : null,
  };
}

const [state, send] = useReducer(reducer, { status: "idle", data: null, error: null });
send({ type: "FETCH" });
```

For complex flows (checkout, wizards, uploads with pause/resume) use **XState**. It adds nested and parallel states, guards, delays and actors, plus a visual editor, so the diagram is the documentation.

### Q155. How do you animate in React, including exit animations?

| Tool | Use for |
|---|---|
| CSS transitions/animations | Most hover, enter and simple state animations. Cheapest; animate `transform`/`opacity` only |
| **Motion** (formerly Framer Motion), `motion/react` | Enter/exit, layout animations, gestures, springs |
| View Transitions API | Browser-native transitions between UI states (Q156) |

React removes elements immediately, so there's nothing left to animate on exit. `AnimatePresence` keeps them mounted until the exit animation finishes:

```jsx
import { motion, AnimatePresence } from "motion/react";

<AnimatePresence>
  {open && (
    <motion.div key="panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} />
  )}
</AnimatePresence>
```

♿ Respect `prefers-reduced-motion` (a CSS media query, or Motion's `useReducedMotion()`).

### Q156. How do you use the View Transitions API with React?

```jsx
import { flushSync } from "react-dom";

function withTransition(update) {
  if (!document.startViewTransition) return update();      // fallback: no animation
  document.startViewTransition(() => flushSync(update));   // DOM must update synchronously inside
}

<button onClick={() => withTransition(() => setView("grid"))}>Grid</button>
```

React's own `<ViewTransition>` component is **experimental/canary**; check its status before relying on it.

### Q157. How do you internationalise (i18n) a React app?

| Concern | Approach |
|---|---|
| Translations | `react-i18next` or `react-intl` (FormatJS); keys + **ICU message format** |
| Plurals & gender | ICU: `{count, plural, one {# item} other {# items}}`. Never `count + " items"` |
| Numbers, currency, dates | Native `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat` |
| Right-to-left languages | `<html dir="rtl">` + CSS **logical properties** (`margin-inline-start`) |
| Loading | Lazy-load translation bundles per locale/namespace |
| SSR | Detect the locale on the server (URL / `Accept-Language`); use the same locale on the client to avoid hydration mismatch |

```jsx
new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(123456.5);  // ₹1,23,456.50
new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date());             // 14 Oct 2026
```

Text can expand by 30–40% in some languages (German, for example), so design flexible layouts.

---

## Part V — Tooling, Env Vars & Deployment

### Q158. How do environment variables work in React apps?

| Tool | Prefix | Read with |
|---|---|---|
| Vite | `VITE_` | `import.meta.env.VITE_API_URL` |
| Next.js | `NEXT_PUBLIC_` (client) | `process.env.NEXT_PUBLIC_API_URL` |
| CRA (legacy) | `REACT_APP_` | `process.env.REACT_APP_API_URL` |

⚠️ Anything exposed to the client is baked into the bundle and **public**. Never put secrets there.

### Q159. How do you build and deploy a React app?
- `npm run build` → static files in `dist/` (Vite; `build/` for CRA).
- **SPA** → any static host (Vercel, Netlify, S3 + CloudFront, GitHub Pages). Configure a **fallback to `index.html`** so deep links don't 404.
- **SSR/RSC** → Node or edge hosting (Vercel, Netlify, containers).
- **CI/CD:** push → lint + type-check + test → build → preview deploy (PR) → production (merge to main).
- **Essential tooling:** ESLint (+ `react-hooks` plugin), Prettier, TypeScript, React DevTools, Vitest, Playwright.

---

## Part W — Class Components & Lifecycle

### Q160. How do class components work, and why does `this` need binding?

```jsx
class Counter extends React.Component {
  state = { count: 0 };                                     // class field, no constructor needed
  increment = () => this.setState(s => ({ count: s.count + 1 }));   // arrow field auto-binds `this`
  componentDidMount() { /* fetch, subscribe */ }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) { /* refetch */ }  // ALWAYS guard, or you get infinite loops
  }
  componentWillUnmount() { /* cleanup */ }
  render() { return <button onClick={this.increment}>{this.state.count}</button>; }
}
```

- With an explicit constructor you must call `super(props)` first.
- `this.setState` **shallow-merges** objects; use the updater form when building on previous state.
- Class methods aren't bound automatically, so `onClick={this.handle}` loses `this`. Fix it by binding in the constructor (`this.handle = this.handle.bind(this)`) or with an arrow-function class field.
- Classes are legacy, but still used for **error boundaries** and found in old code.

### Q161. What are the lifecycle phases and methods?
- **Mount:** `constructor` → `getDerivedStateFromProps` → `render` → `componentDidMount`
- **Update:** `getDerivedStateFromProps` → `shouldComponentUpdate` → `render` → `getSnapshotBeforeUpdate` → `componentDidUpdate`
- **Unmount:** `componentWillUnmount`
- **Error:** `getDerivedStateFromError` (render the fallback) + `componentDidCatch` (log)

| Method | When | Typical use |
|---|---|---|
| `componentDidMount` | Once, after the first render | API calls, subscriptions, timers |
| `componentDidUpdate(prevProps, prevState)` | After every update | Compare with previous values and refetch (guard it!) |
| `componentWillUnmount` | Before removal | Cleanup |
| `shouldComponentUpdate` | Before re-render | Return `false` to skip (performance) |
| `getSnapshotBeforeUpdate` | Right before DOM mutations | Capture scroll position |

### Q162. How do lifecycle methods map to hooks?

| Class | Hooks equivalent |
|---|---|
| `this.state` / `setState` (merge) | `useState` (replaces) / `useReducer` |
| `componentDidMount` | `useEffect(..., [])` |
| `componentDidUpdate` | `useEffect(..., [deps])` |
| `componentWillUnmount` | Effect cleanup function |
| `shouldComponentUpdate` / `PureComponent` | `React.memo` |
| `getDerivedStateFromProps` | Compute during render (or `key` reset) |
| `getSnapshotBeforeUpdate` | `useLayoutEffect` (roughly) |
| Error boundary methods | **None.** Still class-only |

---

## Part X — Build It From Scratch & Machine Coding

### Q163. Implement a mini `useState` and `useEffect`. (How hooks work)

```js
let hooks = [];
let index = 0;

function useState(initial) {
  const i = index++;
  if (!(i in hooks)) hooks[i] = typeof initial === "function" ? initial() : initial;
  const setState = next => {
    hooks[i] = typeof next === "function" ? next(hooks[i]) : next;
    rerender();
  };
  return [hooks[i], setState];
}

function useEffect(callback, deps) {
  const i = index++;
  const prev = hooks[i];
  const changed = !prev || !deps || deps.some((d, k) => !Object.is(d, prev.deps[k]));
  if (changed) {
    prev?.cleanup?.();
    // real React runs this AFTER commit; simplified here
    hooks[i] = { deps, cleanup: callback() };
  }
}

function rerender() {
  index = 0;            // ← why order matters: every render walks hooks from 0
  render(App());
}
```

### Q164. Implement a mini Redux store with `useSelector`.

```js
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach(l => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function useSelector(store, selector) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),   // must return a stable reference when unchanged
  );
}

// usage
const store = createStore(counterReducer, { count: 0 });
function Counter() {
  const count = useSelector(store, s => s.count);
  return <button onClick={() => store.dispatch({ type: "inc" })}>{count}</button>;
}
```

⚠️ A selector like `s => ({ a: s.a })` returns a new object every call and loops forever (Q40). Select primitives, or memoise the selector (`reselect` / `createSelector`).

### Q165. Implement Redux middleware (thunk + logger).

```js
function applyMiddleware(store, ...middlewares) {
  let dispatch = store.dispatch;
  middlewares.slice().reverse().forEach(mw => {
    dispatch = mw({ getState: store.getState, dispatch: a => dispatch(a) })(dispatch);
  });
  return { ...store, dispatch };
}

const thunk  = ({ dispatch, getState }) => next => action =>
  typeof action === "function" ? action(dispatch, getState) : next(action);

const logger = ({ getState }) => next => action => {
  console.log("prev", getState(), action);
  const result = next(action);
  console.log("next", getState());
  return result;
};
```

A middleware is `store => next => action`. Each layer wraps the next one's `dispatch`.

### Q166. Build a promise cache to use with `use()`. (Mini data layer)

```jsx
const cache = new Map();

function fetchOnce(url) {
  if (!cache.has(url)) {
    const p = fetch(url).then(r => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    });
    p.catch(() => cache.delete(url));     // don't cache failures forever
    cache.set(url, p);
  }
  return cache.get(url);                  // SAME promise every render → use() works
}

function User({ id }) {
  const user = use(fetchOnce(`/api/users/${id}`));
  return <h2>{user.name}</h2>;
}

<ErrorBoundary fallback={<p>Error</p>}>
  <Suspense fallback={<Spinner />}><User id="1" /></Suspense>
</ErrorBoundary>
```

Follow-ups to mention: invalidation, stale-while-revalidate, request dedup, memory limits (LRU). In other words, the reasons TanStack Query exists.

### Q167. Write a `useFetch` hook with status and abort.

```jsx
function useFetch(url) {
  const [state, setState] = useState({ status: "idle", data: null, error: null });

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setState(s => ({ ...s, status: "loading" }));
    fetch(url, { signal: controller.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then(data => setState({ status: "success", data, error: null }))
      .catch(error => {
        if (error.name !== "AbortError") setState({ status: "error", data: null, error });
      });
    return () => controller.abort();
  }, [url]);

  return state;
}
```

### Q168. Implement debounce and throttle, and use them correctly in React.

```js
function debounce(fn, ms) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn.apply(this, args); }
  };
}
```

⚠️ In React, create these **once** (`useMemo(() => debounce(save, 500), [])`) or they reset on every render. Read the latest props through a ref or `useEffectEvent`. For values, prefer a `useDebounce` hook (Q169).

### Q169. Build a debounced search box with race-condition safety.
This is the most common machine-coding question.

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const debouncedQ = useDebounce(q, 300);

  useEffect(() => {
    if (!debouncedQ) { setResults([]); return; }
    const controller = new AbortController();
    setStatus("loading");
    fetch(`/api/search?q=${encodeURIComponent(debouncedQ)}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(new Error(r.statusText)))
      .then(data => { setResults(data); setStatus("success"); })
      .catch(e => { if (e.name !== "AbortError") setStatus("error"); });
    return () => controller.abort();
  }, [debouncedQ]);

  return (
    <div>
      <label htmlFor="search">Search</label>
      <input id="search" value={q} onChange={e => setQ(e.target.value)} />
      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p role="alert">Something went wrong</p>}
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}
```

### Q170. Build infinite scroll with `IntersectionObserver`.

```jsx
function Feed() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`/api/posts?page=${page}`)
      .then(r => r.json())
      .then(data => {
        if (ignore) return;
        setItems(prev => [...prev, ...data.items]);
        setHasMore(data.hasMore);
      })
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [page]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPage(p => p + 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      {items.map(i => <article key={i.id}>{i.title}</article>)}
      {loading && <p>Loading…</p>}
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
    </>
  );
}
```

### Q171. Build an accessible modal (portal + Esc + focus restore).

```jsx
function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();
    const onKey = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();                  // restore focus
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
           tabIndex={-1} ref={dialogRef} onClick={e => e.stopPropagation()}>
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
```

Follow-ups: a full focus trap (Q151), a stable `onClose` from the parent (`useCallback`) so the effect doesn't re-run, or the native `<dialog>`.

### Q172. Build a recursive file tree.

```jsx
function Tree({ nodes }) {
  return (
    <ul>
      {nodes.map(n => <TreeNode key={n.id} node={n} />)}
    </ul>
  );
}
function TreeNode({ node }) {
  const [open, setOpen] = useState(false);
  const isFolder = Array.isArray(node.children);
  return (
    <li>
      <button type="button" onClick={() => isFolder && setOpen(o => !o)} aria-expanded={isFolder ? open : undefined}>
        {isFolder ? (open ? "📂" : "📁") : "📄"} {node.name}
      </button>
      {isFolder && open && <Tree nodes={node.children} />}
    </li>
  );
}
```

The same recursion pattern solves **nested comments** and **multi-level menus**.

### Q173. Which machine-coding problems should you practise, and how should you approach them?
**Common asks:**
- Debounced search, infinite scroll, todo with filters
- Modal, tabs/accordion, star rating
- Pagination table with sort and filter
- Countdown timer, OTP input, progress bar, traffic light
- File explorer, nested comments
- Autocomplete (Q149), drag-and-drop list

**Checklist (say these out loud to the interviewer):**
1. Clarify requirements and edge cases (empty, error, loading, very large data).
2. Sketch the component tree and **state shape** before coding.
3. Get the happy path working, then add edge cases.
4. Cleanup: timers, listeners, aborts.
5. Accessibility: semantic elements, labels, keyboard.
6. Mention what you'd add with more time: tests, memoisation, virtualisation, TypeScript types.

---

## Part Y — Architecture & System Design (Senior)

### Q174. How would you structure a large React app with 50+ developers?
- **Code organisation:**
  - Feature-based folders with a public `index.ts` API per feature (Q7)
  - Lint rules enforcing module boundaries
  - A monorepo (Nx / Turborepo) if several apps share code
- **Design system:** headless primitives + tokens (Q177).
- **Quality:** strict TypeScript.
- **State split by type** (Q96):
  - server state → TanStack Query
  - URL state → router
  - local state → hooks
  - rare global state → Zustand / RTK
- **Performance:** route-level code splitting.
- **CI:** type-check, tests and bundle-size budgets.
- **Errors and monitoring:** layered error boundaries + monitoring (Q152–Q153).

### Q175. CSR, SSR or RSC for a new product: how do you choose?

| Product | Choice |
|---|---|
| Internal dashboard behind auth | **CSR** (Vite SPA). Simplest, no SEO needs |
| Public, SEO-sensitive, content-heavy (e-commerce, marketing, blog) | **Next.js / React Router framework** with RSC + SSG/streaming |
| Mostly static docs or site | SSG or islands (Astro) |

Also weigh infrastructure cost, team skills and the caching strategy.

### Q176. When would you use micro-frontends?
- **Use them when** you have independent teams that need independent deploys. Implementations: Module Federation, single-spa, or iframes for strong isolation.
- **Costs:**
  - Duplicated dependencies (multiple React copies)
  - Shared-state complexity, routing coordination
  - UX and design-system consistency
  - Version conflicts

🎯 Usually a **modular monolith** with enforced boundaries is the better starting point. Add micro-frontends only when the organisation, not the code, demands it.

### Q177. How would you build a design system in React?
1. **Tokens** (colours, spacing, typography) as CSS variables.
2. **Headless, accessible primitives** (Radix / React Aria, or your own using Q73–Q78).
3. Styled components on top.
4. **Storybook** docs + interaction tests + visual regression (Chromatic).
5. A versioned package (semver), changelogs, **codemods** for breaking changes.
6. APIs: compound components, controlled + uncontrolled support, `asChild`/polymorphic, full a11y.

### Q178. How do you migrate a legacy app (jQuery / Angular / class components) to modern React?
Use an incremental **strangler** approach:
1. Add tests around the current behaviour first.
2. Mount React "islands" inside the old app (`createRoot` per widget).
3. Migrate route by route; share state through a thin bridge (events or a store).
4. Upgrade class components opportunistically (with codemods where possible).
5. Measure the impact as you go.

Never do a big-bang rewrite.

### Q179. Frontend system design: "Design an autocomplete / news feed / chat." What do you cover?
- **Requirements:** functional + non-functional (latency, scale, offline, a11y, devices).
- **Component tree** and **state shape** (classify the state, Q96).
- **API contract:** REST/GraphQL, pagination (cursor vs offset), error format.
- **Data layer:** caching, dedup, debounce + abort for races, optimistic updates.
- **Real-time:** WebSocket vs SSE vs polling (Q110).
- **Performance:** virtualisation, code splitting, image strategy, prefetching.
- **Accessibility:** the right ARIA pattern (combobox, feed, log), keyboard support.
- **Edge cases:** empty, error and loading states; offline; retries.
- **Observability:** metrics, error tracking, web-vitals.
- **Security:** XSS (user content), auth, rate limiting.

---

## Part Z — Summary — Mistakes, Decision Guide, Rules

### Q180. What are the most common React mistakes?

| ❌ Don't | ✅ Do |
|---|---|
| Mutate state (`arr.push`, `obj.x = 1`) | Create new objects/arrays |
| Index as key on dynamic lists | Stable IDs |
| `{count && <X/>}` with numbers | `{count > 0 && <X/>}` |
| Missing effect dependencies | Follow `exhaustive-deps`; restructure instead of silencing it |
| Effect + state for derived values | Compute during render |
| `async` effect callback | Async IIFE inside the effect + `AbortController` |
| Forget cleanup | Return cleanup for timers, listeners, sockets |
| Define components inside components | Define them at module level |
| One giant context with fast-changing data | Split contexts or use a selector-based store |
| `memo` / `useMemo` / `useCallback` everywhere | Profile first, or use the React Compiler |
| Store server data in Redux by hand | TanStack Query / framework loaders |
| `useState` / effects in a Server Component | Move that part into a `"use client"` component |
| Read state right after `setState` | Use the value you passed in, or the updater form |
| Unguarded `setState` in `componentDidUpdate` | Compare with the previous props/state first |
| `<div onClick>` for buttons | `<button>` |
| Trust Server Actions / UI auth checks | Validate and authorise on the server |

### Q181. Which API do I need? (Decision guide)

| Need | Use |
|---|---|
| Local state | `useState` / `useReducer` |
| Value derived from state/props | Compute in render (`useMemo` if expensive) |
| Sync with an external system | `useEffect` (+ cleanup) |
| Measure the DOM before paint | `useLayoutEffect` |
| Mutable value without re-render / DOM access | `useRef` |
| Shared slow-changing data | Context |
| Server data | TanStack Query / framework loaders / `use()` with a cached promise |
| Global, frequently updated client state | Zustand / Redux Toolkit |
| Filters, pagination | URL search params |
| Form submit + pending + errors | `useActionState` + `useFormStatus` |
| Instant feedback before the server confirms | `useOptimistic` |
| Keep input responsive during heavy updates | `useTransition` / `useDeferredValue` |
| Latest value in an effect without re-running it | `useEffectEvent` |
| Hide UI but keep its state | `<Activity>` |
| Subscribe to a non-React store | `useSyncExternalStore` |
| Smaller bundle | `lazy` + `Suspense`, Server Components |
| Modal / tooltip | `createPortal` |
| Catch render errors | Error boundary (`react-error-boundary`) |
| Reuse logic | Custom hook |
| Long lists | Virtualisation |
| Real-time | WebSocket (two-way) / SSE (one-way) |
| Auth-gated pages | Route guard + token in memory / HttpOnly cookie |
| Verify behaviour | Vitest/Jest + RTL + user-event + MSW |

### Q182. What are the 12 rules to remember?
1. **UI = f(state)**: never touch the DOM directly.
2. **State is a snapshot**: use updater functions when building on the previous value.
3. **Never mutate**: always create new objects and arrays.
4. **Derive, don't sync**: if you can compute it, don't store it.
5. **Effects are for external systems only**: user actions belong in handlers.
6. **Clean up everything** with a lifetime.
7. **Colocate state**: lift only when needed, and classify it (server/URL/local/global).
8. **Stable keys**: never use the index on dynamic lists.
9. **Measure before memoising**, or let the React Compiler handle it.
10. **Server state ≠ client state**: use a query library.
11. **Accessibility is not optional**: semantic HTML first.
12. **Test behaviour, not implementation**: RTL + user-event + MSW.

### Q183. Which JavaScript concepts does React rely on most? (Quick refresher)

| Concept | Why it matters in React |
|---|---|
| Closures | Every render's handlers capture that render's state → stale closures (Q51) |
| Reference equality (`Object.is`) | Re-render bailouts, `memo`, dependency arrays (Q23, Q36) |
| Immutability, spread/rest | State updates (`{...obj}`, `[...arr]`), prop forwarding (`...rest`) |
| Destructuring | `const [x, setX] = useState()`, `function C({ a, b })` |
| Arrow functions & `this` | Arrows inherit `this`, which is why they fix class handler binding (Q160) |
| Higher-order functions | `.map()` for lists, HOCs, middleware (Q165) |
| Pure functions | Render functions and reducers must be pure (Q19, Q44) |
| Promises / `async`–`await` | Data fetching, Actions, `use()`, Suspense. An `async` function always returns a Promise |
| ES modules & dynamic `import()` | Tree-shaking, code splitting (Q72, Q135) |
| Event loop (microtasks vs macrotasks) | Batching, `setTimeout(0)` vs `queueMicrotask`, yielding to the main thread (Q132) |

---

*End of guide. Revise one Part per day and re-read Part Z the day before an interview.*
