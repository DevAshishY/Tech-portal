

## How to use these notes

Every topic is one question, a short simple answer, and a small code example. At 12+ years, interviewers expect you to explain *why* and *trade-offs*, not just syntax, so each answer ends with a one-line "Senior tip" where it matters.

Suggested plan: read one section a day, say each answer out loud in 30–60 seconds, then do Section 7 (tricky questions) without looking at the answers.

## Section 1: Fundamentals and the type system

### Q1. What is TypeScript and why use it?

TypeScript is JavaScript plus a static type system. It compiles (transpiles) to plain JavaScript, and all types are erased at runtime. Benefits: catch bugs before running, better autocomplete and refactoring, and code that documents itself.

Senior tip: types give zero runtime safety. Data from APIs, forms or JSON must still be validated (for example with Zod).

### Q2. What is structural typing (duck typing)?

TypeScript compares types by their *shape*, not their name. If two types have the same properties, they are compatible.

```typescript
interface Point { x: number; y: number }
class Pixel { constructor(public x: number, public y: number) {} }

const p: Point = new Pixel(1, 2); // OK: same shape
```

Java and C# use *nominal* typing (names must match). To fake nominal types in TS, use branded types (see Q20).

### Q3. `interface` vs `type` — which and when?

Both describe object shapes. Differences:

| Feature | interface | type |
| --- | --- | --- |
| Object shapes | Yes | Yes |
| Unions, tuples, primitives | No | Yes |
| Declaration merging | Yes | No |
| Extending | `extends` | `&` intersection |
| Mapped / conditional types | No | Yes |

Rule of thumb: `interface` for public object contracts (especially libraries, since users can extend them); `type` for unions, utility compositions and everything else. Interfaces also give slightly faster type checking and clearer error messages in large codebases.

### Q4. `any` vs `unknown` vs `never`?

- `any`: switches off type checking. Avoid it; it spreads silently.
- `unknown`: "could be anything, but you must check before using it." The safe version of `any`.
- `never`: a value that can never exist (a function that always throws, or an impossible branch).

```typescript
function parse(input: unknown) {
  if (typeof input === "string") return input.toUpperCase(); // OK after check
  // input.toUpperCase(); // Error without check
}

function fail(msg: string): never { throw new Error(msg); }
```

### Q5. What is `void` and how is it different from `undefined`?

`void` means "the return value should not be used." A callback typed `() => void` may still return something; TS just ignores it. That is why `arr.forEach(x => list.push(x))` compiles even though `push` returns a number.

### Q6. What are union and intersection types?

- Union `A | B`: value is A **or** B.
- Intersection `A & B`: value is A **and** B (has all properties).

```typescript
type Id = string | number;
type Admin = User & { permissions: string[] };
```

### Q7. What are literal types and `as const`?

A literal type is an exact value, like `"GET"` or `42`. `as const` makes an object deeply `readonly` and keeps the literal values.

```typescript
const ROLES = ["admin", "user", "guest"] as const;
type Role = typeof ROLES[number]; // "admin" | "user" | "guest"
```

Senior tip: this pattern (array as const + `typeof X[number]`) replaces most enums.

### Q8. Enums: should you use them?

Regular enums generate runtime JavaScript code, numeric enums accept any number, and `const enum` breaks with `isolatedModules` (Babel, esbuild, SWC). Many teams prefer union literal types or `as const` objects instead.

```typescript
const Status = { Active: "ACTIVE", Closed: "CLOSED" } as const;
type Status = typeof Status[keyof typeof Status];
```

### Q9. What are tuples?

Fixed-length arrays where each position has its own type. Labels make them readable.

```typescript
type Range = [start: number, end: number];
type Args = [string, ...number[]]; // variadic
```

### Q10. What is the difference between `readonly` and `const`?

`const` stops reassigning a *variable*. `readonly` stops changing a *property*. Both are shallow: nested objects can still change unless also readonly.

### Q11. What is excess property checking?

When you pass an object *literal* directly, TS errors on extra properties. Passing a variable skips this check (structural typing).

```typescript
interface Opts { size: number }
const f = (o: Opts) => {};
f({ size: 1, colr: "red" }); // Error: typo caught
const o = { size: 1, colr: "red" };
f(o); // OK, no error
```

