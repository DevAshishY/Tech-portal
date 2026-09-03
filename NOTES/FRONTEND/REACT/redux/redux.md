# Redux Toolkit — Practical & Interview Notes

> **Goal:** Learn Redux Toolkit practically instead of memorizing theory.

---

## 1. What is Redux?

**Redux = centralized state management for shared application data.**

Think:

```text
                 Redux Store
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
       User         Cart         Products
```

### Why Redux?

* Avoid **prop drilling**
* Keep shared state in one place
* Predictable state updates
* Easy debugging with Redux DevTools

### Remember

> **Redux = One central place for shared state**

---

# 2. Redux Toolkit

Redux Toolkit (RTK) is the **recommended way to write Redux today**.

Install:

```bash
npm install @reduxjs/toolkit react-redux
```

---

# 3. Main Redux Concepts

Remember these **6 words**:

> **Store → Slice → Action → Reducer → Dispatch → Selector**

| Concept      | Easy Meaning                               |
| ------------ | ------------------------------------------ |
| **Store**    | Where Redux state lives                    |
| **Slice**    | State + reducers + actions for one feature |
| **Action**   | What happened                              |
| **Reducer**  | How state changes                          |
| **Dispatch** | Sends an action                            |
| **Selector** | Reads state                                |

### Memory Trick

```text
Action  = WHAT happened?
Reducer = HOW should state change?
Dispatch = SEND action
Selector = READ state
```

---

# 4. Redux Toolkit Flow ⭐

This is the most important diagram to remember.

```text
User clicks button
       ↓
dispatch(action)
       ↓
     Action
       ↓
    Reducer
       ↓
  State changes
       ↓
     Store
       ↓
useSelector()
       ↓
      UI
```

### Example

```js
dispatch(increment());
```

↓

```js
increment(state) {
  state.count += 1;
}
```

↓

```text
Store
count: 1
```

↓

```js
const count = useSelector(
  state => state.counter.count
);
```

↓

```text
UI shows: 1
```

---

# 5. Store

**Store = central place where Redux state lives.**

Example:

```js
// store.js

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
```

Think:

```text
Store
 ├── counter
 ├── user
 ├── cart
 └── products
```

Usually an application has **one Redux store**.

---

# 6. Slice

**Slice = one feature's state + reducers + actions.**

Examples:

```text
userSlice
cartSlice
productSlice
counterSlice
```

Create a slice:

```js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",

  initialState: {
    count: 0,
  },

  reducers: {
    increment: (state) => {
      state.count += 1;
    },

    decrement: (state) => {
      state.count -= 1;
    },
  },
});

export const {
  increment,
  decrement,
} = counterSlice.actions;

export default counterSlice.reducer;
```

### Remember

> **Slice = State + Reducers + Actions**

---

# 7. Action

**Action = describes WHAT happened.**

Example:

```js
dispatch(increment());
```

The action can look conceptually like:

```js
{
  type: "counter/increment"
}
```

With data:

```js
dispatch(setUser(user));
```

Conceptually:

```js
{
  type: "user/setUser",
  payload: user
}
```

### Remember

> **Action = WHAT happened?**

---

# 8. Payload

**Payload = data sent with an action.**

Example:

```js
dispatch(setUser({
  id: 1,
  name: "Ashish"
}));
```

The data is the payload:

```js
{
  id: 1,
  name: "Ashish"
}
```

Reducer:

```js
setUser: (state, action) => {
  state.user = action.payload;
}
```

### Remember

```text
Action
 ├── type
 └── payload → actual data
```

---

# 9. Reducer

**Reducer = defines HOW state changes.**

Example:

```js
reducers: {
  increment: (state) => {
    state.count += 1;
  }
}
```

The reducer receives:

```text
Current State
      +
   Action
      ↓
 New State
```

Example:

```js
setName: (state, action) => {
  state.name = action.payload;
}
```

### Important

Reducers should be **predictable** and should not perform API calls or other side effects.

---

# 10. Immer in Redux Toolkit

You may notice this:

