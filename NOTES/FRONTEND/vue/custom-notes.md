# Vue Ninjas 🥷

## SFC — 3 Blocks

```vue
<script setup>  ← logic (Composition API)
<template>      ← html
<style scoped>  ← css (only this component)
```

- Use `<template>` as the root wrapper when you don’t want an extra `<div>` rendered in the DOM.

## API Styles

### Options API (Traditional)

```vue
<script>
export default {
  data() {
    return { count: 0 }
  },
  mounted() {
    // code after the component has appeared in the DOM
  },
  methods: {
    onClick(event) {
      // use the native event object
    },
    onClickWithArg(item, event) {
      // both item and event are available
    },
  },
}
</script>
```

- `mounted()` is the hook for running code after the component has appeared in the DOM.
- Note: In Options API, use normal function syntax for `methods` and lifecycle hooks, not arrow functions, so `this` refers to the component instance.

### Reactivity Note

- Options API: Vue makes `data()` properties reactive automatically.
- Composition API: use `ref()` and `reactive()` to create reactive state.
- Vue reactivity is built on JavaScript `Proxy` objects, which track reads and writes.
- DOM updates are async; use `nextTick()` when you need to wait for the DOM after state changes.
- Vue also provides built-in instance properties starting with `$`, like `$refs`, `$attrs`, and `$emit`.

## Computed

Computed properties are reactive derived values that are cached and only re-computed when dependencies change.

- Read-only computed properties are defined with only a getter. Use a setter only when you need a writable computed property.

### Options API

```vue
<script>
export default {
  data() {
    return { count: 5 }
  },
  computed: {
    doubled() {
      return this.count * 2
    },
  },
}
</script>

<template>
  <p>{{ doubled }}</p>
</template>
```

### Composition API

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(5)
const doubled = computed(() => count.value * 2)
</script>

<template>
  <p>{{ doubled }}</p>
</template>
```

### Watchers vs computed

- Use `computed` for derived state that depends on reactive values and should be cached.
- Use `watch` when you need to perform side effects after state changes, such as fetching data, logging, or updating unrelated state.
- If you only need a new value from existing state, prefer `computed`.
- If you need to react asynchronously or run imperative code when a value changes, use `watch`.

````

## Components Usage

### Options API

```vue
<script>
import AboutView from './AboutView.vue'

export default {
  components: { AboutView },
}
</script>

<template>
  <AboutView />
</template>
````

### Composition API (Script Setup)

```vue
<script setup>
import AboutView from './AboutView.vue'  ← auto-registered
</script>

<template>
  <AboutView />
</template>
```

### Component Naming — PascalCase vs kebab-case

Vue allows **both** styles when writing a component tag in the template. They are treated as the same component.

```vue
<!-- ✅ PascalCase (recommended) -->
<MyButton />
<UserProfile />

<!-- ✅ kebab-case (also valid) -->
<my-button />
<user-profile />
```

| Style          | Example         | Where it's preferred                                             |
| -------------- | --------------- | ---------------------------------------------------------------- |
| **PascalCase** | `<MyButton />`  | ✅ Recommended in SFCs — visually distinct from native HTML tags |
| **kebab-case** | `<my-button />` | ✅ Required in non-SFC HTML templates (in-DOM)                   |

> 💡 **Key rules**
>
> - In **SFC templates** (`*.vue` files) prefer **PascalCase** — it makes it obvious the tag is a Vue component, not a native HTML element.
> - In **in-DOM templates** (plain HTML files where Vue is mounted) you **must** use kebab-case because browsers normalise tag names to lowercase.
> - The filename should match PascalCase: `MyButton.vue` → used as `<MyButton />`.
> - Both styles auto-close with `/>` for components without slot content.

### Global Component Registration

Register once in `main.ts` → available in **every** template, no local import needed.

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import MyButton from './components/MyButton.vue'

const app = createApp(App)

app.component('MyButton', MyButton) // register globally

app.mount('#app')
```

```vue
<!-- Any .vue file — no import required -->
<template>
  <MyButton />