### Q12. What is the `satisfies` operator?

`satisfies` checks that a value matches a type **without widening it**, so you keep the exact inferred type.

```typescript
type Config = Record<string, string | number>;
const cfg = { port: 3000, host: "localhost" } satisfies Config;
cfg.port.toFixed(); // OK: still known as number
```

With `const cfg: Config = …`, `cfg.port` would be `string | number`.

## Section 2: Advanced types

### Q13. What are generics and why do we need them?

Generics are type *parameters*. They let one function or type work with many types while keeping the link between input and output.

```typescript
function first<T>(arr: T[]): T | undefined { return arr[0]; }
const n = first([1, 2, 3]); // number | undefined
```

Without generics you would use `any` and lose type information.

### Q14. What are generic constraints and defaults?

`extends` limits what T can be; `=` gives a default.

```typescript
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
type ApiResponse<T = unknown> = { data: T; error?: string };
```

Senior tip: if a type parameter appears only once in a signature, you probably don't need it ("golden rule of generics").

### Q15. What does `keyof` and `typeof` do in types?

- `keyof T`: union of T's property names.
- `typeof value`: gets the type of a runtime variable.
- `T[K]`: indexed access, the type of property K.

```typescript
const user = { id: 1, name: "A" };
type User = typeof user;   // { id: number; name: string }
type Keys = keyof User;     // "id" | "name"
type NameT = User["name"];  // string
```

### Q16. What are conditional types?

Type-level if/else: `T extends U ? X : Y`.

```typescript
type IsString<T> = T extends string ? true : false;
type A = IsString<"hi">; // true
```

They are **distributive** over unions when T is a naked type parameter:

```typescript
type ToArray<T> = T extends any ? T[] : never;
type R = ToArray<string | number>; // string[] | number[]
type NoDist<T> = [T] extends [any] ? T[] : never; // (string | number)[]
```

### Q17. What does `infer` do?

`infer` captures a type from inside another type, only within a conditional type.

```typescript
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;
type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T;
type X = Unwrap<Promise<Promise<number>>>; // number
```

### Q18. What are mapped types?

They build a new type by looping over keys. Modifiers `+/-readonly` and `+/-?` add or remove flags; `as` renames keys.

```typescript
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
// Getters<{ name: string }> → { getName: () => string }
```

### Q19. What are template literal types?

String types built like template strings, great for event names, routes and CSS values.

```typescript
type Event = "click" | "focus";
type Handler = `on${Capitalize<Event>}`; // "onClick" | "onFocus"

type Params<S> = S extends `${string}:${infer P}/${infer Rest}`
  ? P | Params<`/${Rest}`>
  : S extends `${string}:${infer P}` ? P : never;
type P = Params<"/user/:id/post/:postId">; // "id" | "postId"
```

### Q20. What are branded (nominal) types?

A trick to stop mixing values with the same base type, like `UserId` and `OrderId` (both strings).

```typescript
type Brand<T, B> = T & { readonly __brand: B };
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

const toUserId = (s: string) => s as UserId;
function getUser(id: UserId) {}
getUser("abc" as OrderId); // Error
```

### Q21. Name the important built-in utility types.

| Utility | What it does |
| --- | --- |
| `Partial<T>` / `Required<T>` | All props optional / required |
| `Readonly<T>` | All props readonly (shallow) |
| `Pick<T, K>` / `Omit<T, K>` | Keep / remove some keys |
| `Record<K, V>` | Object with keys K and values V |
| `Exclude<U, X>` / `Extract<U, X>` | Remove / keep union members |
| `NonNullable<T>` | Remove null and undefined |
| `ReturnType<F>` / `Parameters<F>` | Function return / argument types |
| `Awaited<T>` | Unwrap Promise types (recursive) |
| `InstanceType<C>` | Type of `new C()` |
| `NoInfer<T>` (TS 5.4) | Stop a position from driving inference |

Senior tip: be able to write `Partial`, `Pick`, `Omit` and `DeepReadonly` from scratch; interviewers often ask.

