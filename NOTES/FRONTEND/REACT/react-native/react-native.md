# React Native Notes

---

# Part 1 — Setup & Installation

---

## 1. Install JDK

```bash
sudo apt install openjdk-21-jre-headless
```

Or download manually.

---

## 2. Install Android Studio

```bash
# Extract android-studio.zip → run:
android-studio/bin/studio.sh
```

Desktop shortcut (Ubuntu): Android Studio → Tools → Create Desktop Entry

---

## 3. Set ANDROID_HOME (Ubuntu)

```bash
nano ~/.bashrc
# add:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
# save (Ctrl+X → Y → Enter), then:
source ~/.bashrc
echo $ANDROID_HOME   # expect /home/<user>/Android/Sdk
```

---

## 4. Virtual Device Manager

Android Studio → More Actions → Virtual Device Manager. Ensure device selected & folder path shows `app` top-right.

---

## 5. Open/Close Project in Android Studio

Open: File → Import Project → select **only the `android` folder**. Auto-syncs; if not, click **Sync Project with Gradle Files**.
Close: File → Close Project

---

## 6. Clear Cache (build errors)

```
File → Invalidate Caches / Restart
Build → Clean Project
```

---

## 7. Create & Run Project (VS Code)

```bash
npx @react-native-community/cli init nativeFirst   # create
npx react-native start                              # run
```

---

## 8. Error Resources

- https://www.youtube.com/@irekhatechsolutions

---

---

# Part 2 — Theory

---

## 1. Current Version

**~0.87** (0.71+ ships TypeScript by default). New Architecture is default since 0.76; legacy Bridge fully removed in 0.82 — apps are bridgeless by default now.

---

## 2. Expo vs React Native CLI

| | Expo | React Native CLI |
|---|---|---|
| **Setup** | Quick, no native config | Requires native setup |
| **Native Modules** | Limited access | Full access |
| **Build** | Handled by Expo / EAS | Manual configuration |
| **Bundle Size** | Larger | Smaller |
| **iOS without Mac** | ✅ (via EAS cloud) | ❌ (needs Mac) |
| **Physical Device** | Expo Go app over same network | Needs platform-specific device |
| **Customization** | Less control | Full control |
| **Best For** | Prototyping, quick starts | Production, custom native code |

Note: Expo's "managed vs bare" split is mostly gone — modern Expo (prebuild + config plugins) lets managed apps add native modules too; EAS Build handles native compilation either way.

---

## 3. Folder Structure

| File/Folder | Purpose |
|---|---|
| `metro.config.js` | Metro bundler config (watchman monitors file changes for hot reload) |
| `babel.config.js` | Converts ES6+ code to plain JS |
| `.eslintrc` | ESLint configuration |
| `android/` & `ios/` | Native platform code and build config |
| `package-lock.json` | Locks dependency versions |
| `Gemfile` | Ruby config (needed for iOS debugging) |
| `.prettierrc` | Code formatting config |
| `.bundle/config` | Bundle config for iOS/Android builds |
| `__tests__/` | Test cases |

---

## 4. Core Components

| Component | Purpose | Notes |
|---|---|---|
| `<Text>` | Display text | All strings must be inside `<Text>` |
| `<View>` | Container/wrapper | Like `<div>` — can't render text directly |
| `<Button>` | Basic button | Use `title` and `color` attributes, limited styling |
| `<TouchableHighlight>` | Custom button | Background color changes on press |
| `<TouchableOpacity>` | Custom button / checkbox | Opacity fades on press |
| `<Pressable>` | Multi-event button | Supports `onPress`, `onLongPress`, `onPressIn`, `onPressOut` |
| `<TextInput>` | Text input field | Form element |
| `<ScrollView>` | Scrollable wrapper | Use as wrapper for scrollable content |
| `<FlatList>` | Performant list | Only renders visible items, has header/footer support |
| `<SectionList>` | Grouped list | For nested arrays with section headers |
| `<ActivityIndicator>` | Loader/spinner | Loading indicator |
| `<Modal>` | Modal popup | Overlay component |
| `<StatusBar>` | Device status bar | `backgroundColor`, `barStyle`, `hidden` |

---

## 5. FlatList Example

```tsx
<FlatList
  data={users}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <Text>{item.name}</Text>}
/>
```

**Why FlatList over `map`?** Only renders visible items · built-in header/footer · pull-to-refresh support.

---

## 6. SectionList Example

