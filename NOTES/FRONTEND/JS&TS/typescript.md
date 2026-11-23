---

## Part A — Fundamentals & Type System

### TS-1. What is TypeScript and why use it?

JavaScript **plus a static type system**. It compiles to plain JS and **all types are erased** at runtime.

**Real-life:** a spell-checker for code. It catches mistakes while you write, but it isn't printed in the final letter.

**Benefits:** catch bugs early, better autocomplete and refactoring, self-documenting code.

⚠️ Types give **zero runtime safety**. API, form and JSON data must still be validated (Zod, TS-47).

### TS-2. What is structural typing?

TS compares types by **shape**, not by name. Same properties = compatible.

**Real-life:** a socket accepts any plug with the right pins, whatever the brand.

```ts
interface Point { x: number; y: number }
class Pixel { constructor(public x: number, public y: number) {} }

const p: Point = new Pixel(1, 2); // OK: same shape
```

🎯 Java/C# are **nominal** (names must match). Fake nominal types in TS with **branded types** (TS-20).

### TS-3. `interface` vs `type`?

| Feature | interface | type |
|---|---|---|
| Object shapes | ✅ | ✅ |
| Unions, tuples, primitives | ❌ | ✅ |
| Declaration merging | ✅ | ❌ |
| Extending | `extends` | `&` |
| Mapped / conditional types | ❌ | ✅ |

**Real-life:** `interface` = a job contract others can add clauses to. `type` = a formula you can combine any way.

🎯 `interface` for public object contracts (libraries, users can extend). `type` for unions and compositions. Interfaces also check slightly faster and give clearer errors in big codebases.

### TS-4. `any` vs `unknown` vs `never`?

| Type | Meaning | Real-life |
|---|---|---|
| `any` | type checking **off** | a stranger walks in, nobody checks |
| `unknown` | anything, but **check before use** | stranger must show ID first |
| `never` | value that **can't exist** | a door to a room that doesn't exist |

```ts
function parse(input: unknown) {
  if (typeof input === "string") return input.toUpperCase(); // OK after check
}

function fail(msg: string): never { throw new Error(msg); }
```

⚠️ `any` spreads silently through everything it touches. Prefer `unknown`.

### TS-5. `void` vs `undefined`?

`void` = "**don't use** the return value". A callback typed `() => void` may still return something; TS ignores it.

```ts
const list: number[] = [];
[1, 2].forEach((x) => list.push(x)); // OK, push returns a number but forEach ignores it
```

**Real-life:** "just drop the parcel at the door"; whether the courier also leaves a receipt doesn't matter.

### TS-6. Union vs intersection types?

- **Union `A | B`:** A **or** B.
- **Intersection `A & B`:** A **and** B (all properties).

```ts
type Id = string | number;
type Admin = User & { permissions: string[] };
```

**Real-life:** union = "pay by cash **or** card". Intersection = a phone that is a camera **and** a music player.

### TS-7. Literal types and `as const`?

A literal type is an exact value (`"GET"`, `42`). `as const` makes values deeply `readonly` and keeps literals.

```ts
const ROLES = ["admin", "user", "guest"] as const;
type Role = typeof ROLES[number]; // "admin" | "user" | "guest"
```

**Real-life:** writing in pen instead of pencil; the exact values are fixed.

🎯 This pattern replaces most enums, and you get a runtime array **and** a type from one source.

### TS-8. Should you use enums?

Problems: regular enums **generate runtime code**, numeric enums accept **any number**, `const enum` breaks with `isolatedModules` (esbuild, SWC, Babel), and enums aren't "erasable" (fail with Node type stripping, TS-49).

```ts
const Status = { Active: "ACTIVE", Closed: "CLOSED" } as const;
type Status = typeof Status[keyof typeof Status]; // "ACTIVE" | "CLOSED"
```

🎯 Prefer union literals or `as const` objects.

### TS-9. What are tuples?

Fixed-length arrays with a type per position.

```ts
type Range = [start: number, end: number]; // labelled
type Args = [string, ...number[]];          // variadic
```

**Real-life:** a form with fixed boxes: box 1 = name, box 2 = age.

🎯 `useState` returns a tuple: `[value, setValue]`.

### TS-10. `readonly` vs `const`?

- `const` → can't **reassign the variable**.
- `readonly` → can't **change the property**.

Both are **shallow**.

```ts
const user = { name: "A" };
user.name = "B";         // ✅ const doesn't protect properties

type U = { readonly name: string; tags: string[] };
declare const u: U;
// u.name = "B";         // ❌
u.tags.push("x");        // ✅ nested data still mutable
```

