---
layout: post
title: "First Look Into Basic Data Structures - Dictionary"
subtitle: ""
date:  2017-02-14 19:35
author:  "M.Utku"
excerpt_separator: <!--end-of-excerpt-->
published: true
tags: 
  - Python
  - Data Structures
  - Dictionaries
---

<h3>
I've been recently working on Python 3.In this blog post I'm posting my learning progress on Python with projects.

    <h2>"It's Dangerous to Go Alone! Take This "</h2>
* In this project, I'm try to write a backpack code to order a backpack in game.

    <h2>What I've Learned:</h2>
* A dictionary is similar to a list, but you access values by looking up a key instead of an index. A key can be any string or number. Dictionaries are enclosed in curly braces.
<!--end-of-excerpt-->
* Like Lists, Dictionaries are "mutable". This means they can be changed after they are created. One advantage of this is that we can add new key/value pairs to the dictionary after it is created.
* An empty pair of curly braces <pre>{}</pre> is an empty dictionary, just like an empty pair of <pre>[]</pre> is an empty list.
* The length <pre>len()</pre> of a dictionary is the number of key-value pairs it has. Each pair counts only once, even if the value is a list.
* Because dictionaries are mutable, they can be changed in many ways. Items can be removed from a dictionary with the <pre>del</pre> command: will remove the key <pre>key_name</pre> and its 
associated value from the dictionary.
* A new value can be associated with a key by assigning a value to the key.

{% gist fa624d48fb55228cd41b70fa0a27a806 %}

    <h2>A Day at Supermarket:</h2>
*In this project, I'm write a market register code.

    <h2>What I've Learned:</h2>
* Dictionaries are unordered, meaning that any time you loop through a dictionary, you will go through every key, but you are not guaranteed to get them in any particular order.

* Strings are like lists with characters as elements. You can loop through strings the same way you loop through lists!
    
    <h2>What I've Practiced:</h2>
* Using <pre>for</pre> loops with lists and dictionaries.
* Writing functions with loops, lists, and dictionaries.
* Updating data in response to changes in the environment (for instance, decreasing the number of bananas in <pre>stock</pre> by 1 when you sell one).

#Thanks for shopping at the Massive supermarket!

{% gist dc643ee0f6a9d64b23e10d068ab95a4b %}
</h3>
