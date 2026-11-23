## Part A — Setup & Installation

### RN-1. How do you install the JDK?

```bash
sudo apt install openjdk-17-jdk
java -version
```

⚠️ React Native **recommends JDK 17**; higher versions (e.g. 21) can cause Gradle problems.

**Real-life:** using the exact spanner size the manual asks for.

### RN-2. How do you install Android Studio?

```bash
# extract android-studio.zip, then:
android-studio/bin/studio.sh
```

Desktop shortcut (Ubuntu): **Tools → Create Desktop Entry**.

In **SDK Manager** install: **Android SDK Platform 35**, **Build-Tools 36.0.0**, **Android SDK Command-line Tools (latest)**, and an emulator system image.

### RN-3. How do you set `ANDROID_HOME` (Ubuntu)?

```bash
nano ~/.bashrc
# add:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
# save (Ctrl+X → Y → Enter), then:
source ~/.bashrc
echo $ANDROID_HOME   # /home/<user>/Android/Sdk
```

**Real-life:** telling your phone where your contacts book is stored so every app can find it.

⚠️ The old `tools` and `tools/bin` folders are deprecated; command-line tools now live in `cmdline-tools/latest/bin`.

### RN-4. How do you create an emulator?

Android Studio → **More Actions → Virtual Device Manager** → create device → ▶ start.

```bash
emulator -list-avds
adb devices          # check device/emulator is connected
```

### RN-5. How do you open the project in Android Studio?

**File → Open → select only the `android` folder.** It auto-syncs; if not, **Sync Project with Gradle Files**. Close: **File → Close Project**.

⚠️ Opening the project root (not `android/`) won't sync Gradle.

### RN-6. How do you clear caches when the build breaks?

```text
Android Studio: File → Invalidate Caches / Restart
                Build → Clean Project
```

```bash
cd android && ./gradlew clean && cd ..
npx react-native start --reset-cache   # Metro cache
rm -rf node_modules && npm install
cd ios && pod install && cd ..         # iOS
```

**Real-life:** turning it off and on again, but for each layer separately.

### RN-7. How do you create and run a project?

```bash
npx @react-native-community/cli@latest init NativeFirst   # create
npx react-native start                                     # start Metro bundler
npx react-native run-android                               # build + install on emulator
npx react-native run-ios                                   # macOS only
```

**Expo (recommended by the official docs for new apps):**

```bash
npx create-expo-app@latest my-app
npx expo start
```

### RN-8. Where can you find help for errors?

- Official docs: reactnative.dev (Troubleshooting, Upgrading)
- **React Native Upgrade Helper** (diffs between versions)
- GitHub issues of the library you're using
- Your saved channel: youtube.com/@irekhatechsolutions

---

## Part B — Basics & How RN Works

### RN-9. 🆕 What is React Native, and how is it different from React (web)?

A framework to build **truly native** iOS/Android apps using React and JavaScript/TypeScript. Components render to **real native views**, not HTML.

**Real-life:** one recipe (React) cooked in two kitchens (iOS, Android) with local ingredients (native views).

| React (web) | React Native |
|---|---|
| `react-dom` renders HTML | renders native views |
| `<div>`, `<span>`, `<img>` | `<View>`, `<Text>`, `<Image>` |
| CSS files, cascade | `StyleSheet`, no cascade |
| `onClick` | `onPress` |
| browser routing | React Navigation / Expo Router |

🎯 Same React concepts (components, props, state, hooks); different renderer.

### RN-10. 🆕 RN vs Flutter vs fully native?

| | React Native | Flutter | Native (Swift/Kotlin) |
|---|---|---|---|
| Language | JS/TS | Dart | Swift / Kotlin |
| UI | real native views | own rendering engine | native views |
| Code sharing | iOS, Android, web (RN Web) | iOS, Android, web, desktop | none |
| Team fit | web/React teams | Dart learners | platform specialists |
| Performance | near native (New Arch) | near native | best |

**Real-life:** RN = hiring a translator who speaks both languages; native = two separate native speakers.

🎯 "RN when the team knows React and wants one codebase with native UI; fully native when you need the deepest platform features or max performance."

### RN-11. 🆕 How does React Native work under the hood (threads)?

| Thread | Does |
|---|---|
| **JS thread** | runs your JS (Hermes): React, business logic |
| **UI (main) thread** | draws native views, handles touches |
| **Background threads** | layout (Yoga), native module work |

**Real-life:** JS thread = the manager deciding what to do; UI thread = the worker on the shop floor. If the manager is busy, the floor waits.

⚠️ Heavy JS work (big loops, JSON parsing) **blocks** the JS thread → laggy taps and animations.

### RN-12. What is the current version?

**React Native 0.88** (released Oct 2026), shipping **React 19.3**. New minor versions come about **every 2 months**, and the **latest 3** are supported (0.86–0.88).

- 0.71+ → TypeScript by default.
- 0.76 → New Architecture on by default.
- 0.82 → legacy architecture removed (**bridgeless only**).

```bash
npm view react-native dist-tags   # check current latest
```

🎯 Mention the version you've shipped with and how you upgrade (RN-79).

### RN-13. Expo vs React Native CLI?

| | Expo | React Native CLI |
|---|---|---|
| Setup | quick | native toolchains needed |
| Native modules | full access via **prebuild + config plugins** | full access |
| Build | **EAS Build** (cloud) or local | Android Studio / Xcode |
| iOS without a Mac | ✅ (EAS cloud) | ❌ |
| Physical device | Expo Go / dev build | USB / Wi-Fi debugging |
| OTA updates | EAS Update built in | third-party |
| Best for | most new apps | full manual control, brownfield |

**Real-life:** Expo = a car with a service plan; CLI = building and servicing your own car.

🎯 The official docs now recommend a **framework (Expo)** for new apps. The old "managed vs bare" split is mostly gone; Expo dev builds can include any native module.

