---
layout: landing
title: Publications
image: assets/home/publications.jpg
nav-menu: true
---

<section id="one">
<div class="inner">

<div class="2u 12u$(small)">
Conference / Journal:
<select id="conference_journal" onChange="onSelect()">
  <option value='all'>ALL</option>
  <option value='siggraph'>SIGGRAPH family </option>
</select>
<p/>
</div>

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

dynamicallyLoadScript('publications.js');

function onSelect() {
	var conf_target = document.getElementById("conference_journal");
	var conf_value = conf_target.options[conf_target.selectedIndex].value;

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
			contents_code += '<div class="12u 12u$(small)">';
			contents_code += '<span class="image left"><img src={0} style="max-width: 220px; height: auto; " alt="" /></span>'.format(pub.representative_img);
			contents_code += '<a href={0}><b>{1}</b></a><br/>'.format(pub.project_page, pub.title);
			contents_code += '{0}<br/>'.format(pub.authors);
			contents_code += '{0}<br/>'.format(pub.conference_journal_full);
			contents_code += '</div>';
		}
	}

	var contents = document.getElementById("contents");
	contents.innerHTML = contents_code;
}

// set default value and trigger onchange event when window is loaded
window.onload = function () {
	var conf_target = document.getElementById("conference_journal");
	conf_target.value = 'all';
	//conf_target.value = 'siggraph';
	conf_target.onchange();

}

</script>

</div>
</div>
</section>


<!--<section id="one">-->
<!--<div class="inner">-->
<!--<div class="row">-->

<!--<div class="12u 12u$(small)">-->
<!--<span class="image left"><img src="assets/publications/2018-iguana-ctrl.jpg" style="max-width: 220px; height: auto; " alt="" /></span>-->
<!--<a href="publications/2018-iguana-ctrl.html"><b>Control of an Iguana Character Using Soft-Body Simulation</b></a><br/>-->
<!--Taesoo Kwon, Hoimin Kim, Yoonsang Lee<br/>-->
<!--IEEE Access, Volume 6 Issue 1, Dec 2018<br/>-->
<!--</div>-->

<!--</div>-->
<!--</div>-->
<!--</section>-->
