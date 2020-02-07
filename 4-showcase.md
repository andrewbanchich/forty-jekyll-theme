---
layout: landing
title: Showcase
image: assets/home/showcase.jpg
nav-menu: true
---

<section id="one">
<div class="inner">

<div class="row">

<div class="2u 12u$(small)">
Type:
<select id="type_select" onChange="onSelect()">
  <option value='all'>ALL</option>
  <option value='publications'>Publications</option>
  <option value='seniorprojs'>Senior Projects</option>
</select>
</div>

<div class="3u 12u$(small)">
Conference / Journal:
<select id="conf_select" onChange="onSelect()">
  <option value='all'>ALL</option>
  <option value='siggraph'>SIGGRAPH (Asia) / TOG</option>
</select>
</div>

</div>

<p/>

<div id="contents" class="row">

<script>
// https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function dynamicallyLoadScript(url) {
    var script = document.createElement("script");  // create a script DOM node
    script.src = url;  // set its src to the provided URL

    document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

dynamicallyLoadScript('publications_eng.js');

function onSelect() {
	var publications = publications_eng;

	var conf_select = document.getElementById("conf_select");
	var conf_value = conf_select.options[conf_select.selectedIndex].value;

	var contents_code = '';
	for(var i = 0; i < publications.length; i++) 
	{
		var pub = publications[i];
		var show = false;
		if(conf_value=='siggraph'
			&& (pub.conference_journal=='SIGGRAPH' || pub.conference_journal=='SIGGRAPH Asia'
				|| pub.conference_journal=='TOG'))
		{
			show = true;
			console.log(conf_value);
		}
		else if(conf_value=='all')
		{
			show = true;
		}

		if(show)
		{
			contents_code += '<div class="6u 12u$(small)">';
			contents_code += '<a href={0}><b>{1}</b></a><br/>'.format(pub.project_page, pub.title);
			contents_code += '<div id="iframe_container"> <div id="iframe">';
			contents_code += '{0}'.format(pub.video_iframe);;
			contents_code += '</div></div>';
			contents_code += '</div><br/>';
		}
	}

	var contents = document.getElementById("contents");
	contents.innerHTML = contents_code;
}

// set default value and trigger onchange event when window is loaded
window.onload = function () {
	var conf_select = document.getElementById("conf_select");
	conf_select.value = 'all';
	//conf_select.value = 'siggraph';
	conf_select.onchange();

}

</script>

</div>
</div>
</section>

<!--<section id="one">-->
<!--<div class="inner">-->
<!--<div class="row">-->

<!--<div class="6u 12u$(small)">-->
<!--<a href="publications/2018-iguana-ctrl.html"><b>Control of an Iguana Character Using Soft-Body Simulation</b></a><br/>-->
<!--<div id="iframe_container"> <div id="iframe">-->
<!--<iframe width="1280" height="720" src="https://www.youtube.com/embed/c37VEexDZaY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  -->
<!--</div></div>  -->
<!--</div>-->

<!--</div>-->
<!--</div>-->
<!--</section>-->