### RN-14. What is the folder structure?

| File / Folder | Purpose |
|---|---|
| `android/`, `ios/` | native projects and build config |
| `index.js` | entry; registers the root component |
| `App.tsx` | root component |
| `metro.config.js` | Metro bundler config |
| `babel.config.js` | transforms JSX, TypeScript, modern JS |
| `.eslintrc.js`, `.prettierrc.js` | lint and format rules |
| `Gemfile`, `.bundle/config` | Ruby/Bundler versions for **CocoaPods** (iOS) |
| `package-lock.json` | locks JS dependency versions |
| `__tests__/` | tests |
| `app.json` | app name and config |

**Real-life:** a house plan: `android/` and `ios/` are the two buildings, `App.tsx` is the front door.

### RN-15. 🆕 What is Metro?

The **JavaScript bundler** for React Native. It bundles your JS into one file the app loads, serves it in development and powers Fast Refresh. **Watchman** watches files for changes.

**Real-life:** a kitchen pass: collects every dish (file) and sends one tray (bundle) to the table (app).

```bash
npx react-native start --reset-cache
```

### RN-16. 🆕 Fast Refresh vs reload?

| Fast Refresh | Full reload |
|---|---|
| updates edited components, **keeps state** | restarts JS, state lost |
| automatic on save | press `r` in Metro or shake menu |

⚠️ Editing a file that exports non-components (or a class component) triggers a full remount.

**Real-life:** changing one lightbulb vs switching off the whole building.

### RN-17. 🆕 Debug vs release builds?

| Debug | Release |
|---|---|
| JS loaded from Metro | JS bundled into the app (Hermes bytecode) |
| dev menu, warnings, slower | optimised, minified, no dev tools |

⚠️ Always performance-test in **release**; debug builds are much slower.

```bash
npx react-native run-android --mode release
```

---

## Part C — Core Components & Styling

### RN-18. What are the core components?

| Component | Purpose | Notes |
|---|---|---|
| `<View>` | container (like `div`) | can't render raw text |
| `<Text>` | text | **all strings must be inside `<Text>`** |
| `<Image>` | images | needs width/height for remote images |
| `<TextInput>` | input | `value` + `onChangeText` |
| `<Button>` | basic button | `title`, `color`; very limited styling |
| `<Pressable>` | modern touch handler | press states, long press |
| `<TouchableOpacity>` | button that fades | older API |
| `<TouchableHighlight>` | button with background highlight | older API |
| `<ScrollView>` | scrollable wrapper | renders all children |
| `<FlatList>` | virtualised list | big lists |
| `<SectionList>` | grouped list | section headers |
| `<ActivityIndicator>` | spinner | loading |
| `<Modal>` | overlay | `visible`, `onRequestClose` |
| `<StatusBar>` | status bar | `barStyle`, `backgroundColor`, `hidden` |
| `<Switch>` | toggle | |

⚠️ Rendering `"Hello"` directly inside `<View>` crashes: *"Text strings must be rendered within a `<Text>` component."*

### RN-19. 🆕 `Pressable` vs `TouchableOpacity` vs `Button`?

| `Button` | `Touchable*` | `Pressable` ✅ |
|---|---|---|
| fixed native look | fade / highlight feedback | full control, press states |
| `title` only | older API | recommended for new code |

```tsx
<Pressable
  onPress={save}
  onLongPress={showMenu}
  style={({ pressed }) => [styles.btn, pressed && { opacity: 0.6 }]}
  hitSlop={8}
  accessibilityRole="button"
>
  <Text>Save</Text>
</Pressable>
```

**Real-life:** `Button` = a standard light switch; `Pressable` = a smart switch you can customise.

### RN-20. 🆕 `ScrollView` vs `FlatList`?

| `ScrollView` | `FlatList` |
|---|---|
| renders **all** children at once | renders **only visible** rows (virtualised) |
| small, fixed content (forms, settings) | long or dynamic lists |

**Real-life:** ScrollView = printing a 1000-page book. FlatList = a reader showing only the page you're on.

