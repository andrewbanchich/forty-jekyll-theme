---
layout: post
title: Kotlin Null Safety
description: How to eliminate null pointer exception in Kotlin?
image: assets/images/pic-kotlin.png
---


# Kotlin Null Safety

> Kotlin's type system is aimed to eliminate `NullPointerException`'s from our code. The only possible causes of NPE's may be

> 1. An explicit call to throw `NullPointerException()`
> 2. Usage of the `!!` operator that is described below
> 3. External Java code has caused it
> 4. There's some data inconsistency with regard to initialization (an uninitialized `this` available in a constructor is used somewhere)

### Variables
As mentioned above, there're the only 4 ways to cause a NPE. And there're nullable and non-nullable types in Kotlin's System. So when you define a variable, you must tell Kotlin whether the variable is nullable or not.

1. Non-nullable variable
    You can define non-nullable variables as following:
    
    ```kotlin
        var b:String = "abc"
        var a:Int = 10
    ```
    Once you want to assign a `null` to a non-nullable variable,
    
    ```kotlin
        b = null
        a = null
    ```
    the compiler will throw you an error. The Kotlin system prevent nullable value in the compile stage.

2. Nullable variable
    If you want to define a variable which can be set as `null`, please code as following. 
    
    ```kotlin
        var b:String? = "abc"
        var a:Int? = 10
    ```
    Now both of them can be set as `null`
    
    ```kotlin
        b = null    // ok
        a = null    // ok
    ```

### Nullable check
The Kotlin system will tell you an error if you want to call a method from a nullable variable.

```kotlin
    b.length.  // compile error
```
You must check `b` whether it is null or not.

```kotlin
    if (b != null) {
        b.length
    }
```
It's a Java style way, is there a new method to handle this in Kotlin. Absolutely, yes. There's a new and safe operator, `?.`, to be used in this state.

```kotlin
    val a = b?.length
``` 
It's safe and never throws the `NullPointerException`. It will return a `null` for  this invocation and never really call the `length` method. Isn't a easy way to handle nullable variable?

> If you want the Java's style to handle exception, just use `!!`.
> 
> ```kotlin
>   val a = b!!.length
> ```
> The above code may throws a `NullPointerException` during the runtime.


There's also another example from kotlin's official site:
>Safe calls are useful in chains. For example, if Bob, an Employee, may be assigned to a Department (or not), that in turn may have another Employee as a department head, then to obtain the name of Bob's department head (if any), we write the following:
>
>```kotlin
>bob?.department?.head?.name
>```
>Such a chain returns a `null` if any of the properties in it is null.

To perform a certain operation only for non-null values, you can use the safe call operator together with `let`:

```kotlin
val listWithNulls: List<String?> = listOf("A", null)
for (item in listWithNulls) {
     item?.let { println(it) } // prints A and ignores null
}
```
### Elvis Operator (`?:`)

You definitely meet the following issue: return the string's length if non-null and just return `-1` when it's `null`

```kotlin
    val l: Int = if (b != null) b.length else -1
```

Now there's new operator.

```kotlin
    val l = b?.length ?: -1
```
or 

```kotlin
    bob?.department?.head?.name ?: "No Name"
```

If the expression to the left of `?:` is not null, the elvis operator returns it, otherwise it returns the expression to the right. Note that the right-hand side expression is evaluated only if the left-hand side is null.

***Note that, since throw and return are expressions in Kotlin, they can also be used on the right hand side of the elvis operator. This can be very handy, for example, for checking function arguments:***

```kotlin
fun foo(node: Node): String? {
    val parent = node.getParent() ?: return null
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

### safe cast
Regular casts may result into a ClassCastException if the object is not of the target type. Another option is to use safe casts that return null if the attempt was not successful:

```kotlin
val a = Animal()
val dog: Dog? = a as? Dog
```
### Collections of Nullable Type
If you have a collection of elements of a nullable type and want to filter non-null elements, you can do so by using filterNotNull.

```kotlin
val nullableList: List<Int?> = listOf(1, 2, null, 4)
val intList: List<Int> = nullableList.filterNotNull()
```


