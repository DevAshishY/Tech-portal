# Angular Interview Questions

---

## T1. Angular Features

- Data binding
- Directives
- Services / Dependency Injection
- Routing 
- Observables
- Forms
- Pipes
- HTTP
- Authentication
- Optimization
- Deployment
- Animation
- Testing

---

## T2. Adding Bootstrap

```bash
npm i bootstrap@5.3.0-alpha3
```

Add CSS path in `angular.json` from `node_modules`.

---

## T3. How Angular App Bootstraps

```
index.html (entry point) → main.ts (bootstrap) → AppModule (root module) → AppComponent (root component)
```

---

## T4. ElementRef vs Renderer2

- **ElementRef** — gives direct access to the native DOM element of a component.
- **Renderer2** — provides a safer, platform-independent way to perform DOM manipulations.

---

## T5. Decorators

Decorators enhance or modify the behavior of the class they are applied to. They are an essential part of Angular's metadata-driven approach.

| Decorator | Purpose |
|---|---|
| `@NgModule` | Define a module |
| `@Component` | Define a component |
| `@Injectable` | Mark a class for DI |
| `@Directive` | Define a directive |
| `@Pipe` | Define a pipe |
| `@Input` | Receive data from parent |
| `@Output` | Emit events to parent |
| `@HostBinding` | Bind to host element property |
| `@HostListener` | Listen to host element events |
| `@ContentChild` | Query projected content |
| `@ContentChildren` | Query all projected content |
| `@ViewChild` | Query view element |
| `@ViewChildren` | Query all view elements |

---

## T6. @NgModule

Defines a module that contains components, directives, pipes, and providers.

```ts
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [Component1, Component2],
  imports: [Module1, Module2],
  exports: [MyModule],
  providers: [Service1, Service2],
  bootstrap: [AppComponent]
})
class MyModule {}
```

---

## T7. @Component

Declares that a class is a component and provides metadata.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',         // or '[app-servers]' for attribute selector
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent {}
```

**Tip:** Using `selector: '[app-servers]'` lets you use it as an attribute: `<div app-servers></div>`

---

## T8. @Injectable

Declares that a class has dependencies that should be injected via the constructor.

```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MyService {}
```

---

## T9. @Pipe

Declares a class as a pipe and provides metadata.

```ts
import { Pipe } from '@angular/core';

@Pipe({
  name: 'myPipe',
  pure: true
})
export class MyPipe {}
```

---

## T10. @Input

Declares an input property — parent passes data to child.

```ts
import { Input } from '@angular/core';

@Input() myProperty: string;
// Usage: <my-cmp [myProperty]="someExpression">
```

**Flow:** Parent → Child

---

## T11. Input Alias

Use `@Input('aliasName')` to expose a property under a different name in the template.

```ts
@Input('userId') id: string;
// Usage: <my-cmp [userId]="123">
```

---

## T12. @Output

Declares an output property — child emits events to parent.

```ts
import { Output, EventEmitter } from '@angular/core';

@Output() myEvent = new EventEmitter<string>();
// Usage: <my-cmp (myEvent)="handler($event)">
```

**Flow:** Child → Parent

---

## T13. @HostBinding

Binds to a property of the host element.

```ts
@HostBinding('style.background') backgroundColor: string = this.defaultColor;
```

---

## T14. @HostListener

Listens to events on the host element.

```ts
@HostListener('mouseenter') onMouseEnter() {
  this.backgroundColor = this.highlightColor;
}

@HostListener('mouseleave') onMouseLeave() {
  this.backgroundColor = this.defaultColor;
}
```

---

## T15. @ContentChild & @ContentChildren

- **@ContentChild** — queries a single projected content element (`ng-content`).
- **@ContentChildren** — queries all projected content elements.

---

## T16. @ViewChild

Binds the first result of the component view query to a property. Not available for directives.

```ts
import { ViewChild } from '@angular/core';

