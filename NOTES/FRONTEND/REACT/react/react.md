## Part A — Fundamentals & Mental Model

### R-1. What is React, and why use it?

A JavaScript **library** (not a framework) for building UIs from reusable **components**. It's **declarative**: you describe the UI for a state, React updates the DOM.

**Real-life:** you tell a painter "make the wall blue"; you don't explain every brush stroke.

```
UI = f(state)
```

| Pros | Cons |
|---|---|
| Reusable components | Only the view layer (you pick router, state, data tools) |
| Predictable UI | Overkill for small static sites |
| Huge ecosystem, React Native | Ecosystem changes often |

🎯 **Interview:** "React is the view layer; frameworks like Next.js or React Router v7 add routing, data loading and SSR."

### R-2. Declarative vs imperative?

- **Imperative:** step by step (`createElement`, `appendChild`, `classList.add`).
- **Declarative:** describe the end result; React finds the steps.

**Real-life:** imperative = giving a taxi driver every turn. Declarative = just saying the address.

🎯 **Interview:** the benefit is **predictability**: UI is always a function of state, so the DOM can't drift out of sync.

### R-3. How does React map to jQuery / Angular / Vue?

| You know | React |
|---|---|
| `$('#el').text(x)` | `setState(x)` → re-render |
| Angular two-way `[(ngModel)]` | controlled input: `value` + `onChange` (one-way flow) |
| `@Input()` / `@Output()` | props / callback props |
| Services + DI | custom hooks + Context |
| `ngOnInit` / `ngOnDestroy` | `useEffect(() => { ...; return cleanup }, [])` |
| Vue `computed` | compute during render (`useMemo` if expensive) |
| Vue `watch` | usually **nothing**: derive or handle in the event |
| `*ngIf`, `v-for` | `&&`, ternary, `.map()` |

🎯 **Interview:** the most common mistake from experienced devs is using `useEffect` like `watch`.

### R-4. What is a SPA?

One HTML page (`<div id="root">`); JS swaps the content on navigation without full reloads.

**Real-life:** a TV that changes channels without turning off and on again.

🎯 **Interview:** client-side routing (React Router) maps URLs to components.

### R-5. React vs Angular?

| | React | Angular |
|---|---|---|
| Type | library | full framework |
| Binding | one-way | two-way available |
| Language | JS/TS + JSX | TypeScript + templates |
| Built-ins | pick your own | router, HTTP, forms, DI |

**Real-life:** React = buying furniture piece by piece. Angular = a fully furnished flat.

### R-6. React vs React Native?

- **React (react-dom):** web, HTML + CSS.
- **React Native:** mobile apps with native `View`, `Text`.

Same components, hooks and state; **different renderers**.

**Real-life:** same recipe, cooked in an oven vs on a grill.

### R-7. How do you set up a React project today?

```bash
npm create vite@latest my-app -- --template react-ts
```

Or a framework: **Next.js** / **React Router v7 framework mode**.

⚠️ Create React App was **deprecated in Feb 2025**.

```
index.html     → <div id="root">
src/main.tsx   → createRoot(...).render(<StrictMode><App/></StrictMode>)
src/App.tsx    → root component
public/        → static files
```

**Feature-based folders** scale better: `src/features/cart/{components,hooks,api}`.

**Real-life:** organise a supermarket by aisle (dairy, bakery), not by "all boxes" and "all bottles".

### R-8. What is JSX, and how is it compiled?

Syntax sugar compiled (Babel/SWC/esbuild) into function calls that return plain objects.

```jsx
<Button kind="primary">Save</Button>
// becomes
jsx(Button, { kind: "primary", children: "Save" });
```

**Real-life:** shorthand notes that a secretary types up into a full letter.

🎯 **Interview:** JSX is an expression that returns a **React element** (a plain object describing UI).

### R-9. What are the rules of JSX?

- One root → use a Fragment `<>...</>`.
- `className`, `htmlFor`, camelCase events (`onClick`).
- `{}` takes **expressions**, not statements (use `&&`, ternary, `.map()`).
- Self-close: `<img />`.
- Values are **escaped** (XSS-safe).

### R-10. What is a component?

A function that takes **props** and returns JSX. Name must be **Capitalised** (lowercase = HTML tag).

**Real-life:** a cookie cutter; same shape, different decorations (props).

```jsx
function UserCard({ name, role = "Engineer", children }) {
  return <div><h3>{name}</h3><p>{role}</p>{children}</div>;
}
```

### R-11. What are props, and their rules?

Inputs from parent to child.

- **Read-only** (never mutate).
- Flow **down**.
- Defaults via JS default params (`defaultProps` on function components removed in React 19).
- Anything can be a prop: strings, objects, functions, JSX.

**Real-life:** a parent gives a child a shopping list; the child can read it, not rewrite it.

### R-12. How does a child send data to its parent?

The parent passes a **callback**; the child calls it.

**Real-life:** the parent gives the child a phone number: "call me when you pick something."

```jsx
function Parent() {
  const [selected, setSelected] = useState(null);
  return <List onSelect={setSelected} />; // child calls onSelect(item)
}
```

### R-13. What is `children`, and why composition?

`children` = whatever is between the tags. React reuses code through **composition**, not inheritance.

**Real-life:** a gift box; it doesn't care what's inside.

```jsx
<Card><h2>Title</h2></Card>
<Layout header={<Title />} />   // "slot" prop
```

### R-14. Conditional rendering and the `0` gotcha?

```jsx
{isLoading && <Spinner />}
{error ? <ErrorMsg /> : <Data />}
```

⚠️ `{count && <Badge />}` renders **`0`** when count is 0. Use `{count > 0 && <Badge />}`.

🎯 **Interview:** avoid nested ternaries; extract a variable or component.

### R-15. Why do lists need keys? Why not the index?

Keys tell React **which item is which** between renders.

**Real-life:** name tags at a party. If you use seat numbers (index) and people swap seats, you greet the wrong person.

```jsx
{users.map((u) => <UserCard key={u.id} name={u.name} />)}
```

⚠️ Index keys break when items are re-ordered, filtered or inserted: input text ends up in the wrong row. Index is OK only for static lists. Keys must be unique among **siblings**.

### R-16. State vs props?

| Props | State |
|---|---|
| from parent | component's own memory |
| read-only | changed by its setter |

Both cause a re-render when they change.

**Real-life:** props = your name given by parents. State = your mood, which you change yourself.

### R-17. What are Fragments?

`<>...</>` groups children with **no extra DOM node**. Use `<Fragment key={id}>` inside lists.

**Real-life:** a rubber band holding pencils together, instead of a whole pencil box.

---

## Part B — State & Rendering

### R-18. What triggers a re-render?

1. Its **state** changes.
2. Its **parent** re-renders (children re-render by default).
3. A **context** it reads changes.

🎯 **Interview:** "props changing" isn't a separate trigger; props only change because the parent re-rendered.

### R-19. Render phase vs commit phase?

- **Render:** React calls your function, builds a new tree. Must be **pure**; can be paused/restarted.
- **Commit:** React applies DOM changes, attaches refs, runs effects. Synchronous.

**Real-life:** render = an architect drawing plans (can redraw). Commit = builders actually building.

🎯 A component can render **without** changing the DOM.

### R-20. Why does `console.log` show the old value after `setState`?

State is a **snapshot** for that render.

**Real-life:** a photo. Changing your hair doesn't change the photo already taken.

```jsx
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
  console.log(count); // still 0
}
// result: 1, not 3
```

### R-21. What is the updater function form?

Use it when the next state depends on the previous one.

```jsx
setCount((c) => c + 1);
setCount((c) => c + 1);
setCount((c) => c + 1); // 3
```

**Real-life:** "add 1 to whatever the total is now", instead of "set total to 1".

### R-22. What is automatic batching? `flushSync`?

React 18+ groups all state updates in the same tick (events, promises, timeouts) into **one** re-render.

**Real-life:** a waiter collects the whole table's order before going to the kitchen.

`flushSync(() => setX(...))` forces an immediate update (rare, e.g. scroll to a newly added item).

### R-23. Why must you never mutate state?

React compares with `Object.is` (reference). Same reference = "nothing changed" = no re-render.

**Real-life:** writing on the same paper; React only notices a **new** sheet.

```jsx
// ❌
items.push(x); setItems(items);
// ✅
setItems([...items, x]);
setItems(items.filter((i) => i.id !== id));
setItems(items.map((i) => (i.id === id ? { ...i, done: true } : i)));
setUser({ ...user, name: "New" });
```

🎯 **Immer** lets you write "mutating" code safely (used by Redux Toolkit).

### R-24. Where should state live?

- **Colocate:** lowest component that needs it.
- **Lift up:** to the closest common parent if siblings share it.
- **Global** only when many distant components need it.

**Real-life:** keep your toothbrush in the bathroom, not in the living room "just in case".

### R-25. What is derived state, and why not sync it?

```jsx
// ❌ extra state + effect
useEffect(() => setFullName(first + " " + last), [first, last]);
// ✅ compute it
const fullName = first + " " + last;
```

**Real-life:** don't write your age in a notebook every birthday; calculate it from your birth date.

🎯 **Interview rule:** "If you can compute it, don't store it."

### R-26. How do you reset a component's state?

Change its **`key`**; React remounts it fresh.

```jsx
<ProfileForm key={userId} userId={userId} />
```

**Real-life:** give someone a new blank form instead of erasing every field.

---

## Part C — Under the Hood

### R-27. What is the Virtual DOM?

JSX produces plain JS objects. React compares the new tree with the old one and applies the **minimal real DOM changes**.

**Real-life:** editing a document draft, then only reprinting the changed pages.

🎯 **Senior nuance:** the VDOM isn't "faster than the DOM". Its value is declarative code with good-enough performance.

### R-28. How does reconciliation (diffing) work?

React uses O(n) heuristics:

1. **Different type** → throw away subtree and rebuild (state lost).
2. **Same type** → keep node, update props, recurse.
3. **Keys** match list children.

**Real-life:** renovating a house. Same room type → repaint. Kitchen became a bedroom → rebuild the room.

### R-29. Why never define a component inside another?