</template>
```

- `app.component('Name', Component)` — first arg is the tag name used in templates.
- Chain multiple registrations:
  ```ts
  app.component('MyButton', MyButton).component('MyInput', MyInput).component('MyModal', MyModal)
  ```
- Use **PascalCase** as the registered name; Vue resolves both `<MyButton />` and `<my-button />` automatically.
- ⚠️ Global registration loses **tree-shaking** — prefer local registration unless the component is truly used everywhere (e.g. icons, base buttons, modals).
- Local import always **overrides** a global registration within that component.

### Class Binding on Components

Classes passed to a component are automatically merged with existing classes on the component's root element.

```vue
<!-- Parent -->
<MyComponent class="extra-class" />

<!-- Child (MyComponent) renders: -->
<p class="existing-class extra-class">Hi!</p>
```

For multi-root components, use `$attrs.class` to apply inherited classes explicitly:

```vue
<p :class="$attrs.class">Text</p>
<span>Other element</span>
```

## Directives

### `v-text`

Sets an element's textContent. Use instead of mustache when you only need text.

```vue
<template>
  <p v-text="message"></p>
</template>
```

### Mustache Interpolation

Double curly braces `{{ }}` insert text into templates (most common).

```vue
<template>
  <p>{{ message }}</p>
</template>
```

### `v-html`

Renders raw HTML from a string — only with trusted content (XSS risk).

```vue
<script setup>
const rawHtml = '<strong>Hello Vue</strong>'
</script>

<template>
  <div v-html="rawHtml"></div>
</template>
```

### `v-show`

Toggles element visibility with CSS (`display`), keeps element in DOM.

```vue
<template>
  <div v-show="visible">Visible content</div>
</template>
```

### `v-if` / `v-else-if` / `v-else`

Conditionally render elements (adds/removes from DOM).

- `v-if` and `v-else` are always used together when you need a fallback branch.
- `v-else` must appear immediately after `v-if` or `v-else-if` with no other sibling elements between.
- `v-if` and `v-for` should not be mixed on the same element; use a wrapper element or separate the directives.

```vue
<template>
  <p v-if="ok">Shown</p>
  <p v-else>Fallback</p>
</template>
```

### `v-for`

Render lists from arrays (always include a `:key`).

- Avoid using `v-if` on the same element as `v-for`; it can cause unexpected behavior.

- You can access the index with `v-for="(item, index) in items"`.
- Destructure directly from array items with `v-for="({ id, text }, index) in items"`.

```vue
<template>
  <li v-for="(item, index) in items" :key="item.id">{{ index }} - {{ item.text }}</li>
</template>
```

```vue
<template>
  <li v-for="({ id, text }, index) in items" :key="id">{{ index }} - {{ text }}</li>
</template>
```

### `v-on`

Attach event listeners. Shorthand is `@`.

- Use `v-on` or its shorthand `@` for event binding: `v-on:click="doThis"` is equivalent to `@click="doThis"`.
- Passing the native event:
  - Inline handlers can access the native event with `$event`: `@click="onClick($event)"`.
  - Prefer declaring the method and letting Vue pass the event: `@click="onClick"` with `onClick(event) { ... }`.
  - To pass both an argument and the event use: `@click="onClick(item, $event)"` and `onClick(item, event) { ... }`.

#### Event modifiers

- `@click.stop="doThis"` stops event propagation.
- `@submit.prevent="onSubmit"` prevents form submission from reloading the page.
- `@click.stop.prevent="doThat"` chains modifiers.
- `@submit.prevent` uses only the modifier, no handler required.
- `@click.self="doThat"` fires only when the event target is the element itself, not a child.
- `@click.once="doOnce"` runs the handler only once.

```vue
<a @click.stop="doThis">Stop propagation</a>
<form @submit.prevent="onSubmit">...</form>
<a @click.stop.prevent="doThat">Stop + prevent</a>
<form @submit.prevent>...</form>
<div @click.self="doThat">...</div>
```

#### Key aliases and system modifier keys

- Common key aliases:
  - `.enter`, `.tab`, `.delete` (captures both Delete and Backspace), `.esc`, `.space`, `.up`, `.down`, `.left`, `.right`
- System modifiers:
  - `.ctrl`, `.alt`, `.shift`, `.meta`

```vue
<input @keydown.enter="submit" />
<button @keydown.ctrl.enter="submitWithCtrl">Submit</button>
```

- When passing arguments, prefer `@click="onClick(item)"` and keep handler logic inside the method.
- Event handlers: prefer method handlers for non-trivial logic and use inline handlers only for very small actions.
  - Inline handler (quick, simple): `@click="count++"`.
  - Method handler (recommended for clarity/testability): `@click="increment"` where `increment()` is defined in `methods` or `<script setup>`.

```vue
<script>
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    },
  },
}
</script>

