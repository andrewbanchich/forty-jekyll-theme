---
layout: post
title: Flutter 开发环境配置
description: Flutter 开发环境配置
---

## 系统要求
操作系统：macOS (64-bit) 本文以 macOS 系统为例介绍安装过程  
工具： `bash`,`git`,`curl`,`unzip`

## 获取 Flutter SDK 
1. 从[Flutter SDK Archive](https://flutter.io/sdk-archive/#macos)页面下载最新版本的 SDK。
    点击[flutter_macos_v0.4.4-beta.zip](https://storage.googleapis.com/flutter_infra/releases/beta/macos/flutter_macos_v0.4.4-beta.zip)下载或者
    
    ```shell
curl -o ~/Downloads/flutter_macos_v0.4.4-beta.zip https://storage.googleapis.com/flutter_infra/releases/beta/macos/flutter_macos_v0.4.4-beta.zip
```
    
    **P.S. 如果上面链接有问题,请使用中国专用链接**
    
    ```shell 
curl -o ~/Downloads/flutter_macos_v0.4.4-beta.zip  https://storage.flutter-io.cn/flutter_infra/releases/beta/macos/flutter_macos_v0.4.4-beta.zip
```
2. 解压文件到你想要的路径

    ```shell
cd ~/development
unzip ~/Downloads/flutter_macos_v0.4.4-beta.zip
```
3. 添加`flutter`到PATH

    ```shell
export PATH=`pwd`/flutter/bin:$PATH
```
4. 运行 flutter doctor

    ```shell
flutter doctor
```

***如果按照上面的步骤，没有成功安装。请采用下面命令安装：***

```shell
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
git clone -b dev https://github.com/flutter/flutter.git
export PATH="$PWD/flutter/bin:$PATH"
cd ./flutter
flutter doctor

####备用的镜像网站####
# export FLUTTER_STORAGE_BASE_URL=https://mirrors.sjtug.sjtu.edu.cn/
# export PUB_HOSTED_URL=https://dart-pub.mirrors.sjtug.sjtu.edu.cn/
```

## 配置开发平台
### iOS开发
#### 安装 Xcode
1. 从 [App Store](https://itunes.apple.com/us/app/xcode/id497799835) 安装 xcode.
2. 配置命令行使用最新的 xcode
    
    ```shell
    sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
    ```
3. 确保您已经接受 xcode 许可协议

    ```shell
    sudo xcodebuild -license
    ```
    
#### 配置模拟器
1. 通过LaunchPad 或者下面的命令来启动模拟器

    ```shell
open -a Simulator
```

2. `flutter run` 来运行你的程序


### Android 开发
#### 安装 Android Studio
下载安装 [Android Studio](https://developer.android.com/studio/index.html)
#### Android 设备（Android Version >= 4.1）
1. 参照[此链接](https://developer.android.com/studio/debug/dev-options.html)开启开发者模式并打开 debug
2. 链接你的手机到电脑
3. `flutter run` 运行你的程序