**Real-life:** `const` = your house address can't change; you can still rearrange furniture inside.

### TS-11. What is excess property checking?

Passing an object **literal** directly → TS errors on extra properties. Passing a **variable** skips it.

```ts
interface Opts { size: number }
const f = (o: Opts) => {};

f({ size: 1, colr: "red" }); // ❌ typo caught
const o = { size: 1, colr: "red" };
f(o);                         // ✅ no error
```

**Real-life:** a form checked at the counter catches typos; one posted inside an envelope isn't checked so closely.

### TS-12. What is `satisfies`?

Checks a value matches a type **without widening** its inferred type.

```ts
type Config = Record<string, string | number>;

const cfg = { port: 3000, host: "localhost" } satisfies Config;
cfg.port.toFixed(); // ✅ still number

const cfg2: Config = { port: 3000 };
// cfg2.port.toFixed(); // ❌ string | number
```

**Real-life:** a quality inspector stamps "approved" but doesn't repaint the product grey.

🎯 Annotation = checked **and** widened. `satisfies` = checked, **exact type kept**.

---

## Part B — Advanced Types

### TS-13. What are generics?

Type **parameters**: one function or type works with many types while keeping the input-output link.

```ts
function first<T>(arr: T[]): T | undefined { return arr[0]; }
const n = first([1, 2, 3]); // number | undefined
```

**Real-life:** a labelled container: whatever you put in, the label tells you what comes out.

⚠️ Without generics you'd use `any` and lose type information.

### TS-14. Generic constraints and defaults?

`extends` limits T; `=` gives a default.

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

type ApiResponse<T = unknown> = { data: T; error?: string };
```

**Real-life:** a car park that accepts "any car" but only if it fits the height limit.

🎯 **Golden rule:** if a type parameter appears only once in a signature, you probably don't need it.

### TS-15. `keyof`, `typeof` and indexed access?

```ts
const user = { id: 1, name: "A" };
type User = typeof user;   // { id: number; name: string }
type Keys = keyof User;    // "id" | "name"
type NameT = User["name"]; // string
```

- `typeof` → type of a runtime value.
- `keyof` → union of property names.
- `T[K]` → type of property K.

**Real-life:** `keyof` = reading the labels on a set of drawers; `T[K]` = opening one drawer to see what's inside.

### TS-16. What are conditional types?

Type-level if/else: `T extends U ? X : Y`.

```ts
type IsString<T> = T extends string ? true : false;
type A = IsString<"hi">; // true
```

They **distribute** over unions when T is a naked type parameter:

```ts
type ToArray<T> = T extends any ? T[] : never;
type R = ToArray<string | number>;               // string[] | number[]

type NoDist<T> = [T] extends [any] ? T[] : never; // (string | number)[]
```

**Real-life:** distributive = sorting each letter in a pile one by one, instead of judging the whole pile.

🎯 Wrapping in `[T]` turns distribution off.

### TS-17. What does `infer` do?

Captures a type from inside another type (only inside conditional types).

```ts
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;
type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T;
type X = Unwrap<Promise<Promise<number>>>; // number
```

**Real-life:** opening nested gift boxes until you find the actual gift.

### TS-18. What are mapped types?

Build a new type by looping over keys. `+/-readonly`, `+/-?` add/remove modifiers; `as` renames keys.

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
// Getters<{ name: string }> → { getName: () => string }
```

**Real-life:** photocopying every page of a form while changing each heading.

### TS-19. What are template literal types?

String types built like template strings: event names, routes, CSS values.

```ts
type Evt = "click" | "focus";
type Handler = `on${Capitalize<Evt>}`; // "onClick" | "onFocus"

type Params<S> = S extends `${string}:${infer P}/${infer Rest}`
  ? P | Params<`/${Rest}`>
  : S extends `${string}:${infer P}` ? P : never;

type P = Params<"/user/:id/post/:postId">; // "id" | "postId"
```

**Real-life:** a label printer that builds names from parts: "on" + "Click".

⚠️ TS 7 treats emoji (surrogate pairs) as one character in template inference; utilities relying on old behaviour may change.

### TS-20. What are branded (nominal) types?

Stop mixing values with the same base type (`UserId` vs `OrderId`, both strings).

```ts
type Brand<T, B> = T & { readonly __brand: B };
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

const toUserId = (s: string) => s as UserId; // only create through this
function getUser(id: UserId) {}

getUser("abc" as OrderId); // ❌ error
```

**Real-life:** two keys that look the same but are cut for different doors.

