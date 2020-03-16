---
layout: post
title: Seinor Projects - 2019 Fall
nav-menu: false
show_tile: false
---

## Outstanding Results

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

dynamicallyLoadScript('../seniorprojs.js');

window.onload = function () {
	var projs = seniorprojs;
	var contents_code = '';
	for(var i = 0; i < projs.length; i++) 
	{
		var proj = projs[i];
		var show = false;

		if(proj.year==2019 && proj.season=='fall')
			show = true;

		if(show)
		{
			contents_code += '<br id="{0}"/><br/>'.format(proj.id);
			contents_code += '<div class="row">'.format(proj.title);
			contents_code += '<div class="6u 12u$(small)">';
			contents_code += '<div id="iframe_container"> <div id="iframe">';
			contents_code += '{0}'.format(proj.video_iframe);;
			contents_code += '</div></div>';
			contents_code += '</div>';
			contents_code += '<div class="6u 12u$(small)">';
			contents_code += '<b>{0}</b><br/>'.format(proj.title);
			contents_code += '{0}<br/>'.format(proj.authors);
			contents_code += '</div>';
			contents_code += '</div>';
		}
	}

	var contents = document.getElementById("contents");
	contents.innerHTML = contents_code;
}


</script>

</div>

<!--#### Team3 - Seinor Projects 2019 Fall-->
<!--Topic: Unreal Engine 4 환경에서 Phase Functioned Neural Network 기술을 이용한 게임 제작  -->
<!--Members: 이상옥 구교민 유지원-->

<!--<div class="6u 12u$(small)">-->
<!--<div id="iframe_container"> <div id="iframe">-->
<!--<iframe width="791" height="445" src="https://www.youtube.com/embed/3tzndxUZ1RI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>-->
<!--</div></div>  -->
<!--</div>-->

