<script type="text/javascript">
			var terms = [
			"To keep it short and sweet, some people call me \"Q.\"",
			"I'm a compassionate, curiosity-driven mentor with a thirst for stories.",
			"Factoid #4080: I had an exciting career in the music industry.",
			"🍕 My favorite pizza spot in Soho, NYC is Pomodoro on Spring.",
			"🐱 I've had two cats in my life: Whisky and Biladi",
			"When I find myself in a moment of truth, the hairs on my arms stand up.",
			"🏂 I seriously injured my AC Joint in a 2005 snowboarding accident.",
			"I am working on opening a public basketball gym in Amsterdam by 2021.",
			"I eat meat, fish, and veggies. Official label: Hungry™.",
			"🔥 I prefer to cook with a gas powered range instead of electric.",
			"After high school, I planned on becoming a biomedical engineer.",
			"🤓 My next career will somehow be connected to Astronomy and Cosmology.",
			"What do I like more than cooking Sunday brunch at home? Eating it.",
			"🇳🇱 I currently live in the most densely populated country in Europe.",
			"🚑 I once suffered second degree burns in a hotel fire.",
			"🤓 Astronomy and Cosmology are my preferred cocktail party convo subjects.",
			"Many people say that Shaka King and I are doppelgängers. I can see it.",
			"I embrace borderless, empathy-powered user experience design.",
			"Within the next 10 years I hope to speak in front of an audience of 5,0000.",
			"I hope to continuously be responsible for the success of other people."
			];

			function rotateTerm() {
			  var ct = $("#rotate").data("term") || 0;
			  $("#rotate").data("term", ct == terms.length -1 ? 0 : ct + 1).text(terms[ct]).fadeIn()
			              .delay(4500).fadeOut(200, rotateTerm);
			}
			$(rotateTerm);
		</script>