🎯 Real bugs this prevents: passing `orderId` where `userId` was expected, mixing cents and rupees.

### TS-21. Important built-in utility types?

| Utility | Does |
|---|---|
| `Partial<T>` / `Required<T>` | all props optional / required |
| `Readonly<T>` | all props readonly (shallow) |
| `Pick<T, K>` / `Omit<T, K>` | keep / remove keys |
| `Record<K, V>` | object with keys K, values V |
| `Exclude<U, X>` / `Extract<U, X>` | remove / keep union members |
| `NonNullable<T>` | remove `null` / `undefined` |
| `ReturnType<F>` / `Parameters<F>` | function return / arg types |
| `Awaited<T>` | unwrap Promises (recursive) |
| `InstanceType<C>` | type of `new C()` |
| `NoInfer<T>` (TS 5.4) | stop a position from driving inference |

Write them yourself (common interview ask):

```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends PropertyKey> = Pick<T, Exclude<keyof T, K>>;
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

**Real-life:** utility types are kitchen tools: you could cut everything with a knife, but a peeler is faster.

### TS-22. What is variance?

- **Covariant (outputs):** `Dog[]` works where `Animal[]` is expected.
- **Contravariant (inputs):** a function taking `Animal` works where a function taking `Dog` is expected, not the reverse.

**Real-life:** a vet who treats **all animals** can replace a dog-only vet. A dog-only vet can't replace an all-animals vet.

⚠️ With `strictFunctionTypes`, function **properties** are checked contravariantly, but **methods** stay bivariant (unsafe):

```ts
interface Good { handler: (x: Dog) => void } // ✅ checked strictly
interface Loose { handler(x: Dog): void }    // ⚠️ bivariant
```

🎯 TS 4.7 added `in` / `out` annotations: `interface Box<out T>`.

### TS-23. What are `const` type parameters? (TS 5.0)

Infer literal types as if the caller wrote `as const`.

```ts
function routes<const T extends readonly string[]>(r: T) { return r; }
const r = routes(["/home", "/about"]); // readonly ["/home", "/about"]
```

**Real-life:** writing down the exact words someone said, not a summary.

---

## Part C — Narrowing, Guards & Inference

### TS-24. What is type narrowing?

TS follows your checks and makes types more specific in each branch: `typeof`, `instanceof`, `in`, `===`, truthiness, discriminated unions.

```ts
function len(x: string | string[] | null) {
  if (!x) return 0;                           // removes null (and "")
  if (typeof x === "string") return x.length; // string
  return x.length;                            // string[]
}
```

**Real-life:** a sorting machine at a post office sends each parcel down the right chute.

⚠️ Truthiness also removes `""` and `0`; use `x == null` when those are valid values.

### TS-25. What is a discriminated union? ⭐

A union where every member has a common **literal tag**. Checking the tag narrows to the right member.

```ts
type State =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: Error };

function render(s: State) {
  switch (s.status) {
    case "success": return s.data.length;   // data only exists here
    case "error":   return s.error.message;
    case "loading": return 0;
  }
}
```

**Real-life:** a traffic light: red, amber or green, never two at once.

🎯 "Makes impossible states impossible", unlike `{ loading: boolean; data?: T; error?: Error }`.

### TS-26. What is exhaustive checking with `never`?

```ts
function assertNever(x: never): never {
  throw new Error(`Unhandled: ${JSON.stringify(x)}`);
}

switch (s.status) {
  // ...cases
  default: return assertNever(s); // error at compile time if a case is missing
}
```

**Real-life:** a checklist that flags a new item nobody handled yet.

🎯 Add `{ status: "idle" }` later → the compiler points to every switch you forgot to update.

### TS-27. What is a user-defined type guard?

A function returning `value is Type`.

```ts
function isUser(x: unknown): x is User {
  return typeof x === "object" && x !== null && "id" in x;
}

if (isUser(data)) data.id; // narrowed
```

**Real-life:** a bouncer checking IDs; if he says "OK", everyone trusts him.

⚠️ TS **trusts you blindly**. A wrong guard is a lie to the compiler.
🎯 Since TS 5.5, simple guards are inferred: `[1, null, 2].filter(x => x !== null)` → `number[]`.

### TS-28. What are assertion functions?

`asserts x is T` (or `asserts condition`): throws if false, narrows after.

```ts
function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v == null) throw new Error("Missing value");
}

