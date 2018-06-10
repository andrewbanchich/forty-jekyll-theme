---
layout: post
title: Flutter 项目结构介绍
description: 说明项目的目录结构以及主要文件内容
---
# Flutter 项目结构介绍
## 主要目录以及文件
![](/assets/images/pic-flutter-project-structure.png)

1. `android` Android 平台相关代码
2. `ios` iOS 平台相关代码
3. `build` 项目编译产生的目录，不需要关心
4. `lib` 跨平台代码，也是 Flutter 项目主要关心的目录
5. `test` 测试相关代码
6. `pubspec.yaml` 项目描述文件，相当于 NodeJs 项目的 `package.json`，里面包含了项目的描述信息以及所需要的依赖的库


## 主要文件说明

### `pubspec.yaml` 
![](/assets/images/pic-flutter-pubspec.png)


### `main.dart`

Flutter 使用 `dart` 语言（以后的章节中会逐步增加一些介绍 dart 的内容）来进行开发，下图是将代码简化之后的效果。只需要3个类就可以实现一个 app 页面，并且可以同时运行在 iOS 和 Android 两个平台，非常简单。而且 `main.dart` 是所有 Flutter 项目的入口文件，不能被删除或者改名。
![pic-flutter-main](/assets/images/pic-flutter-main.png)



