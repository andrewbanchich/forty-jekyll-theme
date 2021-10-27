
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
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
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

    // (200:2) {:else}
    function create_else_block_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "This quadratic doesn't have any real solutions! Check you've\n\t\t\t\tentered your coefficients correctly! Compatibility with complex\n\t\t\t\tnumbers is a feature calc.ulator.world is working on so check\n\t\t\t\tback again soon for updates!";
    			add_location(p, file, 200, 3, 4202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(200:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (137:2) {#if D >= 0}
    function create_if_block(ctx) {
    	let p;
    	let t0;
    	let t1_value = (/*x*/ ctx[0] || "?") + "";
    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let t4_value = (/*y*/ ctx[1] || "?") + "";
    	let t4;
    	let t5;
    	let if_block_anchor;
    	let if_block = /*count*/ ctx[9] > 0 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Root 1 = ");
    			t1 = text(t1_value);
    			t2 = space();
    			br = element("br");
    			t3 = text(" Root 2 = ");
    			t4 = text(t4_value);
    			t5 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(br, file, 137, 26, 2702);
    			add_location(p, file, 137, 3, 2679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, br);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			insert_dev(target, t5, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*x*/ 1 && t1_value !== (t1_value = (/*x*/ ctx[0] || "?") + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*y*/ 2 && t4_value !== (t4_value = (/*y*/ ctx[1] || "?") + "")) set_data_dev(t4, t4_value);

    			if (/*count*/ ctx[9] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t5);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(137:2) {#if D >= 0}",
    		ctx
    	});

    	return block;
    }

    // (140:3) {#if count > 0}
    function create_if_block_1(ctx) {
    	let h4;
    	let t1;
    	let p0;
    	let t2;
    	let span0;
    	let t3_value = (/*A*/ ctx[2] || "a") + "";
    	let t3;
    	let t4;
    	let sup0;
    	let t6;
    	let t7_value = (/*B*/ ctx[3] || "b") + "";
    	let t7;
    	let t8;
    	let t9_value = (/*C*/ ctx[4] || "c") + "";
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let p1;
    	let t19;
    	let p2;
    	let t20;
    	let span1;
    	let span2;
    	let t23;
    	let sup1;
    	let t25;
    	let t26;
    	let p3;
    	let t27;
    	let t28;
    	let span3;
    	let span4;
    	let t31;
    	let t32;
    	let sup2;
    	let t34;
    	let span5;
    	let t36;
    	let span6;
    	let t38;
    	let t39;
    	let span7;
    	let t41;
    	let t42;
    	let t43;
    	let p4;
    	let t44;
    	let t45;
    	let span8;
    	let span9;
    	let t48;
    	let t49_value = /*B*/ ctx[3] * /*B*/ ctx[3] + "";
    	let t49;
    	let t50;
    	let t51_value = 4 * /*A*/ ctx[2] * /*C*/ ctx[4] + "";
    	let t51;
    	let t52;
    	let t53_value = /*A*/ ctx[2] * 2 + "";
    	let t53;
    	let t54;
    	let p5;
    	let t55;
    	let t56;
    	let span10;
    	let span11;
    	let t59;
    	let t60;
    	let t61_value = /*A*/ ctx[2] * 2 + "";
    	let t61;
    	let t62;
    	let show_if;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (show_if == null || dirty & /*D*/ 32) show_if = !!/*isSquare*/ ctx[10](/*D*/ ctx[5]);
    		if (show_if) return create_if_block_2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Quadratic Formula Method -";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("From ");
    			span0 = element("span");
    			t3 = text(t3_value);
    			t4 = text("x");
    			sup0 = element("sup");
    			sup0.textContent = "2";
    			t6 = text("+");
    			t7 = text(t7_value);
    			t8 = text("x+");
    			t9 = text(t9_value);
    			t10 = text("\n\t\t\t\t\twe note that a = ");
    			t11 = text(/*A*/ ctx[2]);
    			t12 = text(", b= ");
    			t13 = text(/*B*/ ctx[3]);
    			t14 = text(" and c = ");
    			t15 = text(/*C*/ ctx[4]);
    			t16 = text("!");
    			t17 = space();
    			p1 = element("p");
    			p1.textContent = "Now we can substitute this into the quadratic formula";
    			t19 = space();
    			p2 = element("p");
    			t20 = text("(-b");
    			span1 = element("span");
    			span1.textContent = "±";
    			span2 = element("span");
    			span2.textContent = "√";
    			t23 = text("(b");
    			sup1 = element("sup");
    			sup1.textContent = "2";
    			t25 = text("-4ac))/2a");
    			t26 = space();
    			p3 = element("p");
    			t27 = text("(-");
    			t28 = text(/*B*/ ctx[3]);
    			span3 = element("span");
    			span3.textContent = "±";
    			span4 = element("span");
    			span4.textContent = "√";
    			t31 = text("(");
    			t32 = text(/*B*/ ctx[3]);
    			sup2 = element("sup");
    			sup2.textContent = "2";
    			t34 = text("-4");
    			span5 = element("span");
    			span5.textContent = "×";
    			t36 = text(/*A*/ ctx[2]);
    			span6 = element("span");
    			span6.textContent = "×";
    			t38 = text(/*C*/ ctx[4]);
    			t39 = text("))/(2");
    			span7 = element("span");
    			span7.textContent = "×";
    			t41 = text(/*A*/ ctx[2]);
    			t42 = text(")");
    			t43 = space();
    			p4 = element("p");
    			t44 = text("(-");
    			t45 = text(/*B*/ ctx[3]);
    			span8 = element("span");
    			span8.textContent = "±";
    			span9 = element("span");
    			span9.textContent = "√";
    			t48 = text("(");
    			t49 = text(t49_value);
    			t50 = text("-");
    			t51 = text(t51_value);
    			t52 = text("))/");
    			t53 = text(t53_value);
    			t54 = space();
    			p5 = element("p");
    			t55 = text("(-");
    			t56 = text(/*B*/ ctx[3]);
    			span10 = element("span");
    			span10.textContent = "±";
    			span11 = element("span");
    			span11.textContent = "√";
    			t59 = text(/*D*/ ctx[5]);
    			t60 = text(")/");
    			t61 = text(t61_value);
    			t62 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			add_location(h4, file, 140, 4, 2757);
    			add_location(sup0, file, 143, 17, 2851);
    			attr_dev(span0, "class", "formula");
    			add_location(span0, file, 142, 10, 2811);
    			add_location(p0, file, 141, 4, 2797);
    			add_location(p1, file, 147, 4, 2960);
    			add_location(span1, file, 149, 8, 3037);
    			add_location(span2, file, 149, 27, 3056);
    			add_location(sup1, file, 149, 49, 3078);
    			add_location(p2, file, 148, 4, 3025);
    			add_location(span3, file, 153, 10, 3133);
    			add_location(span4, file, 153, 29, 3152);
    			add_location(sup2, file, 153, 53, 3176);
    			add_location(span5, file, 154, 8, 3196);
    			add_location(span6, file, 154, 30, 3218);
    			add_location(span7, file, 154, 57, 3245);
    			add_location(p3, file, 152, 4, 3119);
    			add_location(span8, file, 159, 10, 3309);
    			add_location(span9, file, 159, 29, 3328);
    			add_location(p4, file, 158, 4, 3295);
    			add_location(span10, file, 164, 10, 3418);
    			add_location(span11, file, 164, 29, 3437);
    			add_location(p5, file, 163, 4, 3404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			append_dev(p0, span0);
    			append_dev(span0, t3);
    			append_dev(span0, t4);
    			append_dev(span0, sup0);
    			append_dev(span0, t6);
    			append_dev(span0, t7);
    			append_dev(span0, t8);
    			append_dev(span0, t9);
    			append_dev(p0, t10);
    			append_dev(p0, t11);
    			append_dev(p0, t12);
    			append_dev(p0, t13);
    			append_dev(p0, t14);
    			append_dev(p0, t15);
    			append_dev(p0, t16);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t20);
    			append_dev(p2, span1);
    			append_dev(p2, span2);
    			append_dev(p2, t23);
    			append_dev(p2, sup1);
    			append_dev(p2, t25);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t27);
    			append_dev(p3, t28);
    			append_dev(p3, span3);
    			append_dev(p3, span4);
    			append_dev(p3, t31);
    			append_dev(p3, t32);
    			append_dev(p3, sup2);
    			append_dev(p3, t34);
    			append_dev(p3, span5);
    			append_dev(p3, t36);
    			append_dev(p3, span6);
    			append_dev(p3, t38);
    			append_dev(p3, t39);
    			append_dev(p3, span7);
    			append_dev(p3, t41);
    			append_dev(p3, t42);
    			insert_dev(target, t43, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, t44);
    			append_dev(p4, t45);
    			append_dev(p4, span8);
    			append_dev(p4, span9);
    			append_dev(p4, t48);
    			append_dev(p4, t49);
    			append_dev(p4, t50);
    			append_dev(p4, t51);
    			append_dev(p4, t52);
    			append_dev(p4, t53);
    			insert_dev(target, t54, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, t55);
    			append_dev(p5, t56);
    			append_dev(p5, span10);
    			append_dev(p5, span11);
    			append_dev(p5, t59);
    			append_dev(p5, t60);
    			append_dev(p5, t61);
    			insert_dev(target, t62, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*A*/ 4 && t3_value !== (t3_value = (/*A*/ ctx[2] || "a") + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*B*/ 8 && t7_value !== (t7_value = (/*B*/ ctx[3] || "b") + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*C*/ 16 && t9_value !== (t9_value = (/*C*/ ctx[4] || "c") + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*A*/ 4) set_data_dev(t11, /*A*/ ctx[2]);
    			if (dirty & /*B*/ 8) set_data_dev(t13, /*B*/ ctx[3]);
    			if (dirty & /*C*/ 16) set_data_dev(t15, /*C*/ ctx[4]);
    			if (dirty & /*B*/ 8) set_data_dev(t28, /*B*/ ctx[3]);
    			if (dirty & /*B*/ 8) set_data_dev(t32, /*B*/ ctx[3]);
    			if (dirty & /*A*/ 4) set_data_dev(t36, /*A*/ ctx[2]);
    			if (dirty & /*C*/ 16) set_data_dev(t38, /*C*/ ctx[4]);
    			if (dirty & /*A*/ 4) set_data_dev(t41, /*A*/ ctx[2]);
    			if (dirty & /*B*/ 8) set_data_dev(t45, /*B*/ ctx[3]);
    			if (dirty & /*B*/ 8 && t49_value !== (t49_value = /*B*/ ctx[3] * /*B*/ ctx[3] + "")) set_data_dev(t49, t49_value);
    			if (dirty & /*A, C*/ 20 && t51_value !== (t51_value = 4 * /*A*/ ctx[2] * /*C*/ ctx[4] + "")) set_data_dev(t51, t51_value);
    			if (dirty & /*A*/ 4 && t53_value !== (t53_value = /*A*/ ctx[2] * 2 + "")) set_data_dev(t53, t53_value);
    			if (dirty & /*B*/ 8) set_data_dev(t56, /*B*/ ctx[3]);
    			if (dirty & /*D*/ 32) set_data_dev(t59, /*D*/ ctx[5]);
    			if (dirty & /*A*/ 4 && t61_value !== (t61_value = /*A*/ ctx[2] * 2 + "")) set_data_dev(t61, t61_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t43);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t54);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t62);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(140:3) {#if count > 0}",
    		ctx
    	});

    	return block;
    }

    // (184:4) {:else}
    function create_else_block(ctx) {
    	let p0;
    	let t0;
    	let t1;
    	let t2;
    	let span0;
    	let t4;
    	let t5;
    	let t6_value = /*A*/ ctx[2] * 2 + "";
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let span1;
    	let t11;
    	let t12;
    	let t13_value = /*A*/ ctx[2] * 2 + "";
    	let t13;
    	let t14;
    	let p1;
    	let t15;
    	let t16;
    	let t17;
    	let t18_value = /*squareRoot*/ ctx[12](/*D*/ ctx[5]) + "";
    	let t18;
    	let t19;
    	let t20_value = /*A*/ ctx[2] * 2 + "";
    	let t20;
    	let t21;
    	let t22;
    	let t23;
    	let t24_value = /*squareRoot*/ ctx[12](/*D*/ ctx[5]) + "";
    	let t24;
    	let t25;
    	let t26_value = /*A*/ ctx[2] * 2 + "";
    	let t26;
    	let t27;
    	let p2;
    	let t28;
    	let t29;
    	let t30;
    	let t31;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			t0 = text("(-");
    			t1 = text(/*B*/ ctx[3]);
    			t2 = text("+");
    			span0 = element("span");
    			span0.textContent = "√";
    			t4 = text(/*D*/ ctx[5]);
    			t5 = text(")/");
    			t6 = text(t6_value);
    			t7 = text(" and (-");
    			t8 = text(/*B*/ ctx[3]);
    			t9 = text("-");
    			span1 = element("span");
    			span1.textContent = "√";
    			t11 = text(/*D*/ ctx[5]);
    			t12 = text(")/");
    			t13 = text(t13_value);
    			t14 = space();
    			p1 = element("p");
    			t15 = text("(-");
    			t16 = text(/*B*/ ctx[3]);
    			t17 = text("+");
    			t18 = text(t18_value);
    			t19 = text(")/");
    			t20 = text(t20_value);
    			t21 = text(" and (-");
    			t22 = text(/*B*/ ctx[3]);
    			t23 = text("-");
    			t24 = text(t24_value);
    			t25 = text(")/");
    			t26 = text(t26_value);
    			t27 = space();
    			p2 = element("p");
    			t28 = text("which evaluate to give us the approx. roots ");
    			t29 = text(/*x*/ ctx[0]);
    			t30 = text(" and ");
    			t31 = text(/*y*/ ctx[1]);
    			add_location(span0, file, 185, 12, 3882);
    			add_location(span1, file, 185, 55, 3925);
    			add_location(p0, file, 184, 5, 3866);
    			add_location(p1, file, 189, 5, 3988);
    			add_location(p2, file, 194, 5, 4094);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(p0, t2);
    			append_dev(p0, span0);
    			append_dev(p0, t4);
    			append_dev(p0, t5);
    			append_dev(p0, t6);
    			append_dev(p0, t7);
    			append_dev(p0, t8);
    			append_dev(p0, t9);
    			append_dev(p0, span1);
    			append_dev(p0, t11);
    			append_dev(p0, t12);
    			append_dev(p0, t13);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t15);
    			append_dev(p1, t16);
    			append_dev(p1, t17);
    			append_dev(p1, t18);
    			append_dev(p1, t19);
    			append_dev(p1, t20);
    			append_dev(p1, t21);
    			append_dev(p1, t22);
    			append_dev(p1, t23);
    			append_dev(p1, t24);
    			append_dev(p1, t25);
    			append_dev(p1, t26);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t28);
    			append_dev(p2, t29);
    			append_dev(p2, t30);
    			append_dev(p2, t31);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*B*/ 8) set_data_dev(t1, /*B*/ ctx[3]);
    			if (dirty & /*D*/ 32) set_data_dev(t4, /*D*/ ctx[5]);
    			if (dirty & /*A*/ 4 && t6_value !== (t6_value = /*A*/ ctx[2] * 2 + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*B*/ 8) set_data_dev(t8, /*B*/ ctx[3]);
    			if (dirty & /*D*/ 32) set_data_dev(t11, /*D*/ ctx[5]);
    			if (dirty & /*A*/ 4 && t13_value !== (t13_value = /*A*/ ctx[2] * 2 + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*B*/ 8) set_data_dev(t16, /*B*/ ctx[3]);
    			if (dirty & /*D*/ 32 && t18_value !== (t18_value = /*squareRoot*/ ctx[12](/*D*/ ctx[5]) + "")) set_data_dev(t18, t18_value);
    			if (dirty & /*A*/ 4 && t20_value !== (t20_value = /*A*/ ctx[2] * 2 + "")) set_data_dev(t20, t20_value);
    			if (dirty & /*B*/ 8) set_data_dev(t22, /*B*/ ctx[3]);
    			if (dirty & /*D*/ 32 && t24_value !== (t24_value = /*squareRoot*/ ctx[12](/*D*/ ctx[5]) + "")) set_data_dev(t24, t24_value);
    			if (dirty & /*A*/ 4 && t26_value !== (t26_value = /*A*/ ctx[2] * 2 + "")) set_data_dev(t26, t26_value);
    			if (dirty & /*x*/ 1) set_data_dev(t29, /*x*/ ctx[0]);
    			if (dirty & /*y*/ 2) set_data_dev(t31, /*y*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(p2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(184:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (167:4) {#if isSquare(D)}
    function create_if_block_2(ctx) {
    	let p0;
    	let t0;
    	let t1;
    	let span;
    	let t3_value = Math.sqrt(/*D*/ ctx[5]) + "";
    	let t3;
    	let t4;
    	let t5_value = /*A*/ ctx[2] * 2 + "";
    	let t5;
    	let t6;
    	let p1;
    	let t7_value = -/*B*/ ctx[3] + Math.sqrt(/*D*/ ctx[5]) + "";
    	let t7;
    	let t8;
    	let t9_value = /*A*/ ctx[2] * 2 + "";
    	let t9;
    	let t10;
    	let t11_value = -/*B*/ ctx[3] - Math.sqrt(/*D*/ ctx[5]) + "";
    	let t11;
    	let t12;
    	let t13_value = /*A*/ ctx[2] * 2 + "";
    	let t13;
    	let t14;
    	let p2;
    	let t15_value = /*simplify*/ ctx[11](-/*B*/ ctx[3] + Math.sqrt(/*D*/ ctx[5]), /*A*/ ctx[2] * 2) + "";
    	let t15;
    	let t16;
    	let t17_value = /*simplify*/ ctx[11](-/*B*/ ctx[3] - Math.sqrt(/*D*/ ctx[5]), /*A*/ ctx[2] * 2) + "";
    	let t17;
    	let t18;
    	let p3;
    	let t19;
    	let t20;
    	let t21;
    	let t22;
    	let t23;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			t0 = text("(-");
    			t1 = text(/*B*/ ctx[3]);
    			span = element("span");
    			span.textContent = "±";
    			t3 = text(t3_value);
    			t4 = text(")/");
    			t5 = text(t5_value);
    			t6 = space();
    			p1 = element("p");
    			t7 = text(t7_value);
    			t8 = text("/");
    			t9 = text(t9_value);
    			t10 = text(" and ");
    			t11 = text(t11_value);
    			t12 = text("/");
    			t13 = text(t13_value);
    			t14 = space();
    			p2 = element("p");
    			t15 = text(t15_value);
    			t16 = text(" and ");
    			t17 = text(t17_value);
    			t18 = space();
    			p3 = element("p");
    			t19 = text("giving us the roots ");
    			t20 = text(/*x*/ ctx[0]);
    			t21 = text(" and ");
    			t22 = text(/*y*/ ctx[1]);
    			t23 = text("!");
    			add_location(span, file, 168, 11, 3521);
    			add_location(p0, file, 167, 5, 3506);
    			add_location(p1, file, 170, 5, 3579);
    			add_location(p2, file, 174, 5, 3671);
    			add_location(p3, file, 180, 5, 3796);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(p0, span);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			append_dev(p0, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t7);
    			append_dev(p1, t8);
    			append_dev(p1, t9);
    			append_dev(p1, t10);
    			append_dev(p1, t11);
    			append_dev(p1, t12);
    			append_dev(p1, t13);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t15);
    			append_dev(p2, t16);
    			append_dev(p2, t17);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t19);
    			append_dev(p3, t20);
    			append_dev(p3, t21);
    			append_dev(p3, t22);
    			append_dev(p3, t23);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*B*/ 8) set_data_dev(t1, /*B*/ ctx[3]);
    			if (dirty & /*D*/ 32 && t3_value !== (t3_value = Math.sqrt(/*D*/ ctx[5]) + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*A*/ 4 && t5_value !== (t5_value = /*A*/ ctx[2] * 2 + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*B, D*/ 40 && t7_value !== (t7_value = -/*B*/ ctx[3] + Math.sqrt(/*D*/ ctx[5]) + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*A*/ 4 && t9_value !== (t9_value = /*A*/ ctx[2] * 2 + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*B, D*/ 40 && t11_value !== (t11_value = -/*B*/ ctx[3] - Math.sqrt(/*D*/ ctx[5]) + "")) set_data_dev(t11, t11_value);
    			if (dirty & /*A*/ 4 && t13_value !== (t13_value = /*A*/ ctx[2] * 2 + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*B, D, A*/ 44 && t15_value !== (t15_value = /*simplify*/ ctx[11](-/*B*/ ctx[3] + Math.sqrt(/*D*/ ctx[5]), /*A*/ ctx[2] * 2) + "")) set_data_dev(t15, t15_value);
    			if (dirty & /*B, D, A*/ 44 && t17_value !== (t17_value = /*simplify*/ ctx[11](-/*B*/ ctx[3] - Math.sqrt(/*D*/ ctx[5]), /*A*/ ctx[2] * 2) + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*x*/ 1) set_data_dev(t20, /*x*/ ctx[0]);
    			if (dirty & /*y*/ 2) set_data_dev(t22, /*y*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(p3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(167:4) {#if isSquare(D)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div3;
    	let section0;
    	let h1;
    	let span;
    	let t0_value = (/*A*/ ctx[2] || "a") + "";
    	let t0;
    	let t1;
    	let sup;
    	let t3;
    	let t4_value = (/*B*/ ctx[3] || "b") + "";
    	let t4;
    	let t5;
    	let t6_value = (/*C*/ ctx[4] || "c") + "";
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
    	let button;
    	let t20;
    	let section1;
    	let h4;
    	let t21;
    	let t22;
    	let t23_value = (/*count*/ ctx[9] === 1 ? "quadratic" : "quadratics") + "";
    	let t23;
    	let t24;
    	let t25;
    	let t26;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*D*/ ctx[5] >= 0) return create_if_block;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
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
    			button = element("button");
    			button.textContent = "Calc.ulate";
    			t20 = space();
    			section1 = element("section");
    			h4 = element("h4");
    			t21 = text(/*count*/ ctx[9]);
    			t22 = space();
    			t23 = text(t23_value);
    			t24 = text(" calc.ulated!");
    			t25 = space();
    			if_block.c();
    			t26 = text("\n1");
    			add_location(sup, file, 95, 15, 1874);
    			attr_dev(span, "class", "formula");
    			add_location(span, file, 94, 3, 1836);
    			add_location(h1, file, 93, 2, 1828);
    			attr_dev(label0, "for", "coef-a");
    			add_location(label0, file, 100, 3, 1957);
    			attr_dev(input0, "name", "coef-a");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "enter coefficient a");
    			add_location(input0, file, 101, 3, 2002);
    			attr_dev(div0, "class", "field");
    			add_location(div0, file, 99, 2, 1934);
    			attr_dev(label1, "for", "coef-b");
    			add_location(label1, file, 109, 3, 2140);
    			attr_dev(input1, "name", "coef-b");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "enter coefficient b");
    			add_location(input1, file, 110, 3, 2185);
    			attr_dev(div1, "class", "field");
    			add_location(div1, file, 108, 2, 2117);
    			attr_dev(label2, "for", "coef-c");
    			add_location(label2, file, 119, 3, 2324);
    			attr_dev(input2, "name", "coef-c");
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "placeholder", "enter coefficient c");
    			add_location(input2, file, 120, 3, 2369);
    			attr_dev(div2, "class", "field");
    			add_location(div2, file, 118, 2, 2301);
    			add_location(button, file, 128, 2, 2485);
    			add_location(section0, file, 92, 1, 1816);
    			add_location(h4, file, 131, 2, 2577);
    			attr_dev(section1, "class", "split");
    			add_location(section1, file, 130, 1, 2551);
    			attr_dev(div3, "class", "inner");
    			add_location(div3, file, 91, 0, 1795);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, section0);
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
    			set_input_value(input0, /*a*/ ctx[6]);
    			append_dev(section0, t12);
    			append_dev(section0, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t14);
    			append_dev(div1, input1);
    			set_input_value(input1, /*b*/ ctx[7]);
    			append_dev(section0, t15);
    			append_dev(section0, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t17);
    			append_dev(div2, input2);
    			set_input_value(input2, /*c*/ ctx[8]);
    			append_dev(section0, t18);
    			append_dev(section0, button);
    			append_dev(div3, t20);
    			append_dev(div3, section1);
    			append_dev(section1, h4);
    			append_dev(h4, t21);
    			append_dev(h4, t22);
    			append_dev(h4, t23);
    			append_dev(h4, t24);
    			append_dev(section1, t25);
    			if_block.m(section1, null);
    			insert_dev(target, t26, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[15]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[16]),
    					listen_dev(button, "click", /*handleClick*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*A*/ 4 && t0_value !== (t0_value = (/*A*/ ctx[2] || "a") + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*B*/ 8 && t4_value !== (t4_value = (/*B*/ ctx[3] || "b") + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*C*/ 16 && t6_value !== (t6_value = (/*C*/ ctx[4] || "c") + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*a*/ 64 && input0.value !== /*a*/ ctx[6]) {
    				set_input_value(input0, /*a*/ ctx[6]);
    			}

    			if (dirty & /*b*/ 128 && input1.value !== /*b*/ ctx[7]) {
    				set_input_value(input1, /*b*/ ctx[7]);
    			}

    			if (dirty & /*c*/ 256 && input2.value !== /*c*/ ctx[8]) {
    				set_input_value(input2, /*c*/ ctx[8]);
    			}

    			if (dirty & /*count*/ 512) set_data_dev(t21, /*count*/ ctx[9]);
    			if (dirty & /*count*/ 512 && t23_value !== (t23_value = (/*count*/ ctx[9] === 1 ? "quadratic" : "quadratics") + "")) set_data_dev(t23, t23_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(section1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block.d();
    			if (detaching) detach_dev(t26);
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

    	var simplify = function (numOne, numTwo) {
    		let sign = numOne < 0 && numTwo > 0 || numOne >= 0 && numTwo < 0
    		? "-"
    		: "";

    		var num1 = Math.abs(numOne), num2 = Math.abs(numTwo);

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
    		var surd = Math.abs(num), factor = 1;

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
    		$$invalidate(9, count += 1);
    		$$invalidate(2, A = parseFloat(a));
    		$$invalidate(3, B = parseFloat(b));
    		$$invalidate(4, C = parseFloat(c));
    		$$invalidate(5, D = B * B - 4 * A * C);

    		if (D < 0) {
    			alert(`This quadratic doesn't have any real solutions! Check you've entered your coefficients correctly!`);
    		}

    		$$invalidate(0, x = (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A));
    		$$invalidate(1, y = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Quadratic> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		a = this.value;
    		$$invalidate(6, a);
    	}

    	function input1_input_handler() {
    		b = this.value;
    		$$invalidate(7, b);
    	}

    	function input2_input_handler() {
    		c = this.value;
    		$$invalidate(8, c);
    	}

    	$$self.$capture_state = () => ({
    		isSquare,
    		simplify,
    		simpleSurd,
    		squareRoot,
    		x,
    		y,
    		A,
    		B,
    		C,
    		D,
    		a,
    		b,
    		c,
    		count,
    		handleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('isSquare' in $$props) $$invalidate(10, isSquare = $$props.isSquare);
    		if ('simplify' in $$props) $$invalidate(11, simplify = $$props.simplify);
    		if ('simpleSurd' in $$props) simpleSurd = $$props.simpleSurd;
    		if ('squareRoot' in $$props) $$invalidate(12, squareRoot = $$props.squareRoot);
    		if ('x' in $$props) $$invalidate(0, x = $$props.x);
    		if ('y' in $$props) $$invalidate(1, y = $$props.y);
    		if ('A' in $$props) $$invalidate(2, A = $$props.A);
    		if ('B' in $$props) $$invalidate(3, B = $$props.B);
    		if ('C' in $$props) $$invalidate(4, C = $$props.C);
    		if ('D' in $$props) $$invalidate(5, D = $$props.D);
    		if ('a' in $$props) $$invalidate(6, a = $$props.a);
    		if ('b' in $$props) $$invalidate(7, b = $$props.b);
    		if ('c' in $$props) $$invalidate(8, c = $$props.c);
    		if ('count' in $$props) $$invalidate(9, count = $$props.count);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		x,
    		y,
    		A,
    		B,
    		C,
    		D,
    		a,
    		b,
    		c,
    		count,
    		isSquare,
    		simplify,
    		squareRoot,
    		handleClick,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
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