```jsx
function Parent() {
  function Child() { ... } // ❌ new type every render
  return <Child />;
}
```

New type each render → unmount/remount → state resets, inputs lose focus.

**Real-life:** replacing a worker with a new person every day; nobody remembers yesterday.

### R-30. What is Fiber?

React's engine since v16. Rendering became a **loop over small units of work** that can be **paused, prioritised, aborted, resumed**.

**Real-life:** a chef who can pause chopping to serve an urgent order, then continue.

🎯 Fiber makes transitions, Suspense and selective hydration possible.

### R-31. What's inside a fiber? What is double buffering?

| Field | Meaning |
|---|---|
| `type` / `key` | component or tag |
| `child`, `sibling`, `return` | tree pointers |
| `memoizedProps` / `pendingProps` | old / new props |
| `memoizedState` | linked list of hooks |
| `flags` | what to do in commit |
| `lanes` | priority |
| `alternate` | twin in the other tree |

**Double buffering:** a **current** tree (on screen) and a **work-in-progress** tree; on commit they swap.

**Real-life:** a stage with two sets; the crew builds the next scene behind the curtain, then swaps.

### R-32. How are hooks stored internally?

```
fiber.memoizedState → [useState] → [useEffect] → [useMemo] → null
```

React walks the list **in call order** every render.

**Real-life:** lockers numbered 1, 2, 3. Skip one and everyone opens the wrong locker.

🎯 This is the real reason hooks can't be conditional.

### R-33. What does the work loop look like?

```
render (interruptible): beginWork → completeWork for each fiber, yield if needed
commit (sync):
  1. before mutation → getSnapshotBeforeUpdate
  2. mutation        → DOM changes
  3. layout          → refs, useLayoutEffect, componentDidMount/Update
  after paint        → useEffect
```

### R-34. When does React skip (bail out) rendering?

| Situation | Result |
|---|---|
| `setState(sameValue)` | bails out (may call component once) |
| Parent returns **same element object** | child skipped |
| `memo` + shallow-equal props | skipped |
| Context value unchanged | consumers skipped |

### R-35. Why don't `children` re-render when the parent's state changes?

```jsx
function SlowParent({ children }) {
  const [pos, setPos] = useState(0);
  return <div onMouseMove={(e) => setPos(e.clientX)}>{pos}{children}</div>;
}
<SlowParent><ExpensiveTree /></SlowParent>
```

`<ExpensiveTree />` was created by the **grandparent**, so it's the same element object → skipped. No `memo` needed.

**Real-life:** a frame on the wall; repainting the wall doesn't repaint the photo inside.

🎯 Top performance trick: **lift content up and pass it as children**.

### R-36. Why does a new object/function prop break `memo`?

```jsx
<MemoChild style={{ color: "red" }} />   // new object every render
<MemoChild onClick={() => doThing()} />  // new function every render
```

`memo` compares by **reference**. Fix: `useMemo` / `useCallback`, hoist constants, or the React Compiler.

**Real-life:** a guard who only checks "is it the same envelope?"; a new envelope with the same letter still looks different.

### R-37. Does `memo` stop context updates?

**No.** Context consumers re-render even through `memo`.

Fix: split contexts, memoise the value, or use a selector store.

### R-38. What are lanes?

Update **priorities** stored as bitmasks.

| Lane | From |
|---|---|
| Sync | click, keydown, input |
| InputContinuous | mousemove, scroll |
| Default | setTimeout, fetch |
| Transition | `startTransition`, `useDeferredValue` |
| Idle / Offscreen | hidden content (`<Activity>`) |

**Real-life:** hospital triage: emergency, urgent, routine.

### R-39. What is concurrent rendering? Is every render interruptible?

React can prepare UI in the background, **interrupt** it for urgent updates, and throw it away.

**Real-life:** writing a long email; the phone rings (urgent), you answer, then restart the email with fresh info.

🎯 **Senior nuance:** only **transition** (and retry/idle) work is time-sliced (~5 ms chunks). Sync/default updates render in one go. That's why render must be pure.

### R-40. What is tearing? How does `useSyncExternalStore` prevent it?

**Tearing:** during a paused render an external store changes, so half the UI shows old data and half new.

**Real-life:** a scoreboard where one side updates mid-goal; the two halves disagree.

`useSyncExternalStore` detects the change and re-renders synchronously.

⚠️ `getSnapshot` must return the **same reference** when unchanged, or you get an infinite loop.

### R-41. What are synthetic events and React's event delegation?

React wraps native events in a cross-browser `SyntheticEvent`.

- Since **React 17**, listeners attach to the **root container**, not `document`.
- **Event pooling removed** (safe to read `e.target` async).
- Events bubble through the **React tree**, even across portals.

**Real-life:** one receptionist (root) handles all visitors instead of a guard at every door.

---

## Part D — Hooks

### R-42. What are the Rules of Hooks, and why?

1. Call hooks only at the **top level** (no conditions, loops, nested functions).
2. Call them only from **components** or **custom hooks**.

**Why:** hooks are stored in an ordered list and matched by **call order** (R-32).

**Real-life:** students answer roll call in seat order; if one skips, every name after is wrong.

🎯 Exception: React 19's `use()` can be conditional. `eslint-plugin-react-hooks` enforces the rules.

### R-43. How does `useState` work? Lazy initialisation?

```jsx
const [count, setCount] = useState(0);
setCount(5);             // replace
setCount((c) => c + 1);  // updater

const [data, setData] = useState(() => JSON.parse(localStorage.getItem("data")) ?? []);
```

**Real-life:** lazy init = cooking the first meal once, not re-cooking it every time you open the fridge.

⚠️ `useState(expensive())` runs every render. Pass the function: `useState(expensive)`.
⚠️ Unlike class `setState`, it **replaces**, doesn't merge.

### R-44. What is `useReducer`, and when to prefer it?

Use when logic is complex or several values change together.

**Real-life:** a vending machine: you press a button (action), the machine decides what happens (reducer).

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "added":   return [...state, { id: crypto.randomUUID(), text: action.text, done: false }];
    case "toggled": return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "deleted": return state.filter((t) => t.id !== action.id);
    default: throw new Error("Unknown action " + action.type);
  }
}
const [todos, dispatch] = useReducer(reducer, []);
dispatch({ type: "added", text: "Learn React" });
```

🎯 Reducer must be **pure**; `dispatch` is stable (no `useCallback` needed).

### R-45. What is `useEffect`, and how do dependencies work?

Effects **sync with something outside React** (network, timers, subscriptions, `document.title`). Runs **after paint**.

**Real-life:** after moving into a house (render), you connect electricity and internet (effects).

```jsx
useEffect(() => {});          // after every render
useEffect(() => {}, []);      // after mount only
useEffect(() => {}, [a, b]);  // mount + when a or b changes
```

🎯 Include every reactive value used inside; trust `exhaustive-deps`.

### R-46. How does effect cleanup work?

```jsx
useEffect(() => {
  const id = setInterval(() => setSeconds((s) => s + 1), 1000);
  return () => clearInterval(id); // before next run AND on unmount
}, []);
```

**Real-life:** switch off the lights when you leave a room.

⚠️ Missing cleanup = memory leaks and duplicate handlers.

### R-47. Why does my effect run twice in development?

`<StrictMode>` runs **mount → cleanup → mount** in dev to expose missing cleanups. Production runs once.

**Real-life:** a fire drill; if the building can't handle a test exit and re-entry, it has a problem.

🎯 If your effect breaks when run twice, the bug is in the effect.

### R-48. How do you fetch data in an effect safely?

```jsx
useEffect(() => {
  const controller = new AbortController();
  (async () => {
    try {
      const res = await fetch(`/api/users/${id}`, { signal: controller.signal });
      if (!res.ok) throw new Error(res.statusText);
      setUser(await res.json());
    } catch (e) {
      if (e.name !== "AbortError") setError(e);
    }
  })();
  return () => controller.abort();
}, [id]);
```

**Real-life:** you order pizza, then change to burger; cancel the pizza so it doesn't arrive last and replace the burger.

- `useEffect(async () => ...)` ❌: it returns a Promise, React expects a cleanup.
- **Race condition:** without abort, user 1's slow response can overwrite user 2.

🎯 In real apps use **TanStack Query** or framework loaders.

### R-49. When do you NOT need an effect?

| Situation | ❌ Effect | ✅ Instead |
|---|---|---|
| value from props/state | effect + setState | compute in render |
| expensive calc | effect + setState | `useMemo` |
| reset on prop change | effect watching prop | `key={prop}` |
| user action | effect watching a flag | event handler |
| notify parent | effect calling `onChange` | call it in the handler |

### R-50. Effect vs event handler?

- **Handler:** because the user **did** something ("clicked Buy").
- **Effect:** because the component **is on screen** ("stay connected while chat is visible").

**Real-life:** handler = ringing a doorbell. Effect = keeping the porch light on while you're home.

### R-51. What are stale closures, and `useEffectEvent`?

A **stale closure** captured an old render's values (e.g. an interval always seeing `count = 0`).

**Real-life:** reading yesterday's newspaper and thinking it's today's news.

```jsx
const onConnected = useEffectEvent(() => {
  showToast("Connected!", theme); // always latest theme
});

useEffect(() => {
  const conn = connect(roomId);
  conn.on("connected", onConnected);
  return () => conn.disconnect();
}, [roomId]); // theme NOT a dependency
```

🎯 `useEffectEvent` is stable in **React 19.2**. Before that: store the latest value in a ref.

### R-52. `useEffect` vs `useLayoutEffect`?

| `useEffect` | `useLayoutEffect` |
|---|---|
| after paint | before paint (sync) |
| doesn't block | blocks painting |
| default | measuring DOM, tooltips (avoid flicker) |

**Real-life:** useLayoutEffect = straightening a picture **before** guests walk in.

### R-53. What is `useContext`?

Reads the nearest provider's value without prop drilling.

⚠️ Every consumer re-renders when the value changes. React 19's `use(Context)` does the same and can be conditional.

### R-54. `useRef` vs `useState`?

```jsx
const inputRef = useRef(null);
<input ref={inputRef} />;
inputRef.current.focus();

