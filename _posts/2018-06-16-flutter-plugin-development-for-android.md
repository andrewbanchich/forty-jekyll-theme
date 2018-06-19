---
layout: post
title: Flutter 插件开发 -- Android篇
description: 以二维码扫描为例介绍插件开发
---
目前 flutter 的功能还么有很完善，很多常用的三方库在 flutter 中没有类似的实现。如何在 flutter 中使用已经存在的 native 库呢？本文以二维码扫描为例，介绍 flutter 插件开发。
## 新建 Plugin 工程
```shell
flutter create --org mingsin.scan --template=plugin  -i swift -a kotlin scan
```
打开新创建的工程，可以看到一下代码：

`lib/scan.dart`

```dart
import 'dart:async';

import 'package:flutter/services.dart';

class Scan {
  static const MethodChannel _channel =
      const MethodChannel('scan');

  static Future<String> get platformVersion async {
    final String version = await _channel.invokeMethod('getPlatformVersion');
    return version;
  }
}

```
`android/src/..../ScanPlugin.kt`

```kotlin
class ScanPlugin(): MethodCallHandler {
  companion object {
    @JvmStatic
    fun registerWith(registrar: Registrar): Unit {
      val channel = MethodChannel(registrar.messenger(), "scan")
      channel.setMethodCallHandler(ScanPlugin())
    }
  }

  override fun onMethodCall(call: MethodCall, result: Result): Unit {
    if (call.method.equals("getPlatformVersion")) {
      result.success("Android ${android.os.Build.VERSION.RELEASE}")
    } else {
      result.notImplemented()
    }
  }
}
```
通过以上代码，可以清晰看出来，Flutter 通过提供 `MethodChannel` 来实现跨语言的调用。
Kotlin 的代码中，有个叫做 `ScanPlugin` 的类，这个类继承自 `MethodCallHandler`。它会先向 Flutter 注册一个叫做 scan 的 channel， 然后在 `onMethodCall` 判断当函数名为 `getPlatformVersion` 时，返回 android 系统的 OS 版本。

在 Dart 中，获取一个注册明为 `scan` 的 `MethodChannel`。然后通过 `_channel.invokeMethod('getPlatformVersion');` 来获取对应的函数的结果。

通过以上分析，我看就可以看得出来，如果要添加一个叫做 `codescan` 的函数就可以了。

## 添加 `codescan` 函数
### 先执行以下命令

    ```shell
    cd example; 
    flutter build apk
    ```
### 导入 Android Plugin 工程

1. 打开 Android Studio 
2. 选择 Import project,然后选中 `example/android/build.gradle` 文件
3. 在 Gradle Sync 窗口中，选择 OK
4. Android Gradle Plugin Update 窗口中选择 Don’t remind me again for this project

这样你就可以运行 example 工程了


### `lib/scan.dart` 中添加函数
```dart
  static Future codeScan() async {
    await _channel.invokeMethod('codeScan');
  }
```


### `ScanPlugin.kt` 中实现该函数

```kotlin
class ScanPlugin(private val registrar: Registrar) : MethodCallHandler {
    companion object {
        @JvmStatic
        fun registerWith(registrar: Registrar) {
            val channel = MethodChannel(registrar.messenger(), "scan")
            channel.setMethodCallHandler(ScanPlugin(registrar))
        }
    }

    override fun onMethodCall(call: MethodCall, result: Result) {
        when (call.method) {
            "getPlatformVersion" -> {
                result.success("Android ${android.os.Build.VERSION.RELEASE}")
            }
            "codeScan" -> {
                IntentIntegrator(registrar.activity())
                        .setDesiredBarcodeFormats(IntentIntegrator.ONE_D_CODE_TYPES)
                        .initiateScan()
            }
            else ->
                result.notImplemented()
        }

    }
}
```

### `example/lib/main.dart` 中调用该函数

```diff
         body: new Center(
-          child: new Text('Running on: $_platformVersion\n'),
+          child: RaisedButton(
+            onPressed: () async {
+              await Scan.codeScan();
+            },
+            child: Text("Scan"),
+          ),
         ),
       ),
```

重新 reload 该工程，应该可以看到如下界面：
![flutter code scan](/assets/images/flutter-scan-button.png)
点击 Scan 按钮，就可以看到二维码扫描的界面了。

 ![flutter scan camera](/assets/images/flutter-scan-camera.png)

到这里你就可以实现 dart 来调用三方库来实现具体的功能了。

如何获取第三方库的返回值呢？MethodHandler提供了一个 result 类传递返回值，只需要在 success 函数中传递你需要的返回值就可以了。同时如果需要获取  onActivity 的返回值，可以通过 PluginRegistry.ActivityResultListener 来实现。

```kotlin
    override fun onMethodCall(call: MethodCall, result: Result) {
        when (call.method) {
            "getPlatformVersion" -> {
                result.success("Android ${android.os.Build.VERSION.RELEASE}")
            }
            "codeScan" -> {
                if (listener.result == null) {
                    registrar.addActivityResultListener(listener)
                }
                listener.result = result
                IntentIntegrator(registrar.activity())
                        .setDesiredBarcodeFormats(IntentIntegrator.ONE_D_CODE_TYPES)
                        .initiateScan()
            }
            else ->
                result.notImplemented()
        }

    }

    private val listener = object : PluginRegistry.ActivityResultListener {
        var result: Result? = null
        override fun onActivityResult(requestCode: Int, resultCode: Int, intent: Intent?): Boolean {
            val intentResult = IntentIntegrator.parseActivityResult(requestCode, intent)
            result?.success(intentResult.contents)
            return true
        }

    }
```