assertDefined(user);
user.name; // narrowed below the call
```

| Type guard | Assertion function |
|---|---|
| returns boolean | throws or returns nothing |
| use in `if` | call as a statement |

**Real-life:** a security gate: you either pass through cleared, or you're stopped.

### TS-29. How does inference and widening work?

- `let a = "x"` → `string` (widened, can change).
- `const a = "x"` → `"x"` (literal).
- Object properties widen (they're mutable); use `as const` to keep literals.
- **Contextual typing:** `[1, 2].map(n => n * 2)` knows `n` is `number`.

**Real-life:** writing in pencil (`let`) means "could change"; pen (`const`) means exact.

### TS-30. `as` (assertion) vs annotation?

| Annotation `const u: User = …` | Assertion `… as User` |
|---|---|
| **checked** | **overrides** the checker |
| safe | can hide bugs |

- `x as unknown as T` → forces anything.
- `x!` → "trust me, not null".

**Real-life:** annotation = a teacher checking your answer. `as` = writing "correct" on your own answer.

🎯 Prefer annotations and `satisfies`; use `as` only at real boundaries, with a comment.

### TS-31. What are function overloads?

Several call signatures + one implementation (not callable from outside).

```ts
function get(id: number): User;
function get(ids: number[]): User[];
function get(x: number | number[]): User | User[] { /* ... */ }
```

**Real-life:** a restaurant menu listing "single scoop" and "family tub", served by one kitchen.

🎯 Most specific signature first (resolved top-down). Often a union parameter or conditional return type is simpler.

### TS-32. How do you type `this`?

A fake first parameter named `this` (erased at compile time).

```ts
function onClick(this: HTMLButtonElement, e: MouseEvent) {
  this.disabled = true;
}
```

---

## Part D — Classes, Decorators & Modules

### TS-33. `private` vs `#private`?

- `private` → **compile-time only**; at runtime anyone can read it (`(obj as any).secret`).
- `#secret` → real JavaScript private field, enforced at **runtime**.

**Real-life:** `private` = a "Staff only" sign. `#` = a locked door.

🎯 Use `#` when true hiding matters.

### TS-34. Access modifiers and parameter properties?

`public` (default), `protected` (class + subclasses), `private` (class only), `readonly`.

```ts
class User {
  constructor(private readonly id: string, public name: string) {} // declare + assign
}
```

⚠️ Parameter properties aren't **erasable syntax**, so they fail with `--erasableSyntaxOnly` (TS 5.8) and Node's built-in type stripping.

### TS-35. Abstract class vs interface?

| Interface | Abstract class |
|---|---|
| contract only, erased at runtime | can have shared code + state |
| `implements` many | `extends` only one |
| no `new` | no `new` (only subclasses) |

**Real-life:** interface = a job description. Abstract class = a half-built house the buyer finishes.

🎯 Prefer composition + interfaces; abstract classes for a template-method pattern with real shared logic.

### TS-36. What does `override` do?

With `noImplicitOverride`, you must mark methods that replace a parent method. If the parent method is renamed, you get an **error** instead of a silent bug.

```ts
class Base { save() {} }
class Child extends Base { override save() {} }
```

**Real-life:** writing "replaces page 4" on a new page, so you notice if page 4 disappears.

### TS-37. What are decorators?

Functions that wrap classes, methods, fields or accessors to add behaviour (logging, DI, validation).

| Legacy `experimentalDecorators` | Standard TC39 (default since TS 5.0) |
|---|---|
| Angular, NestJS, TypeORM | new projects |
| parameter decorators, `emitDecoratorMetadata` | no parameter decorators |
| `(target, key, descriptor)` | `(value, context)` |

```ts
function log(target: any, context: ClassMethodDecoratorContext) {
  return function (this: any, ...args: any[]) {
    console.log(`Calling ${String(context.name)}`);
    return target.apply(this, args);
  };
}

class Svc { @log run() {} }
new Svc().run(); // "Calling run"
```

**Real-life:** gift wrap on a present: the gift is the same, the wrapper adds something.

### TS-38. Declaration merging and module augmentation?

Same-name interfaces **merge**. Use it to extend third-party types.

```ts
// add a field to Express Request
declare global {
  namespace Express { interface Request { userId?: string } }
}

// augment a library
declare module "axios" {
  interface AxiosRequestConfig { retry?: number }
}
```

**Real-life:** sticking an extra page into a published manual.

⚠️ The augmenting file must be a **module** (have an `import`/`export`) and be included by tsconfig.

### TS-39. What are `.d.ts` files and `declare`?

Declaration files = **types only, no code**. They type plain JS libraries (`@types/*`) or your published package. `declare` says "this exists at runtime, trust me".