const timerId = useRef(null); // mutable value, no re-render
```

| `useRef` | `useState` |
|---|---|
| change doesn't re-render | change re-renders |
| for values the UI doesn't show | for values the UI shows |

**Real-life:** ref = a sticky note in your pocket. State = the scoreboard everyone sees.

### R-55. What is `useMemo`?

Caches an **expensive calculation**.

```jsx
const sorted = useMemo(() => sortBig(items, sortKey), [items, sortKey]);
```

**Real-life:** saving the answer to a long sum so you don't redo it unless the numbers change.

⚠️ Don't memoise cheap work. It's a **hint**, not a guarantee.

### R-56. `useMemo` vs `useCallback` vs `memo`?

| API | Caches | Use for |
|---|---|---|
| `useMemo` | a **value** | expensive calc, stable objects |
| `useCallback` | a **function** | functions passed to memo children / effect deps |
| `memo` | a **component render** | skip render if props shallow-equal |

🎯 `useCallback(fn, deps)` = `useMemo(() => fn, deps)`. Useless unless the receiver is memoised or uses it as a dependency.

### R-57. What is `useId`?

Stable, unique, **SSR-safe** ID for accessibility.

```jsx
const id = useId();
<label htmlFor={id}>Email</label><input id={id} />
```

⚠️ Not for list keys.

### R-58. What is `useImperativeHandle`?

Exposes a **small API** through a ref instead of the raw DOM node.

**Real-life:** a TV remote with only Play/Pause, instead of opening the TV's insides.

```jsx
function VideoPlayer({ ref, src }) {
  const videoRef = useRef(null);
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
  }), []);
  return <video ref={videoRef} src={src} />;
}
```

🎯 Only for imperative actions (focus, scroll, play). If it can be a prop, make it a prop.

### R-59. `useDebugValue` and `useInsertionEffect`?

- `useDebugValue` → labels a custom hook in DevTools.
- `useInsertionEffect` → for **CSS-in-JS libraries** to inject styles early. App code rarely needs it.

### R-60. What is `useTransition`?

Marks **your** state update as low priority so typing stays smooth.

**Real-life:** a shop serves people at the counter first; restocking shelves waits.

```jsx
const [isPending, startTransition] = useTransition();
function onTabClick(next) {
  startTransition(() => setTab(next));
}
{isPending && <Spinner />}
```

⚠️ Never wrap the input's own `onChange` update; wrap only the expensive update.

### R-61. `useDeferredValue` vs `useTransition`?

`useDeferredValue` gives a **lagging copy** of a value.

```jsx
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => search(bigList, deferredQuery), [deferredQuery]);
const isStale = query !== deferredQuery;
```

| `useTransition` | `useDeferredValue` |
|---|---|
| you **own the setter** | you only **receive the value** (e.g. a prop) |

**Real-life:** subtitles that catch up a moment after the speech.

### R-62. When do you use `useSyncExternalStore`?

To subscribe to a **non-React store** safely.

```jsx
function useOnlineStatus() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("online", cb);
      window.addEventListener("offline", cb);
      return () => {
        window.removeEventListener("online", cb);
        window.removeEventListener("offline", cb);
      };
    },
    () => navigator.onLine, // client
    () => true              // server
  );
}
```

🎯 Redux and Zustand use it internally.

### R-63. What are custom hooks?

Functions starting with `use` that call other hooks. The main way to **reuse logic**.

**Real-life:** a recipe card; everyone who uses it cooks their **own** dish.

```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
```

🎯 Custom hooks share **logic, not state**. They replaced most HOCs and render props.

---

## Part E — Component Patterns

### R-64. What is prop drilling, and how do you avoid it?

Passing props through components that don't use them.

**Real-life:** passing a note through 5 classmates to reach one friend.

Fixes (best first):

1. **Composition:** pass the component down (`<Layout sidebar={<UserMenu user={user} />} />`).
2. **Context** for slow-changing data (theme, auth).
3. **Store** (Zustand/Redux) for large, frequently updated state.

### R-65. Controlled vs uncontrolled?

| | Controlled | Uncontrolled |
|---|---|---|
| Source of truth | React state (`value` + `onChange`) | DOM (`defaultValue`, ref, FormData) |
| Good for | instant validation, formatting | simple forms, React 19 Actions |

**Real-life:** controlled = a driving instructor holding the wheel. Uncontrolled = you drive; they check at the end.

⚠️ `value` without `onChange` → read-only warning. Switching undefined → defined value → "uncontrolled to controlled" warning.

### R-66. What are compound components?

Components that share hidden state through context.

**Real-life:** a TV remote and TV: buttons only make sense together.

```jsx
const TabsContext = createContext(null);

function Tabs({ defaultValue, children }) {
  const [active, setActive] = useState(defaultValue);
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>;
}
function Tab({ value, children }) {
  const { active, setActive } = use(TabsContext);
  return <button role="tab" aria-selected={active === value} onClick={() => setActive(value)}>{children}</button>;
}
function Panel({ value, children }) {
  const { active } = use(TabsContext);
  return active === value ? <div role="tabpanel">{children}</div> : null;
}
Tabs.Tab = Tab;
Tabs.Panel = Panel;

<Tabs defaultValue="a">
  <Tabs.Tab value="a">Profile</Tabs.Tab>
  <Tabs.Panel value="a">...</Tabs.Panel>
</Tabs>
```

🎯 Common in design-system interviews.

### R-67. What is a Higher-Order Component (HOC)?

A function that takes a component and returns a new one.

**Real-life:** gift wrapping: same gift, extra layer around it.

```jsx
function withAuth(Component) {
  return function Protected(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return <Component {...props} />;
  };
}
```

⚠️ Downsides: wrapper hell, unclear prop sources. **Custom hooks replaced most HOCs.**

### R-68. What are render props?

A function prop that returns JSX.

```jsx
<DataFetcher url="/api/user" render={(data) => <Profile data={data} />} />
```

**Real-life:** a caterer cooks the food; you decide how to plate it. Mostly replaced by hooks.

### R-69. What is a Portal?

`createPortal(jsx, domNode)` renders outside the parent DOM (modals, toasts, tooltips).

**Real-life:** a speaker on stage whose voice comes from speakers at the back of the hall.

⚠️ Events still bubble through the **React tree**, not the DOM tree.

### R-70. What does `<StrictMode>` do?

Dev-only. Double-invokes render and effects, warns about deprecated APIs. **No production effect.**

**Real-life:** a strict teacher checking homework twice to catch mistakes early.

### R-71. What are error boundaries?

Catch errors in **render, lifecycle, constructors** of children and show a fallback.

**Real-life:** a circuit breaker: one room's fault doesn't black out the whole house.

```jsx
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Dashboard />
</ErrorBoundary>
```

⚠️ Don't catch: event handlers, async code, SSR, errors in the boundary itself. Still **class-only**; use `react-error-boundary`.

### R-72. How do lazy loading and code splitting work?

```jsx
const AdminPanel = lazy(() => import("./AdminPanel"));
<Suspense fallback={<Spinner />}><AdminPanel /></Suspense>
```

**Real-life:** a restaurant cooks a dish only when you order it, not the whole menu upfront.

🎯 Split by **route** first, then heavy features (charts, editors).

### R-73. What are prop getters?

A headless hook returns functions that build props, **merging** your handlers with the consumer's.

```jsx
const callAll = (...fns) => (...args) => fns.forEach((fn) => fn?.(...args));

function useToggle({ reducer = toggleReducer, initialOn = false } = {}) {
  const [{ on }, dispatch] = useReducer(reducer, { on: initialOn });
  const toggle = () => dispatch({ type: "toggle" });
  const getTogglerProps = ({ onClick, ...props } = {}) => ({
    "aria-pressed": on,
    onClick: callAll(onClick, toggle),
    ...props,
  });
  return { on, toggle, getTogglerProps };
}

<button {...getTogglerProps({ onClick: () => track("toggled") })} />
```

**Real-life:** a phone charger with a universal adapter; it works with your plug instead of replacing it.

### R-74. What is the state reducer pattern?

**Inversion of control:** consumers can override state changes.

```jsx
const { on, getTogglerProps } = useToggle({
  reducer(state, action) {
    if (action.type === "toggle" && tooMany) return state; // block
    return toggleReducer(state, action);
  },
});
```

**Real-life:** a thermostat with a parental lock; parents can block changes without rewiring.

### R-75. A component that works controlled and uncontrolled?

```jsx
function useControllableState({ value, defaultValue, onChange }) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const setValue = useCallback((next) => {
    const resolved = typeof next === "function" ? next(current) : next;
    if (!isControlled) setInternal(resolved);
    onChange?.(resolved);
  }, [isControlled, current, onChange]);
  return [current, setValue];
}
```

**Real-life:** a car with both automatic and manual modes.

⚠️ Warn in dev if it switches modes, like native inputs do.

### R-76. What is a polymorphic `as` prop? (TS)

```tsx
type BoxProps<C extends React.ElementType> = {
  as?: C;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<C>, "as" | "children">;

function Box<C extends React.ElementType = "div">({ as, ...props }: BoxProps<C>) {
  const Component = as ?? "div";
  return <Component {...props} />;
}

<Box as="a" href="/docs">Docs</Box>
```

**Real-life:** one actor who can play any role; the costume (props) changes with the role.

### R-77. What is the `asChild` / Slot pattern?

The component merges its props **into its child** instead of rendering its own element.

```jsx
function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className="btn" {...props} />;
}