<template>
  <button @click="increment">+1</button>
</template>
```

### `v-bind`

Bind attributes or props. Shorthand is `:`.

```vue
<script setup>
const url = 'https://vuejs.org'
</script>

<template>
  <a v-bind:href="url">Vue Docs</a>
</template>
```

### `v-model`

Two-way binding for form inputs.

- Use `v-model` to sync form fields with component state.
- Works for text inputs, `<textarea>`, `<select>`, checkboxes, and radios.
- Vue chooses the right DOM prop/event:
  - text and `<textarea>`: `value` + `input`
  - checkbox/radio: `checked` + `change`
  - select: `value` + `change`
- Initial state should come from JavaScript, not from the HTML attribute.

```vue
<template>
  <input v-model="name" placeholder="edit me" />
</template>
```

#### `v-model` modifiers

- `v-model.lazy` syncs on `change` instead of `input`.
- `v-model.number` converts input to a number when possible.
- `v-model.trim` removes leading/trailing whitespace.

```vue
<input v-model.lazy="msg" />
<input v-model.number="age" />
<input v-model.trim="msg" />
```

### `v-slot`

Define or consume slots (scoped slots use a slot prop).

```vue
<MyList v-slot="{ item }">
  <div>{{ item }}</div>
</MyList>
```

### `v-pre`

Skip compilation on element and children (useful for raw mustache examples).

```vue
<pre v-pre>{{ raw }}</pre>
```

### `v-once`

Render element once and skip future updates.

```vue
<div v-once>{{ staticText }}</div>
```

### `v-memo`

Optimize repeated render by memoizing a sub-tree (Vue 3.4+).

```vue
<div v-memo="[count]">{{ expensive }}</div>
```

### `v-cloak`

Hide uncompiled mustache until Vue mounts (needs CSS `[v-cloak]{display:none}`).

```html
<div v-cloak>{{ message }}</div>
```

## Watchers

Watchers let you run code in response to reactive state changes. They are useful when a value changes and you need to perform side effects, such as fetching data, logging, or updating unrelated state.

- `watch` is not for computing a new value; it is for reacting to changes.
- You can watch a ref, a computed value, or a function that returns reactive state.
- The watcher callback receives `newValue` and `oldValue`.
- Use `immediate: true` for eager watchers that run once immediately on setup.
- Use `once: true` to run the callback only one time when the source changes.
- Use `onCleanup()` or `onWatcherCleanup()` to cancel stale async work when the watcher re-runs.

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Ask a yes/no question.')
const loading = ref(false)

watch(question, async (newQuestion, oldQuestion) => {
  if (!newQuestion.includes('?')) {
    answer.value = 'Questions usually contain a question mark.'
    return
  }

  loading.value = true
  answer.value = 'Thinking...'

  try {
    const res = await fetch('https://yesno.wtf/api')
    answer.value = (await res.json()).answer
  } catch (error) {
    answer.value = 'Error! Could not reach the API.'
  } finally {
    loading.value = false
  }
})

// deep watcher example
const user = ref({ name: 'Alice', address: { city: 'NY' } })

watch(
  user,
  (newValue, oldValue) => {
    console.log('user changed', newValue)
  },
  { deep: true },
)
</script>

<template>
  <div>
    <input v-model="question" :disabled="loading" placeholder="Ask a question" />
    <p>{{ answer }}</p>
  </div>
</template>
```

## Watchers vs computed

- Use `computed` when you need a derived value that is based on reactive state and should be cached.
- Use `watch` when you need to perform side effects or run imperative logic after state changes.
- Prefer `computed` for pure data derivation, and `watch` for tasks like API calls, logging, or updating unrelated state.

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const count = ref(1)
const doubled = computed(() => count.value * 2)

watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
})
</script>