```ts
declare const __APP_VERSION__: string;                    // injected by bundler
declare module "*.svg" { const url: string; export default url; }
```

**Real-life:** a product manual for a machine you didn't build.

### TS-40. What is `import type`?

`import type { User } from "./user"` is **always erased**: no runtime import, no circular-dependency side effects.

🎯 `verbatimModuleSyntax: true` forces you to mark type-only imports, so output is predictable for esbuild, SWC and Babel.

**Real-life:** borrowing a recipe's description, not the ingredients.

### TS-41. ES modules vs CommonJS in TS?

| `moduleResolution` | Use for |
|---|---|
| `nodenext` | Node.js apps/libraries (respects `package.json` `type` + `exports`) |
| `bundler` | Vite, webpack, esbuild projects |
| `node10` / `classic` | ❌ **removed in TS 7** (hard error) |

⚠️ In `nodenext` ESM files, relative imports need extensions: `./util.js` (even for a `.ts` file).
⚠️ TS 7 defaults `module` to `esnext`, and `module: amd/umd/systemjs/none` are removed.

### TS-42. Namespaces: use or avoid?

An old TS-only module system. **Avoid** in new code; use ES modules. They still appear in `.d.ts` files and global augmentation.

⚠️ TS 7 removed the `module` keyword for namespaces (`module Foo {}`); only `namespace Foo {}` remains.

---

## Part E — tsconfig, Compiler & Tooling

### TS-43. Which tsconfig options matter most?

| Option | Why |
|---|---|
| `strict` | all strict checks; **default `true` in TS 7** |
| `noUncheckedIndexedAccess` | `arr[0]` → `T \| undefined`; catches real bugs |
| `exactOptionalPropertyTypes` | `prop?: string` rejects explicit `undefined` |
| `target` / `lib` | output JS version / built-in types (`DOM`, `ES2023`) |
| `module` / `moduleResolution` | `nodenext` or `bundler` (TS-41) |
| `isolatedModules` | each file compiles alone (esbuild/SWC/Babel) |
| `verbatimModuleSyntax` | exact import output; forces `import type` |
| `skipLibCheck` | skip `.d.ts` checks; faster builds |
| `declaration` / `declarationMap` | emit `.d.ts` for libraries |
| `paths` | import aliases (`@/utils`); bundler must match |
| `incremental` / `composite` | faster rebuilds; project references |

⚠️ **TS 7 changes:** `baseUrl` removed (use `paths` relative to the tsconfig), `target: es5` removed, `types` defaults to `[]` (add `"types": ["node"]` or `["*"]`), and `rootDir` defaults to `./`.

**Real-life:** tsconfig is the car's settings menu: safety features, which roads it drives on, how fast it builds.

### TS-44. How do you migrate a big JS codebase to TS?

1. Add tsconfig with `allowJs: true`, `checkJs: false`; build passes on day one.
2. Rename to `.ts` **leaf-first** (utils → services → UI).
3. Start loose, enable strict flags **one by one**.
4. Track `any` and `@ts-expect-error` counts in CI.
5. JSDoc types in JS files you can't convert yet.
6. Lint rules (`no-explicit-any`) to stop new debt.

**Real-life:** renovating a house room by room while living in it.

🎯 Migrate by module ownership and ship continuously; a big-bang rewrite branch usually fails.

### TS-45. How do you speed up a slow TS build?

- **Upgrade to TS 7** (native Go compiler, ~8–12× faster full builds).
- Project references (`composite`, `tsc -b`) to split a monorepo.
- `skipLibCheck: true`, `incremental: true`.
- Transpile with esbuild/SWC; run `tsc --noEmit` for type checking in parallel.
- Prefer `interface extends` over big `&` intersections; name complex types.
- Avoid huge unions and deep recursive conditional types.
- Explicit return types on exports (`isolatedDeclarations`, TS 5.5).
- Diagnose: `tsc --extendedDiagnostics`, `tsc --generateTrace`.

**Real-life:** a traffic jam: widen the road (TS 7), split traffic (project references), skip unnecessary checkpoints (`skipLibCheck`).

### TS-46. `@ts-ignore` vs `@ts-expect-error`?

| `@ts-ignore` | `@ts-expect-error` |
|---|---|
| silences forever | **errors if there's no longer an error** |
| stale suppressions pile up | auto-cleaned |

```ts
// @ts-expect-error legacy lib has wrong types, remove after v3 upgrade
legacy.call(1);
```

**Real-life:** `@ts-expect-error` = a reminder note that beeps when the problem is fixed.

### TS-47. Does TS validate at runtime? How to handle API data?

