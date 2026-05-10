# React Native Notes

---

# Part 1 — Setup & Installation

---

## 1. Install Java Development Kit

```bash
sudo apt install openjdk-21-jre-headless
```

Or download and install manually.

---

## 2. Install Android Studio

1. Download `android-studio.zip`
2. Extract → navigate to `android-studio/bin/`
3. Open terminal and run:

```bash
./studio.sh
```

**Create desktop shortcut (Ubuntu):**
Android Studio → Tools → Create Desktop Entry

---

## 3. Set Up ANDROID_HOME (Ubuntu)

```bash
# 1. Open shell config
nano ~/.bashrc

# 2. Add these lines at the end
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# 3. Save and exit (Ctrl+X → Y → Enter)

# 4. Apply changes
source ~/.bashrc

# 5. Verify
echo $ANDROID_HOME
# Expected: /home/<user>/Android/Sdk
```

---

## 4. Open Virtual Device Manager

Android Studio → More Actions → Virtual Device Manager

Make sure device is selected and folder path shows `app` on top right side.

---

## 5. Open Project in Android Studio

File → Import Project → open **only the `android` folder** from your repo.
It will auto-sync and convert to an Android project. If not, click **Sync Project with Gradle Files** at the top.

**Close project:** File → Close Project

---

## 6. Clear Cache (Fix Build Errors)

When Android Studio caches get corrupted:

```
File → Invalidate Caches / Restart
Build → Clean Project
```

---

## 7. Create & Run Project (VS Code)

```bash
# Create project
npx @react-native-community/cli init nativeFirst

# Run project
npx react-native start
```

---

## 8. Error Resources

- https://www.youtube.com/@irekhatechsolutions

---

---

# Part 2 — Theory

---

## 1. Current Version

**0.78** (0.71+ includes TypeScript by default)

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

**Why FlatList over `map`?**
- Only renders visible items (better for large lists)
- Built-in header/footer support
- Pull-to-refresh support

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

**Types:** Stack, Drawer, Tab

```bash
npm install @react-navigation/native
npm install @react-navigation/native-stack
```

**Stack navigation** — screen-to-screen transitions (e.g., Login → Signup).

**Fix package errors:**

```bash
npm start -- --reset-cache
```

---

## 13. Localhost API on Emulator

Localhost APIs don't work on the emulator. Use your machine's IP address instead:

```bash
# Get IP address
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
