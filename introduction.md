---
title: 关于
layout: post
image: 
index: true
---

IT侠的前身是南京大学小百合BBS下 Notebook 版的软件侠。2012年夏，一起“珠江路装系统被坑”事件引起了小百合站友的义愤填膺。在 NoteBook 版的倡议下，志愿者团队“软件侠”迅速组建，旨在帮助解决系统、病毒等软件问题。他的正式服务开通于同年7月31日。
目前IT侠在仙林鼓楼设有分部，共有三个部门，分别是提供免费软硬件维修服务和指导技术培训的 GEEK 组、负责运营宣传策划并且组织活动的 OP 组以及负责预约网站开发并提供校内有偿建站服务的 WEB 组。

IT侠的运营宗旨是为南大在校师生提供完全免费的计算机软硬件服务。用行动说话，据IT侠预约系统不完全统计，三年来处理预约订单三千多次，为广大师生节省了几十万元。团队于2013年荣获江苏省百优志愿服务“小薇奖”（重点项目）。倡导公益之心，荣获广泛好评，我们将善意和爱心扩散到南大每个领域。

<h2>历任主席</h2> 
<div class="row">
	<div class="6u 12u$(medium)">
		<h3>鼓楼</h3>
		{% for pre in site.data.president %}
		<div class="box row">
			<div class="6u 12u$(small)">
				<img class="people" src="assets/images/people/{{ pre.img }}">
			</div>
			<div class="6u$ 12u$(small)">
				<h4>{{pre.name}}</h4>
				<h5>{{pre.time}}</h5>
				<h5>{{pre.college}}</h5>
				
			</div>
		</div>
		{% endfor %}
	</div>
	<div class="6u$ 12u$(medium) ">
		<h3>仙林</h3>
		{% for pre in site.data.president_xianlin %}
		<div class="box row">
			<div class="6u 12u$(small)">
				<img class="people" src="assets/images/people/{{ pre.img }}">
			</div>
			<div class="6u$ 12u$(small)">
				<h4>{{pre.name}}</h4>
				<h5>{{pre.time}}</h5>
				<h5>{{pre.college}}</h5>
				
			</div>
		</div>
		{% endfor %}
	</div>
</div>


