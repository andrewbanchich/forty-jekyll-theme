---
layout: post
title: Newsletters
description:  
image: assets/images/mercury.jpg
image-show: false
nav-menu: true
---

<!-- Main -->
<div id="main" class="alt">

  <!-- One -->
  <section id="one">
<div class="inner">
      <ul>
      {% for post in site.posts %}
{% if post.title != 404 %}
<header>
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
</header>
<!--{% if post.image %}<span class="image main"><img src="{{ site.baseurl }}/{{ post.image }}" alt="" /></span>{% endif %}-->
<!--{% if post.date %}<p>{{ post.date }}</p>{% endif %}-->
<!--<p>{{ post.content }}</p>-->
{% endif %}
      {% endfor %}
      </ul>
</div>
  </section>

</div>