```js
state.count += 1;
```

Normally, Redux follows immutable updates.

RTK uses **Immer**, which allows this convenient syntax inside reducers.

You can write:

```js
state.count += 1;
```

instead of manually creating a new object.

### Remember

> **RTK + Immer = simple-looking immutable updates**

---

# 11. `useSelector()`

`useSelector()` is used to **READ data from Redux**.

```js
import { useSelector } from "react-redux";

const count = useSelector(
  state => state.counter.count
);
```

Think:

```text
useSelector
    ↓
READ Redux Store
```

### Memory Trick

> **Selector = READ**

---

# 12. `useDispatch()`

`useDispatch()` is used to **SEND actions to Redux**.

```js
import { useDispatch } from "react-redux";
import { increment } from "./counterSlice";

const dispatch = useDispatch();

dispatch(increment());
```

Think:

```text
useDispatch
     ↓
SEND Action
```

### Memory Trick

> **Dispatch = SEND**

---

# 13. `useSelector` + `useDispatch`

Most common Redux pattern:

```js
const count = useSelector(
  state => state.counter.count
);

const dispatch = useDispatch();

const handleClick = () => {
  dispatch(increment());
};
```

Simple memory:

```text
useSelector → READ
useDispatch → CHANGE
```

---

# 14. Provider

React needs access to the Redux store.

Wrap the application with `Provider`.

```jsx
import { Provider } from "react-redux";
import { store } from "./store";

<Provider store={store}>
  <App />
</Provider>
```

Think:

```text
Provider
   ↓
Makes Redux Store available
   ↓
Entire React App
```

---

# 15. Complete Redux Toolkit Example

## Folder Structure

```text
src/
│
├── store/
│   ├── store.js
│   └── counterSlice.js
│
├── App.jsx
└── main.jsx
```

---

## Step 1 — Slice

```js
// counterSlice.js

import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",

  initialState: {
    count: 0,
  },

  reducers: {
    increment: (state) => {
      state.count += 1;
    },

    decrement: (state) => {
      state.count -= 1;
    },
  },
});

export const {
  increment,
  decrement,
} = counterSlice.actions;

export default counterSlice.reducer;
```

---

## Step 2 — Store

```js
// store.js

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
```

---

## Step 3 — Provider

```jsx
// main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store/store";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

---

## Step 4 — Use Redux in Component

```jsx
// App.jsx

import { useSelector, useDispatch } from "react-redux";

import {
  increment,
  decrement,
} from "./store/counterSlice";

function App() {
  const count = useSelector(
    state => state.counter.count
  );

  const dispatch = useDispatch();

  return (
    <>
      <h1>{count}</h1>

      <button
        onClick={() => dispatch(increment())}
      >
        +
      </button>

      <button
        onClick={() => dispatch(decrement())}
      >
        -
      </button>
    </>
  );
}

export default App;
```

---

# 16. Complete Flow of the Example

When user clicks `+`:

```text
Button Click
     ↓
dispatch(increment())
     ↓
Action
     ↓
counter Reducer
     ↓
count += 1
     ↓
Redux Store Updated
     ↓
useSelector()
     ↓
Component Re-renders
```

---

# 17. Redux Principles

There are **3 important Redux principles**.

## 1. Single Source of Truth

Application state is managed through a centralized store.

```text
One Store
   ↓
Application State
```

---

## 2. State is Read-Only

Don't directly modify Redux state from components.

```js
// ❌ Don't do this
store.count = 10;
```

Instead:

```js
// ✅
dispatch(setCount(10));
```

---

## 3. Changes Through Reducers

```text
Action
  ↓
Reducer
  ↓
New State
```

### Memory

> **One Store → Dispatch Action → Reducer Changes State**

---

# 18. Why Redux?

### Problem without Redux

Imagine:

```text
App
 ↓
Dashboard
 ↓
Header
 ↓
UserProfile
 ↓