<Button asChild><a href="/home">Home</a></Button> // renders <a class="btn">
```

**Real-life:** a uniform badge pinned onto **your** shirt, instead of giving you a new shirt.

🎯 Used by Radix and shadcn/ui. Real Slot also merges refs and styles.

### R-78. What are headless components?

Ship **behaviour + accessibility**, no styles (Radix, React Aria, Downshift, TanStack Table).

**Real-life:** a car engine and chassis; you choose the body and paint.

🎯 The dominant design-system architecture today.

### R-79. How would you design a reusable Modal or Select?

**Modal:** portal to body, `role="dialog"`, `aria-modal`, `aria-labelledby`, focus in + trapped + restored, Esc closes, scroll lock, `inert` background, controlled `open`/`onClose`. Mention native `<dialog>` + `showModal()`.

**Select:** compound components, controlled + uncontrolled, prop getters/headless hook, full ARIA listbox/combobox + keyboard, `asChild` trigger, portal popup, generic value types.

🎯 Walk through **API → behaviour → a11y → styling** in that order.

### R-80. Are PropTypes still used?

**No.** React 19 removed propTypes checks (silently ignored). Use **TypeScript**.

---

## Part F — Refs

### R-81. What are callback refs? What changed in React 19?

A function ref that React calls with the node. In **React 19** it can **return a cleanup**.

```jsx
function useElementSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useCallback((node) => {
    const ro = new ResizeObserver(([e]) => setSize(e.contentRect));
    ro.observe(node);
    return () => ro.disconnect(); // React 19 cleanup
  }, []);
  return [ref, size];
}
```

**Real-life:** a doorbell that rings when a guest arrives, instead of checking the door every minute.

🎯 Use it to react to a node **appearing** (measure, observe, focus a conditional input).

### R-82. How do you merge refs?

```jsx
function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    });
  };
}
```

**Real-life:** one key copied for two people.

### R-83. Is `forwardRef` still needed?

**No** in React 19: `ref` is a normal prop.

```jsx
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

`forwardRef` still works but will be deprecated. React 18 needed it.

### R-84. Why not read/write refs during render?

It makes render **impure** (output depends on untracked mutable data). Use refs in **effects and handlers**.

Exception: lazy init `if (ref.current === null) ref.current = new Thing()`.

---

## Part G — Forms

### R-85. How do you build a form the classic way?

```jsx
function Signup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.includes("@")) return setError("Invalid email");
    setPending(true);
    try {
      await api.signup(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={pending}>Sign up</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

**Real-life:** a receptionist checking each field before sending your form to the office.

### R-86. React 19 Actions: `useActionState`, `useFormStatus`?

```jsx
async function signupAction(prevState, formData) {
  const email = formData.get("email");
  if (!email.includes("@")) return { error: "Invalid email" };
  await api.signup(email);
  return { error: null };
}

