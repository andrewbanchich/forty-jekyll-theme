---
title: Projects
layout: landing
description: 'Companies and project I have worked with'
image: assets/images/pexels-photo-574069.jpeg
nav-menu: true
---

<!-- Main -->
<div id="main">

<!-- One -->
<!-- <section id="one">
	<div class="inner">
		<header class="major">
			<h2>Sed amet aliquam</h2>
		</header>
		<p>Nullam et orci eu lorem consequat tincidunt vivamus et sagittis magna sed nunc rhoncus condimentum sem. In efficitur ligula tate urna. Maecenas massa vel lacinia pellentesque lorem ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis libero. Nullam et orci eu lorem consequat tincidunt vivamus et sagittis magna sed nunc rhoncus condimentum sem. In efficitur ligula tate urna.</p>
	</div>
</section> -->

<!-- Two -->
<section id="two" class="spotlights">
	{% for project_id in site.data.projects["_index"] %}
	{% assign project = site.data.projects[project_id] %} 

	<section>
		<a href="https://play.google.com/store/apps/details?id=de.penny.app" class="image" 
			onclick="ga('send', 'event', {
				'eventCategory': 'Project Links',
				'eventAction': 'open_{{ project.tracking.event }}_image',
				'eventLabel': 'Image'
			});">
			<img src="{{ project.image }}" alt="" data-position="center center" />
		</a>
		<div class="content">
			<div class="inner">
				<header class="major">
					<h3>{{ project.title }}</h3>
				</header>
				<p>{{ project.description }}</p>
				<ul class="actions">
					<li>
					<a href="{{ project.outbound.url }}" target="_blank" class="button" onclick="ga('send', 'event', {
						'eventCategory': 'Project Links',
  						'eventAction': 'open_{{ project.tracking.event }}_link',
						'eventLabel': '{{ project.outbound.title }}'
					});">{{ project.outbound.title }}</a>
					</li>
				</ul>
			</div>
		</div>
	</section>
	{% endfor %}
</section>

<!-- Three -->
<section id="three">
	<div class="inner">
		<header class="major">
			<h2>Massa libero</h2>
		</header>
		<p>Nullam et orci eu lorem consequat tincidunt vivamus et sagittis libero. Mauris aliquet magna magna sed nunc rhoncus pharetra. Pellentesque condimentum sem. In efficitur ligula tate urna. Maecenas laoreet massa vel lacinia pellentesque lorem ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis libero. Mauris aliquet magna magna sed nunc rhoncus amet pharetra et feugiat tempus.</p>
		<ul class="actions">
			<li><a href="generic.html" class="button next">Get Started</a></li>
		</ul>
	</div>
</section>

</div>
