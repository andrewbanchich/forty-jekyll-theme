---
layout: post
title: Kotlin & Databinding
description: Enable Databinding in a Kotlin Android Project
image: assets/images/pic-Data-Binding-Technique-Android.png
---
    

# Kotlin  DataBinding

### Create Android Kotlin Project  
Please following[Dancing with kotlin] to create a new project. Or  clone the project [https://github.com/trevorwang/android-kotlin-example], checkout `kotlin-init`

### Update `build.gradle`
```diff
 buildscript {
	 ext.kotlin_version = '1.0.6'
+    ext.gradle_version = '2.2.3'
	 repositories {
		 jcenter()
	 }
	 dependencies {
- 	   classpath 'com.android.tools.build:gradle:2.2.3'
+ 	   classpath "com.android.tools.build:gradle:$gradle_version"
		 classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
```

### update `app/build.gradle` to enable data binding
```diff
     sourceSets {
         main.java.srcDirs += 'src/main/kotlin'
     }
+
+    dataBinding {
+        enabled = true
+    }
+}
+kapt {
+    generateStubs = true
 }
 
  dependencies {
@@ -32,6 +39,7 @@ dependencies {
     compile 'com.android.support:design:25.1.1'
     testCompile 'junit:junit:4.12'
     compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
+    kapt "com.android.databinding:compiler:$gradle_version"
 }
```

### update `MainActivity.kt`
```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = DataBindingUtil.setContentView<ActivityMainBinding>(this, R.layout.activity_main)
        binding.greeting = "Hello Kotlin Data Binding!!!"
    }
}

```

### update `activity_main.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<layout>

    <data>

        <variable
            name="greeting"
            type="String" />
    </data>

    <android.support.design.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:fitsSystemWindows="true"
        tools:context="mingsin.androidkotlinexample.MainActivity">

        <android.support.design.widget.AppBarLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:theme="@style/AppTheme.AppBarOverlay">

            <android.support.v7.widget.Toolbar
                android:id="@+id/toolbar"
                android:layout_width="match_parent"
                android:layout_height="?attr/actionBarSize"
                android:background="?attr/colorPrimary"
                app:popupTheme="@style/AppTheme.PopupOverlay" />

        </android.support.design.widget.AppBarLayout>

        <RelativeLayout
            android:id="@+id/content_main"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:paddingBottom="@dimen/activity_vertical_margin"
            android:paddingLeft="@dimen/activity_horizontal_margin"
            android:paddingRight="@dimen/activity_horizontal_margin"
            android:paddingTop="@dimen/activity_vertical_margin"
            app:layout_behavior="@string/appbar_scrolling_view_behavior"
            tools:context="mingsin.androidkotlinexample.MainActivity"
            tools:showIn="@layout/activity_main">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="@{greeting}" />
        </RelativeLayout>


        <android.support.design.widget.FloatingActionButton
            android:id="@+id/fab"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="bottom|end"
            android:layout_margin="@dimen/fab_margin"
            app:srcCompat="@android:drawable/ic_dialog_email" />

    </android.support.design.widget.CoordinatorLayout>
</layout>
```

You can checkout whole source code from [here](https://github.com/trevorwang/android-kotlin-example/tree/kotlin-databinding)

## References

[Issue with databinding using Kotlin for Android](http://stackoverflow.com/questions/41213765/issue-with-databinding-using-kotlin-for-android)