@ViewChild(MyComponent) myChild: MyComponent;
```

---

## T17. @ViewChildren

Like `@ViewChild`, but returns a `QueryList` of **all** matching elements/components in the view (e.g. every item from an `*ngFor`). Updates automatically when matching elements are added/removed.

```ts
@ViewChildren(ChildComponent) children: QueryList<ChildComponent>;
```

---

## T18. Directives Overview

Directives are classes that add behavior to DOM elements. Three types:

- **Component** — a directive with a template (view)
- **Structural** — change DOM layout by adding/removing elements (`*ngIf`, `*ngFor`)
- **Attribute** — change appearance/behavior of an existing element (`ngClass`, `ngStyle`)

---

## T19. Component Directive

A `@Component` is technically a directive with a template attached — every component *is* a directive, but not every directive is a component.

```ts
@Component({ selector: 'app-my', template: '<div>Hi</div>' })
export class MyComponent {}
```

---

## T20. Structural Directives

Modify DOM structure by adding/removing elements.

- `*ngIf`
- `*ngFor`
- `*ngSwitch`

---

## T21. Attribute Directives

Modify appearance/behavior of existing elements.

- `ngClass`
- `ngStyle`
- `ngModel`

---

## T22. Content Projection

Types:
- **Single-slot** — one `<ng-content>`
- **Multi-slot** — multiple `<ng-content select="...">`
- **Conditional** — using `<ng-template>`

---

## T23. Data Binding

Communication between TS (business logic) and HTML (view).

| Type | Syntax | Flow |
|---|---|---|
| **String Interpolation** | `{{ data }}` | TS → Template |
| **Property Binding** | `[property]="data"` | TS → Template |
| **Event Binding** | `(click)="handler()"` | Template → TS |
| **Two-way Binding** | `[(ngModel)]="data"` | TS ↔ Template |

**Event binding example:**

```html
<input (input)="checkValue($event)" [value]="value">
```

```ts
checkValue(event: Event) {
  this.value = (event.target as HTMLInputElement).value;
}
```

---

## T24. View Encapsulation

Scopes component styles to prevent leaking to other components.

| Mode | Behavior |
|---|---|
| **Emulated** (default) | Scoped via unique attribute — styles don't leak |
| **None** | Styles applied globally |
| **ShadowDom** | Uses native Shadow DOM — fully isolated |

---

## T25. Local Reference Variable

```html
<!-- HTML -->
<input #reference type="text">
<button (click)="checkData(reference)">Check</button>
```

```ts
// TS
checkData(data: HTMLInputElement) {
  console.log(data.value);
}
```

---

## T26. Lifecycle Hooks

| Hook | When Called |
|---|---|
| `ngOnChanges` | When input property changes (called multiple times) |
| `ngOnInit` | After component initializes |
| `ngDoCheck` | During every change detection run |
| `ngAfterContentInit` | After `ng-content` is projected |
| `ngAfterContentChecked` | After projected content is checked |
| `ngAfterViewInit` | After component + child views initialize |
| `ngAfterViewChecked` | After component + child views are checked |
| `ngOnDestroy` | Before component is destroyed |

---

## T27. Services & Dependency Injection

**Method 1** — create instance manually (no provider needed):

```ts
const myService = new MyService();
```

**Method 2** — Angular provides instance via DI:

```ts
constructor(private myService: MyService) {}
```

Provider hierarchy:
- Component-level → available to component + children only
- Module-level (`AppModule`) → available globally

---

## T28. Service Inside a Service

Use `@Injectable()` decorator when injecting one service into another.

```ts
@Injectable({ providedIn: 'root' })
export class ServiceA {
  constructor(private serviceB: ServiceB) {}
}
```

---

## T29. Routing

**Basic setup:**

```ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

**Key concepts:**

