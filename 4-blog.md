---
title: Blog
layout: landing
description: 'Thoughts and rambles'
image: assets/images/typewriter.jpg
nav-menu: true
---
<!-- Main -->
<div id="main" class="alt">

<!-- One -->
<section id="one">
	<div class="inner">
		<header class="major">
			<h1>Blog</h1>
		</header>

<!-- Content -->
<h3 id="content">
You can find all of my blog posts <a href="https://medium.com/me/stories/public" style="text-decoration: underline;">HERE</a>. Below is my very first post, which I wrote while working on one of my last projects at Turing - creating a Electron app using the Ember framework and npm Filebin.
</h3>

<h2>Ember, Electron and FileBin: Terra Incognita 101</h2>
<p>On Monday, in typical Turing School fashion, Matt Stjernholm and I set out to build a note-taking app (BetterNotes) with Ember, Electron and FileBin without any prior experience with any of them. So let’s first get familiar with what these things are before we put them to use.</p>

<h3>EmberJS</h3>

<p>Ember is a pretty awesome JavaScript framework for “creating ambitious web applications.” It’s somewhat similar to Rails in that it’s based on the MVC structure, opinionated, was created in-part by Yehuda Katz, and does a whole lot for you right out of the box, including Handlebars, Components and Computed Properties. Ember’s Handlebars allow you to use templates that automatically update your HTML when the model changes. Components allow you to create app-specific HTML tags and tell them how to behave with JavaScript. Computed Properties let you declare functions as properties by caching the result of those functions.
Ember is supposedly MVC and controllers seem to operate similarly to controllers in Rails, handing properties and application state to the templates. However, models are actually fetched from the router rather than the controller. Interestingly enough, according to the Ember docs “controllers will be replaced entirely with components.”
One difficult thing about working with Ember is getting used to the file name structure. For example, when building a note-taking app you end up with a lot of files that end in note.js, notes.js, note.hbs and notes.hbs which can slow you down a bit.
Visit the docs learn more about Ember.</p>

<h3>Electron</h3>

<p>Electron is a framework for building cross-platform desktop applications using web technologies(HTML, CSS, JavaScript). Thankfully it will also allow us to bundle Chromium into the application so we don’t have to worry about it being used with IE6 or an old version of Safari. You’ve quite possibly used an Electron app before without knowing it. Atom, Slack and Avocode are all Electron apps. After building web apps for the last 6 months, the idea of having an app you’ve made hanging out in your dock, accessing your file system, and maybe eventually available on the App Store is pretty exciting. Like Ember, Electron is powerful and allows you to get your app off the ground pretty quickly.
One main point to understand about Electron is the idea of the main process and the renderer processes. The main process lives in one .js file, set in your package.JSON, that does all of the communicating and interacting with the OS and reading/writing to the file system. The (many) renderer processes are actually putting the html and css on the screen. require(‘remote’) allows these two processes to communicate.
Check out the Electron docs to learn more.</p>

<h3>FileBin</h3>

<p>FileBin is ‘an abstraction for accessing the filesystem in Node.js.’ Since Ember Data was designed to work with APIs and not the filesystem, FileBin is a way to do just that. Through this project I was able to contribute to the FileBin library which was also a first for me.
Visit NPM.js for information on using and contributing to this library.</p>

<h3>Building Our App</h3>

<p>So, we’re using Ember to organize, manipulate and style our app, Electron to put it on the desktop and FileBin to allow our app/Ember Data to use the filesystem.
Right off the bat you might notice what I consider the most difficult part about this project — where should we hand off a process from one framework to another? The best example of this issue, which we haven’t fully resolved, came up when we attempted to implement a feature that would allow you to change the file directory you are working with. Out of the gate the app was setup to work with a specific directory but we figured you should be able to choose other files or folders to work from rather than copy/pasting.
It was pretty easy to decide that rendering the “Open” button on the page and firing the initial action would be Ember’s job, but we quickly ran into the issue of how and when do we pass the necessary arguments back and forth between Ember, Electron and FileBin. We had already built out a custom adapter (since our Ember app is working with the filesystem and not an API as it more often would), so our first thought was to fire our action up the chain from our Ember template, through its controller to the adapter where we had access to Electron’s main process. To get there we eventually figured out that we needed Ember’s .adapterFor function to get from our controller to our adapter. And once we got to the adapter, we realized we didn’t have all the access to Electron that we expected or, maybe more accurately, hoped for.
We could either try to pass parameters to our main process or give our adapter more access to the main process. Both seemed a bit messy and we initially tried to write our .showOpenDialog() (an Electron function for opening a file dialog window) functions in the electron main process as we’d seen before. That became problematic when trying to return something we could work with back to our adapter and so forth.
Next we attempted to simply export more of what we needed from electron to our Ember adapter, which turned out to be harder than we anticipated. Once we’d figured out all of the exports, requires and const’s we needed we found ourselves in the most frustrating spot yet. So close, yet so far. In our Ember notes controller we had both the new directory we were getting back from our Electron dialog and access to Ember’s .transitionTo() function that would allow us to re-render our ‘notes’ which could now be the contents of our selected directory. But our setter function that actually makes the directory change isn’t then-able and we just haven’t figured out how to make Ember wait for the directory to be changed before re-rendering our new directory of notes. Our next thought was to add a promise somewhere, but weren’t able to figure out where/when. Currently, you can in fact change the directory but you don’t see your updated list of notes until you refresh the app.
Reflections
In hindsight, this project was ambitious. For the first day and a half we were simply trying to make sense of Ember and Electron by themselves. In the end, I feel like we learned a lot of both of them, but didn’t really show either of them the respect they deserve. I think this project could be successful with these languages because it’s well on its way. Electron is the obvious choice for getting this app on the desktop, but for me it’s still way too early to tell if Ember is the best framework to compliment Electron. I feel like we would have run into similar problems with another framework like Angular or React, but until we try those I can’t reasonably say they’d be any better or worse. I will say that while Ember seems approachable and makes sense at a high level, once I got my feet wet the learning curve definitely felt steeper than expected.
Checkout our repo here if you want to take a look at our code or help us connect some of the missing dots.</p>
