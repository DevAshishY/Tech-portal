# Vue — Merged Notes (Custom + Pinia)

Generated: 2026-09-05

Summary
- Consolidated Vue 3 reference combining general component/templating/reactivity guidance with a focused Pinia (state management) cheat-sheet. Use this as a single quick-reference when building Vue apps.

Contents
- Core SFC & APIs
- Reactivity, computed, watchers
- Template directives & events (`v-if`, `v-for`, `v-model`, `v-on`, `v-bind`)
- Component registration & naming
- Pinia: installation, stores, state, getters, actions, testing, plugins

---

## 1. Single File Components (SFC)

Structure
```vue
<script setup>  ← logic (Composition API)
<template>      ← markup
<style scoped>  ← css (scoped to component)
```

- Prefer `script setup` with Composition API for new projects.
- Use `nextTick()` when you need to act after DOM updates.

---

## 2. Reactivity

- Options API: reactive state via `data()`.
- Composition API: `ref()` and `reactive()` for state.
- Vue reactivity uses `Proxy`; computed properties are cached until dependencies change.
- Use `computed` for derived values, `watch` for side-effects.

---

## 3. Template Essentials & Directives

- `v-if` / `v-else-if` / `v-else` — conditional rendering (adds/removes from DOM).
- `v-show` — toggles visibility (CSS display).
- `v-for` — lists; always use `:key`.
- `v-model` — two-way bindings; modifiers: `.lazy`, `.number`, `.trim`.
- `v-bind` (`:`) — bind props/attributes.
- `v-on` (`@`) — event listeners; use modifiers like `.prevent`, `.stop`, `.once`, `.self`.
- `v-html` — raw HTML (XSS risk; only use trusted content).

---

## 4. Component Registration & Naming

- Local import (preferred) preserves tree-shaking; global registration via `app.component()` makes components available everywhere but can lose tree-shaking.
- In SFCs prefer PascalCase tags (`<MyButton />`); use kebab-case in in-DOM templates.

---

## 5. Events & Class Binding

- Pass classes to components; child root merges them automatically. For multi-root, use `$attrs.class`.
- Prefer method handlers for non-trivial logic; inline handlers OK for tiny updates.

---

## 6. Pinia — State Management (Cheat-sheet)

Installation
```bash
npm install pinia
```

Setup (main.ts)
```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

Define a store (Options-style)
```ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ name: '', age: 0, role: 'viewer' }),
  getters: { isAdult: (s) => s.age >= 18 },
  actions: {
    async fetchUser(id) {
      const res = await api.get(`/users/${id}`)
      this.name = res.data.name
      this.age = res.data.age
    },
    setRole(role) { this.role = role }
  }
})
```

Setup-store (Composition-style)
```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubled, increment }
})
```

Using store in a component
```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
const store = useUserStore()
store.fetchUser(1)
</script>
<template>
  <p>{{ store.name }}</p>
  <button @click="store.fetchUser(1)">Load</button>
</template>
```

Key APIs
- `store.$patch({...})` — batch update multiple fields.
- `store.$reset()` — reset to initial state (Options stores).
- `storeToRefs(store)` — destructure state while preserving reactivity.

Testing
- Use `setActivePinia(createPinia())` in tests to create an isolated store environment.

Plugins
- Persist state with `pinia-plugin-persistedstate`.

Why Pinia
- Simpler API than Vuex, TypeScript-friendly, small bundle, first-class DevTools support.

---

## 7. Quick Reference / Cheats

Define/Use store
```ts
const store = useStore()
store.count        // state
store.double       // getter
store.increment()  // action
store.$patch({count:5})
```

Component event example
```vue
<button @click.prevent="submit">Submit</button>
```

List rendering
```vue
<li v-for="item in items" :key="item.id">{{ item.text }}</li>
```

---

Sources
- `custom-notes.md` (component, directives, patterns)
- `penia.md` (Pinia reference and examples)

---
Generated file: NOTES/FRONTEND/vue/merged-vue-notes.md
