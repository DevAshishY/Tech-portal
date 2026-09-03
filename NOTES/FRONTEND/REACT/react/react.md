# React Learning & Interview Notes

Fast-review notes merged from: React 19 Cheat Sheet, "Top 200 React Interview Questions" (Happy Rawat), and personal topic checklist. Deep Redux content lives in `../redux/redux.md` — only pointers here.

---

## 1. Overview — What & Why React 19

React 19 refines the Concurrent Rendering mental model: less imperative state-syncing, more declarative async. Headline additions — **Actions**, **use()**, native form integration — remove boilerplate around loading/pending/optimistic state. Server Components/Server Functions push data-fetching and mutations onto the server by default, shrinking client bundles.

| Topic | Key Point |
|---|---|
| What is React | Open-source JS **library** (not framework) for building UIs via reusable, composable components. Declarative — describe *what* UI should look like, React handles the *how* (DOM diffing). |
| Virtual DOM | Lightweight in-memory copy of the real DOM. React diffs old vs new VDOM (**reconciliation**) and patches only changed real-DOM nodes — avoids full-page re-render, faster than direct DOM manipulation. |
| SPA | Single Page Application — one HTML shell, content swaps dynamically via JS without full page reloads. |
| React vs Angular | React = library (view layer only, pick your own router/state/HTTP), unopinionated, JSX. Angular = full opinionated framework, two-way binding, TypeScript-first, built-in DI/router/HTTP. |
| Advantages | Component reuse, VDOM speed, huge ecosystem/community, easy testing (Jest/RTL), cross-platform (React Native). |
| Disadvantages | Just a view library — need to pick router/state/build tooling yourself; overkill for very small/static sites; JSX has a learning curve. |
| React 19 key improvements | Fewer hooks needed for async work, native `<form>` handling, faster/more resilient hydration, first-class metadata & resource preloading. |
| Server Components | Render on the server only, ship **zero JS** to the client, read data directly (DB/API), no client fetch waterfall. No hooks/state/browser APIs. |
| Actions | Async functions passed to forms/transitions/handlers; React auto-manages pending/error/optimistic state — no manual `try/catch` + `useState` wiring. |
| ref as a Prop | Function components accept `ref` directly as a normal prop in React 19 — `forwardRef` is no longer required (still works, legacy). |
| Improved Hydration | Better mismatch diagnostics; resilient hydration recovers from 3rd-party DOM edits (browser extensions, etc.) instead of crashing. |
| Metadata Support | `<title>`, `<meta>`, `<link>` can render anywhere in the component tree — React hoists them into `<head>` automatically. |
| Stylesheet Support | `<link rel="stylesheet" precedence="...">` — React controls load order and dedupes styles. |
| Preloading APIs | `preload`, `preinit`, `prefetchDNS`, `preconnect` (from `react-dom`) for fine-grained resource loading. |
| Error Handling | Root-level `onCaughtError` / `onUncaughtError` options + clearer error boundaries reduce noisy duplicate console logging. |
| JSX | JavaScript XML — HTML-like syntax compiled to `React.createElement()` calls via Babel. Browsers only understand JS, not JSX, hence the build step. |
| Declarative vs Imperative | Declarative (JSX/React): describe the desired end state, framework figures out the steps. Imperative (vanilla JS DOM): manually script each step (`createElement`, `appendChild`, ...). |
| React vs React Native | React = library for **web** UIs (browser, HTML/CSS, deploys as a web app). React Native = framework for **mobile** apps (iOS/Android, native components like `View`/`Text`, deploys via app stores). |

### Project Setup & Folder Structure
- `npx create-react-app my-app` (or Vite: `npm create vite@latest`) → `npm start`/`npm run dev`.
- `public/` — static assets served as-is: `index.html`, favicon, images, `manifest.json`, `robots.txt`.
- `src/` — all application source: components, `index.js` (entry point), `App.js` (root component), styles, tests.
- `index.html` — the single SPA page; contains `<div id="root"></div>` which React replaces with the rendered component tree.
- `index.js` — `ReactDOM.createRoot(document.getElementById('root')).render(<App/>)`, typically wrapped in `<StrictMode>`.
- `node_modules/` — installed dependencies, managed by NPM/Yarn/pnpm via `package.json`.

---

## 2. Core Hooks (11 foundational hooks)

**Rules of Hooks**: call hooks only at the top level (never inside conditionals/loops/nested functions), only from React function components or custom hooks, and keep call order identical across renders — React matches hook state to hooks by call order. (`use()` in React 19 is the one sanctioned exception — it can be called conditionally.)

