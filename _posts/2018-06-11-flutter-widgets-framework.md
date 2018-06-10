---
layout: post
title: Flutter widgets framework 介绍
description: 简单介绍Flutter widgets framework，了解 Flutter 如何通过组装widgets 来实现复杂 UI 的
---

## 介绍

Flutter widgets 是从 [React](http://facebook.github.io/react/) 得到启发，从而产生的一套现在流行的响应式框架。其主要思想就是所有的 UI 使用 widgets 来创建。所有的 widgets 会给出当前的配置和状态。当一个 widget 有变化时，系统会计算出来所有的这个 widget背后的渲染树从前一个状态到当前状态的最小变化，从而重新构建自己。所以在 Flutter 中所有的 UI 都是通过各种 widgets 的组合来实现的。**[查看所有的 widgets](https://flutter.io/widgets/)**

## 来一个 Hello World
将如下代码 copy 到你新建项目中的 `lib/main.dart`，运行一下将会看到一下效果。**(如果你还没有新建过项目，请按照[这里的步骤](/2018/06/03/how-to-setup-development-environment.html)新建一个项目)**

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    new Text(
      'Hello, world!',
      textDirection: TextDirection.ltr,
    ),
  );
}
```

![Hello world](/assets/images/flutter-hello-world-1.png)
我们在 main 函数中，把一个 text 的 widget 传给了 `runApp` 这个函数，从而得到上面的效果。
如果我们需要 `Hello, world!` 居中显示怎么办，前面我讲了在 flutter 中我们需要各种 widgets 的组合。这里我们就需要一个叫做 `Center` 的widget 所以放在里面的组件，都会显示在这个组建的中间。我们改一下代码：

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
   Center(
      child: Text(
        'Hello, world!',
        textDirection: TextDirection.ltr,
      ),
    ),
  );
}
```
效果如下： 
![Hell world 2](/assets/images/flutter-hello-world-2.png)
*细心的朋友，可能注意到了，本段中 `Center` 跟 `Text` 的 `new` 关键字不见了， 这里是因为 Dart 2 提供的语法糖，让我们省略关键字 `new`。*

我们把 `Text` 放到了 `Center` widget 的 `child` 属性中，然后这个文字就可以居中了，不要太简单。到这我们就碰到了两种类型的 widgets，一个是用来展示内容的 `Text`，一个是用来布局的 `Center`。 在 Flutter 的开发中，我们会大量使用这种 widgets 的组合来实现我们需要的效果。接下来我们需要一个白色的背景以及蓝色的字体。**[更多布局类型的 widgets](https://flutter.io/widgets/layout/)**

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    Container(
      color: Colors.white, // background color
      child: Center(
        child: Text(
          'Hello, world!',
          textDirection: TextDirection.ltr,
          style: TextStyle(color: Colors.red),  // text color
        ),
      ),
    ),
  );
}
```
![Hello world 3](/assets/images/flutter-hello-world-3.png)
为了实现白色背景，我们添加了一个 `Container`  widget，然后颜色设置为 白色。我们看到 Text 没有 color 的属性，但是有个 style，所以我们通过构建一个白色的 TextStyle 来实现字体变成红色。TextStyle 中还可以改变字体的其他属性，自己可以在研究一下。

如何在文字下面添加一个按钮呢？

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    Container(
      color: Colors.white,
      child: Center(
          child: Column( // 实现上下布局
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(
            'Hello, world!',
            textDirection: TextDirection.ltr,
            style: TextStyle(color: Colors.red),
          ),
          RaisedButton( // 按钮
            child: Text(
              'Say Hello',
              textDirection: TextDirection.ltr,
            ),
            onPressed: null,
          )
        ],
      )),
    ),
  );
}
```
![Hello world 4](/assets/images/flutter-hello-world-4.png)
从代码中我们可以看到我们增加了一个 `Column` 来实现一个多个 widgets 的竖状排列，所以它的子控件 属性变成了需要一个 List 的 `children`。我们再来看 Button，这里我们要给 button 添加一个说明，同样通过添加一个 `Text` widget 来实现。如果你耐心看到这里，你基本上已经入门了 Flutter 开发。再复杂的页面也是类似于这样组合 widget 的方式来进行开发，可能使用到更复杂的 widget 罢了。

你有没有发现，我们没有用 `xml` 或者 `xib` 文件，轻轻松松就实现了这样一个界面。 如果我们同样使用 Java 或者 Swift 来实现同样的界面，需要多少代码呢？

