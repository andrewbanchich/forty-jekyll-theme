---
layout: post
title: COMPUTER SCIENCE Capstone PBL(Physically-Based Character Simulation) - 2020 Spring
nav-menu: false
show_tile: false
---

* Instructor: [Yoonsang Lee](../people/yoonsang-lee.html)
* Teaching Assistant: [Jeongmin Lee](../people/jeongmin-lee.html)
* Time / Location: 
  * Live online lectures and labs due to the COVID-19 pandemic.
  * Mon 13:00-15:00 / Online (originally 503 IT.BT Building)
  * Wed 15:00-17:00 / Online (originally 510 IT.BT Building)

## Course Outline

This course introduces techniques for in-depth understanding of character animation / physically based animation / character control in computer graphics, and provides an opportunity to implement them yourself.

* Basic understanding of character animation / physically based animation / character control in computer graphics
* Introduction to research history and current state-of-the-art studies in the field
* Acquire enough knowledge and implementation skills to perform state-of-the-art research right after entering graduate school

## Schedule

* Data-Driven Animation, Project 1
* Mass-Spring System (Particle Dynamics), Project 2
* Character Simulation & Control, Project 3
* Reinforcement Learning

## Selected Results

<div id="contents">

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

dynamicallyLoadScript('../pbl-projs.js');

window.onload = function () {
	var projs = pbl_projs;
	var contents_code = '';
	var showCount = 0;
	for(var i = 0; i < projs.length; i++) 
	{
		var proj = projs[i];
		var show = false;

		if(proj.year==2020 && proj.season=='spring')
			show = true;

		if(show)
		{
			if(showCount % 2 == 0)
				contents_code += '<div class="row">';

			contents_code += '<div class="6u 12u$(small)">';
			contents_code += '<br id="{0}"/><br/>'.format(proj.id);
			contents_code += '<b>{0}</b><br/>'.format(proj.title);
			contents_code += '{0}<br/>'.format(proj.authors);
			contents_code += '<div id="iframe_container"> <div id="iframe">';
			contents_code += '{0}'.format(proj.video_iframe);;
			contents_code += '</div></div>';
			contents_code += '</div>';

			if(showCount % 2 == 1 || i == projs.length-1)
				contents_code += '</div>';

			showCount += 1;
		}
	}

	var contents = document.getElementById("contents");
	contents.innerHTML = contents_code;
}


</script>

</div>