function SubmitButton() {
  const { pending } = useFormStatus(); // reads the PARENT form
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

**Real-life:** a self-service kiosk that tracks "processing…" and errors for you.

- No `preventDefault` needed; uncontrolled fields reset after success.
- ⚠️ `useFormStatus` must be in a component **inside** the `<form>`.

### R-87. What is `useOptimistic`?

Show the result **instantly**; auto-revert if the action fails.

**Real-life:** a chat app shows your message immediately with a "sending" tick.

```jsx
const [optimisticTodos, addOptimistic] = useOptimistic(
  todos,
  (current, newTodo) => [...current, { ...newTodo, sending: true }]
);

async function add(formData) {
  const todo = { text: formData.get("text") };
  addOptimistic(todo);
  await saveTodo(todo); // throws → optimistic item disappears
}
```

⚠️ Call it inside an Action or transition.

### R-88. Which form libraries are used?

- **React Hook Form:** uncontrolled, few re-renders (current favourite).
- **Zod / Yup:** schema validation, shared with backend, typed.
- **Formik:** older, controlled, more re-renders.

---

## Part H — React 19, 19.2 & Compiler

### R-89. What's new in React 19?

| Feature | One line |
|---|---|
| Actions | async functions with pending/error/optimistic handling |
| `useActionState`, `useFormStatus`, `useOptimistic` | form helpers |
| `use()` | read a Promise or Context, can be conditional |
| ref as prop | no `forwardRef` |
| ref cleanup | callback refs return cleanup |
| `<Context value>` | context as provider |
| Metadata | `<title>`, `<meta>` hoisted to `<head>` |
| Stylesheets | `<link precedence>` dedupes and orders |
| Preloading | `preload`, `preinit`, `preconnect` |
| Hydration | clearer mismatch errors |
| Root error options | `onCaughtError`, `onUncaughtError` |
| Server Components | stable via frameworks |

### R-90. What is `use()`, and its gotcha?

Reads a **Promise** (suspends until resolved) or **Context**. Can be called conditionally.

```jsx
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map((c) => <p key={c.id}>{c.text}</p>);
}
```

**Real-life:** waiting at a counter for an order **number** you already have, not placing a new order each time.

⚠️ Don't create the promise during render (`use(fetch(...))`) in a Client Component: new promise every render → suspends forever. It must be **cached/stable** (R-166).

### R-91. What are Actions?

Async functions passed to `startTransition`, a form `action`, or `useActionState`. React manages **pending, errors, optimistic updates, sequencing**.

```jsx
const [isPending, startTransition] = useTransition();
startTransition(async () => {
  const err = await updateName(name);
  if (err) setError(err);
});
```

### R-92. Other React 19 DOM features?

```jsx
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>                         {/* hoisted to <head> */}
      <meta name="description" content={post.summary} />
      <h1>{post.title}</h1>
    </article>
  );
}

<link rel="stylesheet" href="/theme.css" precedence="default" />;

import { preload, preconnect } from "react-dom";
preconnect("https://api.example.com");
preload("/fonts/inter.woff2", { as: "font" });
```

### R-93. What was removed or changed in React 19?

- `ReactDOM.render` / `hydrate` → `createRoot` / `hydrateRoot`
- `propTypes` checks removed → TypeScript
- `defaultProps` on function components removed → default params
- String refs, legacy context removed
- `act` moved to `react`; `react-test-renderer` deprecated
- `Context.Provider` → `<Context>`

🎯 The "do you keep up?" question.

### R-94. What's new in React 19.1 / 19.2?

| Feature | One line |
|---|---|
| `<Activity mode="visible\|hidden">` | hide UI but **keep its state** |
| `useEffectEvent` | non-reactive logic in effects |
| `cacheSignal` | know when a server `cache()` lifetime ends |
| Partial pre-rendering | static shell now, dynamic parts later |
| Performance tracks | React tracks in Chrome DevTools |

```jsx
<Activity mode={tab === "settings" ? "visible" : "hidden"}>
  <Settings />
</Activity>
```

**Real-life:** `<Activity>` = minimising a window instead of closing it.

### R-95. What is the React Compiler?

A build-time plugin (**v1.0, Oct 2025**) that **auto-memoises** components and values.

**Real-life:** a spell-checker that fixes things as you type, so you stop doing it by hand.

- Needs code that follows the **Rules of React** (pure render, no mutation, hook rules).
- Skips code it can't safely optimise.

🎯 "You write plain code, stop sprinkling memo hooks; purity and immutability matter even more."

---

## Part I — State Management

### R-96. How do you classify state? (Senior answers start here)

| Kind | Example | Tool |
|---|---|---|
| Local UI | open/closed, input text | `useState` / `useReducer` |
| Shared UI | theme, current user | Context / Zustand |
| **Server** | users list, product | **TanStack Query** / SWR / loaders |
| URL | filters, page, tab | search params |
| Form | fields, validation | React Hook Form / Actions |
| Complex global | big editor, workflows | Redux Toolkit / Zustand |

**Real-life:** sorting your stuff: wallet (local), family calendar (shared), bank balance (server, the bank owns it).

🎯 **Key insight:** most of what teams put in Redux was **server state**. TanStack Query removes most of the global store.

### R-97. How does Context work? Performance issues?

```jsx
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext value={value}><Page /></ThemeContext>;
}

const { theme } = useContext(ThemeContext);
```

**Real-life:** a building's PA announcement; everyone hears it, even if it's not for them.

⚠️ **Every** consumer re-renders on change (even through `memo`). Fix: split contexts, memoise value, selector store for fast updates.

🎯 Context is **dependency injection**, not a state manager.

### R-98. How does Redux Toolkit work?

```jsx
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    added(state, action) { state.items.push(action.payload); }, // Immer
    removed(state, action) { state.items = state.items.filter((i) => i.id !== action.payload); },
  },
});
const store = configureStore({ reducer: { cart: cartSlice.reducer } });

const items = useSelector((s) => s.cart.items);
dispatch(cartSlice.actions.added(product));
```

Flow: **UI → dispatch → middleware → reducer → new state → selectors → UI**.

**Real-life:** a bank: you submit a slip (action), the clerk follows rules (reducer), your passbook updates (state).

🎯 Async: `createAsyncThunk` or **RTK Query**.

### R-99. Redux vs Context?

| Context | Redux / Zustand |
|---|---|
| passes values down | real store with **selectors** |
| all consumers re-render | only components whose slice changed |
| no devtools/middleware | devtools, middleware, time-travel |
| theme, auth, locale | big, frequently updated state |

### R-100. What is Zustand?

Lightweight store, no provider.

```jsx
const useCart = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
}));

const items = useCart((s) => s.items);
```

**Real-life:** a shared whiteboard anyone can read from, without a manager in between.

Others: **Jotai** (atoms), **MobX** (observables), **XState** (machines).

### R-101. What is server state? Why TanStack Query?

Data owned by the backend: can go stale, be shared, be changed by others. Needs **caching, dedup, refetch, retries, invalidation, pagination**.

**Real-life:** a shop's price board; you check it, cache it, refresh when it may have changed.

```jsx
const { data, isPending, error } = useQuery({
  queryKey: ["user", id],
  queryFn: ({ signal }) => fetch(`/api/users/${id}`, { signal }).then((r) => r.json()),
  staleTime: 60_000,
});

const qc = useQueryClient();
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => qc.invalidateQueries({ queryKey: ["user", id] }),
});
```

### R-102. How do you choose a state solution? (Senior)

1. **Classify** state (R-96); most "global" is server cache → TanStack Query.
2. URL-worthy state → URL.
3. Keep the rest **local**; lift when needed.
4. A store only for real cross-cutting client state.

🎯 "Start local, add Context for slow shared values, add a store only when you can name the problem it solves."

---

## Part J — Routing

### R-103. How does React Router work (v6/v7)?

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router";

<BrowserRouter>
  <Link to="/users/1">User 1</Link>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users/:id" element={<UserDetail />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

**Real-life:** a building directory: floor number (URL) → which office (component).

- v7 (Nov 2024) merged with Remix; import from `"react-router"`.
- `<Link>` = no page reload, unlike `<a href>`.

### R-104. Nested routes and `<Outlet>`?

```jsx
<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="users/:id" element={<UserDetail />} />
</Route>

function Layout() {
  return <><nav><NavLink to="/">Home</NavLink></nav><Outlet /></>;
}
```

**Real-life:** a picture frame (layout) whose photo (outlet) changes.

### R-105. Params, query strings, navigating in code?

| Need | API |
|---|---|
| `/users/:id` | `const { id } = useParams()` |
| `?page=2` | `const [params, setParams] = useSearchParams()` |
| navigate | `const navigate = useNavigate(); navigate("/login")` |
| current URL | `useLocation()` |

### R-106. How do you build protected routes?

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

**Real-life:** a receptionist sends visitors without a badge to the front desk, then back where they wanted to go.

⚠️ UX only. **The server must enforce authorisation.**

### R-107. What changed from v5 → v6/v7?

| v5 | v6/v7 |
|---|---|
| `<Switch>` | `<Routes>` |
| `component={Comp}` | `element={<Comp />}` |
| `useHistory()` | `useNavigate()` |
| `<Redirect>` | `<Navigate>` |

---

## Part K — Data Fetching & Real-time

### R-108. `fetch` vs `axios`?

| | fetch | axios |
|---|---|---|
| Built-in | ✅ | npm |
| JSON | `res.json()` | automatic |
| 4xx/5xx | **doesn't reject**, check `res.ok` | rejects |
| Interceptors | write a wrapper | built-in |
| Cancel | `AbortController` | `AbortController` |

### R-109. Pagination vs infinite scroll?

| Style | How |
|---|---|
| Page-based | `page` in the **URL**, fetch `?page=2`, **replace** list |
| Infinite | `cursor` + `hasMore`, `IntersectionObserver` on a sentinel, **append** |

**Real-life:** page-based = book pages. Infinite = a never-ending scroll of receipt paper.

🎯 Use `IntersectionObserver`, not scroll listeners. 1000+ rows → virtualise. `useInfiniteQuery` handles caching. Code: R-170.

### R-110. WebSocket vs SSE?

```jsx
useEffect(() => {
  const ws = new WebSocket("wss://example.com/live");
  ws.onmessage = (e) => setMessages((prev) => [...prev, JSON.parse(e.data)]);
  return () => ws.close();
}, []);
```

- **WebSocket:** two-way (chat, collaboration). **Real-life:** phone call.
- **SSE (`EventSource`):** server → client only (notifications, LLM streaming), auto-reconnects. **Real-life:** radio.

🎯 Production: reconnect with backoff, heartbeats, push messages into the query cache/store.

---

## Part L — SSR, Hydration & Server Components

### R-111. CSR vs SSR vs SSG vs Streaming vs RSC?

| Mode | Renders | JS shipped | Best for |
|---|---|---|---|
| CSR | browser | all | dashboards behind login |
| SSR | server per request → hydrate | all | SEO + dynamic pages |
| SSG | at build | all | blogs, docs, marketing |
| Streaming SSR | server in chunks | all | slow data shouldn't block page |
| RSC | server only | **zero** for those components | data-heavy, mostly static UI |

**Real-life:** CSR = ingredients delivered, you cook. SSR = cooked per order. SSG = pre-packed meals. Streaming = dishes arrive as each is ready.

### R-112. What is hydration?

React attaches events and state to **server-rendered HTML** (`hydrateRoot`). First client render must match the server's.

**Real-life:** a mannequin (HTML) that comes to life when the actor (JS) steps in.

### R-113. Hydration mismatches: causes and fixes?

| Cause | Fix |
|---|---|
| `Date.now()`, `Math.random()`, locale | set on client in `useEffect`, or pass server value |
| `typeof window` branches in render | `useEffect` or `useSyncExternalStore` with server snapshot |
| invalid HTML (`<div>` in `<p>`) | fix markup |
| browser extensions | React 19 tolerates most |
| intentional difference | `suppressHydrationWarning` |

```jsx
const subscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
```

### R-114. What is streaming SSR?

Classic SSR waits for **all** data → all HTML → all JS → hydrate all. Streaming sends the **shell first**, then each `<Suspense>` part as it's ready.

**Real-life:** a restaurant serves bread immediately and the main course when it's cooked.

```js
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ["/main.js"],
  onShellReady() {
    res.setHeader("content-type", "text/html");
    pipe(res);
  },
  onShellError() { res.status(500).send("<h1>Error</h1>"); },
});
```

Edge: `renderToReadableStream`. Static: `prerender` from `react-dom/static`.

### R-115. What is selective hydration?

Each Suspense boundary hydrates **independently**. If the user clicks a not-yet-hydrated part, React **hydrates it first** and replays the click.

**Real-life:** a waiter serves whichever table waves first.

🎯 Improves **INP**.

### R-116. Server Components vs Client Components?

| | Server | Client (`"use client"`) |
|---|---|---|
| Runs | server only | server (SSR) + browser |
| `async/await` in component | ✅ | ❌ |
| hooks, state, events | ❌ | ✅ |
| DB / secrets | ✅ | ❌ |
| JS shipped | **none** | yes |

```jsx
// ProductPage.jsx (Server Component)
export default async function ProductPage({ params }) {
  const product = await db.product.find(params.id);
  return <><ProductInfo product={product} /><AddToCart id={product.id} /></>;
}

// AddToCart.jsx
"use client";
export function AddToCart({ id }) {
  const [qty, setQty] = useState(1);
}
```

**Real-life:** server = kitchen (cooks, has the secret recipes). Client = your table (where you interact).

### R-117. `"use client"` vs `"use server"`? Composition rules?

- `"use client"` = a **boundary**: that module and its imports become client code.
- `"use server"` = **Server Functions** the client can call.

```jsx
// ✅ server passes server-rendered content INTO client as children
<ClientTabs><ServerRenderedReport /></ClientTabs>
// ❌ a client component can't import a server component
```

🎯 Push `"use client"` as far **down** (to leaves) as possible.

### R-118. What is the RSC payload? What can cross the boundary?

Server Components send a serialised **UI description** (not HTML): server output resolved, client components as **references** + props.

- ✅ primitives, plain objects, arrays, `Date`, `Map`, `Set`, **Promises**, JSX, Server Functions
- ❌ plain functions, class instances, Symbols, DOM nodes

**Real-life:** flat-pack furniture instructions; the client assembles it with the parts it downloads.

🎯 On navigation only the **payload** is fetched, so client state is kept.

### R-119. `cache()` and `server-only`?

```js
import "server-only"; // build fails if imported on the client
import { cache } from "react";

export const getUser = cache(async (id) => db.user.findUnique({ where: { id } }));
```

`cache()` = **per-request** dedup, not a cross-request cache.

**Real-life:** during one meeting, ask the boss once and share the answer with everyone.

### R-120. Security risks of Server Actions?

Every `"use server"` function is a **public HTTP endpoint**.

**Real-life:** a back door anyone can knock on; always check who's there.

```js
"use server";
export async function deletePost(postId) {
  const session = await auth();                               // 1. authenticate
  if (!session) throw new Error("Unauthorized");
  const id = z.string().uuid().parse(postId);                 // 2. validate
  const post = await db.post.find(id);
  if (post.authorId !== session.userId) throw new Error("Forbidden"); // 3. authorise
  await db.post.delete(id);
}
```

- Don't pass full DB rows to clients (e.g. `passwordHash`); map to DTOs.
- Secrets in `server-only` modules.
- **Patch promptly:** Dec 2025 critical RCE "React2Shell" (CVE-2025-55182) in `react-server-dom-*` 19.0–19.2.0.

### R-121. SSR vs RSC?

- **SSR:** HTML for fast first paint, but **all JS still ships** and hydrates.
- **RSC:** components **never ship JS**.

They work **together**: RSC decides where code runs; SSR turns the first tree into HTML.

### R-122. Islands vs RSC?

- **Islands (Astro):** static HTML page, independent interactive widgets.
- **RSC:** similar idea, but boundaries live in **one React tree**, with client navigation.

**Real-life:** islands = separate shops on a street. RSC = departments in one mall.

### R-123. Loading and error states with Server Components?

- `<Suspense fallback>` around async components.
- Error boundaries for failures.
- Next.js `loading.js` / `error.js` are **Next.js features**, not React.

---

## Part M — Suspense

### R-124. How does Suspense work?

A component that isn't ready **suspends** (conceptually throws a promise). The nearest `<Suspense>` shows the fallback and retries when ready.

**Real-life:** a "Please wait, being prepared" sign at a counter.

Suspends: `lazy()`, `use(promise)`, Suspense-enabled libraries (`useSuspenseQuery`), async Server Components.

⚠️ Fetching in `useEffect` does **not** suspend.

### R-125. Where do you put Suspense boundaries?

```jsx
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<FeedSkeleton />}><Feed /></Suspense>
  <Suspense fallback={<SidebarSkeleton />}><Sidebar /></Suspense>
</Suspense>
```

- **One boundary:** all appears together; slowest blocks all.
- **Many:** parts appear as ready; more layout shift.

🎯 Ask "which pieces should appear together?", like a designer.

### R-126. How do transitions interact with Suspense?

```jsx
startTransition(() => setTab(next)); // keeps OLD tab visible while new one loads
```

- Without transition → visible content replaced by fallback (jarring).
- With transition → old UI stays (dim with `isPending`).

**Real-life:** a TV keeps showing the current channel until the new one is ready, instead of a black screen.

### R-127. Suspense + error boundaries? How to reset?

```jsx
<ErrorBoundary fallback={<p>Couldn't load feed</p>}>
  <Suspense fallback={<FeedSkeleton />}><Feed /></Suspense>
</ErrorBoundary>

<Suspense key={userId} fallback={<Spinner />}>   {/* key resets it */}
  <Profile id={userId} />
</Suspense>
```

🎯 Suspense = **pending**, error boundary = **rejected**. Always pair them.

---

## Part N — Performance

### R-128. How do you approach React performance?

1. **Measure:** React Profiler, Chrome Performance panel, Lighthouse, Core Web Vitals (**LCP, INP, CLS**).
2. **Fix structure:** move state down, lift content up as children (R-35), split contexts, derive instead of sync.
3. **Then memoise** where it measurably helps, or let the Compiler do it.

**Real-life:** a doctor runs tests before prescribing medicine.

⚠️ Don't optimise blindly; memoisation costs memory and comparisons.

### R-129. Show `React.memo` preventing a re-render.

```jsx
const Child = memo(function Child() {
  console.log("child render");
  return <p>I only render once</p>;
});

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <Child />
    </>
  );
}
```

"child render" logs once. Pass a new object/inline function and `memo` stops working (R-36).

### R-130. Which performance techniques should you know?

| Technique | Why |
|---|---|
| `memo` / `useMemo` / `useCallback` | skip work |
| code splitting | smaller bundle → better LCP |
| virtualisation | render only visible rows |
| `useTransition` / `useDeferredValue` | responsive typing (INP) |
| debounce / throttle | fewer requests and renders |
| state colocation | fewer components updated |
| image optimisation | `loading="lazy"`, sizes, modern formats |
| `<Activity>` | keep hidden tabs alive |
| Server Components | less client JS |

⚠️ **Common mistakes:** `memo` everywhere, memoising cheap work, inline objects to memo children, derived data in state, guessing instead of profiling.

### R-131. A page feels slow. How do you debug it?

1. Reproduce and **profile**.
2. Find the bottleneck and fix:

| Bottleneck | Fix |
|---|---|
| network | caching, prefetch |
| bundle | code splitting |
| render count | move state, split context, memo |
| render cost | virtualise, transitions |

3. **Re-measure.**

**Real-life:** a mechanic finds whether it's the engine, tyres or brakes before fixing anything.

### R-132. What are long tasks and INP? How to break up work?

**INP** = how fast the page responds visually to input (> 200 ms is poor). Cause: JS tasks > 50 ms.

**Real-life:** a cashier serving one huge order while the queue waits. Break it up and serve others in between.

```js
const yieldToMain = () =>
  globalThis.scheduler?.yield?.() ?? new Promise((r) => setTimeout(r, 0));

async function processInChunks(items, work) {
  for (let i = 0; i < items.length; i++) {
    work(items[i]);
    if (i % 200 === 0) await yieldToMain();
  }
}
```

### R-133. Web Workers with React?

Move CPU-heavy work off the main thread.

**Real-life:** hiring a helper in the back room so the front desk stays free.

```js
// worker.js
self.onmessage = (e) => self.postMessage(heavySortAndFilter(e.data));

// component
useEffect(() => {
  const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  worker.onmessage = (e) => setResult(e.data);
  worker.postMessage(bigData);
  return () => worker.terminate();
}, [bigData]);
```

🎯 Use for file parsing, search indexing, image processing. **Comlink** simplifies it.

### R-134. What causes memory leaks? How to find them?

| Cause | Fix |
|---|---|
| listeners/intervals without cleanup | return cleanup |
| fetch setting state after unmount | `AbortController` |
| global caches growing forever | LRU limit, `WeakMap` |
| closures capturing big data | avoid, clear refs |
| detached DOM from 3rd-party libs | call `destroy()` in cleanup |

**Find:** DevTools → Memory → heap snapshot → repeat action 5× → snapshot → compare, look for "Detached" nodes.

**Real-life:** a tap left running slowly fills the house.

### R-135. How do you optimise bundle size?

- Analyse: `rollup-plugin-visualizer`, `source-map-explorer`.
- Tree-shaking needs ES modules; import specific functions; avoid barrel files.
- CI budgets: `size-limit`.
- Split by route; prefetch likely next routes.
- Swap heavy deps: moment → `date-fns`/`Intl`, lodash → native.

**Real-life:** packing for a trip: only take what you'll use.

### R-136. How do you render 10,000+ rows?

**Virtualise:** render only visible rows + buffer.

**Real-life:** a train window shows only the view outside right now, not the whole route.

```jsx
import { useVirtualizer } from "@tanstack/react-virtual";

function BigList({ rows }) {
  const parentRef = useRef(null);
  const v = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
  });
  return (
    <div ref={parentRef} style={{ height: 400, overflow: "auto" }}>
      <div style={{ height: v.getTotalSize(), position: "relative" }}>
        {v.getVirtualItems().map((item) => (
          <div key={item.key} style={{ position: "absolute", top: 0, transform: `translateY(${item.start}px)`, height: item.size }}>
            {rows[item.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

Alternatives: `react-window`, CSS `content-visibility: auto`.

### R-137. How would you improve LCP and INP? (Senior)

- **LCP:** SSR/SSG/streaming, preload hero image and fonts, code split, CDN, optimised images.
- **INP:** break long tasks, `useTransition`, debounce, virtualise, workers, less hydration (RSC, selective hydration).

🎯 *"Dashboard INP is 600 ms."* → record the interaction, find the long task, attribute it (React render / heavy JS / layout thrash), fix, then **verify with field data** (web-vitals / RUM).

---

## Part O — Auth & Security

### R-138. How does JWT auth work in a SPA?

1. Login → server returns a token (JWT is **signed, not encrypted**).
2. Store it (R-139).
3. Send `Authorization: Bearer <token>` (axios interceptor / fetch wrapper).
4. Guard routes (R-106).
5. On **401** → refresh token → retry, or log out.
6. Logout → clear token + invalidate on server.

**Real-life:** a festival wristband: shown at every stage; when it expires you swap it at the help desk.

### R-139. Where should you store the token?

| Storage | Pro | Con |
|---|---|---|
| `localStorage` | simple, survives reload | **any XSS can steal it** |
| memory | not persisted | lost on reload; XSS can still read while open |
| **HttpOnly Secure SameSite cookie** | JS can't read it | needs CSRF protection |

🎯 **Senior answer:** short-lived access token **in memory** + refresh token in an **HttpOnly cookie**.

### R-140. What security issues should React devs know?

- JSX **escapes** values: `{userInput}` is safe.
- `dangerouslySetInnerHTML` → **sanitise** (DOMPurify).
- `href={userUrl}` can be `javascript:...` → validate schemes.
- Client env vars are **public**.
- UI auth checks are UX only; **server enforces**.
- Server Actions are public endpoints.
- CSP, patched dependencies, `npm audit`.

**Real-life:** a lock on your front door doesn't help if the back window (server) is open.

---

## Part P — Styling

### R-141. Ways to style React components?

| Approach | Notes |
|---|---|
| inline `style={{}}` | dynamic values; no pseudo-classes/media queries |
| global CSS | simple; name clashes |
| **CSS Modules** | scoped class names per file |
| **Tailwind** | utility classes, very popular |
| CSS-in-JS (styled-components, Emotion) | runtime cost, RSC friction → declining |
| zero-runtime (vanilla-extract, StyleX, Panda) | typed, build-time |
| libraries | MUI, Ant, Chakra; headless: Radix, React Aria, shadcn/ui |

```jsx
import styles from "./Button.module.css";
<button className={`${styles.btn} ${primary ? styles.primary : ""}`}>Save</button>
```

**Real-life:** CSS Modules = labelled lunch boxes, so nobody eats someone else's food.

---

## Part Q — TypeScript with React

### R-142. How do you type props, state, refs and events?

```tsx
type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & React.ComponentPropsWithoutRef<"button">;

function Button({ label, variant = "primary", ...rest }: ButtonProps) {
  return <button className={variant} {...rest}>{label}</button>;
}

const [user, setUser] = useState<User | null>(null);
const inputRef = useRef<HTMLInputElement>(null);
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
```

### R-143. How do you write a generic component?

```tsx
function List<T>({ items, render }: { items: T[]; render: (item: T) => React.ReactNode }) {
  return <ul>{items.map(render)}</ul>;
}

<List items={users} render={(u) => <li key={u.id}>{u.name}</li>} />; // T = User
```

**Real-life:** a box that adapts to whatever you put in it, and labels it correctly.

### R-144. Common TypeScript + React interview points?

| Q | A |
|---|---|
| `interface` vs `type` | interface merges/extends; type does unions. Pick one convention |
| `React.FC`? | optional; type props directly |
| `ReactNode` vs `ReactElement` | ReactNode = anything renderable (use for `children`); ReactElement = element only |
| `any` vs `unknown` | `unknown` forces narrowing → prefer it |
| `void` vs `never` | void returns nothing; never never returns |
| discriminated unions | `{status:"loading"} \| {status:"success";data:T} \| {status:"error";error:Error}` |
| enums | prefer string-literal unions |

---

## Part R — Testing

### R-145. How do you test React apps?

- **Stack:** Vitest/Jest, **React Testing Library** + `user-event`, **MSW** for network, **Playwright**/Cypress for E2E.
- **Philosophy:** test what the **user** sees, not internals.
- **Testing trophy:** mostly integration tests, some unit, few E2E, static analysis at the base.

**Real-life:** test a car by driving it, not by checking which bolt is turned.

### R-146. Show a component test.

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
  render(<UserProfile id="1" />); // network mocked by MSW
  expect(await screen.findByText("Ashish")).toBeInTheDocument();
});
```

### R-147. Key RTL concepts?

| Concept | Point |
|---|---|
| query priority | `getByRole` > `getByLabelText` > `getByText` > … > `getByTestId` |
| `getBy` / `queryBy` / `findBy` | throws / returns null / async wait |
| `userEvent` vs `fireEvent` | userEvent = real interaction → prefer it |
| mocking | `vi.fn()`; mock **network** with MSW |
| hooks | `renderHook()` |
| Enzyme | dead (no React 18+) |

---

## Part S — Accessibility

### R-148. What are the accessibility essentials?

| Topic | Point |
|---|---|
| semantic HTML | `<button>`, not `<div onClick>` |
| labels | every input has `<label htmlFor>`; `useId()` |
| keyboard | Tab/Enter/Space/Esc; visible focus |
| focus management | move on route change / modal open; restore on close |
| ARIA | only when HTML can't; **no ARIA beats bad ARIA** |
| live regions | `aria-live="polite"` for status/toasts |
| tools | `eslint-plugin-jsx-a11y`, axe, Lighthouse, NVDA/VoiceOver |

**Real-life:** ramps and lifts in a building: everyone should be able to get in.

🎯 Reference: **WAI-ARIA Authoring Practices Guide (APG)**.

### R-149. How do you build an accessible combobox?

```jsx
function Combobox({ options, onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  function onKeyDown(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
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
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
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

- Focus **stays on the input**; `aria-activedescendant` points to the "virtual" option.
- `onMouseDown` (not `onClick`) so blur doesn't close the list first.

### R-150. What is roving tabindex?

Only **one** item in a group is tabbable (`tabIndex=0`); arrows move focus inside; Tab leaves.

**Real-life:** one door into a room; inside you walk between desks with arrows.

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
        <button key={item.id} ref={(el) => { refs.current[i] = el; }}
                tabIndex={i === focused ? 0 : -1} onClick={item.action}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
```

### R-151. How do you trap focus in a modal?

Tab/Shift+Tab cycle **inside** the dialog. Options: wrap first/last focusable manually, native **`<dialog>` + `showModal()`**, or `focus-trap-react`. Also `inert` the background and **restore focus** on close.

**Real-life:** a revolving door: you go round inside until you choose to exit.

---

## Part T — Error Handling & Monitoring

### R-152. How do you design error handling across an app?

| Layer | Catches | Tool |
|---|---|---|
| error boundaries | render errors | `react-error-boundary` |
| `showBoundary(err)` | async/event errors | `react-error-boundary` |
| data layer | fetch failures, retry | TanStack Query |
| HTTP interceptors | 401 → refresh/logout, 5xx → toast | axios / fetch wrapper |
| root options | uncaught | `createRoot(el, { onUncaughtError, ... })` |
| global | non-React | `window.onerror`, `unhandledrejection` |

```jsx
function Fallback({ error, resetErrorBoundary }) {
  return <div role="alert"><p>{error.message}</p><button onClick={resetErrorBoundary}>Try again</button></div>;
}

<ErrorBoundary FallbackComponent={Fallback} resetKeys={[userId]}
               onError={(error, info) => reportToSentry(error, info.componentStack)}>
  <UserPanel userId={userId} />
</ErrorBoundary>

const { showBoundary } = useErrorBoundary();
save().catch(showBoundary);
```

**Real-life:** fire safety in layers: smoke alarms per room, sprinklers per floor, the fire brigade for the building.

### R-153. How do you monitor a React app in production?

- **Errors:** Sentry + source maps, release tags, user context.
- **Real-user performance:**

```js
import { onLCP, onINP, onCLS } from "web-vitals";
const send = (m) => navigator.sendBeacon("/analytics", JSON.stringify(m));
onLCP(send); onINP(send); onCLS(send);
```

- `<Profiler onRender>` sampling; session replay with PII masking.

**Real-life:** a car dashboard and black box: see problems live and replay what happened.

---

## Part U — State Machines, Animation & i18n

### R-154. How do you avoid "impossible states"?

`isLoading` + `isError` booleans allow nonsense (loading **and** error). Use a **state machine** / discriminated union.

**Real-life:** a traffic light can't be red and green at once.

```jsx
const machine = {
  idle:    { FETCH: "loading" },
  loading: { RESOLVE: "success", REJECT: "error", CANCEL: "idle" },
  success: { FETCH: "loading" },
  error:   { RETRY: "loading" },
};

function reducer(state, event) {
  const next = machine[state.status][event.type];
  if (!next) return state; // invalid transition ignored
  return {
    status: next,
    data: event.type === "RESOLVE" ? event.data : state.data,
    error: event.type === "REJECT" ? event.error : null,
  };
}
```

🎯 Complex flows (checkout, wizards) → **XState**.

### R-155. How do you animate, including exit animations?

| Tool | Use |
|---|---|
| CSS transitions | most cases; animate `transform`/`opacity` |
| **Motion** (`motion/react`) | enter/exit, layout, gestures |
| View Transitions API | browser-native state transitions |

React removes elements immediately; `AnimatePresence` keeps them until the exit ends.

```jsx
<AnimatePresence>
  {open && (
    <motion.div key="panel"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} />
  )}
</AnimatePresence>
```

**Real-life:** an actor finishes bowing before leaving the stage.

♿ Respect `prefers-reduced-motion`.

### R-156. View Transitions API with React?

```jsx
function withTransition(update) {
  if (!document.startViewTransition) return update();
  document.startViewTransition(() => flushSync(update));
}

<button onClick={() => withTransition(() => setView("grid"))}>Grid</button>
```

⚠️ React's `<ViewTransition>` component is still **experimental**.

### R-157. How do you internationalise (i18n)?

| Concern | Approach |
|---|---|
| translations | `react-i18next` / `react-intl`, **ICU** messages |
| plurals | `{count, plural, one {# item} other {# items}}` |
| numbers/dates | `Intl.NumberFormat`, `Intl.DateTimeFormat` |
| RTL | `dir="rtl"` + CSS logical properties |
| loading | lazy-load per locale |
| SSR | same locale server and client (avoid mismatch) |

```jsx
new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(123456.5); // ₹1,23,456.50
```

**Real-life:** a menu printed in each customer's language, with prices in their currency.

⚠️ German text can be 30–40% longer; design flexible layouts.

---

## Part V — Tooling & Deployment

### R-158. How do environment variables work?

| Tool | Prefix | Read |
|---|---|---|
| Vite | `VITE_` | `import.meta.env.VITE_API_URL` |
| Next.js | `NEXT_PUBLIC_` | `process.env.NEXT_PUBLIC_API_URL` |
| CRA (legacy) | `REACT_APP_` | `process.env.REACT_APP_API_URL` |

⚠️ Client env vars are baked into the bundle and **public**. No secrets.

**Real-life:** writing on a postcard; anyone handling it can read it.

### R-159. How do you build and deploy?

- `npm run build` → `dist/`.
- **SPA** → static host (Vercel, Netlify, S3+CloudFront). Set **fallback to `index.html`** so deep links don't 404.
- **SSR/RSC** → Node or edge hosting.
- **CI/CD:** lint + type-check + test → build → preview (PR) → production.

---

## Part W — Class Components & Lifecycle

### R-160. How do class components work? Why bind `this`?

```jsx
class Counter extends React.Component {
  state = { count: 0 };
  increment = () => this.setState((s) => ({ count: s.count + 1 })); // arrow auto-binds
  componentDidMount() { /* fetch, subscribe */ }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) { /* refetch */ } // always guard
  }
  componentWillUnmount() { /* cleanup */ }
  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}
```

- Constructor → call `super(props)` first.
- `this.setState` **shallow-merges**.
- Methods aren't auto-bound → bind in constructor or use arrow fields.

🎯 Legacy, but still used for **error boundaries**.

### R-161. Lifecycle phases and methods?

- **Mount:** constructor → getDerivedStateFromProps → render → componentDidMount
- **Update:** getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate
- **Unmount:** componentWillUnmount
- **Error:** getDerivedStateFromError + componentDidCatch

**Real-life:** life of an employee: joining (mount), promotions (update), leaving (unmount).

| Method | Use |
|---|---|
| `componentDidMount` | API calls, subscriptions |
| `componentDidUpdate` | compare + refetch (guard!) |
| `componentWillUnmount` | cleanup |
| `shouldComponentUpdate` | return false to skip |
| `getSnapshotBeforeUpdate` | capture scroll position |

### R-162. How do lifecycles map to hooks?

| Class | Hooks |
|---|---|
| `this.state` / `setState` (merge) | `useState` (replace) / `useReducer` |
| `componentDidMount` | `useEffect(..., [])` |
| `componentDidUpdate` | `useEffect(..., [deps])` |
| `componentWillUnmount` | effect cleanup |
| `shouldComponentUpdate` / `PureComponent` | `React.memo` |
| `getDerivedStateFromProps` | compute in render / `key` |
| `getSnapshotBeforeUpdate` | `useLayoutEffect` (roughly) |
| error boundary | **none**, still class-only |

---

## Part X — Build From Scratch & Machine Coding

### R-163. Implement a mini `useState` and `useEffect`.

```js
let hooks = [];
let index = 0;

function useState(initial) {
  const i = index++;
  if (!(i in hooks)) hooks[i] = typeof initial === "function" ? initial() : initial;
  const setState = (next) => {
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
    hooks[i] = { deps, cleanup: callback() }; // real React runs it after commit
  }
}

function rerender() {
  index = 0; // ← why order matters
  render(App());
}
```

**Real-life:** numbered lockers reset to locker 1 at every visit.

🎯 Say out loud: "hooks are an array indexed by call order; that's why they can't be conditional."

### R-164. Implement a mini Redux store with `useSelector`.

```js
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function useSelector(store, selector) {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()));
}
```

**Real-life:** a newsletter: subscribers get notified whenever a new issue (state) is published.

⚠️ `s => ({ a: s.a })` returns a new object each time → infinite loop. Select primitives or memoise (`createSelector`).

### R-165. Implement Redux middleware (thunk + logger).

```js
function applyMiddleware(store, ...middlewares) {
  let dispatch = store.dispatch;
  middlewares.slice().reverse().forEach((mw) => {
    dispatch = mw({ getState: store.getState, dispatch: (a) => dispatch(a) })(dispatch);
  });
  return { ...store, dispatch };
}

const thunk = ({ dispatch, getState }) => (next) => (action) =>
  typeof action === "function" ? action(dispatch, getState) : next(action);

const logger = ({ getState }) => (next) => (action) => {
  console.log("prev", getState(), action);
  const result = next(action);
  console.log("next", getState());
  return result;
};
```

**Real-life:** airport checkpoints; each one inspects your bag, then passes you to the next.

🎯 Middleware shape: `store => next => action`.

### R-166. Build a promise cache for `use()`.

```jsx
const cache = new Map();

function fetchOnce(url) {
  if (!cache.has(url)) {
    const p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    });
    p.catch(() => cache.delete(url)); // don't cache failures
    cache.set(url, p);
  }
  return cache.get(url); // same promise every render
}

function User({ id }) {
  const user = use(fetchOnce(`/api/users/${id}`));
  return <h2>{user.name}</h2>;
}

<ErrorBoundary fallback={<p>Error</p>}>
  <Suspense fallback={<Spinner />}><User id="1" /></Suspense>
</ErrorBoundary>
```

**Real-life:** one order ticket per dish; asking again shows the same ticket, not a new order.

🎯 Follow-ups: invalidation, stale-while-revalidate, LRU limits, i.e. why TanStack Query exists.

### R-167. Write a `useFetch` hook with status and abort.

```jsx
function useFetch(url) {
  const [state, setState] = useState({ status: "idle", data: null, error: null });

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, status: "loading" }));
    fetch(url, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((data) => setState({ status: "success", data, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ status: "error", data: null, error });
      });
    return () => controller.abort();
  }, [url]);

  return state;
}
```

### R-168. Debounce and throttle in React?

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
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

**Real-life:** debounce = a lift door waiting until people stop coming in. Throttle = a tap giving one cup every few seconds.

⚠️ Create them **once** (`useMemo(() => debounce(save, 500), [])`) or they reset every render. For values, use a `useDebounce` hook (R-169).

### R-169. Debounced search box with race-condition safety.

The **most common** machine-coding question.

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
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((data) => { setResults(data); setStatus("success"); })
      .catch((e) => { if (e.name !== "AbortError") setStatus("error"); });
    return () => controller.abort();
  }, [debouncedQ]);

  return (
    <div>
      <label htmlFor="search">Search</label>
      <input id="search" value={q} onChange={(e) => setQ(e.target.value)} />
      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p role="alert">Something went wrong</p>}
      <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}
