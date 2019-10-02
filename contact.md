---
layout: page
title: Contact us
nav-menu: false
show_tile: true
---
<!-- Contact -->
<section id="contact">
	<div class="inner">
		<section>
			<form action="https://formspree.io/{{ site.email }}" method="POST">
				<div class="field half first">
					<label for="name">Name</label>
					<input type="text" name="name" id="name" />
				</div>
				<div class="field half">
					<label for="email">Email</label>
					<input type="text" name="_replyto" id="email" />
				</div>
				<div class="field">
					<label for="message">Message</label>
					<textarea name="message" id="message" rows="6"></textarea>
				</div>
				<ul class="actions">
					<li><input type="submit" value="Send Message" class="special" /></li>
					<li><input type="reset" value="Clear" /></li>
				</ul>
			</form>
		</section>
		<section class="split">
			<section>
				<div class="contact-method">
					<span class="icon fa-envelope"></span>
					<h3>Email</h3>
					<a href="#">{{ site.email }}</a>
				</div>
			</section>
			<section>
				<div class="contact-method">
					<span class="icon fa-phone"></span>
					<h3>Phone</h3>
					<span>{{ site.phone }}</span>
				</div>
			</section>
			<section>
				<div class="contact-method">
					<span class="icon fa-home"></span>
					<h3>Address</h3>
					<span>
					{% if site.street_address %}
					    {{ site.street_address }}<br />
					{% endif %}
					{% if site.city %}
					    {{ site.city }},
					{% endif %}
					{% if site.state %}
					    {{ site.state }} 
					{% endif %}
					{% if site.zip_code %}
					    {{ site.zip_code }}<br />
					{% endif %}
					{% if site.country %}
					    {{ site.country }}
					{% endif %}
					</span>
				</div>
			</section>
		</section>
	</div>
</section>
