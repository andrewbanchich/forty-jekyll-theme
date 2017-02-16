---
layout: post
title: Kotlin & RxJava & Retrofit
description: Integrate rxjava to kotlin project
image: assets/images/pic-kotlin-android-rxjava.png
---


### Add Dependecies  
Add the following code into the `dependencies` block in your `build.gradle`

```gradle
compile 'io.reactivex:rxkotlin:0.60.0'
compile 'io.reactivex:rxandroid:1.2.1'
compile 'com.squareup.retrofit2:retrofit:2.1.0'
compile 'com.squareup.retrofit2:adapter-rxjava:2.1.0'
compile 'com.squareup.retrofit2:converter-gson:2.1.0'
compile 'com.orhanobut:logger:1.15'

```

### Add internet permission for you application
Open you `AndroidManifest.xml` file and add the following line above your applicaiton tag.

```xml
 <uses-permission android:name="android.permission.INTERNET" />

```

### Create the service interface

```kotlin
interface ApiService {
    @GET("/ip")
    fun ip(): Observable<Ip>
}
```

### Create model
```kotlin
data class Ip(val origin: String)
```

### Create Retrofit client

```kotlin
class RestClient {
    val BASE_URL = "http://httpbin.org"

    fun createApi(): ApiService {
        val retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addCallAdapterFactory(RxJavaCallAdapterFactory.create())
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        return retrofit.create(ApiService::class.java)
    }
}
```

### Integrate code into your activity
Init `ApiService` in your class  

```diff
	 class MainActivity : AppCompatActivity() {
	+    lateinit var apiService: ApiService
	+
	+    private val subscriptions = CompositeSubscription()
	 
	     override fun onCreate(savedInstanceState: Bundle?) {
	         super.onCreate(savedInstanceState)
	@@ -27,25 +32,21 @@ class MainActivity : AppCompatActivity() {
	             Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
	                     .setAction("Action", null).show()
	         }
	+        apiService = RestClient().createApi()
	     } 

```
Update the code in your `onStart` and `onStop` method.

```kotlin
    override fun onStart() {
        super.onStart()
        subscriptions.add(apiService.ip().subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe {
                    Logger.d(it)
                })
    }

    override fun onStop() {
        super.onStop()
        subscriptions.clear()
    }
```

### Run you application you will see the message on console

```sonsole
02-16 15:03:32.529 15858-15858/mingsin.androidkotlinexample D/PRETTYLOGGER: ╔════════════════════════════════════════════════════════════════════════════════════════
02-16 15:03:32.530 15858-15858/mingsin.androidkotlinexample D/PRETTYLOGGER: ║ Thread: main
02-16 15:03:32.530 15858-15858/mingsin.androidkotlinexample D/PRETTYLOGGER: ╟────────────────────────────────────────────────────────────────────────────────────────
02-16 15:03:32.530 15858-15858/mingsin.androidkotlinexample D/PRETTYLOGGER: ║ MainActivity$onStart$1.call  (MainActivity.kt:15)
02-16 15:03:32.530 15858-15858/mingsin.androidkotlinexample D/PRETTYLOGGER: ║    MainActivity$onStart$1.call  (MainActivity.kt:44)
02-16 15:03:32.530 15858-15858/mingsin.androidkotlinexample D/PRETTYLOGGER: ╟────────────────────────────────────────────────────────────────────────────────────────
02-16 15:03:32.530 15858-15858/mingsin.androidkotlinexample D/PRETTYLOGGER: ║ Ip(origin=20x.xx.xx.xx, 20x.xx.xx.xx)
02-16 15:03:32.530 15858-15858/mingsin.androidkotlinexample D/PRETTYLOGGER: ╚════════════════════════════════════════════════════════════════════════════════════════
02-16 15:03:33.025 15858-15858/mingsin.androidkotlinexample D/KeyEvent: obtain, mHwFlags=0
```

You can find the full version code from [here](https://github.com/trevorwang/android-kotlin-example/tree/rxjava-retrofit)