```

🎯 Mention: debounce (fewer calls), abort (no stale results), `encodeURIComponent`, loading/error states, label for a11y.

### R-170. Infinite scroll with `IntersectionObserver`.

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
      .then((r) => r.json())
      .then((data) => {
        if (ignore) return;
        setItems((prev) => [...prev, ...data.items]);
        setHasMore(data.hasMore);
      })
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [page]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPage((p) => p + 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      {items.map((i) => <article key={i.id}>{i.title}</article>)}
      {loading && <p>Loading…</p>}
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
    </>
  );
}
```

**Real-life:** a tripwire at the bottom of the page that says "load more" when you reach it.

### R-171. Build an accessible modal.

```jsx
function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus(); // restore focus
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="backdrop" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
           tabIndex={-1} ref={dialogRef} onClick={(e) => e.stopPropagation()}>
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
```

🎯 Follow-ups: full focus trap (R-151), stable `onClose` (`useCallback`), native `<dialog>`.

### R-172. Build a recursive file tree.

```jsx
function Tree({ nodes }) {
  return <ul>{nodes.map((n) => <TreeNode key={n.id} node={n} />)}</ul>;
}

function TreeNode({ node }) {
  const [open, setOpen] = useState(false);
  const isFolder = Array.isArray(node.children);
  return (
    <li>
      <button type="button" onClick={() => isFolder && setOpen((o) => !o)}
              aria-expanded={isFolder ? open : undefined}>
        {isFolder ? (open ? "📂" : "📁") : "📄"} {node.name}
      </button>
      {isFolder && open && <Tree nodes={node.children} />}
    </li>
  );
}
```