**No.** Validate at the boundary and **derive the type from the schema** (one source of truth).

```ts
import { z } from "zod";

const UserSchema = z.object({ id: z.number(), email: z.string().email() });
type User = z.infer<typeof UserSchema>;

const user = UserSchema.parse(await res.json()); // throws if invalid
```

**Real-life:** a passport photo (type) doesn't prove who's standing at the counter; you still check the person (validation).

🎯 Alternatives: Valibot, ArkType, or generate types from OpenAPI / GraphQL.

### TS-48. How do you publish a TS library correctly?

- `declaration: true`; point `types` / `exports` in package.json to the `.d.ts`.
- `exports` map with **`types` condition first**; ESM (and CJS if needed).
- Test types: `@arethetypeswrong/cli`, `tsd`, `expect-type`.
- A stricter type can be a **breaking change** for semver.

**Real-life:** shipping a product with the right instruction manual for each country.

### TS-49. How does TS run directly in Node?

Node.js (22.6+, unflagged in 23.6+) can **strip types** and run `.ts` files directly, but only **erasable** syntax: no enums, namespaces with code, or parameter properties.

```bash
node app.ts
```

🎯 `--erasableSyntaxOnly` (TS 5.8) enforces this. `tsx` and Bun run full TS.

**Real-life:** reading a book with the margin notes erased; anything that needs rewriting (enums) can't be erased.

### TS-50. What is TypeScript 7 (the native compiler)?

**TypeScript 7.0 (released 8 July 2026)** is the compiler **ported to Go** ("Project Corsa"). Same type-checking results as TS 6, but much faster.

| | TS 6 → TS 7 |
|---|---|
| Full builds | ~**7.7–12×** faster (vscode: 125.7 s → 10.6 s) |
| With `--checkers 8` | up to ~**17×** |
| Memory | 6–26% lower |
| Editor first error | ~17.5 s → under 1.3 s |

**New defaults:** `strict: true`, `module: esnext`, `types: []`, `rootDir: ./`.
**Now errors:** `target: es5`, `moduleResolution: node10/classic`, `baseUrl`, `module: amd/umd/systemjs`, `esModuleInterop: false`, import `asserts` (use `with`).

⚠️ TS 7.0 has **no programmatic API yet** (planned for 7.1). Tools that need it (typescript-eslint, Vue/Svelte/Angular template editors, some webpack loaders) run alongside TS 6 via `@typescript/typescript6`.

**Real-life:** same car, new engine: it drives the same roads, just far faster.

🎯 "Upgrade to TS 6 first to clear deprecations, then move to 7; keep TS 6 side by side for tools that still need the API."

---

## Part F — Architecture (Senior)

> Answer with: **principle → short example from your work → trade-off.**

### TS-51. How do you share types between frontend and backend?

1. **Shared `types` package** in a monorepo (pnpm/Nx/Turborepo).
2. **Generate from a contract:** OpenAPI (`openapi-typescript`), GraphQL Codegen, Protobuf.
3. **End-to-end inference:** tRPC, or Zod schemas shared by both sides.

**Real-life:** both teams build from the same blueprint instead of copying measurements by hand.

🎯 Generated contracts work across languages and teams; tRPC is fastest to build but couples both sides to TS.

### TS-52. How do you design a type-safe API client?

Map each endpoint to request/response types once, then let generics do the rest.

```ts
type Endpoints = {
  "GET /users/:id": { res: User };
  "POST /users": { body: NewUser; res: User };
};

async function api<K extends keyof Endpoints>(
  route: K,
  ...args: Endpoints[K] extends { body: infer B } ? [body: B] : []
): Promise<Endpoints[K]["res"]> { /* fetch + validate */ }

const u = await api("GET /users/:id");         // User, no body allowed
await api("POST /users", { name: "A" });       // body required and typed
```

**Real-life:** a vending machine: each button (route) takes the right coin (body) and gives the right item (response).

### TS-53. How do you model errors?

`catch (e)` gives `unknown`; thrown errors aren't typed. For **expected** failures, return a **Result**.

```ts
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseAge(s: string): Result<number, "NOT_A_NUMBER"> {
  const n = Number(s);
  return Number.isNaN(n) ? { ok: false, error: "NOT_A_NUMBER" } : { ok: true, value: n };
}
```

**Real-life:** a delivery app shows "delivered" **or** "address not found" clearly, instead of the driver just disappearing (throw).

🎯 Exceptions for unexpected errors; Result for business failures. Libraries: `neverthrow`, Effect.

