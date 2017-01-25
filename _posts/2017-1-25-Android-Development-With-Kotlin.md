---
layout: post
title: Dancing with Kotlin
description: Develop Android application with kotlin
image: assets/images/pic12.jpg
---



### What's Kotlin?
Statically typed programming language for the JVM, Android and the browser. ***100% interoperable with Java™***



### Why Kotlin?

* **Concise**  
  Drastically reduce the amount of boilerplate code you need to write.
* **Safe**  
  Avoid entire classes of errors such as null pointer exceptions.
* **Versatile**  
  Build server-side applications, Android apps or frontend code running in the browser.
* **Interoperable**   
  Leverage existing frameworks and libraries of the JVM with 100% Java Interoperability.
* **Tooling**   
  Command Line Compiler or First Class IDE Support. Freedom to choose.

### How to?
#### Install kotlin plugin
First, if using Android Studio, you'll need to install the Kotlin plugin. Go to File | Settings | Plugins | Install JetBrains plugin… and then search for and install Kotlin. You'll need to restart the IDE after this completes.   

![How to install plugin](/assets/images/pic-install-kotlin-plugin.png#center)

#### Creating a project
Just create an Android project from the IDE.
#### Converting Java code to Kotlin

* Setup kotlin runtime, select "Confure Kotlin in Project"  
![Setup Kotlin runtime](/assets/images/pic-configure-kotlin-sdk.png#center)
* Select All modules  
![Select modules](/assets/images/pic-select-modules.png#center)
* Convert Java file to Kotlin file  
![Convert Java File to Kotlin File](/assets/images/pic-convert-java-files-kotlin-files.png#center)
* The final code will be as following:   

```kotlin   
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val toolbar = findViewById(R.id.toolbar) as Toolbar
        setSupportActionBar(toolbar)

        val fab = findViewById(R.id.fab) as FloatingActionButton
        fab.setOnClickListener { view ->
            Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                    .setAction("Action", null).show()
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        val id = item.itemId


        if (id == R.id.action_settings) {
            return true
        }

        return super.onOptionsItemSelected(item)
    }
}
```

### You can run the application with kotlin now