| Hook | Purpose | Gotcha |
|---|---|---|
| `useState` | Local component state. `const [n,setN]=useState(0); setN(p=>p+1);` | Updates are batched & async — don't read state immediately after setting it. |
| `useEffect` | Sync with an external system after render (fetch, subscription, DOM). Cleanup via returned function. | Missing/incorrect deps → stale closures. Don't make the effect callback itself `async` (see Common Mistakes). |
| `useContext` | Read Context value without prop drilling. | Re-renders on **any** change to the context value — split contexts to limit blast radius. |
| `useReducer` | State transitions via `(state, action) => newState`; good when next state depends on multiple sub-values or complex logic. | Prefer over `useState` once update logic gets branchy. |
| `useRef` | Mutable value that persists across renders without triggering one. | Mutating `.current` does **not** cause a re-render. |
| `useMemo` | Memoize an expensive computed value. | Not a guarantee — React may discard the cache under memory pressure. Don't memoize cheap calculations. |
| `useCallback` | Memoize a function's identity across renders. | Only useful when passed to a memoized child or used as an effect dependency. |
| `useLayoutEffect` | Like `useEffect` but fires **synchronously before paint**. | Blocks browser paint — use only for layout reads/writes (measuring DOM, avoiding flicker). |
| `useImperativeHandle` | Customize the instance value exposed via `ref`. | Pairs with ref-as-prop in React 19 — `forwardRef` no longer required to use it. |
| `useDebugValue` | Labels a custom hook's value in React DevTools. | Dev-only, zero production effect. |
| `useId` | Generates a stable unique ID for accessibility attributes (`aria-*`, `htmlFor`). | Do **not** use as a list `key`. |

### Concurrent & Store Hooks (React 18+)

| Hook | Purpose | Gotcha |
|---|---|---|
| `useTransition` | Marks a state update as low-priority so urgent updates (typing, clicks) render first. `const [isPending, startTransition] = useTransition(); startTransition(() => setTab(next));` | Only wrap the expensive/derived update — never the input's own `onChange` state update. |
| `useDeferredValue` | Returns a lagging copy of a value so a slow child doesn't block urgent renders. `const deferredQuery = useDeferredValue(query);` | For a *value* you don't own the setter of — `useTransition` is for updates you trigger yourself. |
| `useSyncExternalStore` | Subscribes to a non-React external store safely under concurrent rendering (no tearing). `useSyncExternalStore(subscribe, getSnapshot)` | Rarely called directly in app code — mainly used inside state libraries (Redux, Zustand). |
| `useInsertionEffect` | Fires before layout effects, before DOM mutations are read — lets CSS-in-JS libraries inject `<style>` tags without layout thrashing. | App code almost never needs this — it's for library internals (styled-components, emotion). |

