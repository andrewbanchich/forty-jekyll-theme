# flutter_boost 集成体验之Android
---
layout: post
title: flutter_boost 集成体验之Android
description: flutter_boost 集成体验之Android
---

> 如何将 flutter_boost 添加到已有的Android工程，此 demo 在 MacOS 下完成，如果使用 Windows， 请修改对应的路径为 Windows 的格式。

## flutter 端

1. 新建 flutter module

	```sh
	flutter create -t module flutter_module
	```
2. 在 `pubspec.yaml` 中添加 flutter_boost 依赖
	
	```yaml
	dependencies:
  	  flutter_boost:
	```
3. 运行 `flutter build apk` 
	在 flutter_boost 0.400版本会有错误抛出，找出其中关键信息如下：
	
	```
	* What went wrong:
	A problem occurred evaluating project ':flutter_boost'.
	> Plugin with id 'kotlin-android-extensions' not found.

	``` 
	不难发现是因为没有 `kotlin` 依赖导致, 下面我们就来修复这个问题

4. 在项目根目录下执行，`flutter make-host-app-editable` 
   执行完成后，发现目录下面出现了 `android` 以及 `ios` 文件夹
5. 在 `android/build.gralde` 中添加 `kotlin` 依赖

	```diff
	 buildscript {
	+    ext.kotlin_version = '1.3.21'
		repositories {
			google()
			jcenter()
	@@ -8,6 +9,7 @@ buildscript {

		dependencies {
			classpath 'com.android.tools.build:gradle:3.2.1'
	+        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
		}
	}
	```
	再一次运行 `flutter build apk` 发现成功了
6. 把 `flutter_boost/example/lib` 下的文件复制到 `lib` 目录


这样 flutter 这一端的工作就准备完成了

## Android 端

1. 使用Android Studio新建一个工程
   
   如果你有现成的项目，可以跳过这一步

2. 在 App module 中添加kotlin支持，并在 `settings.gradle` 中添加如下代码

	```groovy
	setBinding(new Binding([gradle: this]))
	evaluate(new File('../flutter_module/.android/include_flutter.groovy'))   //保证Android项目和flutter module在同一目录下
	```
   运行一下 `gralde sync`，这时候你的工程里应该会出现三个新的项目 `Flutter-flutter`, `flutter_boost` 和 `xservice_kit`

   如果碰到一下错误，请把gradle的版本改为 **4.10.2**

   ```
   ERROR: Unable to resolve dependency for ':flutter@dynamicProfile/compileClasspath': Could not resolve project :xservice_kit.
	Show Details
	Affected Modules: flutter

	ERROR: Unable to resolve dependency for ':flutter@dynamicProfile/compileClasspath': Could not resolve project :flutter_boost.
	Show Details
	Affected Modules: flutter
   ```

3. 在 `flutterservice` 目录下的 `build.gradle` 文件中添加一下依赖

	```groovy
    implementation project(path: ':flutter')
    implementation project(":flutter_boost")
	```
4. 从`flutter_boost/example/android` 中复制所有chu新建 `MyApplication` 类，代码如下：

	```kotlin
	class MyApplication : FlutterApplication(), IPlatform {
		override fun onCreate() {
			super.onCreate()
			FlutterBoostPlugin.init(this)
		}
		override fun getApplication(): Application {
			return this
		}

		override fun getMainActivity(): Activity? {
			return MainActivity.sRef.get()
		}

		override fun isDebug(): Boolean {
			return true
		}

		override fun startActivity(context: Context?, url: String?, requestCode: Int): Boolean {
			return false
		}

		override fun getSettings(): MutableMap<Any?, Any?> {
			return HashMap()
		}

	}
	```
	完成后再manifest文件中指定使用此Application
5. 在 MainActivity 中添加弱引用来保存 `MainActivity`

	```kotlin
	class MainActivity : AppCompatActivity() {
		override fun onCreate(savedInstanceState: Bundle?) {
			super.onCreate(savedInstanceState)
			setContentView(R.layout.activity_main)
			sRef = WeakReference(this)
		}

		companion object {

			var sRef: WeakReference<Activity?> = WeakReference(null)
		}
	}

	```
6. 新建FlutterPageActivity, 记得添加到manifest文件中

	```kotlin
	class FlutterPageActivity:BoostFlutterActivity() {
		override fun getContainerParams(): MutableMap<Any?, Any?> {
			return HashMap()
		}

		override fun onRegisterPlugins(registry: PluginRegistry?) {
			GeneratedPluginRegistrant.registerWith(registry)
		}

		override fun getContainerName(): String {
			return "flutterPage"
		}
	}
	```
7. 在layout中给textview 添加id 

	```xml
            android:text="Hello World!"
            android:id="@+id/tvHello"
            app:layout_constraintBottom_toBottomOf="parent"
	```
8. MainActivity 中添加点击事件

	```kotlin
	tvHello.setOnClickListener {
		startActivity(Intent(applicationContext, FlutterPageActivity::class.java))
	}
	```
9. 运行android工程，如果碰到错误请按照提示修改
10. 点击 `Hello world`,就会打开一个Flutter的页面了，到此已经完成了从Native页面打开flutter页面

11. 把MyApplication 中 startActivity 函数修改为下面代码：

```
 override fun startActivity(context: Context?, url: String?, requestCode: Int): Boolean {
        if (url?.contains("sample://nativePage") == true) {
            context?.startActivity(Intent(context, MainActivity::class.java))
            return true
        }
        return false
    }
```
点击flutter页面中的`open native page`，就会重新打开activity。

这样就完成了两端的相互调用，欢迎入坑 Flutter