<template>
  <div>
    <p>count: {{ count }}</p>
    <p>doubled: {{ doubled }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>
```

## Callback Flush Timing

When you mutate reactive state, it may trigger both Vue component updates and watcher callbacks created by you.

Similar to component updates, user-created watcher callbacks are batched to avoid duplicate invocations. For example, we probably don't want a watcher to fire a thousand times if we synchronously push a thousand items into an array being watched.

By default, a watcher's callback is called **after parent component updates** (if any), and **before the owner component's DOM updates**. This means if you attempt to access the owner component's own DOM inside a watcher callback, the DOM will be in a pre-update state.

### Post Watchers

If you want to access the owner component's DOM in a watcher callback **after** Vue has updated it, you need to specify the `flush: 'post'` option:

```js
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post',
    },
  },
}
```

### Sync Watchers

It's also possible to create a watcher that fires **synchronously**, before any Vue-managed updates:

```js
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'sync',
    },
  },
}
```

> ⚠️ **Use with Caution** — Sync watchers do not have batching and trigger every time a reactive mutation is detected. It's ok to use them to watch simple boolean values, but avoid using them on data sources that might be synchronously mutated many times, e.g. arrays.

### `this.$watch()`

It's also possible to imperatively create watchers using the `$watch()` instance method:

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  },
}
```

This is useful when you need to conditionally set up a watcher, or only watch something in response to user interaction. It also allows you to stop the watcher early.

### Stopping a Watcher

Watchers declared using the `watch` option or the `$watch()` instance method are automatically stopped when the owner component is unmounted, so in most cases you don't need to worry about stopping the watcher yourself.

In the rare case where you need to stop a watcher before the owner component unmounts, the `$watch()` API returns a function for that:

```js
const unwatch = this.$watch('foo', callback)

// ...when the watcher is no longer needed:
unwatch()
```

## Lifecycle Methods

Every Vue component goes through a **create → mount → update → unmount** cycle. Hooks let you run code at each stage.

### Quick-Reference Table

| Stage            | Options API hook  | Composition API (`<script setup>`)       | When it runs                                              |
| ---------------- | ----------------- | ---------------------------------------- | --------------------------------------------------------- |
| Before create    | `beforeCreate()`  | _(no equivalent — use `setup()` itself)_ | Instance just initialized, before reactivity              |
| Created          | `created()`       | _(no equivalent — use `setup()` itself)_ | Reactive data ready, DOM not yet rendered                 |
| Before mount     | `beforeMount()`   | `onBeforeMount(cb)`                      | Template compiled, not in DOM yet                         |
| **Mounted** ✅   | `mounted()`       | `onMounted(cb)`                          | Component is in the DOM — best for DOM access / API calls |
| Before update    | `beforeUpdate()`  | `onBeforeUpdate(cb)`                     | Reactive state changed, DOM not yet re-rendered           |
| Updated          | `updated()`       | `onUpdated(cb)`                          | DOM re-rendered after state change                        |
| Before unmount   | `beforeUnmount()` | `onBeforeUnmounted(cb)`                  | Component is still fully functional                       |
| **Unmounted** ✅ | `unmounted()`     | `onUnmounted(cb)`                        | Best for cleanup: clear timers, unsubscribe               |

### Options API

```vue
<script>
export default {
  created() {
    // data is reactive, DOM not ready
    console.log('created')
  },
  mounted() {
    // DOM is ready — start API calls or access $refs here
    console.log('mounted')
  },
  updated() {
    // runs after every reactive update
  },
  unmounted() {
    // clean up: clear intervals, remove event listeners
  },
}
</script>
```

### Composition API

```vue
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  // DOM ready — fetch data, access refs
  console.log('mounted')
})

onUpdated(() => {
  // after every reactive update
})

onUnmounted(() => {
  // cleanup
  clearInterval(timer)
})
</script>
```

> 💡 **Key rules**
>
> - `mounted` / `onMounted` → fetch data, access DOM refs.
> - `unmounted` / `onUnmounted` → always clean up timers and subscriptions.
> - There is **no** `beforeCreate` / `created` in `<script setup>` — the `setup()` function itself runs at that stage.
> - Avoid heavy synchronous work in `updated` — it fires on every update.

---

## Template Refs (`ref`)