```typescript
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends PropertyKey> = Pick<T, Exclude<keyof T, K>>;
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

### Q22. What is variance (covariance, contravariance)?

- Covariant (outputs): `Dog[]` is usable where `Animal[]` is expected.
- Contravariant (inputs): a function taking `Animal` is usable where a function taking `Dog` is expected, not the reverse.

With `strictFunctionTypes`, function *properties* are checked contravariantly, but *methods* stay bivariant (unsafe). So prefer `handler: (x: T) => void` over `handler(x: T): void` in interfaces. TS 4.7 added `in` / `out` annotations: `interface Box<out T>`.

### Q23. What are const type parameters? (TS 5.0)

They infer literal types as if the caller wrote `as const`.

```typescript
function routes<const T extends readonly string[]>(r: T) { return r; }
const r = routes(["/home", "/about"]); // readonly ["/home", "/about"]
```

## Section 3: Narrowing, type guards and inference

### Q24. What is type narrowing?

TS follows your `if` checks and makes the type more specific inside each branch. Ways to narrow: `typeof`, `instanceof`, `in`, equality (`===`), truthiness, and discriminated unions.

```typescript
function len(x: string | string[] | null) {
  if (!x) return 0;              // removes null (and "")
  if (typeof x === "string") return x.length;
  return x.length;               // string[]
}
```

### Q25. What is a discriminated (tagged) union?

A union where every member has a common literal field (the "tag"). Checking the tag narrows to the right member. This is the most important pattern for modelling state.

```typescript
type State =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: Error };

function render(s: State) {
  switch (s.status) {
    case "success": return s.data.length; // data available here
    case "error": return s.error.message;
  }
}
```

Senior tip: this makes impossible states impossible, unlike `{ loading: boolean; data?: T; error?: Error }`.

### Q26. What is exhaustive checking with `never`?

Assign the leftover value to `never` in the `default` branch. If someone adds a new union member later, the compiler shows an error.

```typescript
function assertNever(x: never): never {
  throw new Error(`Unhandled: ${JSON.stringify(x)}`);
}
// default: return assertNever(s);
```

### Q27. What is a user-defined type guard?

A function returning `value is Type`. If it returns true, TS narrows the value.

```typescript
function isUser(x: unknown): x is User {
  return typeof x === "object" && x !== null && "id" in x;
}
```

Senior tip: TS trusts you blindly; a wrong guard is a lie to the compiler. Since TS 5.5, simple guards like `arr.filter(x => x !== null)` are inferred automatically.

### Q28. What are assertion functions?

Functions with `asserts x is T` (or `asserts condition`). They throw if the check fails, and narrow the type for the code after them.

```typescript
function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v == null) throw new Error("Missing value");
}
```

### Q29. How does type inference work, and what is widening?

TS guesses types from values. `let` widens literals (`let a = "x"` → `string`); `const` keeps them (`const a = "x"` → `"x"`). Object properties are widened too because they are mutable; use `as const` to keep literals.

Contextual typing: a callback's parameter types are inferred from where it is used, like `[1, 2].map(n => n * 2)`.

### Q30. Type assertion (`as`) vs type annotation?

An annotation (`const u: User = …`) is *checked*. An assertion (`… as User`) *overrides* the checker and can hide bugs. Double assertion `x as unknown as T` forces anything. The non-null assertion `x!` says "trust me, not null."

Rule: prefer annotations and `satisfies`; use `as` only at real boundaries, with a comment.

### Q31. What are function overloads?

Multiple call signatures followed by one implementation signature (which is not callable from outside).

```typescript
function get(id: number): User;
function get(ids: number[]): User[];
function get(x: number | number[]): User | User[] { /* ... */ }
```

Senior tip: often a conditional return type or union parameter is simpler than overloads. Overloads are resolved top-down, so put the most specific first.

### Q32. How do you type `this` in functions?

Add a fake first parameter named `this`; it is erased at compile time.

```typescript
function onClick(this: HTMLButtonElement, e: MouseEvent) {
  this.disabled = true;
}
```

## Section 4: Classes, decorators and modules

### Q33. `private` vs `#private`?

`private` is compile-time only; at runtime the field is a normal property anyone can read (`(obj as any).secret`). `#secret` is a real JavaScript private field, enforced at runtime. Use `#` when true hiding matters.

### Q34. What are access modifiers and parameter properties?