| Concept | Example |
|---|---|
| **routerLink** | `[routerLink]="['/users']"` |
| **routerLinkActive** | `routerLinkActive="active"` |
| **Exact match** | `[routerLinkActiveOptions]="{exact: true}"` |
| **Navigate programmatically** | `this.router.navigate(['/users'], { relativeTo: this.route })` |
| **Route params** | `this.route.params.subscribe(p => ...)` |
| **Snapshot** | `this.route.snapshot.params['id']` |
| **Query params** | `[queryParams]="{page: 1}"` — shows as `?page=1` |
| **Fragment** | `fragment="section1"` — shows as `#section1` |
| **Children (nested)** | `children: [{ path: 'edit', component: EditComponent }]` |
| **Redirect** | `{ path: 'old', redirectTo: '/new' }` |
| **Wildcard** | `{ path: '**', redirectTo: '/not-found' }` (must be last) |
| **pathMatch** | `{ path: '', redirectTo: '/home', pathMatch: 'full' }` |

---

## T30. Router Guards

Control navigation based on conditions.

**Guard types:**

| Guard | Purpose |
|---|---|
| `canActivate` | Can user access this route? |
| `canActivateChild` | Can user access child routes? |
| `canDeactivate` | Can user leave this route? |
| `resolve` | Pre-fetch data before route loads |

**Example — canActivate:**

```ts
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.auth.isAuthenticated().then((authenticated) => {
      if (authenticated) return true;
      this.router.navigate(['/']);
      return false;
    });
  }
}
```

**Usage in routes:**

```ts
{ path: 'admin', canActivate: [AuthGuard], component: AdminComponent }
```

**canActivateChild** — protects child routes only:

```ts
{ path: 'admin', canActivateChild: [AuthGuard], children: [...] }
```

**canDeactivate** — prevents leaving (e.g., unsaved form):

Create an interface, implement it in the component, and use the guard to call the component's method.

---

## T31. Resolve Guard (Dynamic Data)

Pre-fetch data before navigating to a route.

---

## T32. useHash in Angular Router

By default Angular uses HTML5 History API for clean URLs. For older browsers (e.g., IE11), use hash-based routing:

```ts
RouterModule.forRoot(routes, { useHash: true })
// URLs become: /#/users instead of /users
```

---

## T33. Redirect Blank URL

```ts
{ path: '', redirectTo: '/home', pathMatch: 'full' }
```

---

## T34. What is Angular?

Angular is a TypeScript-based framework developed and maintained by Google for building complex, client-side web applications. Key features: components, DI, routing, forms, HTTP, and RxJS.

---

## T35. Directives — Types & Examples

**3 types:**

1. **Component Directives** — directives with a template (view):

```ts
@Component({ selector: 'app-my', template: '<div>My Component</div>' })
export class MyComponent {}
```

2. **Attribute Directives** — modify element behavior/appearance:

```ts
@Directive({ selector: '[myHighlight]' })
export class HighlightDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'yellow';
  }
}
```

3. **Structural Directives** — add/remove DOM elements:

```ts
@Directive({ selector: '[myIf]' })
export class IfDirective {
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  @Input() set myIf(condition: boolean) {
    condition ? this.viewContainer.createEmbeddedView(this.templateRef) : this.viewContainer.clear();
  }
}
```

---

## T36. Data Binding — Types

| Type | Syntax | Direction |
|---|---|---|
| Interpolation | `{{ value }}` | Component → Template |
| Property Binding | `[disabled]="isDisabled"` | Component → Template |
| Event Binding | `(click)="onClick()"` | Template → Component |
| Two-way Binding | `[(ngModel)]="name"` | Component ↔ Template |

---

## T37. Basic Building Blocks of Angular

- **Components** — UI building blocks with template + logic
- **Templates** — HTML structure with Angular directives
- **Services** — shared functionality via `@Injectable`
- **Modules** — organize app into functional units
- **Directives** — add behavior to DOM elements
- **Pipes** — transform data for display

---

## T38. Decorators & Metadata

Decorators add metadata to classes using `@` syntax. Angular reads this metadata at runtime.

```ts
@Component({
  selector: 'app-root',
  template: '<h1>{{ title }}</h1>'
})
export class AppComponent {
  title = 'My App';
}
```

Built-in: `@Component`, `@Directive`, `@Injectable`, `@Pipe`, `@NgModule`

---

## T39. Lazy Loading

