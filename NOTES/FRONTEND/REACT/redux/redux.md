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

|                 | Thunk               | Saga              | Promise Middleware |
| --------------- | ------------------- | ----------------- | ------------------ |
| Complexity      | Easy                | Complex           | Medium             |
| Async           | ✅                   | ✅                 | ✅                  |
| API calls       | ✅                   | ✅                 | ✅                  |
| Common with RTK | ✅                   | Less common       | Less common        |
| Best for        | Simple/normal async | Complex workflows | Promise-based flow |

### Interview Answer

> **Thunk is simpler and commonly used for API calls. Saga is more powerful for complex side-effect orchestration, cancellation, and complex workflows.**

---

# 24. `connect()`

Before hooks, Redux commonly used:

```js
connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);
```

`connect()` connects a React component to the Redux store.

---

# 25. `mapStateToProps`

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

# 26. `mapDispatchToProps`

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

# 27. `connect()` vs Hooks

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

# 28. Flux

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

# 29. Redux vs Flux

| Redux                                | Flux                              |
| ------------------------------------ | --------------------------------- |
| Library                              | Architecture pattern              |
| One store is typical                 | Multiple stores are possible      |
| No separate dispatcher API like Flux | Has Dispatcher                    |
| Reducers manage state changes        | Stores manage state               |
| Common with React                    | Originally developed around React |

---

# 30. Redux DevTools

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

# 31. Important Interview Questions

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

# 32. Super Short Revision 🚀

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
```

### Most important code

```js
// READ
const count = useSelector(
  state => state.counter.count
);

// SEND
dispatch(increment());
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

# 33. Practical Example to Build

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
```

---

# 34. One-Page Memory Map

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
                            useSelector()
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

THUNK
  = Handle async/API logic
```

> **If you understand this flow, you understand the core of Redux Toolkit.**
