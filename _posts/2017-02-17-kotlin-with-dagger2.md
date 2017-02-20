---
layout: post
title: Kotlin & Dagger2
description: Integrate rxjava to kotlin project
image: assets/images/pic-dagger2-dependency-injection.jpg
---

> ***The project is based on the code complete in last article. You can download from [here](https://github.com/trevorwang/android-kotlin-example/tree/rxjava-retrofit)***

### Add Dependencies to your `build.gradle`

```gradle
 kapt 'com.google.dagger:dagger-compiler:2.9'
 compile 'com.google.dagger:dagger:2.9'
```

### Create your application instead of default

```kotlin
class App : Application() {
    override fun onCreate() {
    }
}
```

### Update your manifest file to enable your App

Add the following to your `application` tag

```diff
     <application
+        android:name=".App"
         android:allowBackup="true"
         android:icon="@mipmap/ic_launcher"
         android:label="@string/app_name"
```

### Create Application module

Create a `AppModule.kt` file and add the following code

```kotlin
@Module
class AppModule(val app: App) {

    @Provides
    @Singleton
    fun app(): App {
        return app
    }

    @Provides
    @Singleton
    fun context(): Context {
        return app
    }

    @Provides
    @Singleton
    fun connectivity(): ConnectivityManager {
        val service = app.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        return service
    }
}
```

### Create component

```kotlin
@Singleton
@Component(
        modules = arrayOf(AppModule::class)
)
interface AppComponent {
    fun inject(app: App)
}
```


### Update your code in `App.kt` to enable the injection

```kotlin
  lateinit var component: AppComponent
    lateinit @Inject var cm: ConnectivityManager
    override fun onCreate() {
        super.onCreate()
        component = DaggerAppComponent.builder().appModule(AppModule(this)).build()
        component.inject(this)
        Logger.d("connectivity manager : ${cm}")
    }
```

Now you can run your code in IDE, you will see the following in your console. You have completed your first injection for Application.

```
02-17 10:03:20.492 10572-10572/? D/PRETTYLOGGER: ╔════════════════════════════════════════════════════════════════════════════════════════
02-17 10:03:20.493 10572-10572/? D/PRETTYLOGGER: ║ Thread: main
02-17 10:03:20.493 10572-10572/? D/PRETTYLOGGER: ╟────────────────────────────────────────────────────────────────────────────────────────
02-17 10:03:20.493 10572-10572/? D/PRETTYLOGGER: ║ BootstrapApplication.onCreate  (BootstrapApplication.java:370)
02-17 10:03:20.493 10572-10572/? D/PRETTYLOGGER: ║    App.onCreate  (App.kt:21)
02-17 10:03:20.493 10572-10572/? D/PRETTYLOGGER: ╟────────────────────────────────────────────────────────────────────────────────────────
02-17 10:03:20.493 10572-10572/? D/PRETTYLOGGER: ║ connectivity manager : android.net.ConnectivityManager@39309b5
02-17 10:03:20.494 10572-10572/? D/PRETTYLOGGER: ╚════════════════════════════════════════════════════════════════════════════════════════
```

### Follow above guide to create `ActivityModule` and `ActivityComponent`

```kotlin
@Module
class ActivityModule(val activity: DaggerActivity) {

    @Provides
    fun activity(): DaggerActivity {
        return activity
    }

    @Provides
    fun progressDialog(): ProgressDialog {
        val progress = ProgressDialog(activity)
        progress.setMessage(activity.getString(R.string.loading))
        return progress
    }
}
```

```kotlin
@ForActivity
@Component(
        modules = arrayOf(ActivityModule::class),
        dependencies = arrayOf(AppComponent::class)
)
interface ActivityComponent {
    fun inject(activity: MainActivity)
}
```

You definately find there's a `@ForActivity` above the `ActivityComponent`. Dagger need you to set a scope to define the lifecycle for any component. Activity cannot be the singleton. So we define a scrope annotation called 'ForActivity'.

```kotlin
@Qualifier
@Retention(value = AnnotationRetention.RUNTIME)
@Scope
annotation class ForActivity
```

### Use activity component in your code

Create a base class called `DaggerActivity`

```kotlin
abstract class DaggerActivity : AppCompatActivity() {
    var component: ActivityComponent? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val app = application as App
        component = DaggerActivityComponent.builder()
                .activityModule(ActivityModule(this))
                .appComponent(app.component)
                .build()
        onInject()
    }

    abstract fun onInject()

    override fun onDestroy() {
        component = null
        super.onDestroy()
    }
}
```
Update your `MainActivity` to extends `DaggerActivity`

```kotlin
class MainActivity : DaggerActivity() {
    @Inject lateinit var apiService: ApiService
    @Inject lateinit var cm: ConnectivityManager
    @Inject lateinit var progressDialog: ProgressDialog

    private val subscriptions = CompositeSubscription()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val binding = DataBindingUtil.setContentView<ActivityMainBinding>(this, R.layout.activity_main)
        binding.greating = "Hello Kotlin Data Binding!!!"

        val toolbar = findViewById(R.id.toolbar) as Toolbar
        setSupportActionBar(toolbar)

        Logger.d(cm)
    }

    override fun onInject() {
        component?.inject(this) // must call this
    }


    override fun onResume() {
        super.onResume()
        progressDialog.show()
    }

    override fun onStart() {
        super.onStart()
        subscriptions.add(apiService.ip().subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe({
                    ip ->
                    Logger.d("get result $ip")
                    progressDialog.hide()
                }) { error ->
                    Logger.e(error, "Aha.. got error message")
                    progressDialog.hide()
                })
    }

    override fun onStop() {
        super.onStop()
        subscriptions.clear()
    }

}

```

Run code from you IDE, you will see the fowlloing error 

```txt
Error:mingsin.androidkotlinexample.data.ApiService cannot be provided without an @Provides-annotated method.
Error:mingsin.androidkotlinexample.data.ApiService cannot be provided without an @Provides- or @Produces-annotated method.
Error:android.net.ConnectivityManager cannot be provided without an @Inject constructor or from an @Provides- or @Produces-annotated method.
```
Because `ConnectivityManager ` and `ApiService ` are provided in you app component, So we must tell the dagger that we provide the two instance.
Update your `AppComponent` code as following:

```kotlin
@Singleton
@Component(
        modules = arrayOf(AppModule::class)
)
interface AppComponent {
    fun inject(app: App)

    fun connectivity(): ConnectivityManager
    fun api(): ApiService
}
```

Now you have complete a project integrated with dagger2. You can chekcout the whole project from [here](https://github.com/trevorwang/android-kotlin-example/tree/kotlin-dagger)