Button
```

If the button needs user data, you may need to pass props through many components.

This is called:

> **Prop Drilling**

---

### Redux Solution

```text
          Redux Store
          /         \
         ↓           ↓
     Header       UserProfile
                      ↑
                    Button
```

Any component can access the shared state through Redux.

### Main Benefits

* Avoid prop drilling
* Centralized state
* Predictable updates
* Easier debugging
* Useful for complex shared state

---

# 19. When Should You Use Redux?

Good examples:

```text
User authentication
Shopping cart
Global filters
User permissions
Application configuration
Large shared state
```

Don't automatically put every piece of state in Redux.

For example, simple local UI state can remain in:

```js
useState()
```

### Rule

> **Local state → useState**
> **Shared/global state → Redux**

---

# 20. Async Operations in Redux

Redux needs middleware for async logic.

The most common approach in Redux Toolkit is:

> **Redux Thunk**

RTK provides thunk support by default through `configureStore()`.

---

# 21. Redux Thunk

**Thunk = allows async logic such as API calls.**

Example:

```js
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUser = createAsyncThunk(
  "user/getUser",

  async () => {
    const response = await fetch("/api/user");

    return response.json();
  }
);
```

Flow:

```text
Component
    ↓
dispatch(getUser())
    ↓
API Call
    ↓
pending
    ↓
fulfilled / rejected
    ↓
Store
    ↓
UI
```

### Memory

> **Thunk = Redux + Async/API**

---

# 22. `createAsyncThunk`

`createAsyncThunk()` helps manage API requests.

```js
export const getUser = createAsyncThunk(
  "user/getUser",
  async () => {
    const response = await fetch("/api/user");

    return response.json();
  }
);
```

It automatically gives you:

```text
pending
fulfilled
rejected
```

Example:

```js
extraReducers: (builder) => {
  builder
    .addCase(getUser.pending, (state) => {
      state.loading = true;
    })

    .addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })

    .addCase(getUser.rejected, (state) => {
      state.loading = false;
    });
}
```

---

# 23. Thunk vs Saga vs Promise

|                 | Thunk               | Saga              | Promise Middleware | Listener Middleware              |
| --------------- | ------------------- | ----------------- | ------------------- | --------------------------------- |
| Complexity      | Easy                | Complex           | Medium               | Easy–Medium                       |
| Async           | ✅                   | ✅                 | ✅                    | ✅                                  |
| API calls       | ✅                   | ✅                 | ✅                    | ✅ (inside `effect`)               |
| Common with RTK | ✅                   | Less common       | Less common          | ✅ (built into RTK, newer)         |
| Best for        | Simple/normal async | Complex workflows | Promise-based flow  | React to an action/state change  |

### Interview Answer

> **Thunk is simpler and commonly used for API calls. Saga is more powerful for complex side-effect orchestration, cancellation, and complex workflows. `createListenerMiddleware` is RTK's newer, lighter built-in alternative to Saga for simple "listen and react" side effects.**

```js
listenerMiddleware.startListening({
  actionCreator: todoAdded,
  effect: async (action, listenerApi) => {
    console.log("Added:", action.payload);
  },
});
```

---

# 24. RTK Query ⭐

**RTK Query = Redux Toolkit's built-in data-fetching & caching layer.**

No more hand-written thunks + manual `loading`/`error` state for every API call.

```text
createApi()
     ↓
fetchBaseQuery()
     ↓
endpoints: query (READ) / mutation (WRITE)
     ↓
auto-generated hooks
     ↓
Component
```

### Define the API

```js
// apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),

  tagTypes: ["Post"],

  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: ["Post"],
    }),

    addPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddPostMutation,
} = apiSlice;
```

### Add to Store

```js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
```

### Use in Component

```jsx
const { data, isLoading } = useGetPostsQuery();
const [addPost] = useAddPostMutation();
```

`query` = GET data (cached automatically). `mutation` = POST/PUT/DELETE (changes data).
`providesTags` says "this response IS Post data". `invalidatesTags` says "Post data is now stale — refetch it automatically."

### Memory Trick

> **RTK Query = fetch() + cache + loading + error, all generated for you**
> **query = READ, mutation = WRITE, tags = auto-refetch**

---

# 25. `createSelector` (Memoized Selectors)

Plain `useSelector` recalculates its return value on **every** store update — even for derived/computed data.

**`createSelector` memoizes the result** — it only recomputes when its input values actually change.

```js
import { createSelector } from "@reduxjs/toolkit";