```tsx
const data = [
  { title: 'Group A', data: [1, 2, 3, 4] },
  { title: 'Group B', data: [5, 6, 7, 8] },
];

<SectionList
  sections={data}
  renderItem={({ item }) => <Text>{item}</Text>}
  renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
/>
```

**Note:** The `data` key in each section object must be named `data`.

---

## 7. Events

| Event | Description |
|---|---|
| `onPress` | Tap event (equivalent of `onClick` on web) |
| `onChangeText` | Text input change |
| `onLongPress` | Hold for ~5 seconds |
| `onPressIn` | Finger touches down |
| `onPressOut` | Finger lifts up |

---

## 8. Styling in React Native

**3 approaches:**

**Inline:**

```tsx
<Text style={{ fontSize: 20, color: 'red' }}>Hello</Text>
```

**Internal (StyleSheet):**

```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  textBox: { color: 'red', fontSize: 16 }
});

<Text style={styles.textBox}>Hello</Text>
```

**External:** Create a separate file, export styles, and import.

**Multiple styles:**

```tsx
<Text style={[styles.textBox, externalStyles.textBox, { color: 'red' }]}>Hello</Text>
```

**Useful CSS properties:** `textAlign`, `textAlignVertical`, `elevation` (Android box shadow)

---

## 9. Lifecycle Methods

Same as React:
- **Mounting** — `constructor`, `render`, `componentDidMount`
- **Updating** — `shouldComponentUpdate`, `render`, `componentDidUpdate`
- **Unmounting** — `componentWillUnmount`

(Or use hooks: `useEffect` with dependency array)

---

## 10. Platform Detection

```tsx
import { Platform } from 'react-native';

Platform.OS;                              // 'android' or 'ios'
Platform.constants.reactNativeVersion;    // { major, minor, patch }
```

---

## 11. WebView

```bash
npm install react-native-webview
```

```tsx
import WebView from 'react-native-webview';

<WebView source={{ uri: 'https://example.com' }} />
```

---

## 12. Navigation

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install @react-navigation/drawer        # drawer nav
npm install @react-navigation/bottom-tabs   # tab nav
```

| Type | Use when |
|---|---|
| **Stack** (`native-stack`) | Screen-to-screen flows, e.g. Login → Signup |
| **Tab** (`bottom-tabs`) | 3–5 top-level sections always reachable (Home/Profile/Settings) |
| **Drawer** (`drawer`) | Many/secondary sections, side-menu style nav |

**Fix package errors:**

```bash
npm start -- --reset-cache
```

---

## 13. Localhost API on Emulator

Localhost APIs don't work on the emulator. Use your machine's IP address instead:

```bash
ifconfig    # Linux/Mac
ipconfig    # Windows
```

Replace `http://localhost:3000` with `http://192.168.x.x:3000`

---

## 14. Change App Icon

