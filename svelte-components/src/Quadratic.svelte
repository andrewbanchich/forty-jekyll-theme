<script>
	var isSquare = function (n) {
		return Math.sqrt(n) === Math.round(Math.sqrt(n));
	};

	var simplify = function (numOne, numTwo) {
		let sign =
			(numOne < 0 && numTwo > 0) || (numOne >= 0 && numTwo < 0)
				? "-"
				: "";
		var num1 = Math.abs(numOne),
			num2 = Math.abs(numTwo);

		for (var i = Math.max(numOne, numTwo); i > 1; i--) {
			if (num1 % i == 0 && num2 % i == 0) {
				num1 = num1 / i;
				num2 = num2 / i;
				if (num2 == 1) {
					return `${sign}${num1}`;
				} else {
					return `${sign}${num1}/${num2}`;
				}
			}
		}
	};

	var simpleSurd = function (num) {
		let complex = num < 0 ? "i" : "";
		var surd = Math.abs(num),
			factor = 1;

		for (var i = Math.floor(Math.sqrt(surd)); i > 1; i--) {
			if (surd % (i * i) == 0) {
				surd = surd / (i * i);
				factor = factor * i;
			}
		}
		if (factor == 1) {
			return `${complex}√${surd}`;
		} else {
			return `${factor}${complex}√${surd}`;
		}
	};
	var squareRoot = function (num) {
		var ans = 0;
		var modulus = Math.abs(num);
		if (isSquare(modulus) && modulus === num) {
			ans = Math.sqrt(num);
			return ans;
		} else if (isSquare(modulus) && modulus !== num) {
			ans = Math.sqrt(Math.abs(num));
			return `${ans}i`;
		} else {
			ans = simpleSurd(num);
			return ans;
		}
	};

	let x = "";
	let y = "";

	let A = "";
	let B = "";
	let C = "";
	let D = 0;

	let a = "";
	let b = "";
	let c = "";

	let count = 0;

	function handleClick() {
		count += 1;

		A = parseFloat(a);
		B = parseFloat(b);
		C = parseFloat(c);

		D = B * B - 4 * A * C;

		if (D < 0) {
			alert(
				`This quadratic doesn't have any real solutions! Check you've entered your coefficients correctly!`
			);
		}
		x = (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A);
		y = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
	}
</script>

<div class="inner">
	<section>
		<h1>
			<span class="formula">
				{A || "a"}x<sup>2</sup>+{B || "b"}x+{C || "c"}
			</span>=0
		</h1>

		<div class="field">
			<label for="coef-a">Coefficient a</label>
			<input
				name="coef-a"
				type="text"
				bind:value={a}
				placeholder="enter coefficient a"
			/>
		</div>
		<div class="field">
			<label for="coef-b">Coefficient b</label>
			<input
				name="coef-b"
				type="text"
				bind:value={b}
				placeholder="enter coefficient b"
			/>
		</div>

		<div class="field">
			<label for="coef-c">Coefficient c</label>
			<input
				name="coef-c"
				type="text"
				bind:value={c}
				placeholder="enter coefficient c"
			/>
		</div>

		<button on:click={handleClick}> Calc.ulate </button>
	</section>
	<section class="split">
		<h4>
			{count}
			{count === 1 ? "quadratic" : "quadratics"} calc.ulated!
		</h4>

		{#if D >= 0}
			<p>Root 1 = {x || "?"} <br /> Root 2 = {y || "?"}</p>

			{#if count > 0}
				<h4>Quadratic Formula Method -</h4>
				<p>
					From <span class="formula">
						{A || "a"}x<sup>2</sup>+{B || "b"}x+{C || "c"}
					</span>
					we note that a = {A}, b= {B} and c = {C}!
				</p>
				<p>Now we can substitute this into the quadratic formula</p>
				<p>
					(-b<span>&#177;</span><span>&#8730;</span>(b<sup>2</sup
					>-4ac))/2a
				</p>
				<p>
					(-{B}<span>&#177;</span><span>&#8730;</span>({B}<sup>2</sup
					>-4<span>&#215;</span>{A}<span>&#215;</span>{C}))/(2<span
						>&#215;</span
					>{A})
				</p>
				<p>
					(-{B}<span>&#177;</span><span>&#8730;</span>({B * B}-{4 *
						A *
						C}))/{A * 2}
				</p>
				<p>
					(-{B}<span>&#177;</span><span>&#8730;</span>{D})/{A * 2}
				</p>
				{#if isSquare(D)}
					<p>
						(-{B}<span>&#177;</span>{Math.sqrt(D)})/{A * 2}
					</p>
					<p>
						{-B + Math.sqrt(D)}/{A * 2} and {-B - Math.sqrt(D)}/{A *
							2}
					</p>
					<p>
						{simplify(-B + Math.sqrt(D), A * 2)} and {simplify(
							-B - Math.sqrt(D),
							A * 2
						)}
					</p>
					<p>
						giving us the roots {x} and {y}!
					</p>
				{:else}
					<p>
						(-{B}+<span>&#8730;</span>{D})/{A * 2} and (-{B}-<span
							>&#8730;</span
						>{D})/{A * 2}
					</p>
					<p>
						(-{B}+{squareRoot(D)})/{A * 2} and (-{B}-{squareRoot(
							D
						)})/{A * 2}
					</p>
					<p>
						which evaluate to give us the approx. roots {x} and {y}
					</p>
				{/if}
			{/if}
		{:else}
			<p>
				This quadratic doesn't have any real solutions! Check you've
				entered your coefficients correctly! Compatibility with complex
				numbers is a feature calc.ulator.world is working on so check
				back again soon for updates!
			</p>
		{/if}
	</section>
</div>
1