`public` (default), `protected` (class + subclasses), `private` (class only), `readonly`. Parameter properties declare and assign a field in one line:

```typescript
class User {
  constructor(private readonly id: string, public name: string) {}
}
```

Note: parameter properties are not "erasable syntax", so they fail under `--erasableSyntaxOnly` (TS 5.8) and Node's built-in type stripping.

### Q35. Abstract class vs interface?

An interface is only a contract (erased at runtime). An abstract class can hold shared code and state, cannot be created with `new`, and exists at runtime. A class can `implements` many interfaces but `extends` only one class.

Senior tip: prefer composition and interfaces; use abstract classes for a template-method pattern with real shared logic.

### Q36. What does `override` do?

The `override` keyword (with `noImplicitOverride`) makes you mark methods that replace a parent method. If the parent method is renamed, you get an error instead of a silent bug.

### Q37. What are decorators?

Functions that wrap classes, methods, fields or accessors to add behaviour (logging, DI, validation). Two versions exist:

- Legacy `experimentalDecorators`: used by Angular, NestJS, TypeORM; supports parameter decorators and `emitDecoratorMetadata`.
- Standard (TC39) decorators, default since TS 5.0: different signature `(value, context)`, no parameter decorators.

```typescript
function log(target: any, context: ClassMethodDecoratorContext) {
  return function (this: any, ...args: any[]) {
    console.log(`Calling ${String(context.name)}`);
    return target.apply(this, args);
  };
}
class Svc { @log run() {} }
```

### Q38. What is declaration merging and module augmentation?

Interfaces with the same name merge into one. You use this to extend third-party types.

```typescript
// Add a field to Express Request
declare global {
  namespace Express { interface Request { userId?: string } }
}

// Augment a library module
declare module "axios" {
  interface AxiosRequestConfig { retry?: number }
}
```

### Q39. What are `.d.ts` files and `declare`?

Declaration files describe types only, with no code. They type plain JS libraries (DefinitelyTyped `@types/*`) or your published package. `declare` tells TS "this exists at runtime, trust me."

```typescript
declare const __APP_VERSION__: string; // injected by bundler
declare module "*.svg" { const url: string; export default url; }
```

### Q40. What is `import type` and why does it matter?

`import type { User } from "./user"` is always erased, so it never creates a runtime import or circular-dependency issue. With `verbatimModuleSyntax: true`, TS forces you to mark type-only imports, which makes output predictable for esbuild, SWC and Babel.

### Q41. ES modules vs CommonJS in TS?

TS can output either. `module` / `moduleResolution` settings decide how imports are resolved:

| Setting | Use for |
| --- | --- |
| `nodenext` | Node.js apps and libraries (respects `package.json` `type` and `exports`) |
| `bundler` | Code built by Vite, webpack, esbuild |
| `node10` (old `node`) | Legacy only, avoid |

In `nodenext` ESM files, relative imports need file extensions (`./util.js`, even for a `.ts` file).

### Q42. Namespaces: use or avoid?

Namespaces are an old TS-only module system. Avoid them in new code; use ES modules. They still appear in `.d.ts` files and global augmentation.

## Section 5: tsconfig, compiler, performance and tooling

### Q43. Which tsconfig options matter most?

| Option | Why it matters |
| --- | --- |
| `strict` | Turns on all strict checks (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc.). Always on for new code |
| `noUncheckedIndexedAccess` | `arr[0]` and `obj[key]` become `T \| undefined`; catches many real bugs |
| `exactOptionalPropertyTypes` | `prop?: string` no longer accepts an explicit `undefined` |
| `target` | Which JS version to output (e.g. `ES2022`) |
| `lib` | Which built-in types exist (`DOM`, `ES2023`) |
| `module` / `moduleResolution` | How imports are emitted and resolved (see Q41) |
| `isolatedModules` | Each file must compile alone; required for esbuild, SWC, Babel |
| `verbatimModuleSyntax` | Exact import/export output; forces `import type` |
| `skipLibCheck` | Skip checking `.d.ts` files; much faster builds |
| `declaration` / `declarationMap` | Emit `.d.ts` files for libraries |
| `paths` / `baseUrl` | Import aliases (`@/utils`); bundler must match |
| `incremental` / `composite` | Faster rebuilds; `composite` needed for project references |

