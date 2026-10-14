# React — Learn It & Crack the Interview

> A React guide for an experienced frontend engineer. It skips the JavaScript basics you already know and covers **how React thinks**, **why it works the way it does**, and **what senior interviews actually ask**.
>
> Current as of **React 19.2** (Oct 2025), **React Compiler 1.0** and **React Router v7**.
> Every section has the same parts: **Idea → Example → Gotchas → 🎯 Interview angle**.

---

## Table of Contents

0. [How to Use This Guide (3-Week Plan)](#0-how-to-use-this-guide-3-week-plan)
1. [The Mental Shift — React for Experienced Devs](#1-the-mental-shift--react-for-experienced-devs)
2. [JSX, Components & Props](#2-jsx-components--props)
3. [State & How Rendering Works](#3-state--how-rendering-works)
4. [Under the Hood — VDOM, Reconciliation, Fiber](#4-under-the-hood--vdom-reconciliation-fiber)
5. [Hooks — The Complete Set](#5-hooks--the-complete-set)
6. [Effects Deep Dive](#6-effects-deep-dive)
7. [Component Patterns](#7-component-patterns)
8. [Forms (Classic + React 19 Actions)](#8-forms-classic--react-19-actions)
9. [What's New in React 19 / 19.2](#9-whats-new-in-react-19--192)
10. [State Management](#10-state-management)
11. [Routing (React Router)](#11-routing-react-router)
12. [Data Fetching & Real-time](#12-data-fetching--real-time)
13. [Rendering Strategies — CSR, SSR, Server Components](#13-rendering-strategies--csr-ssr-server-components)
14. [Performance](#14-performance)
15. [Authentication & Security](#15-authentication--security)
16. [Styling](#16-styling)
17. [TypeScript with React](#17-typescript-with-react)
18. [Testing](#18-testing)
19. [Accessibility](#19-accessibility)
20. [Tooling, Env Vars & Deployment](#20-tooling-env-vars--deployment)
21. [Class Components & Lifecycle (Legacy, Still Asked)](#21-class-components--lifecycle-legacy-still-asked)
22. [Common Mistakes](#22-common-mistakes)
23. [Interview Q&A — Fundamentals](#23-interview-qa--fundamentals)
24. [Interview Q&A — Senior / Architecture](#24-interview-qa--senior--architecture)
25. [Machine-Coding Round — Solved Patterns](#25-machine-coding-round--solved-patterns)
26. [Decision Guide & One-Page Cheat Sheet](#26-decision-guide--one-page-cheat-sheet)

---

## 0. How to Use This Guide (3-Week Plan)

| Week | Focus | Sections | Practice |
|---|---|---|---|
| 1 | Core model | 1–6 | Build a todo app with filters, then a search box that fetches from an API (debounce + race-condition handling) |
| 2 | Real-app skills | 7–13 | Small app: routing, protected routes, a form with validation, a list with pagination, Context for the theme |
| 3 | Senior polish | 14–26 | Profile and optimise your app, write RTL tests, do 2 machine-coding problems a day against a timer (45–60 min) |

**Senior interviews usually have four rounds:**
1. **Fundamentals:** rendering, hooks, reconciliation (sections 3–6, 23)
2. **Machine coding:** build a widget live (section 25)
3. **Frontend system design:** architecture, state, performance, scale (sections 10, 13, 14, 24)
4. **Experience and behavioural:** your 12 years are the advantage here. Tie every answer back to real trade-offs you've made.

---

## 1. The Mental Shift — React for Experienced Devs

### The one formula to remember

```
UI = f(state)
```

You **never** touch the DOM to update the UI. You change **state**, React calls your component function again, and React works out the minimal set of DOM changes.

### Translate what you already know

| You know (jQuery / vanilla / Angular / Vue) | React equivalent | Note |
|---|---|---|
| `$('#el').text(x)` / `el.innerHTML = ...` | `setState(x)` → JSX re-renders | Never mutate the DOM directly |
| Angular two-way binding `[(ngModel)]` | Controlled input: `value` + `onChange` | Data flows **one way**: down via props, up via callbacks |
| Angular `@Input()` / `@Output()` | Props / callback props (`onSave`) | |
| Angular services + DI | Custom hooks + Context | |
| Angular `ngOnInit` / `ngOnDestroy` | `useEffect(() => { ...; return cleanup }, [])` | |
| Vue `computed` | Compute during render (or `useMemo` if expensive) | **Don't** store derived data in state |
| Vue `watch` | Usually **nothing**: derive or handle in the event. Use `useEffect` only for syncing with an external system | Most common beginner mistake |
| RxJS streams | Usually not needed; TanStack Query covers server state | |
| Templates (`*ngIf`, `v-for`) | Plain JS: `&&`, ternary, `.map()` | JSX is just JavaScript |
| Global event bus | Lift state up / Context / store | |

### React is a library, not a framework
React only handles the **view**. You choose the router, data fetching, forms and global state yourself, or you use a framework like **Next.js** or **React Router v7 (framework mode)** that bundles those choices.

🎯 **Interview:** *"Declarative vs imperative?"* Imperative means scripting each step (`createElement`, `appendChild`). Declarative means describing the end state and letting React work out the steps. The benefit is predictability: the UI is always a pure function of state, so there's no state/DOM drift.

---

## 2. JSX, Components & Props

### JSX
JSX is syntax sugar. A compiler (Babel, SWC or esbuild) turns it into function calls:

```jsx
<Button kind="primary">Save</Button>
// compiles to (new JSX transform):
jsx(Button, { kind: "primary", children: "Save" })
```

So JSX is **an expression that returns a plain object** (a "React element") describing the UI. Rules that follow from this:
- One root element per return → use a Fragment `<>...</>` to avoid wrapper divs.
- `className` instead of `class`, `htmlFor` instead of `for`, camelCase event handlers (`onClick`).
- `{}` embeds any JS **expression**, but not statements (no `if`/`for` inside JSX → use `&&`, ternary or `.map()`).

### Components
A component is a function that takes **props** and returns JSX. The name must be **Capitalised**, because lowercase means an HTML tag.

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

<UserCard name="Ashish"><button>Follow</button></UserCard>
```

### Props rules
- **Read-only.** Never mutate props.
- Data flows **down**. To send data **up**, the parent passes a callback:
  ```jsx
  function Parent() {
    const [selected, setSelected] = useState(null);
    return <List onSelect={setSelected} />;   // child calls onSelect(item)
  }
  ```
- `children` lets you compose: the parent decides what goes inside.

### Conditional rendering & lists

```jsx
{isLoading && <Spinner />}
{error ? <ErrorMsg /> : <Data />}

{users.map(u => <UserCard key={u.id} name={u.name} />)}
```

⚠️ **Gotcha:** `{count && <Badge />}` renders a literal **`0`** when count is 0. Use `{count > 0 && ...}`.

⚠️ **Keys:** use a stable, unique ID. Using the array **index** as the key breaks when the list is re-ordered, filtered or has items inserted, because React reuses the wrong component's state and DOM (for example, input text ends up in the wrong row). The index is only safe for static lists that never change.

🎯 **Interview:** *"State vs props?"* Props are inputs owned by the parent and read-only. State is memory owned by the component and changed via its setter. Both trigger a re-render when they change.

---

## 3. State & How Rendering Works

This section matters most. Get it right and most "tricky" React questions become easy.

### What triggers a render?
1. The component's **state changes** (via a setter)
2. Its **parent re-renders** (by default, children re-render even if their props didn't change)
3. A **context** it reads changes

Props changing is *not* a separate trigger. Props only change because the parent re-rendered.

### Render ≠ DOM update
- **Render phase:** React calls your function and builds a new element tree. This must be **pure** (no side effects).
- **Commit phase:** React applies the minimal DOM changes, then runs effects.

A component can render without changing the DOM at all.

### State is a snapshot

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

Each render has its **own** `count` constant. To build on the latest value, use an **updater function**:

```jsx
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);   // Result: 3
```

### Batching
React 18+ **batches** all state updates in the same tick (in event handlers, promises, `setTimeout` and native listeners) into **one** re-render. To force a synchronous update (rarely needed, e.g. scrolling to a just-added item), use `flushSync()` from `react-dom`.

### Immutability: never mutate state

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

React compares with `Object.is` (reference equality). Same reference means "nothing changed". (Libraries like **Immer** let you write "mutating" code that produces new objects; Redux Toolkit uses it internally.)

### Where should state live?
- **Colocate:** keep state in the lowest component that needs it.
- **Lift up:** if two siblings need it, move it to their closest common parent.
- **Derive, don't duplicate:** if something can be computed from props or state, compute it during render.

```jsx
// ❌ redundant state + effect to sync it
const [fullName, setFullName] = useState("");
useEffect(() => setFullName(first + " " + last), [first, last]);

// ✅ just compute it
const fullName = first + " " + last;
```

🎯 **Interview:** *"Why does my console.log show the old value after setState?"* State is a snapshot per render. The setter schedules a re-render with the new value, and the current function keeps its old constant.

---

## 4. Under the Hood — VDOM, Reconciliation, Fiber

### Virtual DOM
JSX produces plain JS objects describing the UI (the "virtual DOM"). On each render, React compares the new tree with the previous one and computes the **minimal real-DOM mutations** needed. Real DOM operations are expensive and JS object comparisons are cheap.

> Senior nuance: the VDOM isn't "faster than the DOM". Hand-written, optimal DOM code is faster. Its value is that you write **declarative** code and get *good-enough* performance without managing updates by hand.

### Reconciliation: the diffing rules
A full tree diff costs O(n³). React uses two **heuristics** to get to O(n):
1. **Different element type → throw away the whole subtree** and rebuild it (`<div>` → `<section>`, or `<ComponentA>` → `<ComponentB>`). All state below is lost.
2. **Keys** identify children across renders, so React can match, move or reuse them instead of recreating them.

**Practical consequences:**
- Changing a component's `key` **resets its state**, which is useful on purpose: `<Profile key={userId} />` gives a fresh form when the user changes.
- Never define a component *inside* another component. It's a new type on every render, so its state resets every time.

### Fiber (React 16+)
Fiber is React's reconciliation engine. Each component is a "fiber" (a unit of work). Rendering can be **split up, paused, prioritised and resumed**, which is what makes **concurrent rendering** possible:
- **Render phase:** interruptible, can be thrown away and restarted → it must be pure.
- **Commit phase:** synchronous, can't be interrupted → DOM updates + effects.

Urgent updates (typing) can interrupt non-urgent ones (filtering 10k rows). See `useTransition` in section 5.

### Synthetic events
React wraps native events in a cross-browser `SyntheticEvent`. Since React 17, listeners are attached to the **root container** instead of `document`, which makes micro-frontends and multiple React versions on one page safer. Event pooling was removed in v17.

🎯 **Interview:** *"Explain reconciliation."* React diffs the new element tree against the old one. A different type means remount, and the same type means updating props and recursing. Keys match list children. Then the commit phase applies the minimal DOM patch. Mention Fiber and interruptible rendering for senior depth.

---

## 5. Hooks — The Complete Set

### Rules of Hooks (and *why*)
1. Only call hooks at the **top level**: not in conditions, loops or nested functions.
2. Only call them from **components** or **custom hooks** (`useXxx`).

**Why:** React stores hook state in an **ordered list** per component. It matches state to hooks by **call order**. A conditional hook shifts the order and gives the wrong state to the wrong hook.
*(Exception: `use()` in React 19 may be called conditionally.)*

### Core hooks

| Hook | Use it for | Key gotcha |
|---|---|---|
| `useState` | Local state | Snapshot semantics; use the updater `setX(prev => ...)` when building on the old value |
| `useReducer` | Complex or related state transitions | Reducer must be pure; great for "state machine" logic |
| `useEffect` | Syncing with **external** systems (network, subscriptions, timers, DOM APIs) | Runs **after paint**. See section 6 |
| `useLayoutEffect` | Measuring or changing layout **before paint** (no flicker) | Blocks paint, so use it sparingly |
| `useContext` | Read a context value | Every consumer re-renders when the value changes |
| `useRef` | Mutable box that survives renders + DOM access | Changing `.current` does **not** re-render |
| `useMemo` | Cache an expensive **value** | Only for measurably expensive work |
| `useCallback` | Cache a **function's** identity | Only useful for memoised children or effect dependencies |
| `useId` | Stable unique IDs for a11y (`htmlFor`/`aria-*`), SSR-safe | Not for list keys |
| `useImperativeHandle` | Expose a custom API via ref (`focus()`, `reset()`) | Escape hatch; prefer props |
| `useDebugValue` | Label a custom hook in DevTools | Dev only |

### Concurrent & special hooks

| Hook | Use it for |
|---|---|
| `useTransition` | Mark **your own** state update as low-priority: `startTransition(() => setFilter(x))`. Gives you `isPending` |
| `useDeferredValue` | Get a **lagging copy** of a value (e.g. a prop) so a slow child doesn't block typing |
| `useSyncExternalStore` | Subscribe to a non-React store without "tearing" (used inside Redux/Zustand) |
| `useInsertionEffect` | CSS-in-JS libraries only (inject `<style>` early) |
| `useEffectEvent` (19.2) | Read the latest props/state inside an effect **without** making it a dependency. See section 6 |
| `use`, `useActionState`, `useOptimistic`, `useFormStatus` | React 19. See sections 8 and 9 |

### `useReducer` example

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

### `useRef`: two uses

```jsx
// 1. DOM access
const inputRef = useRef(null);
<input ref={inputRef} />;
inputRef.current.focus();

// 2. Mutable value that doesn't trigger a render (timer id, previous value, "is mounted")
const timerId = useRef(null);
timerId.current = setInterval(tick, 1000);
```

### Custom hooks: the main way to reuse logic

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

Custom hooks share **logic**, not **state**. Each component that calls the hook gets its own copy.

🎯 **Interview:** *"`useMemo` vs `useCallback`?"* `useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`. One caches a value, the other a function. *"`useTransition` vs `useDeferredValue`?"* Use `useTransition` when you own the setter and `useDeferredValue` when you only receive the value.

---

## 6. Effects Deep Dive

Effects are the **#1 source of React bugs** and the #1 topic interviewers probe.

### What an effect is for
**Syncing a component with something outside React**: network requests, subscriptions, timers, `document.title`, third-party widgets, analytics.

### Dependency array

```jsx
useEffect(() => { ... });            // after EVERY render (rarely what you want)
useEffect(() => { ... }, []);        // after mount only
useEffect(() => { ... }, [a, b]);    // after mount + whenever a or b changes (Object.is compare)
```

**Include every reactive value used inside.** The `eslint-plugin-react-hooks` `exhaustive-deps` rule enforces this, so trust it.

### Cleanup

```jsx
useEffect(() => {
  const id = setInterval(() => setSeconds(s => s + 1), 1000);
  return () => clearInterval(id);    // runs before the next effect AND on unmount
}, []);
```

Cleanup runs **before the effect re-runs** and on unmount. Anything with a lifetime (listeners, sockets, timers, subscriptions) must be cleaned up.

### StrictMode double-run (development only)
In dev, StrictMode runs mount → **cleanup → mount again** to expose missing cleanups. If your effect breaks when it runs twice, the bug is in the effect, not in StrictMode. Production runs it once.

### Fetching in an effect: handling race conditions

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

Without the abort, a fast click from id 1 → 2 can show **user 1's data** if request 1 resolves last.
> In real apps, use **TanStack Query** (or your framework's loader) instead of hand-rolling this. Interviewers love asking you to hand-roll it anyway.

### You probably don't need an effect

| Situation | ❌ Effect | ✅ Instead |
|---|---|---|
| Value computed from props/state | effect + setState | Compute during render |
| Expensive computation | effect + setState | `useMemo` |
| Reset state when a prop changes | effect watching the prop | `key={prop}` on the component |
| Respond to a user action (submit, click) | effect watching a flag | Do it in the **event handler** |
| Notify the parent of a change | effect calling `onChange` | Call `onChange` in the same handler |

### Stale closures & `useEffectEvent` (19.2)
Problem: you want to log the latest `theme` when connected, but `theme` changing shouldn't reconnect.

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

Before 19.2 the workaround was storing the latest value in a ref.

### `useEffect` vs `useLayoutEffect`
- `useEffect` runs **after** the browser paints and doesn't block it. Use it by default.
- `useLayoutEffect` runs **before** paint. Use it to measure the DOM (tooltip position) and avoid a visible flicker.

🎯 **Interview:** *"Effect vs event handler?"* Event handlers handle specific user actions. Effects handle synchronisation that should happen **because the component is displayed**. If the code runs "because the user clicked", it belongs in the handler.

---

## 7. Component Patterns

### Composition over inheritance
React has **no** component inheritance in practice. Reuse comes from:
- `children` and "slot" props (`header={<Title/>}`)
- Custom hooks (logic)
- Composition of small components

### Avoiding prop drilling, best option first
1. **Composition:** pass the *component* down rather than the data (`<Layout sidebar={<UserMenu user={user}/>} />`). This is often overlooked and is often the best fix.
2. **Context:** for widely needed, slowly changing data (theme, auth, locale).
3. **A state library:** for large, frequently updated global state.

### Controlled vs uncontrolled inputs

| | Controlled | Uncontrolled |
|---|---|---|
| Source of truth | React state (`value` + `onChange`) | The DOM (`defaultValue`, read via `ref` or `FormData`) |
| Good for | Instant validation, formatting, dependent fields | Simple forms, React 19 form Actions, performance |
| Gotcha | `value` without `onChange` → React **warns** and the field is read-only | Switching from undefined → defined `value` gives an "uncontrolled to controlled" warning |

### Compound components (very common in design-system questions)

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

// usage: flexible, readable API
<Tabs defaultValue="a">
  <Tabs.Tab value="a">Profile</Tabs.Tab>
  <Tabs.Tab value="b">Settings</Tabs.Tab>
  <Tabs.Panel value="a">...</Tabs.Panel>
  <Tabs.Panel value="b">...</Tabs.Panel>
</Tabs>
```

(In React 19 `<TabsContext value={...}>` replaces `<TabsContext.Provider value={...}>`, and `use(Context)` works like `useContext`.)

### Higher-Order Components (legacy, still asked)
A function that takes a component and returns an enhanced one.

```jsx
function withAuth(Component) {
  return function Protected(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return <Component {...props} />;
  };
}
```

Downsides: "wrapper hell", unclear prop sources, name clashes. **Custom hooks replaced most HOCs.** You'll still see them in old code and in `connect()` from react-redux.

### Render props (legacy)
`<Mouse render={pos => <Cursor {...pos} />} />`. The consumer controls rendering. Also mostly replaced by hooks.

### Fragments, Portals, StrictMode

| API | Purpose |
|---|---|
| `<>...</>` / `<Fragment key=...>` | Group without an extra DOM node (use the long form when you need a `key`) |
| `createPortal(jsx, domNode)` | Render outside the parent DOM (modals, toasts, tooltips). **React events still bubble through the React tree**, not the DOM tree |
| `<StrictMode>` | Dev-only checks: double render and double effect to find impure code |

### Error Boundaries
They catch errors during **rendering, lifecycle methods and constructors** of the subtree and show a fallback. They do **not** catch errors in event handlers, async code (`setTimeout`, promises) or the boundary itself.

Error boundaries are still **class-only**. In practice, use the `react-error-boundary` package:

```jsx
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Dashboard />
</ErrorBoundary>
```

### Lazy loading & Suspense

```jsx
const AdminPanel = lazy(() => import("./AdminPanel"));

<Suspense fallback={<Spinner />}>
  <AdminPanel />
</Suspense>
```

Split by **route** first, then by heavy, rarely used features (charts, editors, modals).

🎯 **Interview:** *"How would you design a reusable Modal?"* Portal to `document.body`, focus trap, return focus on close, `Esc` to close, `aria-modal`/`role="dialog"`, scroll lock, controlled `open` prop + `onClose`. Mention the native `<dialog>` element as an option.

---

## 8. Forms (Classic + React 19 Actions)

### Classic (still everywhere, and still in interviews)

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

### React 19 Actions: less boilerplate

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

What React handles for you: pending state, sequencing of submissions, and **automatically resetting uncontrolled fields** after a successful action.

### Real-world forms
For large forms, use **React Hook Form** (uncontrolled, minimal re-renders) + **Zod** (schema validation, shareable with the backend and TS-typed). Formik is older and controlled, with more re-renders.

---

## 9. What's New in React 19 / 19.2

### React 19 (Dec 2024)

| Feature | In one line |
|---|---|
| **Actions** | Async functions in transitions/forms. React tracks pending, errors and optimistic state |
| `useActionState` | `[state, formAction, isPending] = useActionState(fn, initial)`; `fn(prevState, formData)` |
| `useFormStatus` | `{ pending, data, method, action }` of the parent form (from `react-dom`) |
| `useOptimistic` | Show the expected result instantly; it reverts automatically if the Action fails |
| `use()` | Read a **Promise** (suspends until it resolves) or **Context** during render; can be conditional |
| **ref as a prop** | Function components receive `ref` like any prop, so `forwardRef` isn't needed |
| Ref cleanup | Ref callbacks can return a cleanup function |
| `<Context value>` | Use the context directly as the provider |
| Document metadata | `<title>`, `<meta>`, `<link>` anywhere in the tree are hoisted to `<head>` |
| Stylesheets | `<link rel="stylesheet" precedence="...">` dedupes styles and controls their order |
| Resource preloading | `preload`, `preinit`, `preconnect`, `prefetchDNS` from `react-dom` |
| Better hydration errors | One clear diff instead of many errors; tolerates elements injected by browser extensions |
| Root error options | `createRoot(el, { onCaughtError, onUncaughtError, onRecoverableError })` |
| Server Components & Server Functions | Stable (used via frameworks like Next.js). See section 13 |

### `useOptimistic` example

```jsx
const [optimisticTodos, addOptimistic] = useOptimistic(
  todos,
  (current, newTodo) => [...current, { ...newTodo, sending: true }]
);

async function add(formData) {
  const todo = { text: formData.get("text") };
  addOptimistic(todo);            // UI updates instantly
  await saveTodo(todo);           // if this throws, the optimistic item disappears
}
<form action={add}>...</form>
```

### `use()` gotcha
In a **Client** Component, don't create the promise during render (`use(fetch(...))`), because each render makes a new promise and it suspends forever. The promise must be **cached or stable**, usually created in a Server Component, a loader or a cache, and passed down.

### Removed / changed in React 19 (good "do you keep up?" questions)
- `ReactDOM.render` / `hydrate` removed → `createRoot` / `hydrateRoot`
- **`propTypes` checks removed**: they're silently ignored. Use TypeScript.
- `defaultProps` on function components removed → JS default parameters
- String refs and the legacy context API removed
- `act` moved to `react`; `react-test-renderer` deprecated

### React 19.1 / 19.2 (2025)

| Feature | In one line |
|---|---|
| `<Activity mode="visible\|hidden">` | Hide UI while **keeping its state** (tabs, back navigation) and pre-render hidden content at low priority |
| `useEffectEvent` | Non-reactive "event" logic inside effects (see section 6) |
| `cacheSignal` | (Server Components) know when a `cache()` lifetime ends, to abort work |
| Partial pre-rendering | Pre-render static parts, then resume with dynamic parts |
| Performance tracks | React-specific tracks in the Chrome DevTools Performance panel |

### React Compiler 1.0 (Oct 2025)
A build-time plugin that **automatically memoises** components and values, roughly what you'd do by hand with `memo`, `useMemo` and `useCallback`. With it enabled, most manual memoisation becomes unnecessary. It requires code that follows the Rules of React (pure render, no mutation). Expect the question *"How does the React Compiler change how you write code?"*

---

## 10. State Management

### Classify state first. Senior answers start here.

| Kind | Example | Tool |
|---|---|---|
| **Local UI state** | Open/closed, input text | `useState` / `useReducer` |
| **Shared UI state** | Theme, sidebar, current user | Context (or Zustand) |
| **Server state** (cache of backend data) | Users list, product details | **TanStack Query** / SWR / RTK Query / framework loaders |
| **URL state** | Filters, page, selected tab | Router search params, so it's shareable and bookmarkable |
| **Form state** | Field values, validation | React Hook Form / Actions |
| **Complex global client state** | Large editor, multi-step workflows | Redux Toolkit / Zustand |

> **Key insight:** most of what teams put in Redux was actually **server state**. Moving it to TanStack Query (caching, dedup, refetch, invalidation) usually removes most of the global store.

### Context API

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

**Context performance:** *every* consumer re-renders when the value changes. Mitigations:
- Split contexts (state context vs dispatch context, one per concern)
- Memoise the value object
- For high-frequency updates, use a store with **selectors** (Zustand, Redux)

Context is a **dependency-injection** mechanism, not a state manager. It just passes values down.

### Redux Toolkit (the modern Redux)

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

// component
const items = useSelector(s => s.cart.items);   // re-renders only when this slice changes
const dispatch = useDispatch();
dispatch(added(product));
```

Flow: **UI → dispatch(action) → reducer → new state → selectors → UI**. Async work goes through `createAsyncThunk` or **RTK Query**.

### Zustand (lightweight, very popular)

```jsx
const useCart = create(set => ({
  items: [],
  add: item => set(s => ({ items: [...s.items, item] })),
}));
const items = useCart(s => s.items);      // selector-based subscription
```

🎯 **Interview:** *"Redux vs Context?"* Context passes values down and every consumer re-renders on change. Redux and Zustand are stores with selector-based subscriptions, middleware, devtools and time-travel debugging. Pick by update frequency, team size and debugging needs.

---

## 11. Routing (React Router)

> **Versions:** v6 introduced `<Routes>`, `element` and `useNavigate`. **v7 (Nov 2024)** merged with Remix and is the current version: import from `"react-router"` (`react-router-dom` still works). It can run as a plain library (below) or as a full framework with loaders and SSR.

```jsx
import { BrowserRouter, Routes, Route, Link, NavLink, Outlet,
         useParams, useNavigate, useSearchParams, Navigate } from "react-router";

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="users/:id" element={<UserDetail />} />
      <Route element={<RequireAuth />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>

function Layout() {
  return <><nav><NavLink to="/">Home</NavLink></nav><Outlet /></>;   // Outlet = child route slot
}

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
```

| Need | API |
|---|---|
| Route params `/users/:id` | `const { id } = useParams()` |
| Query string `?page=2` | `const [params, setParams] = useSearchParams(); params.get("page")` |
| Navigate in code | `const navigate = useNavigate(); navigate("/login")` |
| Link with an active style | `<NavLink>` |
| Lazy route | `lazy(() => import(...))` + Suspense, or route `lazy` in data routers |

v5 → v6 changes, in case you're asked about old codebases: `<Switch>` → `<Routes>`, `component=` → `element=`, `useHistory` → `useNavigate`, `<Redirect>` → `<Navigate>`.

---

## 12. Data Fetching & Real-time

### `fetch` vs `axios`

| | `fetch` | `axios` |
|---|---|---|
| Built-in | ✅ native | 3rd-party |
| JSON | `await res.json()` | Automatic |
| HTTP errors | **Doesn't reject on 4xx/5xx**, so check `res.ok` | Rejects on non-2xx |
| Interceptors | Write a wrapper | Built-in (auth headers, 401 handling) |
| Cancel | `AbortController` | `AbortController` (`signal`) |

### TanStack Query (the real-world standard)

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

You get caching, dedup, background refetch, retries, pagination, infinite queries and optimistic updates without writing any of it.

### Pagination & infinite scroll

| Style | How |
|---|---|
| Page-based | `page` in state or **URL**; fetch `?page=2&limit=20`; **replace** the list |
| Cursor / infinite | Keep `cursor` + `hasMore`; an `IntersectionObserver` on a sentinel element fetches the next page and **appends** it |

Use `IntersectionObserver` rather than scroll listeners (no layout thrash). For 1,000+ rows, **virtualise** (`@tanstack/react-virtual`, `react-window`).

### WebSockets & SSE

```jsx
useEffect(() => {
  const ws = new WebSocket("wss://example.com/live");
  ws.onmessage = e => setMessages(prev => [...prev, JSON.parse(e.data)]);
  return () => ws.close();                    // always clean up
}, []);
```

- **WebSocket:** two-way (chat, collaboration).
- **SSE (`EventSource`):** server → client only (notifications, live feeds, LLM streaming); simpler and auto-reconnects.
- In production: reconnect with backoff, heartbeats, and usually push incoming messages into your query cache or store.

---

## 13. Rendering Strategies — CSR, SSR, Server Components

| Mode | Where it renders | JS shipped | Best for |
|---|---|---|---|
| **CSR** (client-side rendering) | Browser | All of it | Dashboards and apps behind a login |
| **SSR** (server-side rendering) | Server HTML per request → **hydrated** in the browser | All of it | SEO + fast first paint for dynamic pages |
| **SSG** (static generation) | At build time | All of it | Marketing pages, docs, blogs |
| **Streaming SSR** | Server sends HTML in chunks as `<Suspense>` boundaries resolve | All of it | Slow data shouldn't block the whole page |
| **React Server Components (RSC)** | Server only | **Zero** for those components | Data-heavy, mostly-static UI |

**Hydration:** React attaches event handlers and state to server-rendered HTML. Mismatches between server and client output (dates, `Math.random()`, `window` checks) cause hydration errors.

### Server vs Client Components (Next.js App Router etc.)

| | Server Component (default) | Client Component (`"use client"`) |
|---|---|---|
| Runs | Server only | Server (SSR) + browser |
| Can `async/await` data directly | ✅ | ❌ (use `use()`/query libraries) |
| Hooks, state, effects, event handlers | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Access DB / secrets | ✅ | ❌ |

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

- `"use client"` marks a **boundary**: that module and everything it imports become client code.
- Server Components can render Client Components, and can pass Server Components to them as `children`.
- `"use server"` marks **Server Functions** (Actions) that the client can call, e.g. as a form `action`.
- Loading and error states: `<Suspense fallback>` + error boundaries (Next.js adds the `loading.js` / `error.js` file conventions; those are Next.js, not React).

🎯 **Interview:** *"SSR vs RSC?"* SSR renders components to HTML, but all of their JS still ships and hydrates. RSC components never ship JS; only their rendered output is sent. They work together.

---

## 14. Performance

### Method: measure → fix structure → memoise last
1. **Measure:** React DevTools Profiler ("why did this render?"), the Chrome Performance panel (React tracks in 19.2), Lighthouse, Core Web Vitals (**LCP, INP, CLS**).
2. **Fix the structure:**
   - Move state **down**, close to where it's used
   - Lift content **up**: pass expensive children as `children` so they don't re-render with the parent's state
   - Split large contexts
   - Derive instead of syncing
3. **Then memoise** where it measurably helps (or let the **React Compiler** do it).

### Memoisation toolkit

```jsx
const Row = memo(function Row({ item, onSelect }) { ... });   // skip render if props are shallow-equal

const sorted = useMemo(() => sortBig(items), [items]);         // expensive value
const handleSelect = useCallback(id => setSel(id), []);        // stable function for memo children
```

`memo` is useless if you pass a **new object, array or function** every render (`style={{...}}`, `onClick={() => ...}`), because shallow comparison fails. That's why `useCallback` and `useMemo` exist.

### Other tools

| Technique | Why |
|---|---|
| Code splitting (`lazy`, route-level) | Smaller initial bundle → better LCP |
| Virtualisation | Render only visible rows of big lists |
| `useTransition` / `useDeferredValue` | Keep typing responsive while expensive UI updates (improves INP) |
| Debounce / throttle | Fewer requests and renders for search and scroll |
| Image optimisation | `loading="lazy"`, proper sizes, modern formats |
| Bundle analysis | `rollup-plugin-visualizer` / `source-map-explorer`; remove heavy dependencies |
| `<Activity>` (19.2) | Keep hidden tabs' state without re-mounting cost |

### `memo` demo

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

🎯 **Interview:** *"A page feels slow. How do you debug it?"* Reproduce it, then profile (React Profiler + Performance panel). Identify whether the cost is **network**, **JS/bundle**, **render count** or **render cost**. Apply the matching fix: caching/prefetch, code-split, move state, memoise, virtualise or use a transition. Re-measure afterwards.

---

## 15. Authentication & Security

### JWT flow in an SPA
1. Log in → POST credentials → the server returns a token (a JWT: `header.payload.signature`, **signed, not encrypted**, so nothing secret goes in the payload).
2. Store it (trade-offs below).
3. Attach it to requests: `Authorization: Bearer <token>` (axios interceptor / fetch wrapper).
4. Guard routes (`RequireAuth` in section 11).
5. Handle expiry: catch **401** globally → refresh the token via a refresh endpoint → retry, or log out.
6. Log out: clear the token and invalidate it server-side.

| Storage | Pro | Con |
|---|---|---|
| `localStorage` | Simple, survives reload | **Any XSS can steal it** |
| In memory (state/context) | Not persisted anywhere | Still readable by XSS *while the page is open*; lost on reload → needs a silent refresh |
| **HttpOnly, Secure, SameSite cookie** | JS can't read it at all | Needs CSRF protection (SameSite + CSRF token); set by the server |

**Common senior answer:** short-lived access token in memory + refresh token in an HttpOnly cookie.

### React security notes
- React **escapes** values in JSX by default, so `{userInput}` is safe.
- `dangerouslySetInnerHTML` bypasses that → **sanitise** (DOMPurify) first.
- `href={userUrl}` can be `javascript:...` → validate URLs.
- Client-side env vars are **public** (section 20).
- Auth checks in the UI are for UX only. **The server must enforce authorisation.**

---

## 16. Styling

| Approach | Notes |
|---|---|
| Plain CSS / global stylesheets | Simple; global namespace clashes |
| **CSS Modules** (`Button.module.css`) | Class names scoped per file at build time (`Button_primary__a1b2c`) |
| **Tailwind CSS** | Utility classes; very popular; no naming problems |
| CSS-in-JS (styled-components, Emotion) | Dynamic styles via props; runtime cost and RSC friction → declining |
| Zero-runtime CSS-in-JS (vanilla-extract, Panda, StyleX) | Typed, extracted at build time |
| Inline `style={{ ... }}` | Dynamic values only; no pseudo-classes or media queries |
| Component libraries | MUI, Ant Design, Chakra; headless options: Radix, React Aria, shadcn/ui |

```jsx
import styles from "./Button.module.css";
<button className={`${styles.btn} ${primary ? styles.primary : ""}`}>Save</button>
```

---

## 17. TypeScript with React

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

// Generic component
function List<T>({ items, render }: { items: T[]; render: (item: T) => React.ReactNode }) {
  return <ul>{items.map(render)}</ul>;
}
```

| Q | A |
|---|---|
| `interface` vs `type` | Both describe shapes. `interface` merges declarations and can `extends`; `type` handles unions and intersections. Pick one convention per team. |
| `React.FC`? | Optional; most teams now type props directly (as above). |
| `ReactNode` vs `ReactElement` vs `JSX.Element` | `ReactNode` = anything renderable (string, number, null, elements); use it for `children`. `ReactElement` = an element object only. |
| `any` vs `unknown` | `unknown` forces you to narrow before use. Prefer it. |
| Discriminated unions | `{ status: "loading" } \| { status: "success"; data: T } \| { status: "error"; error: Error }` models async state safely |

---

## 18. Testing

**Stack:** **Vitest** (with Vite) or **Jest** + **React Testing Library** (RTL) + `@testing-library/user-event`. **MSW** mocks the network. **Playwright** or Cypress handle E2E.

**Philosophy:** test what the **user** sees and does, not implementation details (no testing of internal state or hook calls).

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
  render(<UserProfile id="1" />);
  expect(await screen.findByText("Ashish")).toBeInTheDocument();  // findBy* waits for async
});
```

| Concept | Key point |
|---|---|
| Query priority | `getByRole` > `getByLabelText` > `getByText` > … > `getByTestId` (last resort) |
| `getBy` / `queryBy` / `findBy` | Throws if missing / returns null (use it for asserting absence) / async wait |
| `userEvent` vs `fireEvent` | `userEvent` simulates real interaction (focus, keystrokes). Prefer it |
| Mocking | `vi.fn()`/`jest.fn()` for callbacks; mock the **network with MSW** rather than mocking modules |
| Hooks | `renderHook()` from RTL |
| Enzyme | Dead; no React 18+ support |

**Testing pyramid / trophy:** many integration-style component tests, some unit tests for pure logic, a few critical-path E2E tests.

---

## 19. Accessibility

| Topic | Key point |
|---|---|
| Semantic HTML first | `<button>` not `<div onClick>`; `<nav>`, `<main>`, headings in order |
| Labels | Every input needs a `<label htmlFor>`; use `useId()` for SSR-safe IDs |
| Keyboard | Everything operable with Tab / Enter / Space / Esc; visible focus styles |
| Focus management | Move focus on route change and when a modal opens; trap focus in modals; restore it on close |
| ARIA | Only when HTML can't express it (`aria-expanded`, `aria-live`, `role="dialog"`). *No ARIA is better than bad ARIA.* |
| Live regions | `aria-live="polite"` for async status messages and toasts |
| Tools | `eslint-plugin-jsx-a11y`, axe DevTools, Lighthouse, screen readers (NVDA, VoiceOver) |

---

## 20. Tooling, Env Vars & Deployment

### Starting a project in 2025+
- **Vite:** `npm create vite@latest my-app -- --template react-ts` → `npm run dev`
- **Framework:** Next.js, React Router v7 (framework mode)
- ⚠️ **Create React App was deprecated in Feb 2025.** You'll only meet it in legacy projects.

### Structure (Vite)
```
index.html          ← single page with <div id="root">
src/main.tsx        ← createRoot(document.getElementById("root")).render(<StrictMode><App/></StrictMode>)
src/App.tsx         ← root component
public/             ← static files served as-is
```

**Feature-based folders** scale better than type-based ones in large apps:
```
src/features/cart/{components,hooks,api,cart.slice.ts,index.ts}
src/shared/{ui,lib,hooks}
```

### Env vars

| Tool | Prefix | Read with |
|---|---|---|
| Vite | `VITE_` | `import.meta.env.VITE_API_URL` |
| Next.js | `NEXT_PUBLIC_` (client) | `process.env.NEXT_PUBLIC_API_URL` |
| CRA (legacy) | `REACT_APP_` | `process.env.REACT_APP_API_URL` |

⚠️ Anything exposed to the client is **public**. Never put secrets there.

### Build & deploy
- `npm run build` → static files in `dist/` (Vite).
- SPA → any static host (Vercel, Netlify, S3 + CloudFront, GitHub Pages). Configure a **fallback to `index.html`** so deep links work.
- SSR/RSC → Node or edge hosting (Vercel, Netlify, containers).
- CI/CD: push → lint + type-check + test → build → preview deploy (PR) → production (main).

### Essential tooling
ESLint (+ `react-hooks` plugin), Prettier, TypeScript, React DevTools, Vitest, Playwright.

---

## 21. Class Components & Lifecycle (Legacy, Still Asked)

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

### Lifecycle phases
- **Mount:** `constructor` → `getDerivedStateFromProps` → `render` → `componentDidMount`
- **Update:** `getDerivedStateFromProps` → `shouldComponentUpdate` → `render` → `getSnapshotBeforeUpdate` → `componentDidUpdate`
- **Unmount:** `componentWillUnmount`
- **Error:** `getDerivedStateFromError` (render the fallback) + `componentDidCatch` (log)

| Class | Hooks equivalent |
|---|---|
| `this.state` / `setState` (shallow merge) | `useState` (replaces the value, doesn't merge) |
| `componentDidMount` | `useEffect(..., [])` |
| `componentDidUpdate` | `useEffect(..., [deps])` |
| `componentWillUnmount` | Effect cleanup function |
| `shouldComponentUpdate` / `PureComponent` | `React.memo` |
| `getSnapshotBeforeUpdate` | `useLayoutEffect` (roughly) |
| Error boundary methods | **None.** Still class-only |

**Why `this` binding?** Class methods aren't bound automatically, so `onClick={this.handle}` loses `this`. Fix it by binding in the constructor or with an arrow-function class field.

---

## 22. Common Mistakes

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
| `memo` / `useMemo` / `useCallback` everywhere | Profile first (or use the React Compiler) |
| Store server data in Redux by hand | TanStack Query / framework loaders |
| `useState` / effects in a Server Component | Move that part into a `"use client"` component |
| Read state right after `setState` | Use the value you passed in, or the updater form |
| `<div onClick>` for buttons | `<button>` |

---

## 23. Interview Q&A — Fundamentals

1. **What is React?** A declarative, component-based library for building UIs. UI = f(state).
2. **Virtual DOM?** An in-memory JS object tree describing the UI. React diffs the old and new trees and applies minimal real-DOM updates.
3. **Reconciliation?** The diff algorithm: different type → remount the subtree; same type → update and recurse; keys match list items. O(n) heuristics.
4. **Fiber?** The reconciliation engine since React 16. Work is split into units that can be paused and prioritised, which enables concurrent rendering.
5. **Render vs commit phase?** Render is pure, interruptible and computes changes. Commit is synchronous, applies DOM changes and runs effects.
6. **Why keys?** They identify list items across renders. The wrong key causes lost or misplaced state and wasted DOM work.
7. **State vs props?** Props are read-only inputs from the parent. State is the component's own memory and changes via its setter.
8. **Why can't hooks be conditional?** React tracks hooks by call order; conditions break the order.
9. **Why is `setState` "async"?** Updates are batched and applied on the next render. The current render's variables are a snapshot.
10. **Automatic batching?** React 18+ batches updates everywhere (promises, timeouts, native events). `flushSync` opts out.
11. **Controlled vs uncontrolled?** React state vs the DOM as the source of truth.
12. **`useEffect` vs `useLayoutEffect`?** After paint (non-blocking) vs before paint (for measuring layout).
13. **`useMemo` vs `useCallback` vs `memo`?** Cache a value / cache a function / skip a component's re-render when its props are shallow-equal.
14. **`useRef` vs `useState`?** Both persist across renders; only state changes trigger a re-render.
15. **Context drawbacks?** All consumers re-render on value change; it isn't a state manager.
16. **Prop drilling fixes?** Composition, Context, or a store.
17. **What is a HOC?** A function that wraps a component to add behaviour. Mostly replaced by custom hooks.
18. **Portal?** Renders into another DOM node; events still bubble through the React tree.
19. **Error boundary?** A class component that catches render errors in its subtree. It doesn't catch event-handler or async errors.
20. **StrictMode?** Dev-only: double render and effect mount/cleanup/mount to catch impurity and missing cleanup.
21. **Synthetic events?** A cross-browser wrapper, delegated at the root container since React 17; no pooling.
22. **Lazy loading?** `lazy(() => import())` + `<Suspense>` to split bundles.
23. **What's new in React 19?** Actions, `useActionState`, `useOptimistic`, `useFormStatus`, `use()`, ref as a prop, `<Context>` as provider, metadata hoisting, RSC stable.
24. **What's in 19.2?** `<Activity>`, `useEffectEvent`, `cacheSignal`, partial pre-rendering, DevTools performance tracks.
25. **React Compiler?** A build-time plugin that auto-memoises; needs pure, rule-following code.
26. **`useTransition` vs `useDeferredValue`?** You own the update vs you only have the value.
27. **Server vs Client Components?** Server: no JS shipped, async data, no hooks. Client: interactive, ships JS.
28. **SSR vs CSR vs SSG?** Per-request server HTML vs browser rendering vs build-time HTML.
29. **Hydration?** Attaching React to server-rendered HTML; mismatches cause errors.
30. **How do you test components?** RTL + user-event: query by role, assert on visible output, mock the network with MSW.

---

## 24. Interview Q&A — Senior / Architecture

These are where 12 years of experience pays off. Structure answers as **requirements → options → trade-offs → choice → how you'd measure it**.

**Q: How would you structure a large React app (50+ devs)?**
Feature-based folders with public `index.ts` APIs per feature; a shared design system (headless primitives + tokens); strict TypeScript; lint rules enforcing module boundaries; state split by type (server state → TanStack Query, URL state → router, local → hooks, rare global → Zustand/RTK); route-level code splitting; a monorepo (Nx/Turborepo) if several apps share code; CI with type-check, tests and bundle-size budgets.

**Q: How do you decide on a state management solution?**
Classify the state first (section 10). Most "global state" is server cache. Use a store only for real cross-cutting client state; pick it by update frequency, devtools needs and team familiarity.

**Q: The app re-renders too much. Walk me through fixing it.**
Profile with "highlight updates" and the Profiler, then find the trigger: a parent state change, a context value or new prop references. Fix the structure first (colocate state, lift children up as `children`, split contexts, use selectors), then memoise, or rely on the React Compiler.

**Q: How do you handle errors across the app?**
Route-level and widget-level error boundaries (`react-error-boundary`); root `onUncaughtError` reporting to Sentry; a TanStack Query global `onError`; HTTP interceptors for 401/403/5xx; user-friendly fallbacks with retry.

**Q: CSR vs SSR vs RSC for a new product?**
Internal dashboard behind auth → CSR (Vite SPA), simplest. Public, SEO-sensitive, content-heavy → Next.js with RSC/SSG/streaming. Consider infrastructure cost, team skills and caching strategy.

**Q: Micro-frontends?**
Useful for independent teams and deploys (Module Federation, single-spa, or iframes for isolation). Costs: duplicated dependencies, shared-state complexity, consistency of UX and the design system. Usually a **modular monolith** is the better starting point.

**Q: How do you build a design system in React?**
Tokens (CSS variables) → headless accessible primitives (Radix / React Aria) → styled components → Storybook docs + visual regression tests (Chromatic) → versioned package → codemods for breaking changes. Use compound components and `asChild`/polymorphic APIs for flexibility.

**Q: How do you migrate a legacy app (jQuery / Angular / class components) to modern React?**
Incremental "strangler" approach: mount React roots inside the old app (`createRoot` per island), migrate route by route, share state through a thin bridge, add tests around the behaviour first. Never do a big-bang rewrite.

**Q: How would you improve INP / LCP?**
LCP: SSR/SSG, preload the hero image, code split, CDN, fewer render-blocking resources. INP: break up long tasks, `useTransition` for expensive updates, debounce, virtualisation, move work off the main thread (Web Workers), reduce hydration cost (RSC, islands).

**Q: Frontend system design: "Design an autocomplete / news feed / chat."**
Cover: component tree, state shape, API contract (pagination/cursors), caching, debounce + abort for races, optimistic updates, real-time transport (WebSocket/SSE), virtualisation, a11y (combobox ARIA pattern, keyboard), error and empty states, offline behaviour, and metrics.

---

## 25. Machine-Coding Round — Solved Patterns

Typical asks: **debounced search, infinite scroll, todo with filters, modal, tabs/accordion, star rating, pagination table with sort/filter, countdown timer, file explorer (recursive tree), OTP input, progress bar, traffic light, nested comments.**

### `useDebounce` (used in search boxes)

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
```

### Search with debounce + race-condition safety

```jsx
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

### Infinite scroll with `IntersectionObserver`

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

### Accessible modal (portal + Esc + focus)

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

(Mention a full **focus trap** — keeping Tab inside the modal — as a follow-up, or the native `<dialog>` element with `showModal()`.)

### Recursive file tree

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
      <span onClick={() => isFolder && setOpen(o => !o)}>
        {isFolder ? (open ? "📂" : "📁") : "📄"} {node.name}
      </span>
      {isFolder && open && <Tree nodes={node.children} />}
    </li>
  );
}
```

### Machine-coding checklist (say these out loud to the interviewer)
1. Clarify requirements and edge cases (empty, error, loading, very large data).
2. Sketch the component tree and **state shape** before coding.
3. Get the happy path working, then add edge cases.
4. Cleanup: timers, listeners, aborts.
5. A11y: semantic elements, labels, keyboard.
6. Mention what you'd add with more time: tests, memoisation, virtualisation, TypeScript types.

---

## 26. Decision Guide & One-Page Cheat Sheet

### Which API do I need?

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
| Smaller bundle | `lazy` + `Suspense`, Server Components |
| Modal / tooltip | `createPortal` |
| Catch render errors | Error boundary (`react-error-boundary`) |
| Reuse logic | Custom hook |
| Long lists | Virtualisation |
| Real-time | WebSocket (two-way) / SSE (one-way) |

### The 12 rules to remember
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

---

*Related notes (in the original repo): `../redux/redux.md` (Redux deep dive), `../../nextjs/nextjs.md` (Next.js).*