const selectItems = (state) => state.cart.items;

export const selectTotal = createSelector(
  [selectItems],
  (items) => items.reduce((sum, i) => sum + i.price, 0)
);
```

Think:

```text
Input Selector(s)
      ↓
  Did input change?
   No → return cached result
   Yes → recompute
```

Use it for expensive derived data — totals, filters, sorted/grouped lists — so components don't re-render for no reason.

### Memory Trick

> **Selector = READ, createSelector = READ + CACHE**

---

# 26. `createEntityAdapter`

Storing lists as raw arrays makes lookups/updates slow — `find()`/`filter()` on every render.

**`createEntityAdapter` normalizes state** into `ids` (array of IDs) + `entities` (object keyed by ID) — like a mini database table.

```js
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter();

const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState(),
  reducers: {
    userAdded: usersAdapter.addOne,
    userUpdated: usersAdapter.updateOne,
    userRemoved: usersAdapter.removeOne,
  },
});

export const usersSelectors = usersAdapter.getSelectors(
  (state) => state.users
);
```

Resulting shape:

```text
state.users
 ├── ids:      [1, 2, 3]
 └── entities: { 1: {...}, 2: {...}, 3: {...} }
```

Lookup by ID becomes `entities[id]` — instant, instead of looping the whole array.

### Remember

> **Normalized state = array of IDs + object of items → fast lookup, easy update**

---

# 27. Middleware (General Concept)

**Middleware = code that sits between `dispatch()` and the reducer.**

It can inspect, log, delay, or even stop an action before it reaches the reducer.

```text
dispatch(action)
       ↓
   Middleware
 (log / delay / modify)
       ↓
    Reducer
       ↓
  New State
```

A tiny custom logger middleware:

```js
const logger = (store) => (next) => (action) => {
  console.log("dispatching", action);
  return next(action);
};
```

Thunk (Section 21) and RTK Query's `apiSlice.middleware` (Section 24) are both just **middleware** — that's how they intercept an async action and handle it before it ever reaches a reducer.

### Remember

> **Middleware = the checkpoint between "action sent" and "reducer runs"**

---

# 28. TypeScript with Redux Toolkit

Two types you define once in `store.ts`, then reuse everywhere.

```ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

Pre-typed hooks — use these instead of the plain `useSelector`/`useDispatch`:

```ts
// hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Typed payload inside a slice:

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

setName: (state, action: PayloadAction<string>) => {
  state.name = action.payload;
}
```

### Memory Trick

> **RootState = shape of the store, AppDispatch = shape of dispatch, PayloadAction\<T\> = shape of the payload**

---

# 29. serializableCheck Gotcha ⚠️

`configureStore()` adds a **serializable state check** by default — it warns when non-serializable values end up in Redux state:

```text
Dates
Promises
Class instances
Functions
File / Blob objects
```

### Why it matters

Non-serializable state breaks **time-travel debugging** and **persistence** — Redux DevTools / redux-persist can't serialize a class instance or a Promise.

If it's genuinely unavoidable, silence it narrowly — never disable the check globally:

```js
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ["upload/setFile"],
    },
  }),
```

### Important (interview trap)

> **Redux state must be plain, serializable data — same rule as "reducers shouldn't do API calls" (Section 9).**

---

# 30. `redux-persist`

Redux state lives **only in memory** — refresh the page and it's gone.

**`redux-persist` saves Redux state to storage** (`localStorage` on web, `AsyncStorage` in React Native) and restores it on reload.

```js
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const persistConfig = { key: "root", storage };
const rootReducer = combineReducers({ counter: counterReducer });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
```

Wrap the app with `<PersistGate persistor={persistor}>`.