`ref` on a DOM element or child component gives you a direct reference to the underlying node / component instance — useful when you need to imperatively focus, scroll, or call a method.

### Composition API

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 1. Declare a ref with the SAME name as the `ref` attribute in the template
const inputEl = ref(null)

onMounted(() => {
  inputEl.value.focus() // DOM is ready here
})
</script>

<template>
  <input ref="inputEl" />
</template>
```

#### Ref on a child component

```vue
<script setup>
import { ref } from 'vue'
import MyModal from './MyModal.vue'

const modal = ref(null)

function openModal() {
  modal.value.open() // calls a method exposed by MyModal
}
</script>

<template>
  <MyModal ref="modal" />
  <button @click="openModal">Open</button>
</template>
```

> ⚠️ With `<script setup>`, child components are **private by default** — the parent can only call methods the child explicitly exposes via `defineExpose` (see below).

### Options API

```vue
<script>
export default {
  mounted() {
    this.$refs.inputEl.focus() // access via this.$refs
  },
}
</script>

<template>
  <input ref="inputEl" />
</template>
```

#### `ref` inside `v-for`

When used inside `v-for`, the ref will be an **array** of elements after mount.

```vue
<script setup>
import { ref, onMounted } from 'vue'

const items = ref(['a', 'b', 'c'])
const itemRefs = ref([])

onMounted(() => {
  console.log(itemRefs.value) // [ <li>, <li>, <li> ]
})
</script>

<template>
  <li v-for="item in items" :key="item" :ref="(el) => itemRefs.value.push(el)">
    {{ item }}
  </li>
</template>
```

---

## `defineExpose` / `expose` Option

By default a `<script setup>` component exposes **nothing** to its parent. Use `defineExpose` to opt-in to a public interface.

### Composition API — `defineExpose`

```vue
<!-- MyInput.vue -->
<script setup>
import { ref } from 'vue'

const inputEl = ref(null)

function focus() {
  inputEl.value.focus()
}

function reset() {
  inputEl.value.value = ''
}

// Only `focus` and `reset` are visible to the parent
defineExpose({ focus, reset })
</script>

<template>
  <input ref="inputEl" />
</template>
```

```vue
<!-- Parent -->
<script setup>
import { ref } from 'vue'
import MyInput from './MyInput.vue'

const myInput = ref(null)

function handleClick() {
  myInput.value.focus() // ✅ exposed
  // myInput.value.inputEl — ❌ not exposed, inaccessible
}
</script>

<template>
  <MyInput ref="myInput" />
  <button @click="handleClick">Focus input</button>
