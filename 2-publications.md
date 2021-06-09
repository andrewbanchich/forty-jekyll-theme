---
layout: landing
title: Publications & Presentations
image: assets/home/publications.jpg
nav-menu: true
---

<section id="one">
<div class="inner">

<div class="row">

<div class="3u 12u$(small)">
Conference / Journal:
<select id="conf_select" onChange="onSelect()">
  <option value='all'>ALL</option>
  <option value='siggraph'>SIGGRAPH (Asia) / TOG</option>
</select>
</div>

<div class="3u 12u$(small)">
Type:
<select id="type_select" onChange="onSelect()">
  <option value='all'>ALL</option>
  <option value='paper'>Full Paper</option>
  <option value='extended_abstract'>Extended Abstract</option>
  <option value='talk'>Talk</option>
</select>
</div>

<div class="4u 12u$(small)" style="height:1px">
</div>

<div class="2u 12u$(small)">
Language:
<select id="lang_select" onChange="onSelect()">
  <option value='eng'>In English</option>
  <option value='kor'>In Korean</option>
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

dynamicallyLoadScript('publications-eng.js');
dynamicallyLoadScript('publications-kor.js');

function onSelect() {
	var conf_select = document.getElementById("conf_select");
	var conf = conf_select.options[conf_select.selectedIndex].value;

	var type_select = document.getElementById("type_select");
	var type = type_select.options[type_select.selectedIndex].value;

	var lang_select = document.getElementById("lang_select");
	var lang = lang_select.options[lang_select.selectedIndex].value;

	if(lang=='eng')
		var publications = publications_eng;
	else
		var publications = publications_kor;

	var contents_code = '';
	for(var i = 0; i < publications.length; i++) 
	{
		var pub = publications[i];
		var show = false;

		if(conf=='siggraph'
			&& (pub.conference_journal=='SIGGRAPH' || pub.conference_journal=='SIGGRAPH Asia'
				|| pub.conference_journal=='TOG'))
			show = true;
		else if(conf=='all')
			show = true;
		else
			show = false;

		if(show)
		{
			if(type=='paper' && (pub.type=='paper'))
				show = true;
			else if(type=='extended_abstract' && (pub.type=='extended_abstract'))
				show = true;
			else if(type=='talk' && (pub.type=='talk'))
				show = true;
			else if(type=='all')
				show = true;
			else
				show = false;
		}

		if(show)
		{
			contents_code += '<div class="12u 12u$(small)">';
			contents_code += '<span class="image left"><img src={0} style="max-width: 220px; height: auto; " alt="" /></span>'.format(pub.representative_img);

			if('project_page' in pub)
				contents_code += '<b><a href={0} rel="noopener noreferrer" target="_blank">{1}</a></b><br/>'.format(pub.project_page, pub.title);
			else
				contents_code += '<b>{0}</b><br/>'.format(pub.title);

			contents_code += '{0}<br/>'.format(pub.authors);
			contents_code += '{0}<br/>'.format(pub.conference_journal_full);
			if('additional' in pub)
				contents_code += '{0}<br/>'.format(pub.additional);
			contents_code += '</div>';
		}
	}

	var contents = document.getElementById("contents");
	contents.innerHTML = contents_code;
}

// set default value and trigger onchange event when window is loaded
window.onload = function () {
	var conf_select = document.getElementById("conf_select");
	conf_select.value = 'all';
	conf_select.onchange();

	var type_select = document.getElementById("type_select");
	type_select.value = 'all';
	type_select.onchange();

	var lang_select = document.getElementById("lang_select");
	lang_select.value = 'eng';
	lang_select.onchange();

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
<!--<b><a href="publications/2018-iguana-ctrl.html">Control of an Iguana Character Using Soft-Body Simulation</a></b><br/>-->
<!--Taesoo Kwon, Hoimin Kim, Yoonsang Lee<br/>-->
<!--IEEE Access, Volume 6 Issue 1, Dec 2018<br/>-->
<!--</div>-->

<!--</div>-->
<!--</div>-->
<!--</section>-->
