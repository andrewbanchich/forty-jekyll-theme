<script>
    // Utility Functions
    var isSquare = function (n) {
        return Math.sqrt(n) === Math.round(Math.sqrt(n));
    };

    var simpleFraction = function (numOne, numTwo) {
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
                    return {
                           fraction: `${sign}${num1}`,
                           num1: `${num1}`,
													 num2: ``,
                        	 sign: `${sign}`
											};
                }else {
                    return {
                     				fraction: `${sign}${num1}/${num2}`,
                            num1: `${num1}`,
														num2: `/${num2}`,
                            sign: `${sign}`,
										};
                }
            }
        }
        if (num1 == Math.abs(numOne) && num2 == Math.abs(numTwo)) {
            return {
								fraction: `${sign}${num1}/${num2}`,
                num1: `${num1}`,
                num2: `/${num2}`,
                sign: `${sign}`,
                };
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
            return {
                    fullSurd: `${complex}√${surd}`,
                    factor: `${factor}`,
              			complex: `${complex}`,
                		surd: `√${surd}`,
						};
        } else {
            return {
                    fullSurd: `${factor}${complex}√${surd}`,
                		factor: `${factor}`,
                		complex: `${complex}`,
										surd: `√${surd}`
                };
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
            ans = simpleSurd(num).fullSurd;
            return ans;
        }
    };

    // Quadratic Calc functions
    var calculationParts = function (a, b, c) {
        let A = parseFloat(a);
        let B = parseFloat(b);
        let C = parseFloat(c);
        let D = B * B - 4 * A * C;
        let isComplex = D < 0;
        let modD = Math.abs(D);
        let minusB = -1 * B;
        let twoA = 2 * A;
        let sqrtD = squareRoot(D);
        let sqrtModD = squareRoot(modD);
        let SObject = simpleSurd(D);

        return {
            a,
            b,
            c,
            A,
            B,
            C,
            D,
            isComplex,
            modD,
            minusB,
            twoA,
            sqrtD,
            sqrtModD,
            SObject,
            isSqr: function() { 
                return isSquare(this.D) 
            },
            isComplexSqr: function(){ 
                return this.isComplex && isSquare(this.modD);
            }
        };
    };

    var initialSteps = function (calcParts) {
        // extract the calculation parts we need
        let { A, B, C, D, minusB, twoA } = calcParts;

        return [
            {
                comment: `We start off by noting the quadratic formula`,
                formula: `(-b\xB1√(b\u00B2-4ac))/2a`,
            },
            {
                comment: `In this case we note that a=${A}, b=${B} and c=${C} which we can simply substitute in giving`,
                formula: `(${minusB}\xB1√(${B}\u00B2-4\u00D7${A}\u00D7${C}))/(2√${A})`,
            },
            {
                comment: `Simplifying the denominator and discriminant gives`,
                formula: `(${minusB}\xB1√${D})/${twoA}`,
            },
        ];
    };

    var squareSteps = function (calcData) {
        let { minusB, twoA, D, sqrtD } = calcData;
        let numeratorA = minusB + sqrtD;
        let numeratorB = minusB - sqrtD;
        return [
            {
                comment: `${D} is a perfect square which we can square root to give ${calcData.sqrtD}`,
                formula: `(${minusB}\xB1${sqrtD})/${twoA}`,
            },
            {
                comment: `This can be split to give the following two cases`,
                formula: `${numeratorA}/${twoA} and ${numeratorB}/${twoA}`,
            },
            {
                comment: `This simplifies to give a final answer of`,
                formula: `${simpleFraction(numeratorA, twoA).fraction} and ${
                    simpleFraction(numeratorB, twoA).fraction
                }`,
            },
        ];
    };

    var complexSquareSteps = function (calcData) {
        let { minusB, twoA, sqrtModD, D, sqrtD } = calcData;
        let component1 = simpleFraction(minusB, twoA).fraction;
        let component2 = simpleFraction(sqrtModD, twoA).fraction;

        return [
            {
                comment: `because ${D} is negative, its square root must be imaginary and is therefore given by ${sqrtD}`,
                formula: `(${minusB}\xB1${sqrtD})/${twoA}`,
            },
            {
                comment: `This can be split to give the following two cases`,
                formula: `${minusB}/${twoA}+${sqrtD}/${twoA} and ${minusB}/${twoA}-${sqrtD}/${twoA}`,
            },
            {
                comment: `This simplifies to give a final answer of`,
                formula: `${component1}+${component2}i and ${component1}-${component2}i`,
            },
        ];
    };

    var step4NonSquare = function (calcData) {
        let { minusB, twoA, sqrtModD, modD, D, sqrtD, SObject } = calcData;

        var comment;
        if (calcData.isComplex && SObject.factor != "1") {
            comment = `${D} is negative so its square root must be imaginary and is therefore it is given by ${sqrtD} (where √${modD}=${sqrtModD})`;
        }else if (calcData.isComplex && SObject.factor == "1"){
            comment = `${D} is negative so its square root must be imaginary and is therefore it is given by ${sqrtD}`;
        }else if (SObject.factor == "1") {
            comment = `The square root of ${D} can't be simplified any further`;
        } else {
            comment = `The square root of ${D} simplifies to give ${sqrtD}`;
        }

        let formula = `(${minusB}\xB1${sqrtD})/${twoA}`;

        return { formula, comment };
    };

    var step5NonSquare = function (calcData) {
        let { minusB, twoA, sqrtD } = calcData;
        return {
            comment: `This can be split to give the following two cases`,
            formula: `${minusB}/${twoA}+${sqrtD}/${twoA} and ${minusB}/${twoA}-${sqrtD}/${twoA}`,
        };
    };

    var step6NonSquare = function (calcData) {
        let { minusB, twoA, SObject } = calcData;

        var component1 = simpleFraction(minusB, twoA).fraction;
      	
			let result = simpleFraction(SObject.factor, twoA);  
			
			if (result.num1 == 1 && result.num2 == 1){
				var component2 = `${SObject.complex}${SObject.surd}`;
			}else if (result.num1 == 1 && result.num2 != 1){
				var component2 = `${SObject.complex}${SObject.surd}${result.num2}`;
			}else if (result.num1 != 1 && result.num2 == 1) {
				var component2 = `${result.num1}${SObject.complex}${SObject.surd}`;
			}else if (result.num1 != 1 && result.num2 != 1) {
				var component2 = `${result.num1}${SObject.complex}${SObject.surd}${result.num2}`;
			}
			return {
            comment: `This simplifies to give a final answer of`,
            formula: `${component1}+${component2} and ${component1}-${component2}`,
        };
    };

    function calculate(useComplexNumbers) {
        var calcData = calculationParts(a, b, c);
				if (isNaN(parseInt(a)) || isNaN(parseInt(b)) || isNaN(parseInt(c))){
					
					 let A = "";
    			 let B = "";
   				 let C = "";
					 showStep1 = false;
					 steps = [
                {
                    comment: "Oops something went wrong!",
                    formula: "Try inputting integer coefficients instead!",
                },
            ];
					return {};
				}
        
        count += 1;

        // Set the vars for displaying the formula
        A = calcData.A;
        B = calcData.B;
        C = calcData.C;
				showStep1 = true;

        if (calcData.isComplex && !useComplexNumbers) {
            steps = [
                {
                    comment: "There is no real answer!",
                    formula: "have your tried our complex numbers flavour?",
                },
            ];
						showStep1 = false;
						count -= 1;
        } else if (calcData.isSqr()) {
            steps = [...initialSteps(calcData), ...squareSteps(calcData)];
        } else if (calcData.isComplexSqr()) {
            steps = [
                ...initialSteps(calcData),
                ...complexSquareSteps(calcData),
            ];
        } else {
            steps = [
                ...initialSteps(calcData),
                step4NonSquare(calcData),
                step5NonSquare(calcData),
                step6NonSquare(calcData),
            ];
        }
    }

    // Variables
    let compWithComplex = false;

    let A = "";
    let B = "";
    let C = "";

    let a = "";
    let b = "";
    let c = "";
		let showStep1 = "";

    let steps = [];

    let count = 0;
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

        <div class="6u$ 12u$(small)">
			<input 
                type="checkbox" 
                id="comp-complex" 
                name="comp-complex" 
                bind:checked={compWithComplex}
                on:click={() => calculate(!compWithComplex)}
                >
			<label for="comp-complex">include complex solutions</label>
		</div>

        <button on:click={() => calculate(compWithComplex)}>
            Calc.ulate
			</button>

        {#if compWithComplex}
            <p>
                <br>Currently this quadratic calc.ulator is set to solve quadratics with
                both real and complex solutions.
            </p>
        {:else}
            <p>
                <br>Currently this quadratic calc.ulator is only set to solve quadratics
                with real solutions.
            </p>
        {/if}
    
    </section>


    <section class="split">
        <h4>
            {count}
            {count === 1 ? "quadratic" : "quadratics"} calc.ulated!
        </h4>


            {#each steps as step, i}
                        <div class="step">
                                {#if showStep1}
                            <h6>Step {i + 1}</h6>
                                {/if}
                        <span class="comment">{step.comment}</span><br />
                        <span class="formula">{step.formula}</span><br />
                        </div>
            {/each}

    </section>
</div>