</template>
```

### Options API — `expose` option

```vue
<script>
export default {
  expose: ['focus', 'reset'], // whitelist public methods/data

  data() {
    return { secret: 'hidden' }
  },

  methods: {
    focus() {
      this.$refs.inputEl.focus()
    },
    reset() {
      this.$refs.inputEl.value = ''
    },
  },
}
</script>
```

> 💡 **Key rules**
>
> - `ref` gives you a direct handle to a DOM node or child component instance.
> - Always read `ref.value` **after** `onMounted` / `mounted` — it is `null` before the component mounts.
> - `<script setup>` components are closed by default; use `defineExpose({ ... })` to publish a public API.
> - Options API uses `expose: [...]` to achieve the same whitelist behaviour.
> - Prefer component props/emits for normal data flow; reach for `ref` + `expose` only for imperative needs (focus, scroll, animations).

---

## Props

Props are the mechanism for passing data **from parent → child**.

### Declaration

**Composition API (`<script setup>`)**

```vue
<script setup>
const props = defineProps(['foo']) // array syntax
// OR
defineProps({ title: String, likes: Number }) // object syntax (preferred)
console.log(props.foo)
</script>
```

**Options API**

```js
export default {
  props: ['foo'], // or { title: String }
  created() {
    console.log(this.foo)
  },
}
```

**TypeScript**

```ts
defineProps<{ title?: string; likes?: number }>()
```

### Key Rules

- Props must be **explicitly declared** — undeclared attributes fall through as `$attrs`.
- Declare prop names in **camelCase** (`greetingMessage`), pass them in **kebab-case** from the parent (`greeting-message="hello"`).
- Static prop → plain string: `title="Hello"`. Any other type (Number, Boolean, Array, Object) → use `v-bind` / `:` to avoid passing a string: `:likes="42"`.
- Boolean prop without a value implies `true`: `<BlogPost is-published />`.
- Spread an entire object as props: `<BlogPost v-bind="post" />` (equivalent to passing each key separately).

### One-Way Data Flow (Read-Only)

- Props flow **down only** (parent → child). Never mutate a prop directly.
- If you need a local writeable copy:
  ```js
  const counter = ref(props.initialCounter)   // Composition
  data() { return { counter: this.initialCounter } } // Options
  ```
- If you need to transform a prop, wrap it in `computed`:
  ```js
  const normalized = computed(() => props.size.trim().toLowerCase())
  ```
- Objects/arrays passed as props: child **can** mutate nested properties (JS passes by reference), but it's a bad practice — emit an event instead.

### Prop Validation

```js
defineProps({
  propA: Number, // basic type
  propB: [String, Number], // multiple types
  propC: { type: String, required: true },
  propD: { type: Number, default: 100 },
  propF: { type: Object, default: (rawProps) => ({ message: 'hello' }) }, // factory fn for Object/Array
  propG: {
    validator(value) {
      return ['success', 'warning', 'danger'].includes(value)
    },
  },
})
```

- All props are **optional by default** unless `required: true`.
- Absent optional prop → `undefined` (Boolean → `false`).
- `null` / `undefined` bypass type checks.
- Validation runs **before** component creation — no access to component instance inside validators.

### Reactive Props Destructure (Vue 3.5+)

- Destructured props stay reactive in `<script setup>` (compiler auto-prepends `props.`):
  ```js
  const { foo = 'default' } = defineProps(['foo']) // ✅ reactive in 3.5+
  ```
- When passing a destructured prop to `watch` or a composable, wrap in a getter:
  ```js
  watch(() => foo, handler)
  useComposable(() => foo)
  ```

---

## `$emit` — Child → Parent Communication

Data flows **down** via props, events flow **up** via `$emit`.
When a child does something (click, submit, close), it emits an event; the parent listens and reacts.

### Simple Show / Hide Example

**Child — `ToggleBtn.vue`**

```vue
<script setup>
// Declare the events this component can emit
const emit = defineEmits(['toggle'])

function handleClick() {
  emit('toggle') // fire the event up to the parent
}
</script>

<template>
  <button @click="handleClick">Click Me</button>
</template>
```

**Parent — `App.vue`**

```vue
<script setup>
import { ref } from 'vue'
import ToggleBtn from './ToggleBtn.vue'

const visible = ref(false)

function onToggle() {
  visible.value = !visible.value // parent controls the state
}
</script>

<template>
  <ToggleBtn @toggle="onToggle" />
  <!-- listen to child event -->

  <p v-if="visible">👋 Hello! I am visible now.</p>
</template>
```

### Key Points

- **`defineEmits(['eventName'])`** — declares events in `<script setup>` (Composition API).
- **`emit('eventName', payload?)`** — fires the event; optional second arg is the payload passed to the parent handler.
- **Parent listens with `@event-name="handler"`** — same as a native DOM event listener.
- Event names: use **camelCase** in `defineEmits` / `emit()`; Vue auto-maps to **kebab-case** in the template (`@toggle`, `@my-event`).
- **Never mutate a prop** — always `emit` an event and let the parent update state.

### Emit with Payload

```vue
<!-- Child -->
<script setup>
const emit = defineEmits(['update'])
function save(value) {
  emit('update', value) // send data to parent
}
</script>
```

```vue
<!-- Parent -->
<MyForm @update="(val) => (myData = val)" />
```

### Options API

```js
// Child
export default {
  emits: ['toggle'],
  methods: {
    handleClick() {
      this.$emit('toggle')
    },
  },
}
```

```vue
<!-- Parent -->
<ToggleBtn @toggle="onToggle" />
```

> 💡 **Summary**
>
> - Child **emits** → Parent **listens** → Parent **updates state** → Child **re-renders via prop**
> - This keeps data flow predictable and one-directional.

---

## Slots

Slots let a **parent inject template content** into a child component — like a "hole" the child leaves open for the parent to fill.

### Default Slot

**Child — `Card.vue`**

```vue
<template>
  <div class="card">
    <slot />
    <!-- parent content goes here -->
  </div>