⚠️ Never put a `FlatList` inside a vertical `ScrollView` (breaks virtualisation; you'll get a warning). Use `ListHeaderComponent` instead.

### RN-21. FlatList example. Why not `map`?

```tsx
<FlatList
  data={users}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <Text>{item.name}</Text>}
  ListHeaderComponent={<Text>Users</Text>}
  ListEmptyComponent={<Text>No users</Text>}
  onEndReached={loadMore}            // infinite scroll
  onEndReachedThreshold={0.5}
  refreshing={refreshing}
  onRefresh={reload}                 // pull to refresh
/>
```

**Why FlatList over `map`:** virtualised (only visible rows), header/footer/empty slots, pull-to-refresh, infinite scroll.

### RN-22. SectionList example?

```tsx
const data = [
  { title: "Group A", data: [1, 2, 3, 4] },
  { title: "Group B", data: [5, 6, 7, 8] },
];

<SectionList
  sections={data}
  keyExtractor={(item) => item.toString()}
  renderItem={({ item }) => <Text>{item}</Text>}
  renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
  stickySectionHeadersEnabled
/>
```

**Real-life:** a contacts list grouped by letter A, B, C.

⚠️ Each section's items key **must be named `data`**.

### RN-23. Events?

| Event | Description |
|---|---|
| `onPress` | tap (like `onClick`) |
| `onLongPress` | hold (default **~500 ms**, change with `delayLongPress`) |
| `onPressIn` / `onPressOut` | finger down / up |
| `onChangeText` | text input change (gives the string) |
| `onSubmitEditing` | keyboard "done/return" |
| `onScroll`, `onLayout` | scroll position, measured size |

⚠️ Long press is ~0.5 s, not 5 seconds.

🎯 RN 0.88 moved to web-style **`EventTarget`** dispatching (capture + bubble phases); existing event props work the same.

### RN-24. How does styling work?

**Inline:**

```tsx
<Text style={{ fontSize: 20, color: "red" }}>Hello</Text>
```

**StyleSheet (recommended):**

```tsx
const styles = StyleSheet.create({
  textBox: { color: "red", fontSize: 16 },
});
<Text style={styles.textBox}>Hello</Text>
```

**External:** export styles from a separate file and import them.

**Multiple styles (last wins):**

```tsx
<Text style={[styles.textBox, isActive && styles.active, { color: "red" }]}>Hello</Text>
```

Useful: `textAlign`, `textAlignVertical` (Android), `elevation` (Android shadow), `shadowColor/shadowOffset/shadowOpacity/shadowRadius` (iOS), or `boxShadow` (New Arch, both).

**Real-life:** `StyleSheet` = a uniform guide; inline = a sticky note on one person's shirt.

🎯 No cascade: styles don't inherit, except text styles from a parent `<Text>` to child `<Text>`.

### RN-25. 🆕 How is Flexbox different in React Native?

| Web | React Native |
|---|---|
| `flex-direction: row` default | **`column`** default |
| `align-content: stretch` | `flex-start` |
| `flex: 1 1 0%` shorthand rules | `flex: 1` = fill available space |
| units: px, rem, % | **unitless numbers (dp)** and `%` |
| `display: block/grid` | only `flex` (and `none`) |

```tsx
<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  <Text>Centered</Text>
</View>
```

**Real-life:** same furniture rules, but the room is tall by default (column), not wide.

⚠️ A screen that's blank usually forgot `flex: 1` on the root view.

### RN-26. Lifecycle methods?

Same as React:

| Class | Hook |
|---|---|
| `componentDidMount` | `useEffect(() => {}, [])` |
| `componentDidUpdate` | `useEffect(() => {}, [deps])` |
| `componentWillUnmount` | effect cleanup |

```tsx
useEffect(() => {
  const sub = NetInfo.addEventListener(setNet);
  return () => sub(); // cleanup on unmount
}, []);
```

🎯 Mobile adds an **app** lifecycle too (foreground/background): see `AppState` (RN-53).

### RN-27. Platform detection and platform-specific code?

```tsx
import { Platform } from "react-native";

Platform.OS;                           // 'android' | 'ios'
Platform.Version;                      // Android API level / iOS version
Platform.constants.reactNativeVersion; // { major, minor, patch }

const styles = StyleSheet.create({
  box: Platform.select({
    ios: { shadowOpacity: 0.2 },
    android: { elevation: 4 },
  }),
});
```

**File-based:** `Button.ios.tsx` and `Button.android.tsx`; import `./Button` and Metro picks the right one.

**Real-life:** one menu with "veg" and "non-veg" versions; the waiter brings the right one.

### RN-28. Responsive design?

```tsx
import { Dimensions, useWindowDimensions, PixelRatio } from "react-native";

Dimensions.get("window");           // static, no re-render on rotation
const { width, height } = useWindowDimensions(); // ✅ re-renders on rotate/resize
PixelRatio.get();                   // screen density
```

Use flexbox, percentages, `aspectRatio`, and `useWindowDimensions` for breakpoints (tablets, foldables).

⚠️ Prefer the hook; `Dimensions.get` values go stale after rotation.

### RN-29. Safe area (notch / status bar)?

```bash
npm install react-native-safe-area-context
```

```tsx
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

<SafeAreaProvider>
  <SafeAreaView style={{ flex: 1 }}>...</SafeAreaView>
</SafeAreaProvider>

const insets = useSafeAreaInsets(); // { top, bottom, left, right }
```

**Real-life:** keeping text away from the edges of a framed photo so the frame doesn't cover it.

⚠️ Core RN's `SafeAreaView` is iOS-only and **deprecated**; use the library.

### RN-30. Keyboard handling?

```tsx
import { KeyboardAvoidingView, Keyboard, Platform } from "react-native";

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  ...
</KeyboardAvoidingView>

Keyboard.dismiss(); // hide keyboard
```

Also: `keyboardShouldPersistTaps="handled"` on ScrollView so taps on buttons work while the keyboard is open.

**Real-life:** moving the form up so the keyboard doesn't cover the "Submit" button.

🎯 For complex forms, `react-native-keyboard-controller` gives smoother, consistent behaviour.

### RN-31. 🆕 How do you handle images?

```tsx
<Image source={require("./logo.png")} />                                    // local
<Image source={{ uri: "https://x.com/a.png" }} style={{ width: 100, height: 100 }} /> // remote
```

⚠️ Remote images need explicit **width/height**.
⚠️ `react-native-fast-image` is **no longer maintained**. Use **`expo-image`** (works in bare RN too; caching, placeholders, BlurHash) or the maintained fork `@d11/react-native-fast-image`.

```tsx
import { Image } from "expo-image";
<Image source={url} placeholder={{ blurhash }} cachePolicy="memory-disk" style={{ width: 100, height: 100 }} />
```

### RN-32. WebView?

```bash
npm install react-native-webview
```

```tsx
import { WebView } from "react-native-webview";

<WebView
  source={{ uri: "https://example.com" }}
  onMessage={(e) => console.log(e.nativeEvent.data)} // messages from the page
/>
```

**Real-life:** a window in your app that shows a website.

⚠️ Only load trusted URLs; restrict `originWhitelist` and JS injection.

### RN-33. 🆕 How do you make an app accessible?

```tsx
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel="Add to cart"
  accessibilityHint="Adds this item to your cart"
  accessibilityState={{ disabled: !inStock }}
>
  <Icon name="cart" />
</Pressable>
```

- Labels on icon-only buttons.
- Touch targets ≥ 44×44 (use `hitSlop`).
- Support dynamic font size (`allowFontScaling`).
- Test with **TalkBack** (Android) and **VoiceOver** (iOS).

**Real-life:** braille on lift buttons.

---

## Part D — Navigation & Linking

### RN-34. How does navigation work? Stack vs Tab vs Drawer?

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/bottom-tabs   # tabs
npm install @react-navigation/drawer        # drawer
```

| Type | Use when | Real-life |
|---|---|---|
| **Stack** | screen-to-screen flows (Login → Signup → Home) | a stack of plates: add on top, go back by removing |
| **Tabs** | 3–5 main sections always reachable | TV channels on a remote |
| **Drawer** | many/secondary sections | a side menu in a restaurant |

```tsx
const Stack = createNativeStackNavigator();

<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Details" component={DetailsScreen} />
  </Stack.Navigator>
</NavigationContainer>
```

🎯 Usually nested: **Tabs inside a Stack**, auth flow as a separate stack.

**Fix package errors:** `npm start -- --reset-cache`.

### RN-35. 🆕 How do you pass and read params?

```tsx
navigation.navigate("Details", { id: 42 });

function DetailsScreen({ route }) {
  const { id } = route.params;
}
```

⚠️ Pass **IDs**, not big objects; fetch the data on the screen (keeps deep links working).

### RN-36. 🆕 What is Expo Router?

**File-based routing** for React Native (built on React Navigation), like Next.js.

```text
app/
├── _layout.tsx        → root layout (stack)
├── index.tsx          → "/"
├── (tabs)/_layout.tsx → tab navigator
└── user/[id].tsx      → "/user/42"
```

```tsx
import { Link, useLocalSearchParams } from "expo-router";
<Link href="/user/42">Open</Link>
const { id } = useLocalSearchParams();
```

**Real-life:** the folder layout **is** the site map.

🎯 Deep links work automatically, because every screen has a URL.

### RN-37. How does deep linking work?

```tsx
import { Linking } from "react-native";
Linking.openURL("https://example.com"); // open external URL
```

Opening **your** app from a link needs native setup:

- **Custom scheme:** `myapp://product/5` (in `Info.plist` / `AndroidManifest.xml`).
- **Universal Links (iOS) / App Links (Android):** `https://myapp.com/product/5`, verified with your domain.

```tsx
const linking = {
  prefixes: ["myapp://", "https://myapp.com"],
  config: { screens: { Product: "product/:id" } },
};
<NavigationContainer linking={linking}>...</NavigationContainer>
```

**Real-life:** a QR code on a poster that opens the exact page in the app.

### RN-38. 🆕 How do you handle the Android back button?

```tsx
import { BackHandler } from "react-native";

useEffect(() => {
  const sub = BackHandler.addEventListener("hardwareBackPress", () => {
    if (isModalOpen) { closeModal(); return true; } // handled
    return false;                                   // default behaviour
  });
  return () => sub.remove();
}, [isModalOpen]);
```

**Real-life:** a receptionist who decides whether "back" closes a popup or leaves the room.

---

## Part E — Data, Storage & State

### RN-39. Why doesn't `localhost` work on the emulator?

The emulator is its own device; `localhost` means **the emulator itself**, not your computer.

| Device | Use |
|---|---|
| Android emulator | `http://10.0.2.2:3000` |
| iOS simulator | `http://localhost:3000` works |
| Physical device | your machine's IP: `http://192.168.x.x:3000` |

```bash
ifconfig    # Linux/Mac
ipconfig    # Windows
adb reverse tcp:3000 tcp:3000   # Android: then localhost works
```

**Real-life:** saying "my house" on a phone call means the caller's house, not yours.

⚠️ Android blocks plain `http://` by default in release (cleartext traffic); use HTTPS.

### RN-40. 🆕 How do you call APIs?

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch("https://api.example.com/users", { signal: controller.signal })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
    .then(setUsers)
    .catch((e) => e.name !== "AbortError" && setError(e));
  return () => controller.abort();
}, []);
```

🎯 Real apps: **TanStack Query** or **RTK Query** for caching, retries, background refetch and offline support.

### RN-41. AsyncStorage vs MMKV vs secure storage?

```bash
npm install @react-native-async-storage/async-storage
cd ios && pod install
```

```tsx
await AsyncStorage.setItem("theme", "dark");
const theme = await AsyncStorage.getItem("theme");
await AsyncStorage.setItem("user", JSON.stringify(user)); // strings only
```

| Storage | Speed | Encrypted | Use for |
|---|---|---|---|
| **AsyncStorage** | async, slower | ❌ | small preferences |
| **MMKV** (`react-native-mmkv`) | sync, very fast | optional | app state, caches, persist stores |
| **Keychain / Keystore** (`react-native-keychain`, `expo-secure-store`) | slower | ✅ | **tokens, passwords** |

Data is deleted on uninstall, "clear data", or by code.

**Real-life:** AsyncStorage = a drawer. MMKV = a drawer on wheels. Keychain = a safe.

⚠️ Never store tokens in AsyncStorage; it's **plain text**.

### RN-42. 🆕 How do you handle offline mode?

```bash
npm install @react-native-community/netinfo
```

```tsx
const unsubscribe = NetInfo.addEventListener((state) => setOnline(!!state.isConnected));
```

- Cache data locally (MMKV, SQLite, WatermelonDB).
- Queue writes and sync when back online.
- TanStack Query `onlineManager` + persisted cache.
- Show an "offline" banner.

**Real-life:** writing letters on a plane and posting them when you land.

### RN-43. State management: Redux Toolkit, Saga and others?

| Need | Tool |
|---|---|
| local UI state | `useState` / `useReducer` |
| server data | **TanStack Query** / RTK Query |
| global client state | **Redux Toolkit** / **Zustand** |
| async side effects | RTK thunks / **listener middleware**; **Redux Saga** for complex flows |
| persistence | `redux-persist` / Zustand `persist` with MMKV |

**Real-life:** Saga = a project manager who runs long, multi-step workflows (retry, cancel, race).

🎯 Saga is powerful but heavy; most new RTK apps use thunks, listener middleware or RTK Query. Know Saga for existing codebases.

### RN-44. Environment variables?

Apps can't read `process.env` at runtime like a server; values are **baked in at build time**.

| Setup | Tool |
|---|---|
| Bare RN | `react-native-config` (`.env` → JS + native) |
| Expo | `EXPO_PUBLIC_*` vars, or `app.config.js` → `extra` via `expo-constants` |

```tsx
const api = process.env.EXPO_PUBLIC_API_URL; // Expo
```

⚠️ Anything in the app bundle can be **extracted**. Never ship secret keys; keep them on your server.

### RN-45. 🆕 How do you make API calls secure?

- HTTPS only; consider **SSL pinning** for high-risk apps (banking).
- Tokens in Keychain/Keystore, short-lived access + refresh token.
- No secrets in the bundle.
- Obfuscate release builds (R8/ProGuard on Android; Hermes bytecode helps).
- Detect rooted/jailbroken devices if required.

**Real-life:** pinning = only accepting post with your bank's exact seal, not any seal that looks official.

---

## Part F — Native Layer & Architecture

### RN-46. What is the New Architecture? ⭐

Default since **0.76**; legacy bridge **removed in 0.82** (apps are **bridgeless**).

| Piece | What it is |
|---|---|
| **Hermes** | default JS engine: precompiled bytecode, faster startup, lower memory |
| **JSI** | JS ↔ native interface: **direct, synchronous** calls, no JSON |
| **Fabric** | new renderer on JSI: sync layout, React concurrent features |
| **TurboModules** | native modules loaded **lazily** on first use |
| **Codegen** | generates type-safe native glue from TS/Flow specs |

**Real-life:** old bridge = sending letters between two offices and waiting for replies. JSI = a direct phone line.

🎯 Benefits: faster startup, lower memory, smoother interop, sync layout (e.g. measuring before paint).

### RN-47. 🆕 Old Bridge vs JSI?

| Old Bridge | JSI (New Arch) |
|---|---|
| async messages | sync or async direct calls |
| everything **serialised to JSON** | shares memory references |
| batched, can lag under load | fast, no queue |
| all native modules loaded at startup | lazy (TurboModules) |

**Real-life:** bridge = a translator passing notes under a door. JSI = both people in the same room.

### RN-48. 🆕 What is Hermes?

A JS engine built for React Native. Compiles JS to **bytecode at build time** (AOT), so the app doesn't parse JS on startup.

✅ Faster startup, less memory, smaller app.
🎯 Default on both platforms; the New Architecture requires it. Debug it with **React Native DevTools**.

**Real-life:** pre-chopping vegetables the night before so dinner is ready faster.

### RN-49. 🆕 How do you write a native module?

When you need a platform API no library provides (e.g. a custom SDK).

1. Write a **TypeScript spec** (`NativeMyModule.ts`).
2. **Codegen** generates native interfaces.
3. Implement in Kotlin/Java (Android) and Swift/Obj-C (iOS).
4. Call from JS like a normal function.

```ts
// NativeBattery.ts
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  getLevel(): Promise<number>;
}
export default TurboModuleRegistry.getEnforcing<Spec>("Battery");
```

🎯 With Expo, the **Expo Modules API** (Swift/Kotlin) is a simpler way to write native modules.

**Real-life:** hiring a specialist when no general worker knows the job.

### RN-50. 🆕 What is autolinking?

Native code from npm libraries is **linked automatically** (Gradle for Android, CocoaPods for iOS). No manual `react-native link`.

```bash
npm install react-native-mmkv
cd ios && pod install   # iOS still needs pods installed
```

⚠️ After adding a native library you must **rebuild** the app; Metro reload isn't enough.

### RN-51. How do you handle permissions?

```bash
npm install react-native-permissions
```

```tsx
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";