**Real-life:** Russian dolls; each folder can hold more folders.

🎯 Same pattern solves **nested comments** and **multi-level menus**.

### R-173. Which machine-coding problems to practise? How to approach them?

**Common:** debounced search, infinite scroll, todo with filters, modal, tabs/accordion, star rating, sortable/filterable table, countdown, OTP input, progress bar, traffic light, file explorer, nested comments, autocomplete, drag-and-drop.

**Checklist (say it out loud):**

1. Clarify requirements + edge cases (empty, error, loading, huge data).
2. Sketch component tree and **state shape** first.
3. Happy path, then edge cases.
4. Cleanup: timers, listeners, aborts.
5. Accessibility: semantics, labels, keyboard.
6. What you'd add with time: tests, memo, virtualisation, types.

---

## Part Y — Architecture & System Design

### R-174. Structure a large app with 50+ developers?

- Feature-based folders with a public `index.ts` per feature; lint-enforced boundaries; monorepo (Nx/Turborepo) if multiple apps.
- Design system: headless primitives + tokens.
- Strict TypeScript.
- State by type: server → TanStack Query, URL → router, local → hooks, rare global → Zustand/RTK.
- Route-level code splitting; CI with type-check, tests, bundle budgets.
- Layered error boundaries + monitoring.

**Real-life:** a city with districts (features), shared roads (design system) and zoning rules (lint boundaries).