Loads a feature module/route only when the user navigates to it, instead of loading it upfront — shrinks the initial bundle and speeds up first load.

```ts
{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }

// Standalone equivalent (no NgModule):
{ path: 'admin', loadComponent: () => import('./admin.component').then(c => c.AdminComponent) }
```

---

## T40. Services in Angular

A service is a plain TypeScript class that holds reusable logic/data (API calls, shared state, utilities), injected into components via DI — keeps components focused on the UI only.

```ts
@Injectable({ providedIn: 'root' })  // singleton, app-wide
export class DataService {
  getItems() { return ['a', 'b']; }
}
```

---

## T41. ng-content (Content Projection)

`<ng-content>` is a placeholder inside a component's template where content passed by the parent (written between the component's tags) gets inserted — similar to a "slot".

```html
<!-- child.component.html -->
<div class="card"><ng-content></ng-content></div>

<!-- parent usage -->
<app-card><p>This gets projected inside the card</p></app-card>
```

---

## T42. ViewChild vs ViewChildren

| | @ViewChild | @ViewChildren |
|---|---|---|
| Returns | first matching element/component | `QueryList` of all matches |
| Source | component's own template | component's own template |
| Use case | one known ref (e.g. a modal) | list of refs (e.g. `*ngFor` items) |

---

## T43. ContentChild vs ContentChildren

Same idea as ViewChild/ViewChildren, but query **projected content** (passed in via `<ng-content>`) instead of the component's own template.

| | @ContentChild | @ContentChildren |
|---|---|---|
| Returns | first projected match | `QueryList` of all projected matches |
| Source | content projected by parent | content projected by parent |

---

## T44. `{ static: true }` in ViewChild

Controls **when** the query is resolved:

- **`static: true`** — resolved once, before change detection runs (available in `ngOnInit`). Use only when the element is always in the DOM (not inside `*ngIf`/`*ngFor`).
- **`static: false`** (default) — resolved after the view (and any conditional content) is initialized, available in `ngAfterViewInit`. Required when the element is conditional.

```ts
@ViewChild('el', { static: true }) el: ElementRef;
```

---

## T45. Constructor vs ngOnInit

| | Constructor | ngOnInit |
|---|---|---|
| What | plain JS/TS class feature | Angular lifecycle hook |
| When | runs when the class is instantiated | runs once, right after the first `ngOnChanges` |
| `@Input()` values | **not yet set** | available — safe to use |
| Use for | dependency injection only | initialization logic (API calls, setup using inputs) |

---

## T46. HTTP in Angular

`HttpClient` makes HTTP calls and returns `Observable`s.

```ts
constructor(private http: HttpClient) {}
getUsers() { return this.http.get<User[]>('/api/users'); }
```

**Modern setup** (standalone apps, no `HttpClientModule`) — in `app.config.ts`:

```ts
providers: [ provideHttpClient(withInterceptors([authInterceptor])) ]
```

---

## T47. Passing Data Between Components

| Method | Direction |
|---|---|
| `@Input` | Parent → Child |
| `@Output` + EventEmitter | Child → Parent |
| `@ViewChild` | Child → Parent |
| Shared Service | Any ↔ Any |

---

## T48. @Input — Parent to Child

Parent binds a value into the child's `@Input()` property via `[ ]` property binding. One-way: parent → child.

```html
<!-- parent.html -->
<app-child [name]="parentName"></app-child>
```

```ts
// child.ts
@Input() name: string;
```

---

## T49. @Output — Child to Parent

Child emits an event via `EventEmitter`; parent listens with `( )` event binding. One-way: child → parent.

```html
<!-- parent.html -->
<app-child (notify)="onNotify($event)"></app-child>
```

```ts
// child.ts
@Output() notify = new EventEmitter<string>();
send() { this.notify.emit('hello'); }
```

---

## T50. Pipes in Angular

Pipes transform displayed data right in the template using `|`.

```html
{{ birthday | date:'shortDate' }}
{{ name | uppercase }}
{{ price | currency:'USD' }}
```