**Android:** Use [easyappicon.com](https://easyappicon.com) to generate icons, then replace files inside `android/app/src/main/res/`.

---

## 15. AsyncStorage

Like `localStorage` for React Native. Data is deleted when the app cache is cleared, app is uninstalled, or removed via code.

```bash
npm install @react-native-async-storage/async-storage
npx pod-install   # iOS only
```

---

## 16. Redux with Saga

For handling async side effects, use **Redux Saga** alongside Redux Toolkit.

---

## 17. New Architecture (Hermes / Fabric / TurboModules / JSI)

Default since RN 0.76 (bridge fully removed 0.82+ — "bridgeless").

| Piece | What it is |
|---|---|
| **Hermes** | Default JS engine (both platforms) — AOT bytecode, faster startup, lower memory. New Arch requires it (won't run on JSC). |
| **JSI** | JS↔Native interface replacing the old async bridge — direct, synchronous calls, no JSON serialization. |
| **Fabric** | New renderer built on JSI — synchronous layout measurement, concurrent rendering (React 18), used by Reanimated's `measure()`. |
| **TurboModules** | Replace `NativeModules` — native modules load lazily on first use instead of all at startup. |

Why it matters: faster startup, lower memory, smoother native interop — mostly transparent to app code, but some old native-module libraries needed updates to support it.

---

## 18. Performance — FlatList Tuning

| Prop | Effect |
|---|---|
| `keyExtractor` | Stable keys — avoids full re-renders |
| `getItemLayout` | Skips dynamic measurement when row height is fixed/known |
| `initialNumToRender` | How many rows render on first paint (lower = faster mount) |
| `windowSize` | How many screens' worth of rows kept rendered around viewport |
| `removeClippedSubviews` | Unmounts off-screen views (Android mainly) to save memory |
| `maxToRenderPerBatch` | Rows rendered per batch during scroll |

---

## 19. Animations

| | `Animated` (core) | `react-native-reanimated` |
|---|---|---|
| Runs on | JS thread (bridged to native) | UI thread directly |
| Best for | Simple fades/transitions | Complex, gesture-driven, 60fps-critical animation |
| Blocked by JS lag? | Yes | No |

```bash
npm install react-native-reanimated
```

---

## 20. Gesture Handling

```bash
npm install react-native-gesture-handler
```

Core `Pressable`/`Touchable*` handle simple taps but don't compose well (swipe, pinch, drag, pan). `react-native-gesture-handler` gives native-driven, composable gesture recognizers — pairs with Reanimated for smooth drag/swipe UI.

---

## 21. Safe Area (notch / status bar)

```bash
npm install react-native-safe-area-context
```

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';
<SafeAreaView style={{ flex: 1 }}>...</SafeAreaView>
```

Core RN also ships a basic `<SafeAreaView>`, but `react-native-safe-area-context` is more reliable (works with nested nav, gives `useSafeAreaInsets()`).

---

## 22. Responsive Design

```tsx
import { Dimensions, useWindowDimensions } from 'react-native';

const { width, height } = Dimensions.get('window');   // static, no re-render on rotate
const { width, height } = useWindowDimensions();       // hook — re-renders on rotation/resize
```

---

## 23. Keyboard Handling

```tsx
import { KeyboardAvoidingView, Keyboard, Platform } from 'react-native';

<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
  ...
</KeyboardAvoidingView>

Keyboard.dismiss();   // manually hide keyboard
```

---

## 24. Permissions

- **Android:** `PermissionsAndroid` (core) or `react-native-permissions` (cross-platform, recommended).
- **iOS:** Must add usage-description keys to `Info.plist` (e.g. `NSCameraUsageDescription`) or the app crashes on request.

```bash
npm install react-native-permissions
```

---

## 25. Push Notifications

Firebase Cloud Messaging (`@react-native-firebase/messaging`) or **Notifee** for local/rich notifications. Needs native config (Firebase config files, entitlements) — not pure JS install.

---

## 26. Deep Linking

```tsx
import { Linking } from 'react-native';
Linking.openURL('https://example.com');
```

Requires native setup: URL scheme (`myapp://`) in `Info.plist`/`AndroidManifest.xml`, or Universal Links/App Links for `https://` domains. `@react-navigation` integrates via `linking` config on `NavigationContainer`.

---

## 27. Testing

| Layer | Tool |
|---|---|
| Unit | **Jest** |
| Component | **React Native Testing Library** |
| E2E | **Detox** |

---

## 28. Debugging Tools

| Tool | Use |
|---|---|
| **Flipper** | Native + JS inspector (network, layout, logs) |
| **React DevTools** | Component tree/props/state inspection |
| **Chrome remote debugger** | JS breakpoints/console via Chrome DevTools |

---

## 29. Custom Fonts

**Bare RN:** add font files → `react-native.config.js` (`assets: ['./assets/fonts/']`) → run `npx react-native-asset`.
**Expo:** `expo-font` package, load via `useFonts()` hook.

---

## 30. Images

`<Image>` caches inconsistently across platforms and doesn't handle large lists well. Use **`react-native-fast-image`** for reliable disk/memory caching and better scroll performance.

```bash
npm install react-native-fast-image
```

---

## 31. Splash Screen

`react-native-bootsplash` (bare RN) generates native splash + JS handoff. Expo: built-in `splash`/`expo-splash-screen` config in `app.json`.

---

## 32. Environment Variables

Native apps can't read `process.env` at runtime like web. Use:
- **Bare RN:** `react-native-config` — reads `.env` into native + JS.
- **Expo:** `app.config.js` → `extra` field, read via `expo-constants`.

---

## 33. OTA Updates

Push JS-only updates without app-store review: **CodePush** (App Center) for bare RN, or **Expo Updates** (`expo-updates`) for Expo projects.

---

## 34. Release / Publishing

**Android:**
1. Generate a keystore (`keytool`)
2. `./gradlew assembleRelease` (APK) or `./gradlew bundleRelease` (AAB)
3. Upload to Play Console

**iOS:**
1. Archive build in Xcode
2. Upload via Xcode/Transporter to App Store Connect
3. Submit for review