const status = await request(
  Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
);
if (status === RESULTS.GRANTED) openCamera();
```

- **Android:** declare in `AndroidManifest.xml`; ask at runtime (`PermissionsAndroid` or the library).
- **iOS:** add usage text to `Info.plist` (e.g. `NSCameraUsageDescription`) or the app **crashes**.

**Real-life:** asking before entering someone's room, and explaining why.

🎯 Ask **in context** (when the user taps "Scan"), not all at launch; handle "denied forever" by linking to Settings.

### RN-52. How do push notifications work?

- **Remote:** Firebase Cloud Messaging (`@react-native-firebase/messaging`), APNs on iOS; Expo: `expo-notifications`.
- **Local / rich:** **Notifee**.
- Needs native config: Firebase files, iOS push entitlements, user permission.

```text
Your server → FCM/APNs → device → app (foreground / background / killed)
```

**Real-life:** the post office (FCM/APNs) delivers your letter; you don't drive to each house.

⚠️ Handle all three states: **foreground, background, quit**. Android 13+ needs the `POST_NOTIFICATIONS` permission.

### RN-53. 🆕 What is `AppState`?

Tells you if the app is **active**, **background** or **inactive**.

```tsx
useEffect(() => {
  const sub = AppState.addEventListener("change", (state) => {
    if (state === "active") refreshData();
    if (state === "background") saveDraft();
  });
  return () => sub.remove();
}, []);
```

**Real-life:** a shop knowing when the customer stepped out and when they came back.

🎯 Use for refreshing data, pausing video, locking sensitive screens.

### RN-54. 🆕 How do background tasks work?

The OS limits background JS. Options:

- **Headless JS** (Android) for short tasks.
- `react-native-background-fetch` / `expo-background-task` (periodic, OS decides timing).
- Push notifications (silent/data) to wake the app.

⚠️ iOS is strict: no guaranteed timing; long work must go to the server.

**Real-life:** a night shift that's allowed only short, scheduled breaks.

### RN-55. 🆕 What is React Native Web / sharing code with web?

`react-native-web` renders RN components to the DOM, so one codebase targets iOS, Android **and** web (Expo supports it out of the box).

🎯 Share business logic and hooks in a monorepo; share UI only where design allows.

---

## Part G — Performance & Animation

### RN-56. How do you tune FlatList?

| Prop | Effect |
|---|---|
| `keyExtractor` | stable keys, no full re-renders |
| `getItemLayout` | skip measuring when row height is fixed |
| `initialNumToRender` | rows on first paint (lower = faster mount) |
| `windowSize` | screens of rows kept rendered around the viewport |
| `maxToRenderPerBatch` | rows rendered per batch while scrolling |
| `removeClippedSubviews` | unmount off-screen views (mainly Android) |

```tsx
const Row = memo(({ item }) => <Text>{item.name}</Text>);
const renderItem = useCallback(({ item }) => <Row item={item} />, []);

