
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Quadratic.svelte generated by Svelte v3.43.1 */

    const file = "src/Quadratic.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[30] = i;
    	return child_ctx;
    }

    // (364:8) {:else}
    function create_else_block(ctx) {
    	let p;
    	let br;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			br = element("br");
    			t = text("Currently this quadratic calc.ulator is only set to solve quadratics\n                with real solutions.");
    			add_location(br, file, 365, 16, 11524);
    			add_location(p, file, 364, 12, 11504);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, br);
    			append_dev(p, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(364:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (359:8) {#if compWithComplex}
    function create_if_block_1(ctx) {
    	let p;
    	let br;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			br = element("br");
    			t = text("Currently this quadratic calc.ulator is set to solve quadratics with\n                both real and complex solutions.");
    			add_location(br, file, 360, 16, 11337);
    			add_location(p, file, 359, 12, 11317);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, br);
    			append_dev(p, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(359:8) {#if compWithComplex}",
    		ctx
    	});

    	return block;
    }

    // (383:32) {#if showStep1}
    function create_if_block(ctx) {
    	let h6;
    	let t0;
    	let t1_value = /*i*/ ctx[30] + 1 + "";
    	let t1;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			t0 = text("Step ");
    			t1 = text(t1_value);
    			add_location(h6, file, 383, 28, 11988);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    			append_dev(h6, t0);
    			append_dev(h6, t1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(383:32) {#if showStep1}",
    		ctx
    	});

    	return block;
    }

    // (381:12) {#each steps as step, i}
    function create_each_block(ctx) {
    	let div;
    	let t0;
    	let span0;
    	let t1_value = /*step*/ ctx[28].comment + "";
    	let t1;
    	let br0;
    	let t2;
    	let span1;
    	let t3_value = /*step*/ ctx[28].formula + "";
    	let t3;
    	let br1;
    	let t4;
    	let if_block = /*showStep1*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			span0 = element("span");
    			t1 = text(t1_value);
    			br0 = element("br");
    			t2 = space();
    			span1 = element("span");
    			t3 = text(t3_value);
    			br1 = element("br");
    			t4 = space();
    			attr_dev(span0, "class", "comment");
    			add_location(span0, file, 385, 24, 12072);
    			add_location(br0, file, 385, 67, 12115);
    			attr_dev(span1, "class", "formula");
    			add_location(span1, file, 386, 24, 12146);
    			add_location(br1, file, 386, 67, 12189);
    			attr_dev(div, "class", "step");
    			add_location(div, file, 381, 24, 11893);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, span0);
    			append_dev(span0, t1);
    			append_dev(div, br0);
    			append_dev(div, t2);
    			append_dev(div, span1);
    			append_dev(span1, t3);
    			append_dev(div, br1);
    			append_dev(div, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (/*showStep1*/ ctx[7]) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*steps*/ 256 && t1_value !== (t1_value = /*step*/ ctx[28].comment + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*steps*/ 256 && t3_value !== (t3_value = /*step*/ ctx[28].formula + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(381:12) {#each steps as step, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div4;
    	let section0;
    	let h1;
    	let span;
    	let t0_value = (/*A*/ ctx[1] || "a") + "";
    	let t0;
    	let t1;
    	let sup;
    	let t3;
    	let t4_value = (/*B*/ ctx[2] || "b") + "";
    	let t4;
    	let t5;
    	let t6_value = (/*C*/ ctx[3] || "c") + "";
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let div0;
    	let label0;
    	let t11;
    	let input0;
    	let t12;
    	let div1;
    	let label1;
    	let t14;
    	let input1;
    	let t15;
    	let div2;
    	let label2;
    	let t17;
    	let input2;
    	let t18;
    	let div3;
    	let input3;
    	let t19;
    	let label3;
    	let t21;
    	let button;
    	let t23;
    	let t24;
    	let section1;
    	let h4;
    	let t25;
    	let t26;
    	let t27_value = (/*count*/ ctx[9] === 1 ? "quadratic" : "quadratics") + "";
    	let t27;
    	let t28;
    	let t29;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*compWithComplex*/ ctx[0]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value = /*steps*/ ctx[8];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			section0 = element("section");
    			h1 = element("h1");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text("x");
    			sup = element("sup");
    			sup.textContent = "2";
    			t3 = text("+");
    			t4 = text(t4_value);
    			t5 = text("x+");
    			t6 = text(t6_value);
    			t7 = space();
    			t8 = text("=0");
    			t9 = space();
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Coefficient a";
    			t11 = space();
    			input0 = element("input");
    			t12 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Coefficient b";
    			t14 = space();
    			input1 = element("input");
    			t15 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Coefficient c";
    			t17 = space();
    			input2 = element("input");
    			t18 = space();
    			div3 = element("div");
    			input3 = element("input");
    			t19 = space();
    			label3 = element("label");
    			label3.textContent = "include complex solutions";
    			t21 = space();
    			button = element("button");
    			button.textContent = "Calc.ulate";
    			t23 = space();
    			if_block.c();
    			t24 = space();
    			section1 = element("section");
    			h4 = element("h4");
    			t25 = text(/*count*/ ctx[9]);
    			t26 = space();
    			t27 = text(t27_value);
    			t28 = text(" calc.ulated!");
    			t29 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(sup, file, 310, 27, 9939);
    			attr_dev(span, "class", "formula");
    			add_location(span, file, 309, 12, 9889);
    			add_location(h1, file, 308, 8, 9872);
    			attr_dev(label0, "for", "coef-a");
    			add_location(label0, file, 315, 12, 10052);
    			attr_dev(input0, "name", "coef-a");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "enter coefficient a");
    			add_location(input0, file, 316, 12, 10106);
    			attr_dev(div0, "class", "field");
    			add_location(div0, file, 314, 8, 10020);
    			attr_dev(label1, "for", "coef-b");
    			add_location(label1, file, 324, 12, 10322);
    			attr_dev(input1, "name", "coef-b");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "enter coefficient b");
    			add_location(input1, file, 325, 12, 10376);
    			attr_dev(div1, "class", "field");
    			add_location(div1, file, 323, 8, 10290);
    			attr_dev(label2, "for", "coef-c");
    			add_location(label2, file, 334, 12, 10593);
    			attr_dev(input2, "name", "coef-c");
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "placeholder", "enter coefficient c");
    			add_location(input2, file, 335, 12, 10647);
    			attr_dev(div2, "class", "field");
    			add_location(div2, file, 333, 8, 10561);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "id", "comp-complex");
    			attr_dev(input3, "name", "comp-complex");
    			add_location(input3, file, 344, 3, 10865);
    			attr_dev(label3, "for", "comp-complex");
    			add_location(label3, file, 351, 3, 11107);
    			attr_dev(div3, "class", "6u$ 12u$(small)");
    			add_location(div3, file, 343, 8, 10832);
    			add_location(button, file, 354, 8, 11185);
    			add_location(section0, file, 307, 4, 9854);
    			add_location(h4, file, 374, 8, 11723);
    			attr_dev(section1, "class", "split");
    			add_location(section1, file, 373, 4, 11691);
    			attr_dev(div4, "class", "inner");
    			add_location(div4, file, 306, 0, 9830);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, section0);
    			append_dev(section0, h1);
    			append_dev(h1, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, sup);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			append_dev(span, t5);
    			append_dev(span, t6);
    			append_dev(span, t7);
    			append_dev(h1, t8);
    			append_dev(section0, t9);
    			append_dev(section0, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t11);
    			append_dev(div0, input0);
    			set_input_value(input0, /*a*/ ctx[4]);
    			append_dev(section0, t12);
    			append_dev(section0, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t14);
    			append_dev(div1, input1);
    			set_input_value(input1, /*b*/ ctx[5]);
    			append_dev(section0, t15);
    			append_dev(section0, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t17);
    			append_dev(div2, input2);
    			set_input_value(input2, /*c*/ ctx[6]);
    			append_dev(section0, t18);
    			append_dev(section0, div3);
    			append_dev(div3, input3);
    			input3.checked = /*compWithComplex*/ ctx[0];
    			append_dev(div3, t19);
    			append_dev(div3, label3);
    			append_dev(section0, t21);
    			append_dev(section0, button);
    			append_dev(section0, t23);
    			if_block.m(section0, null);
    			append_dev(div4, t24);
    			append_dev(div4, section1);
    			append_dev(section1, h4);
    			append_dev(h4, t25);
    			append_dev(h4, t26);
    			append_dev(h4, t27);
    			append_dev(h4, t28);
    			append_dev(section1, t29);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section1, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[13]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[14]),
    					listen_dev(input3, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*A*/ 2 && t0_value !== (t0_value = (/*A*/ ctx[1] || "a") + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*B*/ 4 && t4_value !== (t4_value = (/*B*/ ctx[2] || "b") + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*C*/ 8 && t6_value !== (t6_value = (/*C*/ ctx[3] || "c") + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*a*/ 16 && input0.value !== /*a*/ ctx[4]) {
    				set_input_value(input0, /*a*/ ctx[4]);
    			}

    			if (dirty & /*b*/ 32 && input1.value !== /*b*/ ctx[5]) {
    				set_input_value(input1, /*b*/ ctx[5]);
    			}

    			if (dirty & /*c*/ 64 && input2.value !== /*c*/ ctx[6]) {
    				set_input_value(input2, /*c*/ ctx[6]);
    			}

    			if (dirty & /*compWithComplex*/ 1) {
    				input3.checked = /*compWithComplex*/ ctx[0];
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(section0, null);
    				}
    			}

    			if (dirty & /*count*/ 512) set_data_dev(t25, /*count*/ ctx[9]);
    			if (dirty & /*count*/ 512 && t27_value !== (t27_value = (/*count*/ ctx[9] === 1 ? "quadratic" : "quadratics") + "")) set_data_dev(t27, t27_value);

    			if (dirty & /*steps, showStep1*/ 384) {
    				each_value = /*steps*/ ctx[8];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Quadratic', slots, []);

    	var isSquare = function (n) {
    		return Math.sqrt(n) === Math.round(Math.sqrt(n));
    	};

    	var simpleFraction = function (numOne, numTwo) {
    		let sign = numOne < 0 && numTwo > 0 || numOne >= 0 && numTwo < 0
    		? "-"
    		: "";

    		var num1 = Math.abs(numOne), num2 = Math.abs(numTwo);

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
    				} else {
    					return {
    						fraction: `${sign}${num1}/${num2}`,
    						num1: `${num1}`,
    						num2: `/${num2}`,
    						sign: `${sign}`
    					};
    				}
    			}
    		}

    		if (num1 == Math.abs(numOne) && num2 == Math.abs(numTwo)) {
    			return {
    				fraction: `${sign}${num1}/${num2}`,
    				num1: `${num1}`,
    				num2: `/${num2}`,
    				sign: `${sign}`
    			};
    		}
    	};

    	var simpleSurd = function (num) {
    		let complex = num < 0 ? "i" : "";
    		var surd = Math.abs(num), factor = 1;

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
    				surd: `√${surd}`
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
    			isSqr() {
    				return isSquare(this.D);
    			},
    			isComplexSqr() {
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
    				formula: `(-b\xB1√(b\u00B2-4ac))/2a`
    			},
    			{
    				comment: `In this case we note that a=${A}, b=${B} and c=${C} which we can simply substitute in giving`,
    				formula: `(${minusB}\xB1√(${B}\u00B2-4\u00D7${A}\u00D7${C}))/(2√${A})`
    			},
    			{
    				comment: `Simplifying the denominator and discriminant gives`,
    				formula: `(${minusB}\xB1√${D})/${twoA}`
    			}
    		];
    	};

    	var squareSteps = function (calcData) {
    		let { minusB, twoA, D, sqrtD } = calcData;
    		let numeratorA = minusB + sqrtD;
    		let numeratorB = minusB - sqrtD;

    		return [
    			{
    				comment: `${D} is a perfect square which we can square root to give ${calcData.sqrtD}`,
    				formula: `(${minusB}\xB1${sqrtD})/${twoA}`
    			},
    			{
    				comment: `This can be split to give the following two cases`,
    				formula: `${numeratorA}/${twoA} and ${numeratorB}/${twoA}`
    			},
    			{
    				comment: `This simplifies to give a final answer of`,
    				formula: `${simpleFraction(numeratorA, twoA).fraction} and ${simpleFraction(numeratorB, twoA).fraction}`
    			}
    		];
    	};

    	var complexSquareSteps = function (calcData) {
    		let { minusB, twoA, sqrtModD, D, sqrtD } = calcData;
    		let component1 = simpleFraction(minusB, twoA).fraction;
    		let component2 = simpleFraction(sqrtModD, twoA).fraction;

    		return [
    			{
    				comment: `because ${D} is negative, its square root must be imaginary and is therefore given by ${sqrtD}`,
    				formula: `(${minusB}\xB1${sqrtD})/${twoA}`
    			},
    			{
    				comment: `This can be split to give the following two cases`,
    				formula: `${minusB}/${twoA}+${sqrtD}/${twoA} and ${minusB}/${twoA}-${sqrtD}/${twoA}`
    			},
    			{
    				comment: `This simplifies to give a final answer of`,
    				formula: `${component1}+${component2}i and ${component1}-${component2}i`
    			}
    		];
    	};

    	var step4NonSquare = function (calcData) {
    		let { minusB, twoA, sqrtModD, modD, D, sqrtD, SObject } = calcData;
    		var comment;

    		if (calcData.isComplex && SObject.factor != "1") {
    			comment = `${D} is negative so its square root must be imaginary and is therefore it is given by ${sqrtD} (where √${modD}=${sqrtModD})`;
    		} else if (calcData.isComplex && SObject.factor == "1") {
    			comment = `${D} is negative so its square root must be imaginary and is therefore it is given by ${sqrtD}`;
    		} else if (SObject.factor == "1") {
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
    			formula: `${minusB}/${twoA}+${sqrtD}/${twoA} and ${minusB}/${twoA}-${sqrtD}/${twoA}`
    		};
    	};

    	var step6NonSquare = function (calcData) {
    		let { minusB, twoA, SObject } = calcData;
    		var component1 = simpleFraction(minusB, twoA).fraction;
    		let result = simpleFraction(SObject.factor, twoA);

    		if (result.num1 == 1 && result.num2 == 1) {
    			var component2 = `${SObject.complex}${SObject.surd}`;
    		} else if (result.num1 == 1 && result.num2 != 1) {
    			var component2 = `${SObject.complex}${SObject.surd}${result.num2}`;
    		} else if (result.num1 != 1 && result.num2 == 1) {
    			var component2 = `${result.num1}${SObject.complex}${SObject.surd}`;
    		} else if (result.num1 != 1 && result.num2 != 1) {
    			var component2 = `${result.num1}${SObject.complex}${SObject.surd}${result.num2}`;
    		}

    		return {
    			comment: `This simplifies to give a final answer of`,
    			formula: `${component1}+${component2} and ${component1}-${component2}`
    		};
    	};

    	function calculate(useComplexNumbers) {
    		var calcData = calculationParts(a, b, c);

    		if (isNaN(parseInt(a)) || isNaN(parseInt(b)) || isNaN(parseInt(c))) {
    			$$invalidate(7, showStep1 = false);

    			$$invalidate(8, steps = [
    				{
    					comment: "Oops something went wrong!",
    					formula: "Try inputting integer coefficients instead!"
    				}
    			]);

    			return {};
    		}

    		$$invalidate(9, count += 1);

    		// Set the vars for displaying the formula
    		$$invalidate(1, A = calcData.A);

    		$$invalidate(2, B = calcData.B);
    		$$invalidate(3, C = calcData.C);
    		$$invalidate(7, showStep1 = true);

    		if (calcData.isComplex && !useComplexNumbers) {
    			$$invalidate(8, steps = [
    				{
    					comment: "There is no real answer!",
    					formula: "have your tried our complex numbers flavour?"
    				}
    			]);

    			$$invalidate(7, showStep1 = false);
    			$$invalidate(9, count -= 1);
    		} else if (calcData.isSqr()) {
    			$$invalidate(8, steps = [...initialSteps(calcData), ...squareSteps(calcData)]);
    		} else if (calcData.isComplexSqr()) {
    			$$invalidate(8, steps = [...initialSteps(calcData), ...complexSquareSteps(calcData)]);
    		} else {
    			$$invalidate(8, steps = [
    				...initialSteps(calcData),
    				step4NonSquare(calcData),
    				step5NonSquare(calcData),
    				step6NonSquare(calcData)
    			]);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Quadratic> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		a = this.value;
    		$$invalidate(4, a);
    	}

    	function input1_input_handler() {
    		b = this.value;
    		$$invalidate(5, b);
    	}

    	function input2_input_handler() {
    		c = this.value;
    		$$invalidate(6, c);
    	}

    	function input3_change_handler() {
    		compWithComplex = this.checked;
    		$$invalidate(0, compWithComplex);
    	}

    	const click_handler = () => calculate(!compWithComplex);
    	const click_handler_1 = () => calculate(compWithComplex);

    	$$self.$capture_state = () => ({
    		isSquare,
    		simpleFraction,
    		simpleSurd,
    		squareRoot,
    		calculationParts,
    		initialSteps,
    		squareSteps,
    		complexSquareSteps,
    		step4NonSquare,
    		step5NonSquare,
    		step6NonSquare,
    		calculate,
    		compWithComplex,
    		A,
    		B,
    		C,
    		a,
    		b,
    		c,
    		showStep1,
    		steps,
    		count
    	});

    	$$self.$inject_state = $$props => {
    		if ('isSquare' in $$props) isSquare = $$props.isSquare;
    		if ('simpleFraction' in $$props) simpleFraction = $$props.simpleFraction;
    		if ('simpleSurd' in $$props) simpleSurd = $$props.simpleSurd;
    		if ('squareRoot' in $$props) squareRoot = $$props.squareRoot;
    		if ('calculationParts' in $$props) calculationParts = $$props.calculationParts;
    		if ('initialSteps' in $$props) initialSteps = $$props.initialSteps;
    		if ('squareSteps' in $$props) squareSteps = $$props.squareSteps;
    		if ('complexSquareSteps' in $$props) complexSquareSteps = $$props.complexSquareSteps;
    		if ('step4NonSquare' in $$props) step4NonSquare = $$props.step4NonSquare;
    		if ('step5NonSquare' in $$props) step5NonSquare = $$props.step5NonSquare;
    		if ('step6NonSquare' in $$props) step6NonSquare = $$props.step6NonSquare;
    		if ('compWithComplex' in $$props) $$invalidate(0, compWithComplex = $$props.compWithComplex);
    		if ('A' in $$props) $$invalidate(1, A = $$props.A);
    		if ('B' in $$props) $$invalidate(2, B = $$props.B);
    		if ('C' in $$props) $$invalidate(3, C = $$props.C);
    		if ('a' in $$props) $$invalidate(4, a = $$props.a);
    		if ('b' in $$props) $$invalidate(5, b = $$props.b);
    		if ('c' in $$props) $$invalidate(6, c = $$props.c);
    		if ('showStep1' in $$props) $$invalidate(7, showStep1 = $$props.showStep1);
    		if ('steps' in $$props) $$invalidate(8, steps = $$props.steps);
    		if ('count' in $$props) $$invalidate(9, count = $$props.count);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		compWithComplex,
    		A,
    		B,
    		C,
    		a,
    		b,
    		c,
    		showStep1,
    		steps,
    		count,
    		calculate,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_change_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Quadratic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Quadratic",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    new Quadratic({
      target: document.querySelector('#quadratic-container'),
    });

})();
//# sourceMappingURL=svelte-bundle.js.map