Common built-ins: `DatePipe`, `UpperCasePipe`, `LowerCasePipe`, `CurrencyPipe`, `DecimalPipe`, `PercentPipe`, `JsonPipe`, `SlicePipe`, `AsyncPipe`.

---

## T51. Custom Pipe

Implement `PipeTransform` and register with `@Pipe`.

```ts
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20): string {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}
// Usage: {{ longText | truncate:10 }}
```

---

## T52. Interceptors

Middleware that intercepts HTTP requests/responses.

**Use cases:**
- Add authentication headers
- Cache responses
- Handle errors globally
- Show loading indicators
- Log requests

```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
    return next.handle(authReq);
  }
}
```

---

## T53. Pure vs Impure Pipe

| | Pure (default) | Impure (`pure: false`) |
|---|---|---|
| Re-runs when | input **reference** changes | **every** change detection cycle |
| Performance | fast | expensive |
| Use for | immutable data | mutable arrays/objects (e.g. in-place filtering) |

```ts
@Pipe({ name: 'myPipe', pure: false })
```

---

## T54. Compilation Types in Angular

| | JIT (Just-in-Time) | AOT (Ahead-of-Time) — default |
|---|---|---|
| When compiled | in the browser, at runtime | at build time |
| Bundle size | larger (ships the compiler) | smaller |
| Startup speed | slower | faster |
| Error detection | at runtime | at build time (catches template errors early) |

---

## T55. Angular Animation Module

`@angular/animations` uses `trigger` / `state` / `transition` / `style` / `animate`.

```ts
import { trigger, state, style, transition, animate } from '@angular/animations';

animations: [
  trigger('fade', [
    state('in', style({ opacity: 1 })),
    transition('void => *', [style({ opacity: 0 }), animate(300)])
  ])
]
```

Enable via `provideAnimationsAsync()` (or `provideAnimations()`) in providers; bind in template with `[@fade]="'in'"`.

---

## T56. Dynamic Script Loading

Load an external JS file at runtime (e.g. a heavy third-party library) instead of including it in `index.html` upfront.

```ts
loadScript(src: string) {
  const script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);
}
```

---

## T57. Router Events

`router.events` is an Observable emitting events through the navigation lifecycle — useful for loaders, analytics, scroll restoration.

**Order:** `NavigationStart` → `RoutesRecognized` → `GuardsCheckStart/End` → `ResolveStart/End` → `NavigationEnd` (or `NavigationCancel`/`NavigationError`).

```ts
this.router.events.subscribe(event => {
  if (event instanceof NavigationStart) this.loading = true;
  if (event instanceof NavigationEnd) this.loading = false;
});
```

---

## T58. ngSwitch Directive

Structural directive for conditional rendering among multiple options — like a JS `switch`.

```html
<div [ngSwitch]="status">
  <p *ngSwitchCase="'active'">Active</p>
  <p *ngSwitchCase="'inactive'">Inactive</p>
  <p *ngSwitchDefault>Unknown</p>
</div>
```

---

## T59. Forms in Angular

Two approaches:

- **Template-driven** — form model built in HTML via `ngModel`; simple, good for basic forms (needs `FormsModule`).
- **Reactive** — form model built in TypeScript via `FormGroup`/`FormControl`; more scalable, testable, synchronous (needs `ReactiveFormsModule`).

See T69–T71 for details and examples.

---

## T60. ng-container vs ng-template

- **`<ng-container>`** — a logical grouping wrapper that renders **no actual DOM element**. Useful for applying a structural directive without adding an extra `<div>`.
- **`<ng-template>`** — defines a block that is **not rendered by default**; only rendered when referenced by a structural directive or `ViewContainerRef` (e.g. an `*ngIf` `else` block).

```html
<ng-container *ngIf="show">
  <p>A</p><p>B</p>
</ng-container>

<p *ngIf="show; else elseBlock">Shown</p>
<ng-template #elseBlock><p>Nothing to show</p></ng-template>
```

---

## T61. Sharing Modules Between NPM Packages

**Repo 1 (library):**