<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={(i) => i.id}
  getItemLayout={(_, index) => ({ length: 60, offset: 60 * index, index })}
/>
```

🎯 For very large or complex lists, **FlashList** (Shopify) recycles views and is usually faster.

### RN-57. 🆕 General performance checklist?

- Test in a **release** build.
- `memo`, `useCallback`, `useMemo` for list rows and heavy children (or the React Compiler).
- Avoid inline functions/objects passed to memoised rows.
- Keep heavy work **off the JS thread** (native modules, worklets).
- Optimise images (right size, caching, `expo-image`).
- Lazy-load screens; reduce startup work.
- Remove `console.log` in release (babel plugin).
- Profile with **React Native DevTools** (Performance, React Profiler) and Android Studio / Xcode Instruments.

**Real-life:** tuning a car: lighter load, better tyres, then measure on the track.

### RN-58. 🆕 How do you improve startup time (TTI)?

- Hermes (bytecode, already default).
- Fewer, lazy-loaded modules (TurboModules are lazy).
- Defer non-critical work (analytics, SDK init) until after first screen.
- Smaller bundle; avoid heavy imports at the top level.
- Native splash screen while JS loads.

**Real-life:** open the shop with just the counter ready; restock shelves after the first customers.

### RN-59. 🆕 How do you reduce app size?

- Upload **AAB** (Play Store sends only needed code per device).
- Enable **R8/ProGuard** (shrink + obfuscate) in release.
- ABI splits for APKs.
- Compress images, use vector icons / SVG.
- Remove unused libraries and fonts.

```gradle
// android/app/build.gradle
def enableProguardInReleaseBuilds = true
```

**Real-life:** packing only the clothes you'll wear on the trip.

### RN-60. 🆕 What causes memory leaks?

| Cause | Fix |
|---|---|
| listeners/timers without cleanup | return cleanup from `useEffect` |
| state updates after unmount (async) | `AbortController` / ignore flag |
| huge images in memory | right-sized images, caching library |
| global caches growing forever | limit size |

**Find them:** React Native DevTools **Memory** panel, Android Studio Profiler, Xcode Instruments (Leaks).

**Real-life:** leaving taps running in every room you've left.

### RN-61. Animated vs Reanimated?

| | `Animated` (core) | `react-native-reanimated` |
|---|---|---|
| Runs on | JS thread (UI thread with `useNativeDriver`) | **UI thread** (worklets) |
| Best for | simple fades, slides | complex, gesture-driven, 60/120 fps |
| Blocked by busy JS? | yes (without native driver) | no |

```tsx
// core Animated
Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

