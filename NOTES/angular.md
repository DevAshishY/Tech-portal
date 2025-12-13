
## Questions

**# T1 angular feature**

    Data binding
    Directives
    Services or Dependency Injection
    Routing
    Observables
    Forms
    Pipes
    HTTP
    Authentication
    Optimization
    Deployment
    Animation
    Testing

------------------------------------------

**# T2 adding bootstrap**

    npm i bootstrap@5.3.0-alpha3

    add css on angular.json from node module

------------------------------------------
**# T4 how angular app bootstrap**

    index.html(entry point) => main.ts(bootstrap) => appModule(rootModule) => appComponent(root component)

------------------------------------------

**# T5 elementRef and render2 different**

    ElementRef gives you direct access to the native element of a component, Renderer2 provides a safer and more efficient way to perform DOM manipulations in Angular.

  ------------------------------------------
  **# T6 decorator**

    Decorators are used to enhance or modify the behavior of the class they are applied to, and they are an essential part of Angular's metadata-driven approach to building applications.

    @NgModule
    @Component
    @Injectable
    @Directive
    @Pipe
    @Input
    @Output
    @HostBinding
    @HostListener
    @ContentChild
    @ContentChildren
    @ViewChild
    @ViewChildren

------------------------------------------
**# T7 @NgModule**

    Defines a module that contains components, directives, pipes, and providers.

    import { NgModule } from '@angular/core';

    @NgModule({
    declarations:[Component1, Component2],
    imports: [Module1, Module2],
    exports: [MyModule],
    providers: [Service1, Service2],
    bootstrap: [AppComponent]})
    class MyModule {}

------------------------------------------
**# T8 @Component**

    Declares that a class is a component and provides metadata about the component.

    import { Component } from '@angular/core';

    @Component({
    changeDetection?: ChangeDetectionStrategy
    viewProviders?: Provider[]
    moduleId?: string
    templateUrl?: string
    template?: string
    styleUrls?: string[]
    styles?: string[]
    animations?: any[]
    encapsulation?: ViewEncapsulation
    interpolation?: [string, string]
    entryComponents?: Array<Type<any> | any[]>
    preserveWhitespaces?: boolean

    // inherited from core/Directive
    selector?: string
    inputs?: string[]
    outputs?: string[]
    host?: {...}
    providers?: Provider[]
    exportAs?: string
    queries?: {...}
    })

    selector: '[app-servres]'
    we can use selector as attibute and use this type <div app-servres></div>

------------------------------------------
**# T9 @Injectable**

    Declares that a class has dependencies that should be injected into the constructor when the dependency injector is creating an instance of this class.

    import { Injectable } from '@angular/core';
    @Injectable()

------------------------------------------
**# T10 @Pipe**

    Declares that a class is a pipe and provides metadata about the pipe.

    import { Pipe } from ‘@angular/core’;
    @Pipe({
    name: string
    pure?: boolean
    })

------------------------------------------
**# T11 @Input**

      Declares an input property that you can update via property binding (example: <my-cmp [myProperty]="someExpression">).

      import { Input } from ‘@angular/core’;
      @Input({
      bindingPropertyName?: string
      })

      These decorators are used to define input and output properties for components. @Input allows a parent component to pass data to a child component, while @Output allows a child component to emit events to its parent component.

      @input or binding a custom property (like disbale attibute ) : process parent => to child

------------------------------------------
**# T12 input alias**

    Answer

