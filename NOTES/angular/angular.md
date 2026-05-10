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

Answer

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

Answer

---

## T18. Directives Overview

Answer

---

## T19. Component Directive

Answer

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

Answer

---

## T40. Services in Angular

Answer

---

## T41. ng-content (Content Projection)

Answer

---

## T42. ViewChild vs ViewChildren

Answer

---

## T43. ContentChild vs ContentChildren

Answer

---

## T44. `{ static: true }` in ViewChild

Answer

---

## T45. Constructor vs ngOnInit

Answer

---

## T46. HTTP in Angular

Answer

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

Answer

---

## T49. @Output — Child to Parent

Answer

---

## T50. Pipes in Angular

Answer

---

## T51. Custom Pipe

Answer

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

Answer

---

## T54. Compilation Types in Angular

Answer

---

## T55. Angular Animation Module

Answer

---

## T56. Dynamic Script Loading

Answer

---

## T57. Router Events

Answer

---

## T58. ngSwitch Directive

Answer

---

## T59. Forms in Angular

Answer

---

## T60. ng-container vs ng-template

Answer

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