// Reanimated
const offset = useSharedValue(0);
const style = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
offset.value = withSpring(100);
```

**Real-life:** Animated = a performer waiting for cues from a busy director (JS). Reanimated = a performer who knows the routine by heart (UI thread).

### RN-62. 🆕 What is `useNativeDriver`?

Sends the animation to native **once**, so it runs on the UI thread without asking JS every frame.

⚠️ Only works for **non-layout** props: `transform`, `opacity`. Not `width`, `height`, `top`.

🎯 Always `useNativeDriver: true` when possible.

### RN-63. Gesture handling?

```bash
npm install react-native-gesture-handler
```

`Pressable` handles taps, but swipe, pinch, pan and drag need **native-driven, composable** gestures.

```tsx
const pan = Gesture.Pan().onUpdate((e) => { offset.value = e.translationX; });

<GestureDetector gesture={pan}>
  <Animated.View style={style} />
</GestureDetector>
```

**Real-life:** a touchscreen that understands swipe vs pinch vs drag, not just taps.

🎯 Pairs with Reanimated for smooth swipe-to-delete, bottom sheets, carousels.

### RN-64. 🆕 What is `InteractionManager` / deferring work?

Run heavy work **after** animations and transitions finish.

```tsx
useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => loadHeavyData());
  return () => task.cancel();
}, []);
```

**Real-life:** waiting until guests are seated before bringing out the noisy food trolley.

🎯 Newer alternatives: `requestIdleCallback`, React's `useTransition`/`startTransition`.

### RN-65. Custom fonts?

**Bare RN:**

```js
// react-native.config.js
module.exports = { assets: ["./assets/fonts/"] };
```

```bash
npx react-native-asset
```

**Expo:**

```tsx
const [loaded] = useFonts({ Inter: require("./assets/Inter.ttf") });
if (!loaded) return null;
```

⚠️ iOS uses the font's **PostScript name**, which can differ from the file name.
🎯 RN 0.88 supports **variable fonts** via `fontVariationSettings`.

### RN-66. Splash screen and app icon?

**Splash:** `react-native-bootsplash` (bare) generates native splash assets; Expo: `expo-splash-screen` config in `app.json`.

```tsx
// hide when ready
SplashScreen.hideAsync(); // Expo
```

**Icon (Android):** generate sizes (e.g. easyappicon.com / Android Studio **Image Asset**) and replace files in `android/app/src/main/res/mipmap-*`. **iOS:** `Images.xcassets/AppIcon`. Expo: `icon` in `app.json`.

**Real-life:** the shop's sign and the welcome mat while doors open.

---

## Part H — Debugging, Testing & Release

### RN-67. Which debugging tools do you use?

| Tool | Use |
|---|---|
| **React Native DevTools** ✅ | console, breakpoints, network, performance, memory, React components & profiler |
| Android Studio / Xcode | native crashes, logcat, native profiling |
| Reactotron | state, API calls, Redux inspection |
| Sentry / Crashlytics | production crashes |

Open: press **`j`** in the Metro terminal, or the dev menu → "Open DevTools".

⚠️ **Out of date:** Flipper was removed from the default template (0.74), and **Chrome remote JS debugging was removed in 0.79**. React Native DevTools replaces both.

**Real-life:** one modern dashboard instead of three old gauges.

### RN-68. Testing?

| Layer | Tool |
|---|---|
| Unit | **Jest** |
| Component | **React Native Testing Library** |
| E2E | **Detox** or **Maestro** |

```tsx
test("shows error on empty submit", async () => {
  render(<LoginForm />);
  fireEvent.press(screen.getByRole("button", { name: "Login" }));
  expect(await screen.findByText("Email is required")).toBeOnTheScreen();
});
```

**Real-life:** check each part (unit), the assembled machine (component), then a real test drive (E2E).

🎯 Mock native modules in Jest (`jest.mock`); test behaviour, not implementation.

### RN-69. 🆕 Crash reporting and monitoring?

- **Sentry** or **Firebase Crashlytics** for JS + native crashes.
- Upload **source maps** (and Hermes maps) so stack traces are readable.
- Track app start time, slow screens, ANRs (Android "App Not Responding").

**Real-life:** a black box recorder on a plane.

### RN-70. OTA (over-the-air) updates?

Push **JS-only** updates without app-store review.

| Tool | Notes |
|---|---|
| **EAS Update** (Expo) | hosted, works in bare RN too |
| Self-hosted `expo-updates` server | full control, you maintain it |
| CodePush-compatible services (Revopush, self-hosted CodePush server) | for teams migrating from CodePush |

⚠️ **CodePush / App Center retired on 31 March 2025**; it's no longer an option for new apps.
⚠️ OTA can't change **native code**; changes to native modules need a store release. Follow store rules (no changing the app's purpose).

**Real-life:** updating a restaurant's menu board without rebuilding the kitchen.

### RN-71. How do you release / publish?

**Android:**

1. Generate an upload keystore (`keytool`), keep it safe.
2. Configure signing in `android/gradle.properties` + `build.gradle`.
3. `cd android && ./gradlew bundleRelease` → **AAB** (or `assembleRelease` → APK).
4. Upload to **Play Console** (internal → closed → production tracks).

**iOS:**

1. Set version/build in Xcode, signing & certificates.
2. **Product → Archive**.
3. Upload via Xcode / Transporter to **App Store Connect**.
4. TestFlight → submit for review.

⚠️ Losing the Android upload key = painful recovery; use **Play App Signing**.

### RN-72. 🆕 CI/CD for mobile?

- **EAS Build + EAS Submit** (Expo, works for bare too).
- **Fastlane** (build, sign, upload, screenshots).
- GitHub Actions / Bitrise / Codemagic to run lint → tests → build → deploy to TestFlight / Play internal track.

**Real-life:** an assembly line that builds, checks and ships every car automatically.

### RN-73. 🆕 Versioning: `versionName` vs `versionCode`?

| Platform | User sees | Store needs (must increase) |
|---|---|---|
| Android | `versionName` "1.4.0" | `versionCode` 140 |
| iOS | `CFBundleShortVersionString` "1.4.0" | `CFBundleVersion` (build number) |

⚠️ Uploads fail if the build number didn't increase.

### RN-74. 🆕 How do you handle app updates for users on old versions?

- Force/soft update prompt (check min version from your API, `react-native-version-check` / in-app updates on Android).
- Keep the API **backward compatible** (old app versions stay installed for months).
- OTA for JS fixes.

**Real-life:** not everyone replaces their phone; your service must still work for older ones.

### RN-75. 🆕 How do you secure a release build?

- R8/ProGuard (Android), Hermes bytecode.
- No secrets in the bundle; tokens in Keychain/Keystore.
- SSL pinning for sensitive apps.
- Disable debug flags and logs.
- Screen-capture protection on sensitive screens (`FLAG_SECURE`).

### RN-76. 🆕 What are common Android build errors and fixes?

| Error | Fix |
|---|---|
| `SDK location not found` | set `ANDROID_HOME` or `android/local.properties` |
| Gradle / JDK mismatch | use JDK 17 |
| `Unable to load script` | start Metro; `adb reverse tcp:8081 tcp:8081` |
| duplicate classes / stale build | `./gradlew clean`, delete `android/build`, rebuild |
| new native lib not found | rebuild app (not just reload) |

### RN-77. 🆕 What are common iOS build errors and fixes?

| Error | Fix |
|---|---|
| pod missing / outdated | `cd ios && pod install` (or `bundle exec pod install`) |
| signing errors | set team + bundle ID in Xcode |
| stale build | Xcode **Product → Clean Build Folder**, delete DerivedData |
| permission crash | add the `Info.plist` usage description |

### RN-78. 🆕 What is "brownfield"?

Adding React Native screens **inside an existing native app**, instead of starting fresh.

**Real-life:** building a new extension onto an existing house, not a new house.

🎯 Common migration path for big companies.

### RN-79. 🆕 How do you upgrade React Native?

1. Read the release notes / blog for breaking changes.
2. Use the **React Native Upgrade Helper** to diff native files.
3. Upgrade one **minor** version at a time if far behind.
4. Update libraries (check New Architecture support).
5. Clean builds, run tests, test both platforms in release.

```bash
npm install react-native@0.88
```

🎯 Expo: `npx expo install expo@latest --fix` handles compatible versions (Expo SDK 58 ships RN 0.88).

**Real-life:** renovating one room at a time instead of the whole house at once.

### RN-80. 🆕 How do you support tablets, dark mode and RTL?

- **Tablets / foldables:** `useWindowDimensions` breakpoints, split layouts.
- **Dark mode:** `useColorScheme()` + theme tokens.

```tsx
const scheme = useColorScheme(); // 'light' | 'dark'
```

- **RTL:** `I18nManager.forceRTL(true)`, use `start/end` (e.g. `marginStart`) instead of left/right.

---

## Part I — Scenario & Senior Questions

### RN-81. 🆕 "The list scrolls with blank areas and lag." What do you do?

1. Test in **release** build.
2. Profile (RN DevTools Performance / React Profiler).
3. `memo` rows, stable `renderItem` and `keyExtractor`.
4. `getItemLayout` if fixed height; tune `windowSize`, `maxToRenderPerBatch`.
5. Smaller images with caching.
6. Switch to **FlashList** if still slow.

### RN-82. 🆕 "Animations stutter when data loads." Why?

The **JS thread is busy** (parsing, rendering), so JS-driven animations miss frames.

**Fix:** Reanimated or `useNativeDriver`, defer heavy work (`InteractionManager`, transitions), move work to native/worklets.

### RN-83. 🆕 "Login state is lost after restart." How do you design auth?

- Store refresh token in **Keychain/Keystore**, access token in memory.
- On launch: show splash → read token → refresh → route to App or Auth stack.
- Interceptor handles **401** → refresh → retry, or log out.

```tsx
{isLoggedIn ? <AppStack /> : <AuthStack />}
```

**Real-life:** a hotel key card that's renewed at reception when it expires.

### RN-84. 🆕 How would you structure a large RN app?

```text
src/
├── features/      auth/, cart/, profile/ (screens, hooks, api, components)
├── shared/        ui/, hooks/, utils/, theme/
├── navigation/
├── services/      api client, storage, analytics
└── store/
```

- TypeScript strict, ESLint, absolute imports.
- Server state in TanStack/RTK Query; small global store.
- Design system with theme tokens.
- Monorepo if sharing with web.

### RN-85. 🆕 How do you share code between iOS and Android while handling differences?

- One codebase; `Platform.select` / `.ios.tsx` / `.android.tsx` for differences.
- Respect platform conventions (back button, navigation gestures, haptics).
- Test on both platforms every release.

**Real-life:** one recipe, small adjustments for local taste.

### RN-86. 🆕 When would you NOT choose React Native?

- Heavy 3D games or real-time graphics (use Unity/native).
- Apps mostly built on the newest platform-only APIs on day one.
- Very small native-only teams with no JS experience.

🎯 Senior answers show trade-offs, not just enthusiasm.

### RN-87. 🆕 How do you handle forms?

- **React Hook Form** + **Zod** for validation.
- `TextInput` with `returnKeyType`, `onSubmitEditing` to move focus to the next input (refs).
- `KeyboardAvoidingView` + `keyboardShouldPersistTaps="handled"`.
- Correct `keyboardType` (`email-address`, `numeric`) and `autoComplete` / `textContentType`.

```tsx
<TextInput
  keyboardType="email-address"
  autoCapitalize="none"
  autoComplete="email"
  returnKeyType="next"
  onSubmitEditing={() => passwordRef.current?.focus()}