</template>
```

**Parent**

```vue
<Card>
  <p>Hello from the parent!</p>   <!-- fills the default slot -->
</Card>
```

### Named Slots

Use `name` to have **multiple slots** in one component.

**Child — `Layout.vue`**

```vue
<template>
  <header><slot name="header" /></header>
  <main><slot /></main>
  <!-- unnamed = default slot -->
  <footer><slot name="footer" /></footer>
</template>
```

**Parent**

```vue
<Layout>
  <template #header>🏠 My Header</template>
  <p>Main body content</p>
  <template #footer>© 2025</template>
</Layout>
```

> `#header` is shorthand for `v-slot:header`.

### Scoped Slots

Child **passes data back up** through the slot so the parent can use it.

**Child — `UserList.vue`**

```vue
<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      <slot :user="user" />
      <!-- expose user to parent -->
    </li>
  </ul>
</template>
```

**Parent**

```vue
<UserList v-slot="{ user }">
  <strong>{{ user.name }}</strong> — {{ user.email }}
</UserList>
```

> 💡 **Key rules**
>
> - Default slot → `<slot />` in child, content between tags in parent.
> - Named slots → `<slot name="x" />` in child, `<template #x>` in parent.
> - Scoped slots → child binds data on `<slot :key="val" />`, parent destructures with `v-slot="{ key }"`.
> - Slot content is **evaluated in the parent scope** — the child only controls where it renders.

### Conditional Slots

Use `$slots` inside the child to **check whether the parent actually provided content** for a slot — useful for showing fallback UI or skipping wrapper markup.

**Child — `Panel.vue`**

```vue
<template>
  <div class="panel">
    <!-- Only render the header block if the parent fills #header -->
    <div v-if="$slots.header" class="panel-header">
      <slot name="header" />
    </div>

    <div class="panel-body">
      <slot />
      <!-- default slot (always shown) -->
    </div>

    <!-- Footer with built-in fallback text -->
    <div class="panel-footer">
      <slot name="footer">
        <span>Default footer</span>
        <!-- shown when parent omits #footer -->
      </slot>
    </div>
  </div>
</template>
```

**Parent A — provides header, skips footer**

```vue
<Panel>
  <template #header>🔔 Alerts</template>
  <p>Some body content here.</p>
  <!-- no #footer → child shows "Default footer" -->
</Panel>
```

**Parent B — provides nothing extra**

```vue
<Panel>
  <p>Just the body.</p>
  <!-- no #header → header block is skipped entirely -->
  <!-- no #footer → fallback renders -->
</Panel>
```

> 💡 **Note**
>
> - `$slots.header` is `undefined` when the parent omits that slot — wrap with `v-if` to avoid empty wrappers in the DOM.
> - Put default content **inside** `<slot>…</slot>` as fallback; it renders only when the parent provides nothing.
> - `$slots.default` checks the default (unnamed) slot the same way.

---

### Receiving Data: Child → Parent via Scoped Slot

Normally data flows **parent → child** via props.  
With a **scoped slot**, the child can push its own internal data **back up** so the parent's template can use it — without emitting an event.

**How it works**

```
Child               Parent
──────────────      ──────────────────────────────
<slot :x="val" />  →  v-slot="{ x }"  →  use x in template
```

**Child — `Counter.vue`** _(exposes its count through the slot)_

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <!-- bind `count` onto the slot so the parent can read it -->
  <slot :count="count" :inc="() => count++" />
</template>
```

**Parent** _(receives count + inc and renders however it wants)_

```vue
<Counter v-slot="{ count, inc }">
  <p>Current count: {{ count }}</p>
  <button @click="inc">+1</button>
</Counter>
```

> 💡 **Note**
>
> - The child **binds** data on `<slot :key="value" />` — these are called **slot props**.
> - The parent **destructures** them with `v-slot="{ key }"` — identical syntax to scoped slots.
> - The parent controls the **look** (template); the child controls the **logic** (state, methods).
> - This pattern is sometimes called _"renderless components"_ — the child owns state, the parent owns markup.
> - For named scoped slots use: `<template #mySlot="{ key }">` in the parent.
