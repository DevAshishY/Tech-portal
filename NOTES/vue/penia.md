# 🍍 Pinia — Vue State Management

> Official, lightweight state management for Vue 3 (and Vue 2).  
> Replaces Vuex with a simpler, fully typed API.

---

## 📋 Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Define a Store](#define-a-store)
- [State](#state)
- [Getters](#getters)
- [Actions](#actions)
- [Setup Store (Composition API)](#setup-store-composition-api)
- [Using Store in a Component](#using-store-in-a-component)
- [Batch Update — $patch](#batch-update--patch)
- [Reset State — $reset](#reset-state--reset)
- [DevTools](#devtools)
- [Testing](#testing)
- [Plugins](#plugins)
- [vs provide/inject](#vs-provideinject)
- [vs Vuex](#vs-vuex)

---

## Installation

```bash
npm install pinia
```

---

## Setup

```ts
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

---

## Define a Store

```ts
// stores/userStore.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    age: 0,
    role: 'viewer',
  }),

  getters: {
    isAdult: (state) => state.age >= 18,
    isAdmin: (state) => state.role === 'admin',
  },

  actions: {
    async fetchUser(id: number) {
      const res = await api.get(`/users/${id}`)
      this.name = res.data.name
      this.age  = res.data.age
    },
    setRole(role: string) {
      this.role = role
    },
  },
})
```

---

## State

- Reactive data of the store
- Always a **function** returning an object
- Mutate **directly** — no mutations needed

```ts
const store = useUserStore()

// Read
console.log(store.name)

// Mutate directly ✅
store.name = 'Ali'
store.age  = 25
```

---

## Getters

- Like `computed` — auto-cached
- Recalculate only when dependent state changes

```ts
getters: {
  isAdult: (state) => state.age >= 18,

  // Getter using another getter
  greeting(): string {
    return `Hello, ${this.name}. Admin: ${this.isAdmin}`
  },
}
```

```ts
// In component
store.isAdult  // ✅ boolean
store.greeting // ✅ string
```

---

## Actions

- Where all logic lives — sync & async
- Can call other actions or other stores
- `this` refers to the store instance

```ts
actions: {
  async fetchUser(id: number) {
    try {
      const res = await api.get(`/users/${id}`)
      this.name = res.data.name
    } catch (err) {
      console.error(err)
    }
  },

  logout() {
    this.$reset() // reset to initial state
  },
}
```

---

## Setup Store (Composition API)

Alternative syntax — uses `ref`, `computed`, functions directly.

```ts
// stores/counterStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)

  // getter
  const doubled = computed(() => count.value * 2)

  // action
  function increment() {
    count.value++
  }

  return { count, doubled, increment }
})
```

---

## Using Store in a Component

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()

// Read state / getters
console.log(store.name)
console.log(store.isAdult)

// Call action
store.fetchUser(1)

// Mutate directly
store.name = 'Updated Name'
</script>

<template>
  <p>{{ store.name }}</p>
  <p>Admin: {{ store.isAdmin }}</p>
  <button @click="store.fetchUser(1)">Load User</button>
</template>
```

### Destructuring with `storeToRefs`

```ts
import { storeToRefs } from 'pinia'

const store = useUserStore()

// ✅ Keep reactivity when destructuring state/getters
const { name, age, isAdult } = storeToRefs(store)

// Actions can be destructured normally (no storeToRefs needed)
const { fetchUser, setRole } = store
```

---

## Batch Update — $patch

Update multiple state properties at once.

```ts
// Object syntax
store.$patch({ name: 'Ali', age: 25 })

// Function syntax (for arrays, nested objects)
store.$patch((state) => {
  state.name = 'Ali'
  state.items.push({ id: 1 })
})
```

---

## Reset State — $reset

```ts
store.$reset() // resets to initial state values
```

> ⚠️ Only works with **Options Store** syntax, not Setup Store.

---

## DevTools

Pinia has **first-class Vue DevTools support**:

- ✅ View full state tree
- ✅ Time-travel debugging
- ✅ Action history & logs
- ✅ Edit state live in browser

> Install [Vue DevTools](https://devtools.vuejs.org/) browser extension.

---

## Testing

```ts
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/userStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

it('sets user name', () => {
  const store = useUserStore()
  store.name = 'Test User'
  expect(store.name).toBe('Test User')
})

it('isAdult returns true for age >= 18', () => {
  const store = useUserStore()
  store.age = 20
  expect(store.isAdult).toBe(true)
})
```

---

## Plugins

### Persist State to localStorage

```bash
npm install pinia-plugin-persistedstate
```

```ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

```ts
defineStore('user', {
  state: () => ({ name: '' }),
  persist: true, // ✅ auto-saved to localStorage
})
```

---

## vs provide/inject

| Feature | `provide/inject` | Pinia |
|---|---|---|
| Re-renders | ✅ Fine | ✅ Fine |
| DevTools | ❌ None | ✅ Full |
| TypeScript | ❌ Weak (string keys) | ✅ Strong |
| Scope | ❌ Component tree only | ✅ Truly global |
| Structure | ❌ No rules | ✅ state/getters/actions |
| Testing | ❌ Harder | ✅ Easy |
| Plugins | ❌ None | ✅ Rich ecosystem |

> **Use `provide/inject`** for library internals or passing config down a tree.  
> **Use Pinia** for all app-wide business state.

---

## vs Vuex

| Feature | Vuex | Pinia |
|---|---|---|
| Mutations | ✅ Required | ❌ Removed (not needed) |
| Modules | Complex, namespaced setup | Auto — each store = a module |
| TypeScript | ❌ Weak | ✅ Excellent |
| Composition API | ❌ Limited | ✅ First-class |
| Bundle size | ~9kb | ~1.5kb |
| DevTools | ✅ | ✅ Better |
| Actions (async) | ✅ | ✅ |
| Learning curve | Steeper | Simpler |

---

## 📌 Quick Cheat Sheet

```ts
// 1. Define
export const useStore = defineStore('id', {
  state: () => ({ count: 0 }),
  getters: { double: (s) => s.count * 2 },
  actions: { increment() { this.count++ } },
})

// 2. Use
const store = useStore()
store.count          // state
store.double         // getter
store.increment()    // action
store.$patch({ count: 5 })  // batch update
store.$reset()       // reset
```

---

> 📖 Official Docs: [pinia.vuejs.org](https://pinia.vuejs.org)