/>
```

### RN-88. 🆕 How do you handle errors so the app doesn't crash to a white screen?

- **Error boundaries** around screens (`react-native-error-boundary` / `react-error-boundary`).
- Global handler: `ErrorUtils.setGlobalHandler` for uncaught JS errors.
- Crash reporting (Sentry/Crashlytics).
- Friendly fallback + "Retry".

**Real-life:** a fuse box: one faulty room trips, the whole house keeps its lights.

---

## Part J — Cheat Sheet

### RN-89. One-line answers

| Topic | One line |
|---|---|
| RN vs React | same React; native views instead of HTML |
| Threads | JS thread (logic), UI thread (drawing); busy JS = lag |
| Version | 0.88 (Oct 2026), React 19.3; bridgeless New Architecture only |
| New Architecture | Hermes + JSI + Fabric + TurboModules + Codegen |
| Bridge vs JSI | async JSON messages vs direct sync calls |
| Expo vs CLI | recommended framework vs full manual control |
| Text rule | all strings inside `<Text>` |
| ScrollView vs FlatList | render all vs virtualised |
| Big lists | FlatList tuning or FlashList |
| Flexbox default | `flexDirection: 'column'`, unitless dp |
| Platform code | `Platform.select`, `.ios.tsx` / `.android.tsx` |
| Safe area | `react-native-safe-area-context` |
| Navigation | React Navigation (stack, tabs, drawer) or Expo Router |
| Emulator localhost | `10.0.2.2` (Android) or machine IP |
| Storage | AsyncStorage (prefs), MMKV (fast), Keychain (secrets) |
| Env vars | baked in at build; never ship secrets |
| Animations | Reanimated / `useNativeDriver` for 60fps |
| Gestures | react-native-gesture-handler |
| Images | `expo-image` (fast-image unmaintained) |
| Debugging | React Native DevTools (Flipper & Chrome debugger gone) |
| Testing | Jest + RNTL + Detox/Maestro |
| OTA | EAS Update (CodePush retired Mar 2025) |
| Release | AAB to Play Console; Archive → App Store Connect |
| JDK | 17 |
