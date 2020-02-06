---
layout: landing
title: Publications
image: assets/home/publications.jpg
nav-menu: true
---

<section id="one">
<div class="inner">
<div class="row">

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

var publications = [
	{
		'title': 'Control of an Iguana Character Using Soft-Body Simulation',
		'representative_img': 'assets/publications/2018-iguana-ctrl.jpg',
		'project_page': 'publications/2018-iguana-ctrl.html',
		'conference_journal': 'Access',
		'year': '2018',
		'authors': 'Taesoo Kwon, Hoimin Kim, Yoonsang Lee',
		'conference_journal_full': 'IEEE Access, Volume 6 Issue 1, Dec 2018'
	},
	{
		'title': 'Performance-Based Biped Control using a Consumer Depth Camera',
		'representative_img': 'assets/publications/2017-perf-based.png',
		'project_page': 'publications/2017-perf-based.html',
		'conference_journal': 'Eurographics',
		'year': '2017',
		'authors': 'Yoonsang Lee, Taesoo Kwon',
		'conference_journal_full': 'Computer Graphics Forum (Eurographics 2017), Volume 36 Issue 2, 387-395, May 2017'
	},
	{
		'title': 'Push-Recovery Stability of Biped Locomotion',
		'representative_img': 'assets/publications/2015-push-recovery.png',
		'project_page': 'publications/2015-push-recovery.html',
		'conference_journal': 'SIGGRAPH Asia',
		'year': '2015',
		'authors': 'Yoonsang Lee, Kyungho Lee, Soon-Sun Kwon, Jiwon Jeong, Carol O\'Sullivan, Moon Seok Park, Jehee Lee',
		'conference_journal_full': 'ACM Transactions on Graphics (SIGGRAPH Asia 2015), Volume 34 Issue 6, Article No. 180, November 2015'
	},
	{
		'title': 'Locomotion Control for Many-Muscle Humanoids',
		'representative_img': 'assets/publications/2014-many-muscle.png',
		'project_page': 'publications/2014-many-muscle.html',
		'conference_journal': 'SIGGRAPH Asia',
		'year': '2014',
		'authors': 'Yoonsang Lee, Moon Seok Park, Taesoo Kwon, Jehee Lee',
		'conference_journal_full': 'ACM Transactions on Graphics (SIGGRAPH Asia 2014), Volume 33 Issue 6, Article No. 218, November 2014'
	},
	{
		'title': 'Data-Driven Biped Control',
		'representative_img': 'assets/publications/2010-data-driven.jpg',
		'project_page': 'publications/2010-data-driven.html',
		'conference_journal': 'SIGGRAPH',
		'year': '2010',
		'authors': 'Yoonsang Lee, Sungeun Kim, Jehee Lee',
		'conference_journal_full': 'ACM Transactions on Graphics (SIGGRAPH 2010), Volume 29 Issue 4, Article No. 129, July 2010'
	},
]

for(var i = 0; i < publications.length; i++) 
{
    var pub = publications[i];
	document.write('<div class="12u 12u$(small)">');
	document.write('<span class="image left"><img src={0} style="max-width: 220px; height: auto; " alt="" /></span>'.format(pub.representative_img));
	document.write('<a href={0}><b>{1}</b></a><br/>'.format(pub.project_page, pub.title));
	document.write('{0}<br/>'.format(pub.authors));
	document.write('{0}<br/>'.format(pub.conference_journal_full));
	document.write('</div>');
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