------------------------------------------
**# T13 OutPut**

    Declares an output property that fires events that you can subscribe to with an event binding (example:

------------------------------------------
**# T14 @HostBinding**

      while HostBinding allows us to bind to a property of the host element.

    @HostBinding('style.background') backgrondColor:string = this.defaultColor

------------------------------------------
**# T15 @HostListener**

  HostListener listens to host events

    @HostListener('mouseenter') mouseEnterFun(eventData:Event){
    // this.render.setStyle(this.eleRef.nativeElement,'background-color','tranparent'); // by render target elemnet
    this.backgrondColor =this.byHostBinding

    }
    @HostListener('mouseleave') mouseLeaveFun(eventData:Event){
    // this.render.setStyle(this.eleRef.nativeElement,'background-color','red');// by render target elemnet
    this.backgrondColor = this.defaultColor

------------------------------------------
**# T16 @ContentChild**

## ![image](https://user-images.githubusercontent.com/106906674/232863485-67025abb-2a06-46ba-a63d-8ee1f9189da5.png)

------------------------------------------
**# T17 @ContentChildren**

## ![image](https://user-images.githubusercontent.com/106906674/232863780-05e1ec6b-dd3b-4b6d-9504-b264da9b260f.png)

------------------------------------------
**# T17 @ViewChild**

    Binds the first result of the component view query (myPredicate) to a property (myChildComponent) of the class. Not available for directives.

    import { ViewChild } from '@angular/core';
    @ViewChild(Pane)

    These decorators are used to query and access child components or elements from a parent component.

------------------------------------------
**# T19 ViewChildren**

    Answer

------------------------------------------
**# T20 Directive**

    Answer

------------------------------------------
**# T21 Component Directive**

    Answer

------------------------------------------
**# T22 Structural Directive**

  ngIf
  ngFor
  ngSwitch

------------------------------------------
**# T23 Attribute Directive**

    ngClass
    ngStyle
    ngModel

------------------------------------------
**# T24 content projectio**

    Single-slot
    Multi-slot
    Conditional

    ng-content
    ng-templete

------------------------------------------
**# T25 data binding**

    mean comunication between ts file(bussniess logic) and view (html file)

    string interpolation {{data}} : Flow ts => templete
    proprty binding [property]="data" :flow ts => templete
    event binding (click)="expression" : flow ts <== templete
    two way binding [(ngModal)]="data " :flow ts <==> templete

    **note: Event binding **

    <input (input)="checkValue($event)" [value]="value">
    checkValue(event:Event){
    this.value = (<HTMLInputElement>event.target).value
    }

    $event received as event so use htmlinpputElement in front

------------------------------------------
**# T26 View encapsulation**


    it ensures that the styles defined within a component are scoped only to that component and do not affect other components or elements in the DOM (Document Object Model).

    1- Emulated (default):This ensures that the component's styles do not leak to other components.by adding a unique attribute

    2-None: This mode disables view encapsulation, allowing the component's styles to be applied globally.

    3-ShadowDom: it create self dom other css not work only current css work here means it's css not reflict any css.

------------------------------------------
**# T27 local reference varible**

    **html file:**

    <input #reference type="text">

    <button (click)="checkdata(reference)">

    **ts file**

    checkdata(data:HTMLInputElement){
    console.log(data) // define data as element target if div htmlDivElemnt
    }

------------------------------------------
**# T28 life cycle method**

    **ngOnchanges** :it call multiple time when com crated and called after a bound input propery change ,

    **ngOnInt:** after initialize

    **ngDocheck** called during every change

    **ngAfterContentInit**: called after content(ng-content) has been prpjected into view

    **ngAfterContentChecked** called every time the projected content has beed checked

    **ngAfterViewInit** : called after com view and child view initialize

    **ngAfterViewchecked** : called after com view and child view checked

    **ngOnDistroy** : when com is distroy

------------------------------------------
**# T29 services /Di**

**method-1** create instance manually of service in component

![image](https://user-images.githubusercontent.com/106906674/233548375-b551a0bd-8378-4427-87dd-0f35b0c0fccf.png)

Not need to provider

**method 2**- angular will provide instance

    ![image](https://user-images.githubusercontent.com/106906674/233548540-73ceea23-5692-405b-b7df-3f3faedef2f0.png)

    **need to provider hireecy meand it will work this and this child **
    ![image](https://user-images.githubusercontent.com/106906674/233556416-257357aa-24b8-4b4f-81cc-97320e5a6af5.png)

    **But if component is not child of provide on @component so need to menstion on global app mododule
    **
    ![image](https://user-images.githubusercontent.com/106906674/233556655-d6b062c7-2ecc-4ca2-9f45-777b244c0868.png)

------------------------------------------
**# T30 servie inside service**

    ![image](https://user-images.githubusercontent.com/106906674/233560832-479e5cdb-bfe8-4dcb-af66-9fa627ff8098.png)
    ![image](https://user-images.githubusercontent.com/106906674/233561146-8ff45781-aff2-4920-a69a-94f1f1a1be40.png)

    **injectbale** : it is needed here because here we are injecting other service inside norammlywhen mamkking normal service not use @injetable but new angular provide default it

------------------------------------------
**# T31 routing**

      basic

      ![image](https://user-images.githubusercontent.com/106906674/233893784-2248400b-2c89-4530-a654-d9708d10cee0.png)

      create path : Routes provided by angular core

      RouterModule.forRoot(routes) : forRoot pass our routes

      ![image](https://user-images.githubusercontent.com/106906674/233893937-c69e9831-5f37-4596-b0fd-b6cf5872047b.png)

      use apboslute path by using slash

      you can set path stringvalue by this type

      ![image](https://user-images.githubusercontent.com/106906674/233894910-f3eaf923-4ac4-477d-ae43-b8e1afe17e41.png)

      set path and declear in declration need
      ![image](https://user-images.githubusercontent.com/106906674/233895322-4191a2eb-3569-4f6c-ac2b-db99d51efd29.png)

      **Active**

      ![image](https://user-images.githubusercontent.com/106906674/233898298-45bc58cc-9720-41ac-8572-02c0df3e3e37.png)

      first link always active so pass

      [routerLinkActiveOptions]="{exact:true}"

      **navigate**

      this.\_router.navigate(['page2'],{relativeTo:this.activatedRoute} )

      navigate: can work as routing , relative to for currect route

      **set parems**

      ![image](https://user-images.githubusercontent.com/106906674/233925854-7d358c2c-e529-4ab8-b353-4bbb0453c69b.png)
      ![image](https://user-images.githubusercontent.com/106906674/233925929-57e1ca4a-8721-429c-9beb-4991f8ec02b0.png)

      **route.snapshot**
      is a static image of the route information, captured at the moment the component is created.

      **route.params**
      route.params, on the other hand, is an Observable that allows you to subscribe to changes to the route parameters. It provides the current route parameters and also updates the values when the parameters change.

      **passing query parameter and fragment**

      <li>
              <a routerLinkActive="active"  [routerLink]="['user']" [queryParams]="{page:'userPage',year:2010}" fragment="'hrllo'" >
                  query/params  and fragment</a>
            
          </li>

      ![image](https://user-images.githubusercontent.com/106906674/234461212-af7dc07b-a7eb-4c7f-980e-e3f53e1b79cf.png)
      query parameter will show with ? and fragment with #

      **geeting query parameter and fragment with sanpshot and parames observable**

      ![image](https://user-images.githubusercontent.com/106906674/234461434-67361b7c-5d46-499f-9777-bad1a2d9dc69.png)

      **nexted router by using children**
      ![image](https://user-images.githubusercontent.com/106906674/234462281-565cc54b-6378-4bbb-b96e-e10984c369b1.png)

      **redirected to**

      {path:'something',component:PageNotFoundComponent},
      {path:'not-found',redirectTo:'/something'}

      **wildcard**

      {path:'not-found',component:PageNotFoundComponent},
      {path:'\*\*',redirectTo:'/not-found'}

      make sure wildcard should be in last
      **pathMatch**
      if path is sonmething use path match

      {path:'\*\*',redirectTo:'/not-found', pathMatch: 'full'}

------------------------------------------
**# T32  router Guards**

      we can control navigation as per condition

      1- create auth-guard.service.ts

      2-authservice.ts (for check condition if user login or logout)

      **authservice.ts**

      export class authService{
      loggin:boolean = false;

          isAuthenticated(){
              const promise = new Promise(
                  (resolve,reject) =>{
                      setTimeout(() => {
                          resolve(this.loggin)
                      }, 1000);
                  }
                  );
                  return promise;
          }
          logIn(){
              this.loggin =true;
          }
          logOut(){
              this.loggin = false;
          }

      }

      **create auth-guard.service.ts**

      canactivated

      **The method takes two parameters:**

      route: An ActivatedRouteSnapshot object that represents the current route that the user is trying to access. it can contain URL, parameters, query parameters, and data

      state: A RouterStateSnapshot object that represents the state of the router at the time the user is trying to access the route. It contains an array of ActivatedRouteSnapshot objects, one for each route in the hierarchy.

      The method returns a value that can be one of the following types:

      boolean: If the user is authorized to access the route, the method should return true. If not, it should return false.

      UrlTree: If the user is not authorized to access the route, the method can return a UrlTree object that represents a redirect to another page.

      Observable<boolean>: If the authorization check requires an asynchronous operation, the method can return an Observable that emits a boolean value when the operation is complete.

      Promise<boolean>: If the authorization check requires an asynchronous operation that returns a promise, the method can return a promise that resolves to a boolean value when the operation is complete.

      import { Injectable } from "@angular/core";
      import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
      import { Observable } from "rxjs";
      import { authService } from "./auth-service";

      @Injectable()
      export class AuthGuard implements CanActivate{

          constructor(private _authService:authService,private router:Router){

          }

      canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return this.\_authService.isAuthenticated()
      .then(
      (authenticate:any)=>{
      if(authenticate){
      return true;
      }
      else{
      this.router.navigate(['/'])
      return false;
      }
      }
      )
      }

      }

      - use injectable because we are uising servie inside a service authservice
      - inside canActivate check isAthenticated return true then allow navigation if not redirect to root
      - export both service on appmodule provider
      - apply on routhing file

      path:'routing', canActivate:[AuthGuard], component:RoutingComponent,

      ---

      ** protect only child route**

      we can use canActivate:[AuthGuard] on child but it is not good way because it can multiple so using canActiveChild

      canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return this.canActivate(childRoute,state)
      }

      we call canActive inside canActiveChild and pass expeceted parameter childRoute,state

      now we can use for child route

      path:'routing',
      // canActivate:[AuthGuard],
      canActivateChild:[AuthGuard],
      component:RoutingComponent,

      ### can deActivted

      ![image](https://user-images.githubusercontent.com/106906674/235601691-13d8c7b9-f1c7-49f0-a6f0-00a7adb4bc52.png)

      ![image](https://user-images.githubusercontent.com/106906674/235601929-91775fd9-6742-4fc4-8e1d-49a334398cc8.png)

      we can make canComponentDeactivated service and implnemnts on class

      then we can use canDeactivated method if can check here if form edited and change naviagation you can set popup message

      **canDeactivtedGuraed.ts**
      ![image](https://user-images.githubusercontent.com/106906674/235602371-a6d36225-e27c-4661-8d5d-f42dda9fd75c.png)

      making a inteface for set rule implements on class and it will return component.canDeactivted method thats we have implment on out componts

      **appRoutingFile**
      ![image](https://user-images.githubusercontent.com/106906674/235602672-0e3f0e28-c247-4aec-bf8a-389eb9b732ab.png)

      ## passing static data on route

      ![image](https://user-images.githubusercontent.com/106906674/235638901-7e31c9dd-07b0-4ead-8dd2-0452368290a5.png)

      ![image](https://user-images.githubusercontent.com/106906674/235641731-e7b94d91-6b39-4386-81f0-5b0051a582ff.png)

      you can set snapshot and router method

------------------------------------------
**# T33 dynamic data with resolve guard like parems and fragment**

  by default angular on server only one page so routing url create problem old browesr but new angular follow html 5 history api .

  If a new browser supports the HTML5 history API, then using useHash in Angular is generally not necessary. The HTML5 history API provides a clean URL structure without the need for a hash symbol (#), and it is widely supported by modern browsers.

  However, it's important to keep in mind that not all users may be using the latest browsers. If your application needs to support older browsers, such as Internet Explorer 11, then using useHash may still be necessary to ensure proper navigation.

  ![image](https://user-images.githubusercontent.com/106906674/235648879-6ab77ba1-15d9-4d6f-9866-32f5e8332ea8.png)

------------------------------------------
**# T34 usehash in angular router**

    Answer

------------------------------------------
**# T35 when redirect blank url to page show a error so we can set**

  ![image](https://user-images.githubusercontent.com/106906674/236223031-3b93f303-4dba-4bb9-8b8b-ca2d8f1bd161.png)

------------------------------------------
**# T36 What is angular or goal of angular**

  The primary goal of Angular is to provide a platform for building complex, client-side web applications. Angular is a JavaScript framework developed and maintained by Google, and it has several key features that make it well-suited for this purpose:

------------------------------------------
**# T37 what is directive and how many types**

    In Angular, a directive is a class that adds behavior or modifies the appearance of an element in the DOM (Document Object Model). Directives can be used to implement custom behavior, such as attaching event handlers, manipulating the DOM, or adding custom attributes to elements.

    There are three types of directives in Angular:

    **Component Directives:** These are the most common type of directives in Angular. Components are directives with a view. They are used to create reusable UI components that can be used throughout an application. A component directive is defined using the @Component decorator.

    @Component({
    selector: 'app-my-component',
    template: '<div>My Component</div>'
    })
    export class MyComponent {}

    **Attribute Directives:** Attribute directives modify the behavior or appearance of an element by changing its attributes. They are used to add behavior to an existing element. An attribute directive is defined using the @Directive decorator and is applied to an element as an attribute.

    @Directive({
    selector: '[myHighlight]'
    })
    export class HighlightDirective {
    constructor(private el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'yellow';
    }
    }

    **Structural Directives:** Structural directives modify the structure of the DOM by adding, removing, or manipulating elements. They are used to conditionally render elements or repeat a block of elements. Structural directives are defined using the @Directive decorator and are applied to an element as an attribute.

    @Directive({
    selector: '[myIf]'
    })
    export class IfDirective {
    constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

    @Input() set myIf(condition: boolean) {
    if (condition) {
    this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
    this.viewContainer.clear();
    }
    }
    }

------------------------------------------
**# T38 what is data binding and it's type**

    Data binding is a feature in Angular that allows you to connect data in your component class to the user interface (UI) in your template. There are four types of data binding in Angular:

    **1- Interpolation Binding:** This is a one-way data binding where the data flows from the component class to the template. Interpolation binding is denoted by double curly braces {{}} and can be used to display string literals or variable values in the template.

    <!-- app.component.html -->
    <h1>{{ pageTitle }}</h1>

    <!-- app.component.ts -->

    export class AppComponent {
    pageTitle = 'My App';
    }

    **2-Property Binding:** This is also a one-way data binding where the data flows from the component class to the template. Property binding is denoted by square brackets [] and can be used to set a property of an HTML element in the template.

    <!-- app.component.html -->

    <button [disabled]="isDisabled">Click me</button>

    <!-- app.component.ts -->

    export class AppComponent {
    isDisabled = false;
    }

    **3-Event Binding:** This is a one-way data binding where the data flows from the template to the component class. Event binding is denoted by parentheses () and can be used to bind to events raised by HTML elements in the template.

    <!-- app.component.html -->

    <button (click)="onClick()">Click me</button>

    <!-- app.component.ts -->

    export class AppComponent {
    onClick() {
    console.log('Button clicked!');
    }
    }

    **4-Two-way Binding:** This is a two-way data binding where the data flows in both directions between the component class and the template. Two-way binding is denoted by square brackets and parentheses [()] and can be used to bind to both a property and an event at the same time.

    <!-- app.component.html -->

    <input [(ngModel)]="name">

    <!-- app.component.ts -->

    export class AppComponent {
    name = 'John Doe';
    }

    In summary, data binding is a powerful feature in Angular that allows you to connect data between the component class and the template. There are four types of data binding in Angular: interpolation binding, property binding, event binding, and two-way binding, each with its own use case and syntax.

------------------------------------------
**# T39 basic component involved in angular**

    There are several basic components involved in creating an Angular application. Here are the main components:

    **Components:** Components are the building blocks of an Angular application. Each component defines a part of the user interface (UI) and its behavior. A component is defined by a TypeScript class with a decorator that provides metadata to Angular. A component's metadata includes its selector, template or templateUrl, and styles or styleUrls.

    **Templates:** Templates define the structure and layout of the UI for a component. Templates use HTML markup and can include Angular directives and expressions to provide dynamic content and behavior.

    **Services:** Services are used to provide functionality that is shared across multiple components. Services are defined by a TypeScript class with the @Injectable decorator, and they can be injected into components or other services using dependency injection.

    **Modules:** Modules are used to organize an Angular application into functional units. Each module declares the components, services, and other dependencies that it uses, and can be imported by other modules that depend on it.

    **Directives:** Directives are used to add behavior or modify the appearance of an element in the UI. There are three types of directives in Angular: component directives, attribute directives, and structural directives.

    **Pipes:** Pipes are used to transform data in the UI. Pipes can be used to format dates and numbers, filter and sort arrays, and more.

    In summary, an Angular application is composed of several basic components, including components, templates, services, modules, directives, and pipes. Understanding these components is essential to building robust and maintainable Angular applications.


------------------------------------------
**# T40 what is decorator in angular and meta data in angular?**

    In Angular, a decorator is a special kind of declaration that can be attached to a class declaration, method, property, parameter, or accessor. Decorators are used to add metadata to a class or its members, which can be used by Angular to provide additional functionality or to configure how a component is processed at runtime.

    Decorators are defined using the @ symbol followed by the decorator name, and they are applied immediately before the declaration of the class or member that they decorate. Here's an example of a decorator applied to a class declaration:

    @Component({
    selector: 'app-root',
    template: '<h1>{{ title }}</h1>'
    })
    export class AppComponent {
    title = 'My App';
    }
    In this example, the @Component decorator is used to define the metadata for the AppComponent class. The decorator provides the selector and template properties, which Angular uses to create the component at runtime.

    Angular provides several built-in decorators, such as @Component, @Directive, and @Injectable, which are used to define components, directives, and services, respectively. Developers can also create their own custom decorators to provide additional functionality or to extend existing decorators.

    In summary, decorators in Angular are a powerful feature that allow developers to add metadata to classes and their members, which can be used by Angular to provide additional functionality or to configure how a component is processed at runtime.

------------------------------------------
**# T41  what is lazy loading **

    Answer

------------------------------------------
**# T42 services in angular**

    Answer

------------------------------------------
**# T43 ng-content or content porjection in angular**

    Answer

------------------------------------------
**# T44 why we need view-child and view children**

    Answer

------------------------------------------
**# T45 what is content child and content children**

    Answer

------------------------------------------
**# T46 what is {static:true} in viewChild**

    Answer

------------------------------------------
**# T47  different between constructor and ngonInit**

    Answer

------------------------------------------
**# T48 http in angular**

    Answer

------------------------------------------
**# T49 pass data in angular**

    Answer

------------------------------------------
**# T50  pass data parent to child by @input**

    Answer

------------------------------------------
**# T51 pass data parent to child @output**

    Answer

------------------------------------------
**# T52 what is pipes in angular**

    Answer

------------------------------------------
**# T53 create custom pipe in angular**

    Answer

------------------------------------------
**# T54  What are interceptors in Angular?**

    Interceptors in Angular are a type of middleware that intercepts incoming or outgoing HTTP requests and responses. Interceptors allow you to modify or inspect HTTP requests and responses before they are sent or received by your application.

    Angular interceptors can be used for a variety of purposes, including:

    Authentication: Interceptors can add authentication headers to outgoing HTTP requests, and check for authentication errors in incoming HTTP responses.

    Caching: Interceptors can cache HTTP responses to improve performance and reduce server load.

    Error handling: Interceptors can catch and handle errors that occur during HTTP requests or responses.

    Logging: Interceptors can log HTTP requests and responses for debugging purposes.

    Loading indicators: Interceptors can show loading indicators while HTTP requests are in progress.

    Interceptors in Angular are implemented as services that implement the HttpInterceptor interface. Interceptors can be registered globally or locally, depending on your needs.

    Here's an example of an interceptor that adds an authentication token to outgoing HTTP requests:

------------------------------------------
**# T55 pure and impure pipe**

    Answer

------------------------------------------
**# T56 different types of compilation in Angular**

    Answer

------------------------------------------
**# T57 angular animation module**

    Answer

------------------------------------------
**# T58 dynamic script in angular**

    Answer

------------------------------------------
**# T59 router event**

    Answer

------------------------------------------
**# T60 ngSwitch directive**

    Answer

------------------------------------------
**# T61 forms in angular**

    Answer

------------------------------------------
**# T62 ng-container and ng-templete**

    Answer

------------------------------------------
**# T63 one npm to other npm share module and its component**

we have two repo repo-1,and repo2

    we want to share a module and component (com1,com2,com3) repo-1 => repo-2

    ## repo-1

    ### repo1.component

    <app-com1>
    <app-com2>
    <app-com3>

    ### repo1.module

    html
    import { repo1component} from './repo1.component'
    import { com1 } from './com1';
    import { com2 } from './com2';
    import { com3 } from './com3';

    declarations: [
    repo1component,com1,com2,com3

    ],

    exports:[
    repo1component,com1,com2,com3
    ]
    export class repo1.module { }

    ### public-api.ts

    html
    export _ from './repo1.module';
    export _ from './com1';
    export _ from './com2';
    export _ from './com3';

    ## repo-2

    html

    ### anycomponent.module

    import {repo1.module} form 'repo1Npm';

    import:[
    repo1.module
    ]

    ### anycomponent.html

    <lib-com1>
    <lib-com2>
    <lib-com3>

------------------------------------------
**# T64 making npm process**

  Npm Generate Process:
  ng build --prod one-jf-header
  cd dist/one-jf-header/
  npm publish

------------------------------------------
**# T65 Data Sharing Between Angular Components**
Parent to Child: via Input

    Child to Parent: via Output() and EventEmitter

    Child to Parent: via ViewChild

    Unrelated Components: via a Service

------------------------------------------
**# T66  create project in root**

    ng new interface-npm-one-jf-config --directory ./

------------------------------------------
**# T67 find unused var in angular project**

![image](https://user-images.githubusercontent.com/106906674/230338401-82e6d173-bb0a-4c22-bcf8-e2713d045bd8.png)
" "noUnusedLocals": true
"