### Remember

> **redux-persist = Redux state that survives a page refresh**

---

# 31. `connect()`

Before hooks, Redux commonly used:

```js
connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
```

`connect()` connects a React component to the Redux store.

---

# 32. `mapStateToProps`

Used to get Redux state and pass it as component props.

```js
const mapStateToProps = (state) => ({
  count: state.counter.count,
});
```

Think:

```text
Redux Store
     ↓
mapStateToProps
     ↓
Component Props
```

---

# 33. `mapDispatchToProps`

Used to provide dispatch actions to a component.

```js
const mapDispatchToProps = {
  increment,
};
```

Think:

```text
Component
    ↓
mapDispatchToProps
    ↓
Redux Actions
```

---

# 34. `connect()` vs Hooks

Modern Redux code usually uses hooks.

| Old Approach                 | Modern Approach                   |
| ---------------------------- | --------------------------------- |
| `connect()`                  | `useSelector()` + `useDispatch()` |
| `mapStateToProps`            | `useSelector()`                   |
| `mapDispatchToProps`         | `useDispatch()`                   |
| HOC                          | Hooks                             |
| Common with class components | Functional components             |

### Interview Answer

> `connect()` is the older Higher-Order Component approach. Modern React-Redux applications generally use `useSelector()` to read state and `useDispatch()` to dispatch actions.

---

# 35. Flux

**Flux = architecture pattern based on unidirectional data flow.**

Basic Flux flow:

```text
Action
  ↓
Dispatcher
  ↓
Store
  ↓
View
```

Redux follows the same general **one-way data flow** idea.

### Remember

> **Flux = One-way data flow architecture**

Redux is **not Flux**, but Redux was inspired by Flux concepts.

---

# 36. Redux vs Flux

| Redux                                | Flux                              |
| ------------------------------------ | --------------------------------- |
| Library                              | Architecture pattern              |
| One store is typical                 | Multiple stores are possible      |
| No separate dispatcher API like Flux | Has Dispatcher                    |
| Reducers manage state changes        | Stores manage state               |
| Common with React                    | Originally developed around React |

---

# 37. Redux DevTools

Redux DevTools helps you inspect:

```text
Actions
State
State changes
Action history
```

Example:

```text
Initial State
     ↓
increment
     ↓
count: 1
     ↓
increment
     ↓
count: 2
```

Useful for debugging state changes.

---

# 38. Important Interview Questions

### Q1. What is Redux?

> Redux is a state management library used to manage shared application state in a predictable way using a centralized store and unidirectional data flow.

---

### Q2. Why use Redux?

> Redux helps manage complex shared state, avoids prop drilling, centralizes state, and makes state changes predictable and easier to debug.

---

### Q3. What is Redux Toolkit?

> Redux Toolkit is the recommended way to write Redux logic. It simplifies store configuration, slice creation, reducers, actions, and immutable state updates.

---

### Q4. What is a Slice?

> A slice represents one feature of the Redux state and contains its initial state, reducers, and automatically generated action creators.

---

### Q5. What is a Reducer?

> A reducer defines how the state changes in response to an action.

---

### Q6. What is an Action?

> An action describes what happened and can contain additional data in its payload.

---

### Q7. What is Dispatch?

> Dispatch sends an action to Redux so that the corresponding reducer can update the state.

---

### Q8. What is `useSelector()`?

> `useSelector()` reads and subscribes to a specific part of the Redux store.

---

### Q9. What is `useDispatch()`?

> `useDispatch()` returns the dispatch function used to send actions to the Redux store.

---

### Q10. What is Redux Thunk?

> Redux Thunk is middleware that allows asynchronous logic, such as API calls, to be handled through dispatched functions.

---

### Q11. What is `createAsyncThunk()`?

> It is a Redux Toolkit utility for handling asynchronous operations and automatically generating pending, fulfilled, and rejected action states.

---

### Q12. `connect()` vs `useSelector()`?

> `connect()` is the older HOC-based approach, while `useSelector()` is the modern hooks-based approach for reading Redux state.