### TS-54. Type-safe dependency injection?

Depend on **interfaces**, inject through constructors, wire up in one place (**composition root**).

```ts
interface Mailer { send(to: string, msg: string): Promise<void> }

class UserService {
  constructor(private mailer: Mailer) {}
}

const service = new UserService(new SmtpMailer()); // composition root
// tests: new UserService(fakeMailer)
```

**Real-life:** a phone charger with a standard port: plug in any brand of cable.

🎯 For most apps, plain constructor injection is simpler and fully type-safe; containers (NestJS, Angular, Inversify) for large frameworks.

### TS-55. Type-safe event emitter?

```ts
type Events = { login: { userId: string }; logout: void };

class Emitter<E extends Record<string, unknown>> {
  private handlers: { [K in keyof E]?: ((p: E[K]) => void)[] } = {};

  on<K extends keyof E>(event: K, fn: (p: E[K]) => void) {
    (this.handlers[event] ??= []).push(fn);
  }

  emit<K extends keyof E>(event: K, payload: E[K]) {
    this.handlers[event]?.forEach((fn) => fn(payload));
  }
}

const em = new Emitter<Events>();
em.on("login", (p) => p.userId); // p is { userId: string }
```

**Real-life:** a radio where each channel has a fixed programme format; you can't tune into a channel that doesn't exist.

### TS-56. TypeScript standards for a large team?

- `strict: true` + `noUncheckedIndexedAccess` from day one.
- `typescript-eslint` type-aware rules: `no-floating-promises`, `no-explicit-any`, `consistent-type-imports`.
- Validate all external input; no `as` on API data.
- Discriminated unions for state.
- Explicit return types on exported functions.
- Type check in CI; ban `@ts-ignore`, allow `@ts-expect-error` with a reason.
- Review question: "Do the types **model the domain**, or just silence errors?"

**Real-life:** building codes for a city: everyone follows the same safety rules.

### TS-57. When is type cleverness a problem?

When types are **hard to read**, **slow the compiler**, or give errors nobody understands.

**Real-life:** a lock so complex even the owner can't open it.

🎯 Keep public APIs simple, hide complex types inside library code, add type tests, choose readability when risk is low.

### TS-58. How do you type React components?

- Props as `type`/`interface`; type props directly (`React.FC` is optional).
- Discriminated unions for variant props.
- Extend native props: `ComponentPropsWithoutRef<"button">`.
- Generic components: `function List<T>({ items, render }: { items: T[]; render: (t: T) => ReactNode })`.
- Empty initial state: `useState<User | null>(null)`.

```tsx
type ButtonProps =
  | { variant: "link"; href: string }
  | { variant: "button"; onClick: () => void };
```

### TS-59. How do you type async code safely?

- `async` always returns `Promise<T>`; unwrap with `Awaited<T>`.
- `Promise.all([a(), b()])` keeps a **typed tuple**.
- `no-floating-promises` lint rule catches missing `await`.
- `AbortController` signals in typed fetch helpers.

```ts
const [user, posts] = await Promise.all([getUser(), getPosts()]); // [User, Post[]]
```

**Real-life:** a forgotten `await` is like ordering food and walking off before it arrives.

### TS-60. What is `using`? (TS 5.2)

Explicit resource management: `using` calls `[Symbol.dispose]()` automatically at the end of the block (like `try/finally`). `await using` for async cleanup.

```ts
function openFile(path: string) {
  return { read() { /* ... */ }, [Symbol.dispose]() { console.log("closed"); } };
}

{
  using file = openFile("a.txt");
  file.read();
} // "closed" runs automatically
```

**Real-life:** a hotel room that checks you out automatically when you leave.

🎯 Good for DB connections, file handles, locks.

---

## Part G — Tricky Questions (try first!)

### TS-61. What is the type of `x`?

```ts
const arr = [1, "a", true];
const x = arr[0];
```

**Answer:** `string | number | boolean`, not `number`. Arrays aren't tuples. With `as const` it's `1`.

### TS-62. Does this compile?

```ts
interface A { name: string }
const obj = { name: "x", age: 3 };
const a: A = obj;
```

**Answer:** Yes. Excess property checks only apply to **fresh object literals** (TS-11).

### TS-63. Why is `Object.keys` typed as `string[]`?

```ts
const keys = Object.keys({ a: 1, b: 2 }); // string[]
```

**Answer:** objects may have **extra keys at runtime** (structural typing). Cast only when sure: `Object.keys(o) as (keyof typeof o)[]`.

### TS-64. What is `keyof any`?