**Automatic Batching (React 18+)**: multiple `setState` calls are batched into a single re-render even inside promises, `setTimeout`, and native event handlers (earlier React only batched inside React's own event handlers). Opt out with `flushSync()` from `react-dom` when a synchronous render is genuinely required (rare).

---

## 3. React 19 New APIs & Hooks

- **`use()`** — reads a Promise or Context value **during render**. `const data = use(promise);` Unlike other hooks, it **can be called conditionally**. The Promise must stay stable across renders (usually passed down from a Server Component).
- **`useActionState()`** — tracks pending/result/error state for an Action.
  ```jsx
  const [state, formAction, pending] = useActionState(updateName, null);
  ```
- **`useOptimistic()`** — instant optimistic UI while an Action is in flight; auto-reverts if the Action throws.
  ```jsx
  const [opt, addOpt] = useOptimistic(list, (s, item) => [...s, item]);
  ```
- **`useFormStatus()`** — reads pending status of the nearest parent `<form>`. Must be called from a component **rendered inside** that form (no prop drilling needed).
- **Actions** — an async function passed to a transition, form, or handler: `startTransition(async () => {...})`. React tracks pending/error/optimistic state for you.
- **Server Actions/Functions** — an async function marked `'use server'` that runs only on the server; requires a framework with server support (e.g. Next.js).
- **ref as a Prop** — function components accept `ref` as a normal prop now; `forwardRef` still works but is no longer required.

---

## 4. Component Patterns

### Basics
| Topic | Key Point |
|---|---|
| Functional Components | Default in modern React; class components are legacy. |
| Props | Read-only — never mutate; parent → child data flow. |
| Children | `{children}` prop enables composition without prop explosion. |
| Conditional Rendering | Avoid nested ternaries — extract to a variable or component. |
| Lists & Keys | Always add a stable `key`; never use array index as key if the list can reorder/filter. |
| Event Handling | Avoid inline object/array literals in hot render paths (creates new refs every render). |
| Composition | Prefer composition over deep prop drilling or class inheritance. |
| Custom Hooks | Extract reusable stateful logic into a function prefixed with `use`. |
| Prop Drilling | Passing props through many intermediate components that don't need them, just so a deeply nested child can read them. 5 ways to avoid: Context API, Redux, Component Composition, Callback functions, Custom Hooks. |
| Child → Parent data | No built-in "reverse prop" — parent passes a **callback function** as a prop; child calls it with data (`onSelect(value)`), parent handles it in its own state. |

### Controlled vs Uncontrolled
| | Controlled | Uncontrolled |
|---|---|---|
| Source of truth | React state (`value` + `onChange`) | The DOM itself |
| Read value via | State variable | `ref` (`defaultValue` for initial) |
| Use when | Need validation/formatting as user types, instant feedback | Simple forms, perf-sensitive, quick uncontrolled inputs |
| Common mistake | Controlled input missing `onChange` → React throws/warns "readOnly" | — |

### Higher-Order Components (HOC)
A HOC is a function that takes a component and returns a new, enhanced component — used for cross-cutting concerns (auth guard, logging, data injection) before hooks existed.
```jsx
function withAuth(Component) {
  return function Wrapped(props) {
    const isAuthed = useAuth();
    if (!isAuthed) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}
const ProtectedDashboard = withAuth(Dashboard);
```
- Naming convention: `withXxx`.
- Modern React mostly prefers **custom hooks** or **render props** over HOCs, but HOCs still appear in older codebases and some libraries (e.g. `connect()` from react-redux).

### Render Props
A component takes a function as a prop (often `children` or `render`) that returns JSX, letting the consumer control rendering while the component controls logic/state.
```jsx
<DataFetcher url="/api/user" render={data => <Profile data={data} />} />
```
Mostly superseded by custom hooks today.

### Fragments, Portals, StrictMode
| API | Purpose |
|---|---|
| `<>...</>` / `<React.Fragment>` | Group children without adding an extra DOM node. |
| `createPortal(child, domNode)` | Render children into a DOM node outside the parent hierarchy (modals, tooltips) while keeping React event bubbling. |
| `<StrictMode>` | Dev-only wrapper that double-invokes render/effects to surface side-effect bugs early; no production effect. |

### Error Boundaries
Class-only API (no hook equivalent) that catches render/lifecycle errors in its subtree via `static getDerivedStateFromError()` and `componentDidCatch()`, and renders a fallback UI instead of a blank crashed screen. In React 19 pair with root `onCaughtError`/`onUncaughtError` for centralized logging.

### Lazy Loading & Code Splitting
```jsx
const Chart = lazy(() => import('./Chart'));
// must be wrapped in Suspense
<Suspense fallback={<Spinner />}><Chart /></Suspense>
```
- Splits code so unused routes/features don't ship in the initial bundle.
- Split by route or by rarely-used feature (modal, chart, admin panel).
- Dynamic `import('./heavy-module').then(...)` for on-demand, non-component code.

### CSS Modules
Scoped CSS per component — avoids global class-name collisions.
```css
/* Button.module.css */
.primary { background: blue; }
```
```jsx
import styles from './Button.module.css';
<button className={styles.primary}>Click</button>
```
- Build tool (Webpack/Vite) hashes class names uniquely per file at build time (e.g. `Button_primary__a1b2c`).
- 5 general ways to style React components: inline styles (`style={{...}}` object), plain CSS stylesheets, CSS Modules (scoped), global stylesheets, CSS-in-JS/CSS frameworks (styled-components, Tailwind).

### PropTypes
Runtime prop-type checking (pre-TypeScript convention), via the `prop-types` package:
```jsx
Button.propTypes = { label: PropTypes.string.isRequired };
```
Largely superseded by TypeScript in modern codebases, but still seen in JS-only projects.

---

## 5. Class Components & Lifecycle

Modern React favors function components + hooks (less boilerplate, no `this`), but class lifecycle knowledge is still a common interview topic, and error boundaries remain class-only. Classes are also still found in legacy code and some third-party libraries.

```jsx
import React, { Component } from 'react';
class AppClass extends Component {
  constructor(props) {
    super(props); // required — sets up this.props correctly before any other code runs
    this.state = { count: 0 };
  }
  render() {                     // required method — returns JSX (unlike function components, no explicit "render" step)
    return <h1>{this.props.title}: {this.state.count}</h1>;
  }
}
```

| Aspect | Functional + Hooks | Class |
|---|---|---|
| State | `useState` | `this.state` + `this.setState({...})` (shallow-merges; prefer functional form `this.setState(prev => ({...}))`) |
| Side effects | `useEffect` | Lifecycle methods |
| `this` keyword | Not used | Required (`this.props`, `this.state`) — event handlers need binding (`this.handleClick = this.handleClick.bind(this)` in constructor, or an arrow-function class property) |
| Verbosity | Concise | More boilerplate |

### The three lifecycle phases
- **Mounting** (created & inserted into DOM): `constructor()` → `getDerivedStateFromProps()` → `render()` → `componentDidMount()`
- **Updating** (re-render from new props/state): `getDerivedStateFromProps()` → `shouldComponentUpdate()` → `render()` → `getSnapshotBeforeUpdate()` → `componentDidUpdate()`
- **Unmounting** (removed from DOM): `componentWillUnmount()`

| Method | Fires When | Typical Use | Hook Equivalent |
|---|---|---|---|
| `constructor(props)` | Before mount | Init `this.state`; must call `super(props)` first | `useState` initializer |
| `componentDidMount()` | Once, right after first render | API calls, subscriptions, timers, event listeners | `useEffect(() => {...}, [])` |
| `componentDidUpdate(prevProps, prevState)` | After every re-render (not the first) | Compare `prevProps`/`prevState` to current, conditionally re-fetch. **Gotcha:** an unconditional `setState` here causes an infinite re-render loop — always guard with a comparison. | `useEffect(() => {...}, [deps])` |
| `componentWillUnmount()` | Just before removal from DOM | Cleanup: remove listeners, clear timers, unsubscribe | Cleanup function returned from `useEffect` |
| `shouldComponentUpdate(nextProps, nextState)` | Before re-render | Return `false` to skip a re-render (perf) | `React.memo()` |
| `static getDerivedStateFromProps()` | Before every render | Sync state from props | Derive during render, no hook needed |
| `getSnapshotBeforeUpdate()` | Right before DOM mutations commit | Capture info (e.g. scroll position) pre-update | `useLayoutEffect` (partial equivalent) |
| `static getDerivedStateFromError()` / `componentDidCatch()` | A descendant throws during render | Show fallback UI (error boundary) | No hook equivalent — must be a class |

---

## 6. Forms & Validation

**React 18 pattern** (manual): `useState` for pending/error + `e.preventDefault()` + `try/catch` in a submit handler.
**React 19 pattern** (Actions):
```jsx
const [error, formAction, pending] = useActionState(async (prev, formData) => {
  if (!formData.get('name')) return 'Name is required';
  await saveName(formData.get('name'));
  return null;
}, null);

<form action={formAction}>
  <input name="name" />
  <SubmitButton />
  {error && <p>{error}</p>}
</form>
```

| Need | API |
|---|---|
| Form submission | `<form action={formAction}>` — no manual `preventDefault`/`fetch`/state wiring |
| Pending state in a child | `useFormStatus()` inside a component rendered inside the `<form>` — reads `{ pending }` |
| Validation error | Return an error string/object from the action function |
| Optimistic UI | `useOptimistic(list, reducerFn)`, call `addOpt(item)` for instant UI, auto-reverts on failure |
| Controlled validation (per-keystroke) | Controlled inputs + validate in `onChange`/`onBlur`, store errors in state (or a form lib) |
| Bigger forms | Libraries like **React Hook Form** (uncontrolled, less re-render) or **Formik** (controlled) + a schema validator (**Zod**/**Yup**) are standard in real apps |

---

## 7. Routing (React Router)

React itself has no built-in router — **React Router** is the de-facto standard for client-side routing in an SPA.

```jsx
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

<BrowserRouter>
  <nav><Link to="/">Home</Link> <Link to="/users/1">User 1</Link></nav>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users/:id" element={<UserDetail />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

| Concept | Key Point |
|---|---|
| `<BrowserRouter>` | Wraps the app, enables HTML5 history-API routing (clean URLs, no `#`). |
| `<Routes>` | Container that renders the **first** matching `<Route>` — replaces the old `<Switch>` (React Router v5) which did the same exclusive-match job. |
| `<Route path element>` | Maps a URL path to a component. `path="*"` = catch-all/404. |
| `<Link to="...">` | Client-side navigation without a full page reload (vs `<a href>` which reloads). |
| Route Params | `:id` in the path → read with `useParams()` → `{ id } = useParams()`. |
| Nested Routes | `<Route path="dashboard" element={<Layout/>}><Route path="settings" element={<Settings/>} /></Route>` + `<Outlet/>` in `Layout` renders the matched child. |
| Programmatic navigation | `const navigate = useNavigate(); navigate('/login');` |
| Query params | `useSearchParams()` → `[params, setParams] = useSearchParams(); params.get('page')`. |
| Protected routes | Wrap element in a guard component that checks auth and either renders children or `<Navigate to="/login" />`. |
| Old (v5) vs new (v6) | v5: `<Switch>`, `component={}` prop, `useHistory()`. v6: `<Routes>`, `element={}` prop (JSX, allows passing props), `useNavigate()`. |

---

## 8. State Management

- **Local state** → `useState`/`useReducer` (Section 2).
- **Cross-component, no prop drilling** → **Context API**: `createContext()` + `<Provider value={...}>` + `useContext()`. Best for low-frequency-change data (theme, auth user, locale) — every consumer re-renders on **any** value change, so don't put fast-changing data in a single big context.
  ```jsx
  const ThemeContext = createContext('light');
  <ThemeContext.Provider value={theme}><App/></ThemeContext.Provider>
  const theme = useContext(ThemeContext);
  ```
- **Complex local state machine** → `useReducer` (Section 2) — actions/reducer pattern scales better than many `useState` calls once transitions get branchy.
- **App-wide shared/global state at scale** → **Redux Toolkit** (`configureStore`, slices, `createSlice`, `useSelector`/`useDispatch`) is the standard; **Redux Thunk** (built into RTK) handles async action creators (API calls) before dispatching. → see `../redux/redux.md` for the full walkthrough (Store → Slice → Action → Reducer → Dispatch → Selector flow, middleware, thunks).
- **Lighter alternatives** to Redux: Zustand, Jotai, React Query/TanStack Query (for server-state/caching specifically — arguably a better fit than Redux for API data).
- Rule of thumb: keep state as **local** as possible; only lift to Context/Redux when 2+ distant components genuinely need it.

---

## 9. Server Components & Async Patterns

| Rendering Mode | Where | Ships JS? | Hooks/State? | Best For |
|---|---|---|---|---|
| Client-side Rendering | Browser | Yes | Yes | Interactive widgets |
| Server Rendering (SSR) | Server → hydrates | Yes | Yes | Fast first paint + interactivity |
| Server Components | Server only | **No** | **No** | Data-heavy, mostly-static UI |
| Client Components | SSR + browser | Yes | Yes | Anything interactive |

- **`"use client"`** — marks a module boundary; everything imported below runs as a Client Component.
- **`"use server"`** — marks a function as a Server Function/Action callable from the client.
- **Async Components** — Server Components may be `async` functions and `await` data directly in the component body (no `useEffect` fetch waterfall).
- **`use()` with Promises** — in Client Components, `use()` unwraps a Promise handed down from a Server Component.
- **Loading & Error States** — wrap async Server Components in `<Suspense fallback={<Spinner/>}>`; use an error boundary or route-level `error.js` for rejected fetches.

---

## 10. Performance

| Technique | What it does |
|---|---|
| `React.memo` | Skips re-render if props are shallow-equal. |
| `useMemo` | Cache an expensive derived value — not everything. |
| `useCallback` | Pairs with `memo()` to keep child function props stable. |
| Lazy Loading / Code Splitting | See Section 4 — don't ship unused code upfront. |
| `Suspense` | Required boundary around `lazy()` and `use()`. |
| Avoid Unneeded Renders | Keep state as local as possible; global state re-renders everything subscribed to it. |
| State Placement | Move fast-changing state into the smallest component that needs it. |
| List Virtualization | Stable `key`s always; virtualize (`react-window`) once a list hits ~1000+ rows. |
| Profiler | `<Profiler id="App" onRender={logRender}>` — measure before optimizing, don't guess. |

**Don't optimize prematurely** — memoization/virtualization add complexity and can hurt if used blindly; profile first, prefer structural fixes (state placement) over sprinkling `memo`/`useMemo` everywhere.

**Common performance mistakes**: wrapping every component in `memo()`, memoizing trivially cheap calculations, inline object/array literals as props (breaks memoization every render), storing derived data in state instead of computing it inline, skipping the Profiler and guessing.

### `React.memo` demo
```jsx
import React, { useState, memo } from 'react';

// Memoized child — only re-renders if its own props change
const MemoButton = memo(() => {
  console.log('rendered Child');
  return <button>Child</button>;
});

export default function App() {
  const [count, setCount] = useState(0);
  console.log('rendered parent');

  const handleClick = () => setCount(prev => prev + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p>Count: {count}</p>
      <MemoButton />
      {/* Clicking this re-renders App, but "rendered Child" does NOT log again
          because MemoButton's props (none) never changed */}
      <button onClick={handleClick}>Re-render Parent</button>
    </div>
  );
}
```

---

## 11. Authentication (JWT)

Typical SPA + JWT flow:
1. User submits login form → POST credentials to an auth API.
2. Server verifies and returns a **JWT** (header.payload.signature, base64-encoded, signed — not encrypted, don't put secrets in the payload).
3. Client stores the token — options and trade-offs:
   | Storage | Pro | Con |
   |---|---|---|
   | `localStorage` | Simple, persists across tabs/reloads | Vulnerable to XSS (any injected JS can read it) |
   | In-memory (state/Context) | Not readable by injected scripts after reload | Lost on refresh — need a silent refresh flow |
   | HttpOnly cookie | Not readable by JS at all (best XSS protection) | Needs CSRF protection; server sets it |
4. Attach token to API requests: `Authorization: Bearer <token>` header, usually via an Axios interceptor or `fetch` wrapper.
5. Protect routes: a wrapper component/guard checks token presence/validity (and expiry) before rendering, else redirects to `/login` (pairs with the React Router "Protected routes" pattern in Section 7).
6. Handle expiry: decode `exp` claim (e.g. `jwt-decode` lib) or catch `401` responses globally and either refresh the token (refresh-token flow) or force re-login.
7. Logout = clear the stored token (and call a server logout endpoint if using refresh tokens/cookies).

---

## 12. Data & Real-time

### Data Fetching: `fetch` vs `axios`
| | `fetch` | `axios` |
|---|---|---|
| Type | Native browser API | 3rd-party library |
| JSON | Manual `res.json()` step | Automatic |
| Interceptors | No (roll your own wrapper) | Built-in request/response interceptors |
| Error handling | Only rejects on network failure — must check `res.ok` yourself for HTTP errors | Rejects on non-2xx by default |
| Use when | Simple calls, no extra dependency wanted | Need interceptors, auth-token injection, or richer error handling |

### Pagination
| Style | How |
|---|---|
| Classic (page-based) | Track `page`/`pageSize` in state, request `?page=2&limit=20`, render page-number controls, replace the list on each page change. |
| Infinite scroll | Track a `cursor`/`page` + `hasMore`; use `IntersectionObserver` on a sentinel element at the list bottom (or a scroll-position listener) to fetch and **append** the next page; show a loading spinner while fetching; stop when `hasMore` is false. |
| Notes | Debounce/throttle scroll listeners; prefer `IntersectionObserver` over raw scroll-event math (better perf, no layout thrashing); libraries like React Query's `useInfiniteQuery` handle cache/dedup for you. |

### WebSocket (real-time)
```jsx
useEffect(() => {
  const ws = new WebSocket('wss://example.com/socket');
  ws.onopen = () => console.log('connected');
  ws.onmessage = (e) => setMessages(prev => [...prev, JSON.parse(e.data)]);
  ws.onerror = (err) => console.error(err);
  ws.onclose = () => console.log('disconnected');
  return () => ws.close(); // cleanup on unmount — critical to avoid leaked connections
}, []);
```
- Always close the socket in the `useEffect` cleanup function.
- For reconnect/backoff logic, heartbeats, and channel multiplexing, prefer a library (`socket.io-client`, or the native API wrapped in a small hook) over hand-rolling it.
- Alternative for one-way server→client updates: **Server-Sent Events (SSE)** (`EventSource`) — simpler than WebSocket when you don't need client→server messages.

---

## 13. Testing

React apps are tested with **Jest** (test runner/assertions) + **React Testing Library** (RTL — renders components, queries the DOM like a user would). Philosophy: test behavior users see, not implementation details.

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('increments count on click', () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

| Concept | Key Point |
|---|---|
| Query priority | Prefer `getByRole`/`getByLabelText` (accessible, resilient) over `getByTestId` (brittle, last resort). |
| `render()` | Mounts a component into a virtual DOM (jsdom) for the test. |
| `screen` | Global object used to query the rendered output. |
| `fireEvent` vs `userEvent` | `fireEvent` dispatches a raw DOM event; `userEvent` (separate package) simulates real browser interaction more realistically (focus, typing sequence) — prefer it. |
| Mocking | `jest.fn()` for callbacks/functions; `jest.mock('./api')` to mock a whole module (e.g. API calls). |
| E2E testing | Cypress or Playwright test the full app in a real browser, beyond component-level units. |
| Enzyme | Older library (shallow rendering, implementation-detail-focused) — largely superseded by RTL. |

---

## 14. Accessibility (a11y)

| Topic | Key Point |
|---|---|
| Semantic HTML | Use `<button>`, `<nav>`, `<header>`, etc. instead of `<div onClick>` — screen readers and keyboard navigation rely on correct semantics. |
| `aria-*` attributes | `aria-label`, `aria-hidden`, `aria-live`, etc. add meaning when semantic HTML alone isn't enough. |
| `useId()` | Generates stable unique IDs to correctly pair `<label htmlFor>` with `<input id>` (Section 2). |
| Keyboard navigation | Interactive elements must be focusable (`tabIndex`) and operable via keyboard (Enter/Space), not just mouse/touch. |
| Focus management | Move focus programmatically after route changes or modal opens (`ref.current.focus()`) so keyboard/screen-reader users aren't lost. |
| Tools | `eslint-plugin-jsx-a11y` (lint-time checks), Lighthouse / axe DevTools (audits), React DevTools (inspect tree). |

---

## 15. Environment Variables & Deployment

| Topic | Key Point |
|---|---|
| Env vars (CRA) | `.env` file; vars must be prefixed `REACT_APP_` to be exposed to the client bundle: `REACT_APP_API_URL=...` → `process.env.REACT_APP_API_URL`. |
| Env vars (Vite) | Prefix `VITE_` instead: `VITE_API_URL=...` → `import.meta.env.VITE_API_URL`. |
| Never expose secrets | Anything prefixed and bundled ships to the browser in plain text — never put API secrets/private keys in client-side env vars. |
| Production build | `npm run build` → static HTML/JS/CSS bundle in `build/` (CRA) or `dist/` (Vite), ready to deploy to any static host. |
| Deployment targets | Static hosts (Vercel, Netlify, GitHub Pages, S3+CloudFront) for a plain SPA; a Node/edge platform is only needed once you add SSR — see `../../nextjs/nextjs.md` for the framework that layers SSR/Server Components onto React. |
| CI/CD | Typical flow: push → lint/test → build → deploy preview (PR) → deploy production (merge to main). |

---

## 16. Common Mistakes & Best Practices

| DON'T | DO |
|---|---|
| Missing/unstable keys | Always add a stable `key` (not array index if reorderable). |
| Wrong `useEffect` deps | Include all values used inside the effect (e.g. `[id]` not `[]`). |
| Unnecessary `useEffect` | Compute derived values directly during render instead of syncing via effect+state. |
| Mutating state directly | Always spread/copy: `setState({...state, items:[...state.items, x]})`. |
| Overusing `useMemo` | Don't memoize trivially cheap computations. |
| Overusing `useCallback` | Only wrap functions actually passed to memoized children or used as deps. |
| Bad controlled/uncontrolled mix | Controlled inputs need `onChange` too, or React warns/treats it as read-only. |
| State-sync via effect | Derive during render or lift state up — don't sync prop → state with an effect. |
| Deep prop drilling (4+ layers) | Use Context or composition instead. |
| `async` directly on the effect callback | Wrap async logic in an IIFE inside `useEffect`; the effect callback itself must stay non-async (can't return a Promise where a cleanup function is expected). |
| `useState`/effects inside a Server Component | Add `'use client'` at the top of that module, or move the stateful part down into a smaller Client Component. |
| Class `this` unbound in handlers | Bind in constructor or use arrow-function class properties (function components avoid this entirely). |

---

## 17. Interview Q&A Quick-Fire

Deduped against all sections above — short recall answers only.

1. **What's new in React 19?** Actions, `use()`, `useActionState`/`useOptimistic`/`useFormStatus`, ref as a prop, native form actions, metadata/stylesheet/preload support.
2. **What is `use()`?** Hook-like API reading a Promise or Context during render; unlike hooks, callable conditionally.
3. **What are Actions?** Async functions passed to transitions/forms; React auto-tracks pending/error/optimistic state.
4. **What does `useActionState()` do?** Wires an Action to state, returns `[state, dispatchAction, pending]`.
5. **What does `useOptimistic()` do?** Renders an optimistic value immediately, reconciles/reverts once the real Action resolves.
6. **What does `useFormStatus()` do?** Reads pending status of the nearest parent `<form>` from any child, no prop drilling.
7. **What are Server Components?** Render only on the server, zero JS shipped, direct backend access.
8. **Server vs Client Components?** Server: no state/effects/browser APIs. Client (`'use client'`): can use them, ships JS.
9. **What changed with refs in React 19?** Function components accept `ref` as a normal prop; `forwardRef` mostly unnecessary now.
10. **When to use `useMemo`?** Only for genuinely expensive computations that measurably affect render time.
11. **When to use `useCallback`?** When the function's identity is passed to a memoized child or used as an effect dependency.
12. **`useEffect` vs event handlers?** Effects sync with external systems after render; user-triggered logic belongs in event handlers, not effects.
13. **Controlled vs uncontrolled inputs?** Controlled: React state drives the value. Uncontrolled: the DOM holds the value, read via `ref`.
14. **How does reconciliation work?** React diffs the new element tree vs the previous one by type + key, and patches only the changed real-DOM nodes.
15. **What is the Virtual DOM, concretely?** An in-memory JS object tree mirroring the UI; React diffs two VDOM trees (not the real DOM) to compute the minimal set of real-DOM mutations needed.
16. **Function vs class components?** Function components + hooks are the modern default (less boilerplate, no `this` binding); class components remain only for error boundaries and legacy code.
17. **What is a HOC?** A function that wraps a component to inject extra behavior/props (e.g. `withAuth`) — mostly superseded by custom hooks.
18. **What is a Portal?** `createPortal()` renders children into a DOM node outside the parent hierarchy while keeping React's event bubbling — used for modals/tooltips.
19. **What does `<StrictMode>` do?** Dev-only double-invocation of renders/effects to surface side-effect bugs early; no production impact.
20. **What is an error boundary?** A class component using `getDerivedStateFromError`/`componentDidCatch` to catch render errors in its subtree and show a fallback UI; no hook equivalent exists.
21. **Why can't hooks be called conditionally?** React relies on **call order** across renders to match hook state to the right hook (linked-list-like internal bookkeeping) — conditional calls break that order. (`use()` is the sanctioned exception in React 19.)
22. **What is prop drilling and how do you avoid it?** Passing props through many intermediate components that don't need them; avoid via Context, composition, or state colocation.
23. **What is the difference between `state` and `props`?** `props` = read-only data passed from parent; `state` = local, mutable (via setter), owned by the component.
24. **What is a synthetic event?** React's cross-browser wrapper around native DOM events, normalizing behavior; pooled in older React versions (no longer pooled from React 17+).
25. **What is automatic batching?** React 18+ batches multiple `setState` calls into one re-render even inside promises/timeouts/native handlers, not just React event handlers; opt out with `flushSync()`.
26. **`useTransition` vs `useDeferredValue`?** `useTransition` wraps a state-setting action *you* trigger as low-priority; `useDeferredValue` gives a lagging copy of a value whose update you don't control.
27. **What is `useSyncExternalStore` for?** Safely subscribing to an external (non-React) store under concurrent rendering — used internally by state libraries like Redux/Zustand, rarely called directly in app code.
28. **How do you test a React component?** Jest + React Testing Library — render it, query by role/text like a user would, assert on visible output rather than internal implementation details.

---

## 18. Decision Guide — Which API Do I Need?

| Need | Use |
|---|---|
| Local state | `useState` / `useReducer` |
| Side effect after render | `useEffect` |
| Mutable value, no re-render | `useRef` |
| State shared across many components | Context, or Redux/Zustand for app-wide scale |
| Read an async resource during render | `use()` |
| Form pending/result state | `useActionState()` |
| Instant optimistic UI | `useOptimistic()` |
| A form's pending status in a child | `useFormStatus()` |
| Reduce bundle size | Server Components / `lazy()` |
| A performance optimization | Profile first, memoize only if proven |
| Client-side page navigation | React Router (`Routes`/`Route`/`Link`) |
| Cross-cutting logic reuse | Custom hook (preferred) or HOC (legacy) |
| Auth-gated pages | Route guard + JWT in memory/HttpOnly cookie |
| Live server push | WebSocket (bi-directional) or SSE (server→client only) |
| Long lists from an API | Paginate (page-based or infinite scroll) + virtualize if 1000+ rows |
| Update UI without blocking urgent input | `useTransition` |
| Lagging copy of a value you don't control | `useDeferredValue` |
| Subscribe to a non-React store safely | `useSyncExternalStore` |
| Verify component behavior | Jest + React Testing Library |

---

## 19. Final One-Page Cheat Sheet

- **Derive, don't sync** — compute values during render instead of syncing state via effects.
- **Keep state local** — lift to Context/Redux only when truly shared.
- **Let Actions own async status** — `useActionState`/`useOptimistic`/`useFormStatus` instead of manual pending/error `useState`.
- **Measure before you memoize** — Profiler first, `memo`/`useMemo`/`useCallback` only on proven bottlenecks.
- **Push data-fetching to the server when you can** — Server Components / SSR reduce client JS and waterfalls.
- **Stable keys, always** — never array index on reorderable lists.
- **Composition over inheritance/drilling** — custom hooks and `children` over HOCs and deep prop chains.
- **Cleanup everything with a lifetime** — effects, subscriptions, WebSockets — always return a cleanup function.
- **Let low-priority updates yield** — `useTransition`/`useDeferredValue` for expensive UI work, automatic batching handles the rest for free.
- **Test what users see** — Jest + React Testing Library for unit/component tests (query by role/text, not implementation detail), Cypress/Playwright for e2e; Enzyme is legacy.

---

## Appendix: JS Essentials & TypeScript Quick Reference

*(General JS/TS facts relevant to React, condensed from the interview-question source — for a fast refresher only, not a full JS/TS guide.)*

| JS Concept | Quick Fact |
|---|---|
| `var` vs `let`/`const` | `var` is function-scoped (leaks out of blocks); `let`/`const` are block-scoped; `const` can't be reassigned. |
| Arrow functions | `(a, b) => a + b` — concise syntax, and (unlike `function`) does **not** bind its own `this`, inheriting it from the enclosing scope — why arrow functions avoid class `this`-binding issues. |
| Pure vs impure functions | Pure: same input → same output, no side effects (safe to memoize). Impure: can return different results or mutate outside state. |
| Higher-order function | A function that takes and/or returns another function (e.g. `.map()`, `useCallback`, HOCs). |
| Spread vs Rest | Spread (`...arr`) expands an iterable into individual elements (copy/merge arrays or props). Rest (`...args`) collects remaining arguments into an array. |
| Destructuring | `const [a, b] = arr;` / `const {x, y} = obj;` — pulls values into named variables (used constantly in hooks: `const [state, setState] = useState()`). |
| Promises | Object representing a future async result: `pending` → `resolved`/`rejected`, handled via `.then()`/`.catch()` or `async`/`await`. |
| `async`/`await` | `async` marks a function non-blocking; `await` (inside an async function only) pauses until the awaited Promise settles. |
| Template literals | `` `Hello ${name}` `` — backtick strings with embedded expressions and multiline support. |
| Classes | `class X { constructor(){...} }` — blueprint for objects; `this` refers to the current instance. |

| TypeScript with React | Quick Fact |
|---|---|
| Why TS | Superset of JS adding static types — catches type mismatches at compile time instead of runtime. |
| Typing props | `type Props = { name: string; age?: number }; function User({name, age}: Props) {...}` |
| Typing `useState` | `useState<number>(0)` — usually inferred, annotate when the initial value doesn't reveal the full type (e.g. `useState<User \| null>(null)`). |
| `any` | Disables type-checking entirely for that value — flexible but unsafe, avoid where possible. |
| `void` vs `never` | `void` = returns nothing. `never` = never returns normally (e.g. always throws). |
| `interface` vs `type` | Both describe object shapes; `interface` supports declaration merging and is conventional for props; `type` supports unions/intersections more flexibly. |
| `extends` vs `implements` | `extends` = class inherits from a base class. `implements` = class must satisfy an interface's contract; a class can `implement` multiple interfaces (TS has no multiple class inheritance). |
| Generics | `function useFetch<T>(url: string): T {...}` — reusable, type-safe hooks/components across different data shapes. |
| Enum | `enum Direction { North, South }` — named constant set, avoids magic numbers/strings. |