---

### Q13. What is Flux?

> Flux is an architecture pattern based on unidirectional data flow. Redux follows similar principles but is a separate library.

---

### Q14. What is RTK Query?

> RTK Query is Redux Toolkit's built-in data-fetching and caching layer. It generates hooks, handles loading/error state, and re-fetches data automatically — removing the need to hand-write thunks for most API calls.

---

### Q15. Difference between a `query` and a `mutation` in RTK Query?

> A `query` fetches/reads data and is cached automatically. A `mutation` sends a create/update/delete request and typically uses `invalidatesTags` to tell RTK Query which cached queries need to refetch.

---

### Q16. What is `createSelector` used for?

> `createSelector` creates a memoized selector — it recomputes derived data only when its input selectors change, avoiding unnecessary recalculation and re-renders for expensive derived state.

---

### Q17. What is `createEntityAdapter` and why use it?

> `createEntityAdapter` normalizes list data into an `ids` array and an `entities` lookup object, and generates CRUD reducers/selectors. It makes lookups and updates by ID fast instead of scanning arrays.

---

### Q18. Why type `RootState` and `AppDispatch`, and what does `PayloadAction<T>` do?

> `RootState` and `AppDispatch` give `useSelector`/`useDispatch` full type-safety across the app (usually wrapped as `useAppSelector`/`useAppDispatch`). `PayloadAction<T>` types the `action.payload` inside a slice reducer.

---

### Q19. What is Redux middleware?

> Middleware is a function that sits between `dispatch()` and the reducer, able to intercept, log, delay, or modify actions. Thunk, RTK Query's middleware, and `createListenerMiddleware` are all implemented as middleware.

---

# 39. Super Short Revision 🚀

If you have only **2 minutes before an interview**, remember this:

```text
Redux
 ↓
Central Store
 ↓
Slice
 ↓
Action = WHAT
 ↓
Reducer = HOW
 ↓
Dispatch = SEND
 ↓
Selector = READ
 ↓
createSelector = READ + CACHE
 ↓
RTK Query = fetch + cache + hooks, auto
```

### Most important code

```js
// READ
const count = useSelector(
  state => state.counter.count
);

// SEND
dispatch(increment());

// FETCH (RTK Query)
const { data, isLoading } = useGetPostsQuery();
```

### Most important flow

```text
User
 ↓
dispatch()
 ↓
Action
 ↓
Reducer
 ↓
Store
 ↓
useSelector()
 ↓
UI
```

### Six words

> **Store → Slice → Action → Reducer → Dispatch → Selector**

---

# 40. Practical Example to Build

To remember Redux properly, build a small application with:

```text
Redux Todo App

Features:
├── Add Todo
├── Delete Todo
├── Mark Complete
├── Filter Todos
└── API Fetch Todos
```

This will practice:

```text
createSlice()
configureStore()
useSelector()
useDispatch()
payload
reducers
createAsyncThunk()
extraReducers
loading
error
createApi()
useGetTodosQuery()
createSelector()
```

---

# 41. One-Page Memory Map

```text
                         REDUX
                           │
                    Central Store
                           │
                         Slice
                    ┌──────┴──────┐
                  State        Reducers
                                  │
                               Actions
                                  │
                              dispatch()
                                  │
                                  ↓
                                Store
                                  │
                    ┌─────────────┼──────────────┐
              useSelector()  createSelector()   RTK Query
               (READ)        (READ + CACHE)   (fetch+cache+hooks)
                                  │
                                  ↓
                                  UI
```

## Final Memory Formula

```text
STORE
  = Where data lives

SLICE
  = Feature state + reducers + actions

ACTION
  = What happened

REDUCER
  = How state changes

DISPATCH
  = Send action

SELECTOR
  = Read state

CREATESELECTOR
  = Read state + cache the result

RTK QUERY
  = Fetch + cache + loading/error, auto-generated

THUNK
  = Handle async/API logic
```

> **If you understand this flow, you understand the core of Redux Toolkit.**
