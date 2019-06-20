---
layout: post
title: 使用 Jacoco 检查测试覆盖率
description: 在手动测试中启用 jacoco 来检查测试覆盖率
tags: [test, jacoco, unitest, manual, codecoverage]
typora-root-url: ../
---



​    团队中目前还没有自动化测试的覆盖，所以测试 team 想了解下手动测试的覆盖率。于是才有了本片文章的产生。网上有很多文章是利用 Android 的 instrument 测试框架，然后通过命令来启动app来进行测试。而且报告生产的时间点是在启动的 activity 结束以后，在复杂场景下，是没有办法来捕捉到所有页面的函数调用的。

   本文中的方案是对一个新的 `build type` 来重载 Application 代码，只在手动测试时候使用，对原来的代码不会产生任何影响。 希望可以帮到你。本文的实例代码可以到这里下载[trevorwang/jacoco-manual-coverage](https://github.com/trevorwang/jacoco-manual-coverage)

1. 在你的工程目录的`buildscripts` 下，新建一个 `jacoco.gradle` 的文件，添加如下代码

   ```groovy
   apply plugin: 'jacoco'  // 开启 jacoco
   
   jacoco {	
       toolVersion = "0.8.3"  // 设置 jacoco 版本号
   }
   
   // 如果使用了 Robolectric 请务必添加如下代码
   tasks.withType(Test) {
       jacoco.includeNoLocationClasses = true
   }
   ```

2. 在 app 目录下的 `build.gradle` 中添加代码,来启用脚本

   ```groovy
   apply from: '../buildscripts/jacoco.gradle'
   ```

3. 执行 `testDebugUnitTest` 后，会在`app/build/jococo/` 下看到 `testDebugUnitTest.exec`。 记住这个文件 我们会在后面用这个文件来生产报告。

   ![jacoco-executedata](/assets/images/jacoco-executedata.png)

4. 创建 `jacoco` 任务

   Android gradle plugin 会生成不同的 `variant`, 所以我们要对不用的 `variant` 生成不用的任务来生产报告。

   ```groovy
   project.afterEvaluate {
       android.applicationVariants.all { variant ->
           def variantName = variant.name
           def testTaskName = "test${variantName.capitalize()}UnitTest"
           tasks.create(name: "${testTaskName}Coverage", type: JacocoReport, dependsOn: "$testTaskName") {
             // TODO 后面实现
           }
       }
   }
   ```

   点击`Sync Gradle` 后，gradle task 会增加两个任务 ` testDebugUnitTestCoverage`, `testReleaseUnitTestCoverage`，接下来我们增加实现报告生成的任务。

5. 使用一下代码替换上一个步骤中的`TODO`

   ```groovy
    group = "Reporting"
       description = "Generate Jacoco coverage reports for the ${variantName.capitalize()} build."
    		// 设置报告格式
       reports {
           html.enabled = true
           xml.enabled = true
       }
    
   	 // 排除不需要统计的类
       def excludes = [
               '**/R.class',
               '**/R$*.class',
               '**/BuildConfig.*',
               '**/Manifest*.*',
               '**/*Test*.*',
               'android/**/*.*',
         		  'androidx/**/*.*'
       ]
   	  // Java 类文件
       def javaClasses = fileTree(dir: variant.javaCompiler.destinationDir, excludes: excludes)
   	  // Kotlin 文件
       def kotlinClasses = fileTree(dir: "${buildDir}/tmp/kotlin-classes/${variantName}", excludes: excludes)
       classDirectories = files([javaClasses, kotlinClasses])
   	  // 源文件
       sourceDirectories = files([
               "$project.projectDir/src/main/java",
               "$project.projectDir/src/${variantName}/java",
               "$project.projectDir/src/main/kotlin",
               "$project.projectDir/src/${variantName}/kotlin"
       ])
     	// 最开始我们生成的文件
       executionData = files("${project.buildDir}/jacoco/${testTaskName}.exec")
   ```

6. 执行一下 `testDebugUnitTestCoverage` 任务，我们就会在build 目录下看到报告了

   ![](/assets/images/jacoco-reports.png)

    经过以上步骤我们完成了一个jacoco 报告的生成过程。

关键步骤来了，如何在打包的app中开启jacoco呢？

7. 新建一个`staging` 的build type

   ```groovy
       buildTypes {
           release {...}
   
           staging {
               initWith(debug)
               matchingFallbacks = ["debug"]
               testCoverageEnabled true    // 会将jacoco runtime打包至app中
           }
       }
   ```

   

8. 在`src` 目录下，与 `main` 通级，新建 `staging` 目录

9. `staging` 目录下新建 `java`目录，并在 `com.example.staging` 包下新建 `StagingApp.kt`文件，代码如下：

   ```kotlin
   package com.example.staging
   
   import android.Manifest
   import android.app.Activity
   import android.app.Application
   import android.os.Bundle
   import android.os.Environment
   import android.util.Log
   import android.widget.Toast
   import androidx.fragment.app.FragmentActivity
   import com.tbruyelle.rxpermissions2.RxPermissions
   import java.io.File
   import java.io.FileOutputStream
   import java.io.IOException
   
   
   class StagingApp : Application() {
       override fun onCreate() {
           super.onCreate()
           Log.d(TAG, "StagingApp")
           registerActivityLifecycleCallbacks(object : ActivityLifecycleCallbacks {
               var activitySize = 0
               override fun onActivityPaused(activity: Activity?) {
               }
   
               override fun onActivityResumed(activity: Activity?) {
                   // 第一个activity 请求 SD card 目录访问权限
                   if (activitySize == 1) {
                       (activity as? FragmentActivity)?.let {
                           val rxPerm = RxPermissions(it)
                           rxPerm.request(Manifest.permission.WRITE_EXTERNAL_STORAGE).subscribe({ result ->
                               if (!result) {
                                   Toast.makeText(
                                       it,
                                       "You have to grant the permission to save coverage file",
                                       Toast.LENGTH_SHORT
                                   ).show()
                               }
                           }, { e ->
                               e.printStackTrace()
                           })
                       }
                   }
               }
   
               override fun onActivityStarted(activity: Activity?) {
               }
   
               override fun onActivityDestroyed(activity: Activity?) {
                   activitySize -= 1
   
                   if (activitySize <= 0) {
                     //所有activity被销毁后，生产报告文件
                       generateCoverageReport(createFile())
                   }
               }
   
               override fun onActivitySaveInstanceState(activity: Activity?, outState: Bundle?) {
               }
   
               override fun onActivityStopped(activity: Activity?) {
               }
   
               override fun onActivityCreated(activity: Activity?, savedInstanceState: Bundle?) {
                   activitySize += 1
               }
   
           })
   
       }
   
   
       private fun generateCoverageReport(file: File) {
           Log.d(TAG, "generateCoverageReport():${file.absolutePath}")
           FileOutputStream(file, false).use {
               val agent = Class.forName("org.jacoco.agent.rt.RT")
                   .getMethod("getAgent")
                   .invoke(null)
   
   
               Log.d(TAG, agent.toString())
               it.write(
                   agent.javaClass.getMethod("getExecutionData", Boolean::class.javaPrimitiveType)
                       .invoke(agent, false) as ByteArray
               )
           }
       }
   
       fun createFile(): File {
           // SD card 下面
           val file = File(Environment.getExternalStorageDirectory(), "jacoco/$DEFAULT_COVERAGE_FILE_PATH")
           if (!file.exists()) {
               try {
                   file.parentFile?.mkdirs()
                   file.createNewFile()
               } catch (e: IOException) {
                   Log.d(TAG, "异常 : $e")
                   e.printStackTrace()
               }
           }
           return file
       }
   
       companion object {
           const val DEFAULT_COVERAGE_FILE_PATH = "jacoco-coverage.ec"
           const val TAG = "StagingApp"
       }
   }
   ```

   

10. `staging` 目录中新建一个 `AndroidManifest.xml` 文件，内容如下

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <manifest
            xmlns:android="http://schemas.android.com/apk/res/android" package="com.example.jacocomanual">
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
        <application android:name="com.example.staging.StagingApp"/>
    
    </manifest>
    ```

    最后效果如下：

    ![jacoco-staging-build-type](/assets/images/jacoco-staging-build-type.png)

11. IDE `Build Variants` 下选择 `staging`

    ![jacoco-build-variants](/assets/images/jacoco-build-variants.png)

12. 运行app并安装到设备或者模拟器，操作一下，然后按返回键关闭所有的页面，这时候会在 SD 卡目录下的生成  `jacoco/jacoco-coverage.ec` 文件。

    ![jacoco-sd-location](/assets/images/jacoco-sd-location.png)

13. 复制 `jacoco-coverage.ec` 文件到项目根目录下的 `jacoco` 文件夹

14. 我们来修改jacoco的任务来生成最后的报告

    ```groovy
                // 最开始我们生成的文件
                executionData = files([
                        "${project.buildDir}/jacoco/${testTaskName}.exec",
                        "${rootDir}/jacoco/jacoco-coverage.ec"   //增加一个数据源
                ])
    ```

14. 运行 `testStagingUnitTest` 这样就可以看到报告了

    ![jacoco-report-html](/assets/images/jacoco-report-html.png)

真香！~~