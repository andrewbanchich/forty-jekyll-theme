---
layout: post
title: News and Announcements
description:  
image: assets/images/pluto.jpg
image-show: false
nav-menu: true
---

<!-- Main -->
<!--<div id="main" class="alt">-->

  <!-- One -->
  <section id="one">
  <a style="border-bottom-color: transparent;" href="{{ site.url }}/feed.xml"><i class="fa fa-rss" aria-hidden="true"></i></a>
  <div class="inner">

  <table>
  {% for post in site.posts %}
  {% if post.title != 404 %}
  <!--<ul>
  <header>-->
  <tr>
    <td style="width:20%"><span>{{ post.date | date_to_long_string }}</span></td>
    <td><a href="{{ post.url | relative_url }}">{{ post.title }}</a><br /><span style="font-size:80%;"><em>{{ post.description }}</em></span></td>
  </tr>

  <!--<li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
  </header>-->
  <!--{% if post.image %}<span class="image main"><img src="{{ site.baseurl }}/{{ post.image }}" alt="" /></span>{% endif %}-->
  <!--{% if post.date %}<p>{{ post.date }}</p>{% endif %}-->
  <!--<p>{{ post.content }}</p>-->
  {% endif %}
  {% endfor %}
  <!--</ul>-->
  </table>

  </div>
  </section>

<!--</div>-->