**Answer:** `string | number | symbol` (= `PropertyKey`).

### TS-65. What is `never` in unions and intersections?

**Answer:** `string | never` = `string` (disappears). `string & never` = `never`. `string & number` = `never`.

**Real-life:** adding "nothing" to a list changes nothing; requiring "impossible" makes the whole requirement impossible.

### TS-66. What is the result?

```ts
type T = Exclude<"a" | "b" | "c", "a">;
```

**Answer:** `"b" | "c"`, because conditional types **distribute** over unions.

### TS-67. Why is this unsafe even in strict mode?

```ts
const nums: number[] = [];
nums[0].toFixed(); // runtime crash
```

**Answer:** index access returns `number`, not `number | undefined`, unless `noUncheckedIndexedAccess` is on.

### TS-68. Why is narrowing lost here?

```ts
function f(u: { name?: string }) {
  if (u.name) {
    setTimeout(() => u.name.toUpperCase()); // ❌ error
  }
}
```

**Answer:** inside a callback, TS can't be sure `u.name` wasn't changed later. Fix: `const n = u.name;` and use `n`.

🎯 TS 5.4 keeps narrowing in closures for `let` variables and parameters after their last assignment, but **not for object properties**.

### TS-69. Write `Last<T>` for a tuple.

```ts
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;
type R = Last<[1, 2, 3]>; // 3
```

### TS-70. Write `DeepPartial<T>`.

```ts
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
```

🎯 Follow-up: functions and arrays are objects too; production versions handle them separately.

### TS-71. Write `UnionToIntersection<U>`.

```ts
type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void
    ? I
    : never;

type R = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }
```

**Why:** function parameters are **contravariant**, so inferring from a union of functions gives an intersection.

### TS-72. Accept only keys whose values are strings.

```ts
type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

function pluck<T>(o: T, k: KeysOfType<T, string>) { return o[k]; }

pluck({ a: "x", b: 1 }, "a"); // ✅
pluck({ a: "x", b: 1 }, "b"); // ❌
```

### TS-73. What does this print?

```ts
enum Color { Red, Green }
console.log(Color[0], Color.Green);
```

**Answer:** `Red 1`. Numeric enums have **reverse mapping** (number → name). String enums don't.

---

## Part H — Cheat Sheet

### TS-74. One-line answers (night before the interview)

| Topic | One line |
|---|---|
| Typing model | structural (shape-based); types erased at runtime |
| interface vs type | interface for object contracts + merging; type for unions/compositions |
| any / unknown / never | off / must check / impossible |
| `satisfies` | check type without losing the narrow inferred type |
| `as const` | deep readonly + literals; replaces most enums |
| Generics | type parameters linking inputs to outputs; constrain with `extends` |
| Conditional types | `T extends U ? X : Y`; distributive over naked unions |
| `infer` | pull a type out inside a conditional type |
| Mapped types | loop over keys; `-readonly`, `-?`, `as` rename |
| Template literal types | `` `on${Capitalize<E>}` `` |
| Branded types | `T & { __brand: B }` fakes nominal typing |
| Discriminated unions | literal tag field; best way to model state |
| Exhaustiveness | leftover assigned to `never` in `default` |
| Type guards | `x is T` (TS trusts you); `asserts x is T` throws |
| `as` vs annotation | annotation is checked; `as` overrides |
| Variance | outputs covariant, inputs contravariant; methods bivariant |
| `private` vs `#` | compile-time only vs real runtime privacy |
| Decorators | legacy (Angular/Nest) vs TC39 standard (TS 5.0+) |
| `import type` | erased import; enforce with `verbatimModuleSyntax` |
| Module resolution | `nodenext` for Node, `bundler` for Vite/webpack; `node10` removed in TS 7 |
| Must-have flags | `strict` (default in TS 7), `noUncheckedIndexedAccess`, `isolatedModules`, `skipLibCheck` |
| Runtime data | validate with Zod, infer types from the schema |
| Big builds | TS 7, project references, SWC/esbuild + `tsc --noEmit` |
| Migration | allowJs, leaf-first, strict flags one by one, track `any` in CI |
| `@ts-expect-error` | better than `@ts-ignore`: errors when no longer needed |
| `using` | auto cleanup via `Symbol.dispose` (TS 5.2) |
| TS 7 | Go-native compiler (July 2026), ~10× faster, no API until 7.1 |

> **Practice:** write `Partial`, `Pick`, `Omit`, `DeepReadonly`, `ReturnType`, `Awaited` and `UnionToIntersection` from memory. If you can explain each line, you're ready for the type-level round.