```ts
// repo1.module.ts
@NgModule({
  declarations: [Com1, Com2, Com3],
  exports: [Com1, Com2, Com3]
})
export class Repo1Module {}

// public-api.ts
export * from './repo1.module';
export * from './com1';
export * from './com2';
export * from './com3';
```

**Repo 2 (consumer):**

```ts
// any.module.ts
import { Repo1Module } from 'repo1-npm';

@NgModule({
  imports: [Repo1Module]
})
export class AnyModule {}
```

```html
<!-- any.component.html -->
<lib-com1></lib-com1>
<lib-com2></lib-com2>
<lib-com3></lib-com3>
```

---

## T62. NPM Publish Process

```bash
ng build --prod one-jf-header
cd dist/one-jf-header/
npm publish
```

---

## T63. Data Sharing Summary

| Method | Direction |
|---|---|
| `@Input` | Parent → Child |
| `@Output` + EventEmitter | Child → Parent |
| `@ViewChild` | Child → Parent |
| Shared Service | Unrelated components |

---

## T64. Create Project in Root Directory

```bash
ng new my-project --directory ./
```

---

## T65. Find Unused Variables

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "noUnusedLocals": true
  }
}
```

---

## T66. Standalone Components

Since Angular 19, components/directives/pipes are **standalone by default** — no `NgModule` required. Each declares its own dependencies via `imports`.

```ts
@Component({
  selector: 'app-hello',
  imports: [CommonModule, RouterLink],
  template: `<h1>Hi</h1>`
})
export class HelloComponent {}
```

Bootstrap: `bootstrapApplication(AppComponent, appConfig)` instead of `platformBrowserDynamic().bootstrapModule(AppModule)`. NgModules still work (`standalone: false`), but new apps default to standalone.

---

## T67. Signals

Angular's newer reactivity primitive — a value wrapper that notifies consumers when it changes, enabling fine-grained UI updates without zone.js.

```ts
count = signal(0);
double = computed(() => this.count() * 2);   // auto-recomputes when count changes
effect(() => console.log('count is', this.count()));  // side effect on change

increment() { this.count.update(v => v + 1); }  // or this.count.set(5)
```

Read a signal by **calling it**: `count()`. Signals are the foundation of Angular's move toward zoneless change detection.

---

## T68. Change Detection: Default vs OnPush

| | Default | OnPush |
|---|---|---|
| Checks component | on every CD cycle (any event/timer/HTTP anywhere in the app) | only when: an `@Input` **reference** changes, an event fires from within the component, an `async`-piped Observable emits, or a signal it reads changes |
| Performance | more checks, simpler | fewer checks, faster — recommended for most components |

```ts
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
```

Default CD is driven by **zone.js** patching async browser APIs (see T80).

---

## T69. Reactive Forms vs Template-Driven Forms

| | Reactive | Template-Driven |
|---|---|---|
| Form model | defined in TS (`FormGroup`/`FormControl`) | defined in HTML (`ngModel`) |
| Style | synchronous, explicit | asynchronous, implicit |
| Scalability/testing | better for complex forms | fine for simple forms |
| Module needed | `ReactiveFormsModule` | `FormsModule` |

**Reactive:**
```ts
form = new FormGroup({ name: new FormControl('') });
```
```html
<form [formGroup]="form"><input formControlName="name"></form>
```

**Template-driven:**
```html
<form #f="ngForm">
  <input name="name" ngModel required>