### R-175. CSR, SSR or RSC for a new product?

| Product | Choice |
|---|---|
| internal dashboard behind login | **CSR** (Vite SPA) |
| public, SEO, content-heavy | **Next.js / React Router framework** with RSC + SSG/streaming |
| mostly static docs | SSG or islands (Astro) |

🎯 Also weigh infra cost, team skills, caching strategy.

### R-176. When would you use micro-frontends?

**Use when** independent teams need **independent deploys** (Module Federation, single-spa, iframes).

**Costs:** duplicated React copies, shared-state complexity, routing coordination, design consistency, version conflicts.

**Real-life:** separate food stalls in a food court vs one restaurant kitchen. Stalls give independence but cost coordination.

🎯 Start with a **modular monolith**; add micro-frontends only when the **organisation** demands it.

### R-177. How would you build a design system?

1. **Tokens** (colours, spacing, type) as CSS variables.
2. **Headless accessible primitives** (Radix / React Aria / your own).
3. Styled components on top.
4. **Storybook** + interaction tests + visual regression (Chromatic).
5. Versioned package, changelogs, **codemods**.
6. APIs: compound, controlled + uncontrolled, `asChild`/polymorphic, full a11y.

**Real-life:** LEGO: standard bricks (primitives) that every team builds with.

### R-178. How do you migrate a legacy app to modern React?

Incremental **strangler** approach:

1. Tests around current behaviour.
2. Mount React "islands" in the old app (`createRoot` per widget).
3. Migrate route by route; thin bridge for shared state.
4. Upgrade class components opportunistically (codemods).
5. Measure as you go.

**Real-life:** renovating a house room by room while still living in it.

⚠️ Never a big-bang rewrite.

### R-179. Frontend system design ("design an autocomplete / feed / chat"): what do you cover?

- **Requirements:** functional + non-functional (latency, scale, offline, a11y).
- **Component tree** + **state shape** (classify state).
- **API contract:** REST/GraphQL, cursor vs offset pagination, error format.
- **Data layer:** caching, dedup, debounce + abort, optimistic updates.
- **Real-time:** WebSocket vs SSE vs polling.
- **Performance:** virtualisation, code splitting, images, prefetch.
- **Accessibility:** correct ARIA pattern, keyboard.
- **Edge cases:** empty/error/loading, offline, retries.
- **Observability:** metrics, error tracking, web-vitals.
- **Security:** XSS, auth, rate limiting.

---

## Part Z — Summary & Cheat Sheets

### R-180. Most common React mistakes?

| ❌ Don't | ✅ Do |
|---|---|
| mutate state | create new objects/arrays |
| index as key on dynamic lists | stable IDs |
| `{count && <X/>}` | `{count > 0 && <X/>}` |
| missing effect deps | follow `exhaustive-deps` |
| effect + state for derived values | compute in render |
| `async` effect callback | async IIFE + `AbortController` |
| forget cleanup | return cleanup |
| components inside components | module-level components |
| one giant fast-changing context | split / selector store |
| memo everywhere | profile first / Compiler |
| server data in Redux by hand | TanStack Query / loaders |
| hooks in a Server Component | move to `"use client"` |
| read state right after `setState` | use the value you passed / updater |
| unguarded setState in `componentDidUpdate` | compare with previous first |
| `<div onClick>` | `<button>` |
| trust UI auth / Server Actions | validate + authorise on server |

### R-181. Which API do I need? (Decision guide)

| Need | Use |
|---|---|
| local state | `useState` / `useReducer` |
| derived value | compute in render (`useMemo` if expensive) |
| sync with external system | `useEffect` + cleanup |
| measure DOM before paint | `useLayoutEffect` |
| mutable value / DOM access | `useRef` |
| shared slow-changing data | Context |
| server data | TanStack Query / loaders / `use()` + cached promise |
| global frequent client state | Zustand / Redux Toolkit |
| filters, pagination | URL search params |
| form submit + pending + errors | `useActionState` + `useFormStatus` |
| instant feedback | `useOptimistic` |
| responsive input during heavy work | `useTransition` / `useDeferredValue` |
| latest value in effect without re-run | `useEffectEvent` |
| hide UI, keep state | `<Activity>` |
| non-React store | `useSyncExternalStore` |
| smaller bundle | `lazy` + `Suspense`, RSC |
| modal / tooltip | `createPortal` |
| catch render errors | error boundary |
| reuse logic | custom hook |
| long lists | virtualisation |
| real-time | WebSocket / SSE |
| auth pages | route guard + memory token / HttpOnly cookie |
| tests | Vitest/Jest + RTL + user-event + MSW |

### R-182. The 12 rules to remember

1. **UI = f(state)**: never touch the DOM directly.
2. **State is a snapshot**: use updaters for previous-based updates.
3. **Never mutate**.
4. **Derive, don't sync**.
5. **Effects only for external systems**; user actions in handlers.
6. **Clean up** everything with a lifetime.
7. **Colocate state**; classify it (server / URL / local / global).
8. **Stable keys**.
9. **Measure before memoising** (or use the Compiler).
10. **Server state ≠ client state**.
11. **Accessibility is not optional**.
12. **Test behaviour, not implementation**.

### R-183. Which JS concepts does React rely on most?

| Concept | Why in React |
|---|---|
| closures | handlers capture that render's state → stale closures |
| `Object.is` equality | bailouts, `memo`, dependency arrays |
| immutability, spread/rest | state updates, prop forwarding |
| destructuring | `const [x, setX] = useState()` |
| arrow functions & `this` | fix class handler binding |
| higher-order functions | `.map()`, HOCs, middleware |
| pure functions | render and reducers must be pure |
| Promises / async | fetching, Actions, `use()`, Suspense |
| ES modules, `import()` | tree-shaking, code splitting |
| event loop | batching, yielding to the main thread |

> **Revision tip:** one Part per day; re-read Part Z the day before the interview.