### Q44. How do you migrate a big JavaScript codebase to TypeScript?

1. Add `tsconfig` with `allowJs: true` and `checkJs: false`; build passes on day one.
2. Rename files to `.ts` leaf-first (utils, then services, then UI).
3. Start loose (`strict: false`), then enable strict flags one by one.
4. Track progress: count of `any` and `@ts-expect-error`, enforce in CI.
5. Use JSDoc types in JS files you can't convert yet.
6. Lint rules (`@typescript-eslint/no-explicit-any`) to stop new debt.

Senior tip: migrate by module ownership and ship continuously; a "big bang" rewrite branch usually fails.

### Q45. How do you make a slow TS build faster?

- Use project references (`composite`, `tsc -b`) to split a monorepo into separately cached projects.
- `skipLibCheck: true` and `incremental: true`.
- Transpile with esbuild/SWC, and run `tsc --noEmit` for type checking in parallel.
- Prefer `interface extends` over big `&` intersections; name complex types instead of inlining them.
- Avoid huge unions (thousands of members) and deeply recursive conditional types.
- Add explicit return types on exported functions (with `isolatedDeclarations` in TS 5.5, this also lets tools generate `.d.ts` in parallel).
- Diagnose with `tsc --extendedDiagnostics` and `tsc --generateTrace`.

### Q46. `@ts-ignore` vs `@ts-expect-error`?

`@ts-ignore` silences the next line forever. `@ts-expect-error` silences it but **errors if there is no longer an error**, so stale suppressions get cleaned up. Always prefer `@ts-expect-error` with a reason.

### Q47. Does TypeScript do runtime validation? How do you handle API data?

No. Types are erased. For external data (HTTP, env vars, localStorage, queues) validate at the boundary and derive the type from the schema, so you have one source of truth.

```typescript
import { z } from "zod";
const UserSchema = z.object({ id: z.number(), email: z.string().email() });
type User = z.infer<typeof UserSchema>;

const user = UserSchema.parse(await res.json()); // throws if invalid
```

Alternatives: Valibot, ArkType, io-ts, or generating types from OpenAPI / GraphQL schemas.

### Q48. How do you publish a TypeScript library correctly?

- Emit `.d.ts` (`declaration: true`) and point `types` / `exports` in `package.json` to them.
- Use the `exports` map with `types` conditions first; support ESM (and CJS if needed).
- Test types with tools like `@arethetypeswrong/cli`, `tsd` or `expect-type`.
- Treat type changes as API changes: a stricter type can be a breaking change for semver.

### Q49. How does TS run in Node directly now?

Node.js (22.6+, unflagged in 23.6+) can strip types and run `.ts` files directly, but only "erasable" syntax: no enums, namespaces with code, or parameter properties. TS 5.8 added `--erasableSyntaxOnly` to enforce this. Tools like `tsx` and Bun run full TS.

### Q50. What is the new native TypeScript compiler?

Microsoft is porting the TypeScript compiler to Go ("Project Corsa", planned as TypeScript 7), reporting around 10x faster builds and editor loading. TS 6.x is the bridge release that deprecates old options. Version details change fast, so check the official TypeScript blog for current status before an interview.

## Section 6: Architecture and senior-level questions

At 12+ years, these questions test judgment. Answer with: the principle, a short example from your work, and the trade-off.

### Q51. How do you share types between frontend and backend?

Options, from simplest to strongest:

1. A shared `types` package in a monorepo (pnpm/Nx/Turborepo workspaces).
2. Generate types from a contract: OpenAPI (`openapi-typescript`), GraphQL Codegen, or Protobuf.
3. End-to-end inferred types: tRPC, or Zod schemas shared by both sides.

Trade-off: generated contracts work across languages and teams; inferred types (tRPC) are fastest to build but couple client and server to TypeScript.

### Q52. How do you design a type-safe API client?

Map each endpoint to its request and response types once, then let generics do the rest.