</form>
```

---

## T70. FormControl / FormGroup / FormBuilder

- **FormControl** — tracks the value/validity of a single field.
- **FormGroup** — groups multiple `FormControl`s as one object.
- **FormArray** — a dynamic list of controls.
- **FormBuilder** — injectable helper that reduces boilerplate when building forms.

```ts
constructor(private fb: FormBuilder) {}
form = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]]
});
```

---

## T71. Form Validation

**Built-in validators:** `Validators.required`, `minLength`, `maxLength`, `pattern`, `email`, `min`, `max`.

```ts
name: ['', [Validators.required, Validators.minLength(3)]]
```
```html
<span *ngIf="form.get('name')?.hasError('required')">Name is required</span>
```

**Custom validator** — a function returning `null` (valid) or an error object:

```ts
function forbiddenName(control: AbstractControl): ValidationErrors | null {
  return control.value === 'admin' ? { forbidden: true } : null;
}
```

---

## T72. RxJS Essentials for Angular

An **Observable** is a stream of values over time; call `.subscribe()` to receive them.

| Operator | Use |
|---|---|
| `map` | transform each emitted value |
| `filter` | only pass values matching a condition |
| `switchMap` | cancel the previous inner observable and switch to a new one (e.g. search-as-you-type) |
| `mergeMap` | run inner observables in parallel, no cancellation |
| `debounceTime` | wait for a pause in emissions before emitting (e.g. input events) |
| `takeUntil` | auto-complete the stream when a notifier observable emits |

---

## T73. Subscribing/Unsubscribing & Memory Leaks

Forgetting to unsubscribe from an Observable (e.g. one started in `ngOnInit`) keeps it alive after the component is destroyed → memory leak.

**Fixes:**
- Prefer the **`async` pipe** in the template — Angular subscribes and unsubscribes automatically:
```html
<p>{{ data$ | async }}</p>
```
- Or use `takeUntil(this.destroy$)`, emitting `destroy$` in `ngOnDestroy`.
- Or use `takeUntilDestroyed()` (Angular 16+) — no manual `Subject` needed.

---

## T74. Angular CLI Common Commands

| Command | Purpose |
|---|---|
| `ng new my-app` | create a new project |
| `ng serve` | run the dev server |
| `ng generate component name` (`ng g c name`) | scaffold a component |
| `ng generate service name` | scaffold a service |
| `ng build` | production build |
| `ng test` | run unit tests (Karma/Jasmine) |
| `ng e2e` | run end-to-end tests |
| `ng update` | update Angular packages |

---

## T75. Testing Basics (TestBed, Jasmine/Karma)

- **Jasmine** — the testing framework (`describe`/`it`/`expect`) used to write unit tests.
- **Karma** — the test runner that executes tests in a real browser.
- **TestBed** — Angular's utility to configure a testing module (like an `@NgModule`) for the component/service under test.

```ts
describe('MyComponent', () => {
  let fixture: ComponentFixture<MyComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MyComponent] });
    fixture = TestBed.createComponent(MyComponent);
  });
  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

---

## T76. State Management Options

- **Small/medium apps** — a shared service holding a `signal()` or RxJS `BehaviorSubject` as the single source of truth. Simple, no extra library.
- **Large apps with complex, cross-cutting state** — **NgRx** (Redux pattern: actions/reducers/effects/selectors). More boilerplate, but predictable and debuggable (time-travel).

Rule of thumb: start with services + signals; reach for NgRx only when state sharing/complexity truly needs it.

---

## T77. Angular Universal / SSR

Server-Side Rendering — renders the app to HTML on the server (Node) before sending it to the browser. Improves first-paint speed and SEO (crawlers see real content). Enable via `ng add @angular/ssr`.

---

## T78. i18n (Internationalization)

Angular's built-in i18n tooling (`$localize`, the `i18n` template attribute, `ng extract-i18n`) lets you translate templates into multiple languages and build locale-specific versions of the app.

---

## T79. trackBy with *ngFor

Without `trackBy`, Angular identifies list items by object reference and re-renders the whole list on any change. `trackBy` gives each item a stable id, so Angular only updates/moves the DOM nodes that actually changed — a big performance win for large or frequently-updated lists.

```html
<li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>
```
```ts
trackById(index: number, item: Item) { return item.id; }
```

---

## T80. Zone.js

A library Angular (pre-signals) uses to patch async browser APIs (`setTimeout`, promises, DOM events, XHR) so it knows when something *might* have changed and automatically triggers change detection — this is why you don't have to manually call `detectChanges()` after an event or HTTP response. Angular now supports an experimental **zoneless** mode (`provideExperimentalZonelessChangeDetection()`) that relies on signals instead of zone.js.
