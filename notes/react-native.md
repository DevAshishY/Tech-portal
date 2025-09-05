# Install

## install Java Development Kit
download and install or sudo apt install openjdk-21-jre-headless
## download andriod studio.zip from download => andriod studio => bin open terminal here and type this command  
./studio.sh
## How to Set Up ANDROID_HOME on Ubuntu

```

If you use Bash (default shell in Ubuntu):

1-Open the Terminal and Edit the Shell Configuration File

nano ~/.bashrc

2. Add These Lines at the End of the File

export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

3- save and exit 

Press CTRL + X
Press Y (to confirm changes)
Press Enter (to save)

4-Apply the chnages

source ~/.bashrc



5. Verify the Setup Check if ANDROID_HOME is set:

echo $ANDROID_HOME

Expected output:/home/bjshw-005016/Android/Sdk

```

## Now open andriod studio and open virtual device manager
more actions => virtual device manager


# Andriod studio 

## create desktop short cut for ubantu
Android Studio > Tools > Create Desktop Entry



## open project on andriod studio 
file => import project => open only andriod folder on your repo , when it open it will sync and convert it andriod project autometic if not you can sync on top option sync project with gradle file 

## error video
https://www.youtube.com/@irekhatechsolutions

## if project open how to close 
File → Close Project

## error clean catch
```
error Android Studio) caches project metadata, Gradle files, and compiled files.
 caches get corrupted or outdated, they can cause unexplained build errors
 Invalidating caches forces the IDE to re-index the project and fetch fresh metadata

  file ->  Invalidate Caches/Restart
   Build -> Clean Project
   
```

## run emulator 

make sure device should be seleted on Andriod studio and folder path should app on top right side 


## create project vs code
npx @react-native-community/cli init  nativeFirst

## run project
npx react-native start


# Thoery

## current version 
0.78

## reactive native develop option 
When it comes to developing mobile applications using React Native, developers have two main options: Expo and React Native CLI. Both approaches have their own set of advantages and disadvantages

## Advantages of Expo

```
    Quick Start: Expo allows you to quickly start developing your app without worrying about device-specific setup or native code dependencies.
    Over-the-Air Updates: With Expo, you can deploy updates to your app directly to user devices without requiring them to download a new version from the app store.
    Access to Pre-built Libraries: Expo provides a wide range of pre-built libraries and APIs, making it easy to add features like push notifications, in-app purchases, and maps to your app.
    Simplified Build Process: Expo handles the build process for you, abstracting away the need to configure build tools and deal with native code compilation.
    EAS: With Expo, you don’t need a mac to build the app for iOS. You can have the code built and deployed to EAS in the cloud. From there you can directly deploy it to the store.
    Native Physical Device: With Expo, you can have the Expo Go app installed in your mobile and connect over the same network and get your app tested on any physical device [both Android and iOS].


```
## Disadvantages of Expo:

```
 Limited Native Modules: Expo restricts access to certain native modules, which means you may encounter limitations when trying to integrate certain third-party libraries or accessing low-level device features.
    Less Control Over the Build: With Expo, you have less control over the build configuration and customization options compared to React Native CLI.
    Size and Performance: Expo apps tend to have a larger bundle size compared to React Native CLI apps, which can impact download and loading times. Additionally, certain performance optimizations may not be available in Expo.

```
## React Native CLI

```
React Native CLI is the traditional approach for building React Native apps. It provides maximum flexibility and control over your project setup and configuration.
```

## Advantages of React Native CLI:

```
    Full Native Module Support: React Native CLI allows you to access and integrate any native module available in the React Native ecosystem, giving you the flexibility to leverage a wide range of third-party libraries and device capabilities.
    Customization Options: You have complete control over the build configuration, allowing you to fine-tune your app’s performance, size, and behavior.
    Ecosystem Compatibility: React Native CLI is fully compatible with the entire React Native ecosystem, including all community libraries and tools.

```

## Disadvantages of React Native CLI:

```
    Steeper Learning Curve: React Native CLI requires more initial setup and configuration, which can be overwhelming for developers new to React Native or mobile app development.
    Longer Development Setup Time: Setting up a React Native CLI project involves installing and configuring native dependencies, which can take longer compared to getting started with Expo.
    Manual Build Process: React Native CLI requires you to manually configure build tools, which can be more time-consuming and complex, especially for developers unfamiliar with native app development.
    Native Physical Device: React Native CLI requires you to have physical platform specific devices for testing your app in Android and iOS. For iOS, you would surely need a Mac to build and test your app.

```

## more chnages on version
0.71 incluse type script by default

## Folder structure
```
metro.config.js and watchman (watchman check file if any chnages then metro reload fast our app) 
babel.config.js :convert es code to plan js

esLintrc :config of Es
andriod and ios :convert code as per anderiod and ios and make build as enviremnt
packagelock.json :store dependency to dependency 
Gemfile :it is for ruby when we debug app ruby need so we can change config 
.prettierrc.config :app formatting config
.bundl.config :when we bundle ios or andriod app then we can set config
__tests__ : test case

```

## React native compoents
native have no tag we say compoent and it will come from react native and first letter will captial

```
<Text> :for text 
<View> :work as wrapper , or you can say for fragment, we can't write anything inside View , always put inside string on Text
<Button>:and for text pass on title as attribute and color also as attribute , default button from native we can not more style

<TouchableHighlight> for custom button


      <TouchableHighlight>
        <Text>Button</Text>
      </TouchableHighlight> now you can apply css on Text


<TouchableOpacity> for checkbox or radio


<TouchableOpacity> for checkbox or radio TouchableHighlight emphasizes the press effect by changing the background color, while TouchableOpacity provides a fade effect by adjusting opacity. T

<FlatList> (for print data as list or you can same as map on react)


<FlatList data={users} renderItem={
({item})=><Text>{item.name}</Text>
}

FlatList att keyExtractor like key on list in react


why flat list  : we can add header footer and if we have laerge list it will show only view on screen option other will hise for ui , we have more options 
map: we can use map also 
ScrollView: for scrolling list use as wrappper


SectionList (for array inside array, next list use it ) :

 const user = [
    {
      name: 'ashish',
      data: [1, 2, 3, 4],
    },
    {
      name: 'ashish',
      data: [5, 6, 7, 8],
    },
  ];
  const chnageme = (e: any) => {
    console.warn(e);
  };
  return (
    <>
      <Text>fff</Text>
      <TextInput
        placeholder="please enter yout name"
        onChangeText={e => chnageme(e)}></TextInput>
      <SectionList
        sections={user}
        renderItem={({item}) => <Text>{item}</Text>}
        renderSectionHeader={({section: {name}}) => <Text>{name}</Text>}
      />
    </>

data on array is constant , it should same 


<ActivityIndecator> : loader 
<Modal>: modal popup 
<pressable>: because we need one button multple event so use , you can use attbuite onPress, onLongPress,onPressIn,onPressOut   (onLongPress will take 5 second)


```

## events 

onPress (mobile have onPress on web we can say click)

onChangeText

## Style in native

```
inline 

style={{fontSize:20}} , double object first for norma objct and second for jsx , for multile proprty comma saprated

internal

import styleSheet from react-native
const styles = Stylesheet.create({
textBox:{
color:'red'
}

})

<Text style={styles.textBox}>hello</Text>

externl

make interfile code saprate file and export and use

multiple css

<Text style={[styles.textBox,Exstyle.textBox,{color:'red'}]}

```


## css Property