```typescript
type Endpoints = {
  "GET /users/:id": { res: User };
  "POST /users": { body: NewUser; res: User };
};

async function api<K extends keyof Endpoints>(
  route: K,
  ...args: Endpoints[K] extends { body: infer B } ? [body: B] : []
): Promise<Endpoints[K]["res"]> { /* fetch + validate */ }

const u = await api("GET /users/:id"); // User
```

### Q53. How do you model errors in TypeScript?

`throw` is not typed: a `catch (e)` gives `unknown` (with `useUnknownInCatchVariables`). For expected failures, return a Result type so callers must handle them.

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

Use exceptions for truly unexpected errors; Result types for business failures (validation, not found). Libraries: `neverthrow`, Effect.

### Q54. How do you implement type-safe dependency injection?

Depend on interfaces, inject through constructors, and wire up in one place (composition root). Frameworks: NestJS and Angular (decorator-based), InversifyJS, or plain factory functions. Senior tip: for most apps, plain constructor injection without a container is simpler and fully type-safe.

### Q55. How do you write type-safe event emitters / pub-sub?

```typescript
type Events = { login: { userId: string }; logout: void };

class Emitter<E extends Record<string, unknown>> {
  private handlers: { [K in keyof E]?: ((p: E[K]) => void)[] } = {};
  on<K extends keyof E>(event: K, fn: (p: E[K]) => void) {
    (this.handlers[event] ??= []).push(fn);
  }
  emit<K extends keyof E>(event: K, payload: E[K]) {
    this.handlers[event]?.forEach(fn => fn(payload));
  }
}
```

### Q56. What TypeScript standards would you set for a large team?

- `strict: true` plus `noUncheckedIndexedAccess` from day one.
- ESLint with `typescript-eslint` type-aware rules (`no-floating-promises`, `no-explicit-any`, `consistent-type-imports`).
- Validate all external input at boundaries; no `as` casts on API data.
- Discriminated unions for state; avoid optional-field soup.
- Explicit return types on exported/public functions.
- Type checking in CI and pre-commit; ban `@ts-ignore`, allow `@ts-expect-error` with a reason.
- Code review focus: are the types *modelling the domain*, not just silencing errors?

### Q57. When is too much type cleverness a problem?

When types become hard to read, slow the compiler, or give error messages nobody understands. Senior answer: keep public APIs simple, hide complex types inside library code, add type tests, and choose readability over perfect precision when the risk is low.

### Q58. How do you type React components well? (if asked)

- Props as a `type` or `interface`; avoid `React.FC` for children inference issues in older versions, just type props directly.
- Use discriminated unions for variant props.
- Extend native props: `ComponentPropsWithoutRef<"button">`.
- Generic components: `function List<T>({ items, render }: { items: T[]; render: (t: T) => ReactNode })`.
- Type `useState` when the initial value is empty: `useState<User | null>(null)`.

### Q59. How do you type async code safely?

- Async functions always return `Promise<T>`; use `Awaited<T>` to unwrap.
- `Promise.all([a(), b()])` keeps a typed tuple.
- Turn on the `no-floating-promises` lint rule to catch missing `await`.
- Use `AbortController` signals for cancellation in typed fetch helpers.

### Q60. What is the `using` keyword? (TS 5.2)

Explicit resource management: `using` calls `[Symbol.dispose]()` automatically when the block ends (like `try/finally`). `await using` does the same for async cleanup. Good for DB connections, file handles and locks.

## Section 7: Tricky questions (try before reading the answer)

### T1. What is the type of `x`?

```typescript
const arr = [1, "a", true];
const x = arr[0];
```

Answer: `string | number | boolean`, not `number`. Arrays are not tuples. With `as const` it becomes `1`.

### T2. Does this compile?

```typescript
interface A { name: string }
const obj = { name: "x", age: 3 };
const a: A = obj;
```

Answer: Yes. Excess property checks only apply to fresh object literals (Q11).

### T3. Why does this error?

```typescript
const keys = Object.keys({ a: 1, b: 2 }); // string[]
```

Answer: `Object.keys` returns `string[]`, not `("a" | "b")[]`, because an object may have extra keys at runtime (structural typing). Use `(Object.keys(o) as (keyof typeof o)[])` only when you are sure.

### T4. What is `keyof any`?

Answer: `string | number | symbol` (same as the built-in `PropertyKey`).

### T5. What is `never` in a union and intersection?

Answer: `string | never` = `string` (never disappears). `string & never` = `never`. Also `string & number` = `never`.

### T6. What is the result?

```typescript
type T = Exclude<"a" | "b" | "c", "a">;
```

Answer: `"b" | "c"`. It works because conditional types distribute over unions.

### T7. Why is this unsafe even with strict mode?

```typescript
const nums: number[] = [];
const first = nums[0].toFixed(); // runtime crash
```

Answer: index access returns `number`, not `number | undefined`, unless `noUncheckedIndexedAccess` is on.

### T8. Why does narrowing get lost here?

```typescript
function f(u: { name?: string }) {
  if (u.name) {
    setTimeout(() => u.name.toUpperCase()); // error
  }
}
```

Answer: inside a callback, TS can't be sure `u.name` wasn't changed later. Copy it to a `const` first: `const n = u.name;`. (TS 5.4 keeps narrowing in closures after the last assignment for `let` variables and parameters, but not for object properties.)

### T9. Write a type `Last<T>` that returns the last element of a tuple.

```typescript
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;
type R = Last<[1, 2, 3]>; // 3
```

### T10. Write `DeepPartial<T>`.

```typescript
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
```

Follow-up: functions and arrays are objects too; production versions handle them separately.

### T11. Write `UnionToIntersection<U>`.

```typescript
type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void
    ? I : never;
```

Why it works: function parameters are contravariant, so inferring from a union of functions gives an intersection.

### T12. Make a function that only accepts keys whose values are strings.

```typescript
type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

function pluck<T>(o: T, k: KeysOfType<T, string>) { return o[k]; }
pluck({ a: "x", b: 1 }, "a"); // OK
pluck({ a: "x", b: 1 }, "b"); // Error
```

### T13. What does this print, and what does TS think?

```typescript
enum Color { Red, Green }
console.log(Color[0], Color.Green);
```

Answer: prints `Red 1`. Numeric enums have reverse mapping (number → name). String enums do not.

## Quick revision cheat sheet

Read this the night before the interview.

| Topic | One-line answer |
| --- | --- |
| Typing model | Structural (shape-based), types erased at runtime |
| interface vs type | interface for object contracts + merging; type for unions and compositions |
| any / unknown / never | Off / must-check / impossible |
| satisfies | Check a type without losing the inferred, narrower type |
| as const | Deep readonly + literal types; replaces most enums |
| Generics | Type parameters that link inputs to outputs; constrain with `extends` |
| Conditional types | `T extends U ? X : Y`; distributive over naked unions |
| infer | Pull a type out inside a conditional type |
| Mapped types | Loop over keys; `-readonly`, `-?`, `as` for renaming |
| Template literal types | String types like `` `on${Capitalize<E>}` `` |
| Branded types | `T & { __brand: B }` to fake nominal typing |
| Discriminated unions | Common literal tag field; best way to model state |
| Exhaustiveness | Assign leftover to `never` in default |
| Type guards | `x is T` (TS trusts you); `asserts x is T` throws |
| as vs annotation | Annotation is checked; `as` overrides the checker |
| Variance | Outputs covariant, inputs contravariant; methods are bivariant |
| private vs # | Compile-time only vs real runtime privacy |
| Decorators | Legacy (Angular/Nest) vs TC39 standard (TS 5.0+) |
| import type | Erased import; enforce with `verbatimModuleSyntax` |
| Module resolution | `nodenext` for Node, `bundler` for Vite/webpack |
| Must-have flags | `strict`, `noUncheckedIndexedAccess`, `isolatedModules`, `skipLibCheck` |
| Runtime data | Validate with Zod and infer types from the schema |
| Big builds | Project references, SWC/esbuild transpile, `tsc --noEmit`, diagnostics |
| Migration | allowJs, leaf-first, strict flags one by one, track `any` in CI |
| ts-expect-error | Better than ts-ignore: errors when no longer needed |
| using | Auto cleanup via `Symbol.dispose` (TS 5.2) |

Practice tip: write `Pick`, `Omit`, `Partial`, `DeepReadonly`, `ReturnType`, `Awaited` and `UnionToIntersection` from memory on paper. If you can explain each line, you are ready for the type-level round.
