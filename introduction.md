---
layout: post
title: 关于
---

IT侠的前身是南京大学小百合BBS下 Notebook 版的软件侠。2012年夏，一起“珠江路装系统被坑”事件引起了小百合站友的义愤填膺。在 NoteBook 版的倡议下，志愿者团队“软件侠”迅速组建，旨在帮助解决系统、病毒等软件问题。2013年4月在校团委的支持下，IT侠以软件侠为组织基础迅速组建，并增加硬件服务。2013年11月[IT侠维修预约网站]({{ site.socials.Help }})上线。2018年春季，IT侠在社联注册，社团名称定为“南京大学IT侠公益协会”。2019年，社团性质变更后，又更名为“南京大学IT侠互助协会”。

目前，IT侠在仙林鼓楼均设有分部。IT侠内部分为三个部门，分别是提供免费软硬件维修服务和指导技术培训的 GEEK 组、负责运营宣传策划并且组织活动的 OP 组以及负责预约网站开发维护的 WEB 组。

IT侠的宗旨是为南大在校师生提供完全免费的电脑软硬件服务，并向广大师生普及电脑技术的基础知识。据IT侠预约系统不完全统计，六年来IT侠共处理预约订单5000多人次，为广大师生节省了几十万元。团队于2013年荣获江苏省百优志愿服务“小薇奖”（重点项目），于2018年获南京大学公益创意大赛二等奖。倡导公益之心，荣获广泛好评，我们将善意和爱心扩散到南大每个领域。

<h2>历任主席/负责人</h2> 
<div class="row">
	<div class="6u 12u$(medium)">
		<h3>鼓楼</h3>
		{% for pre in site.data.president %}
		<div class="box row">
			<div class="6u 12u$(xsmall)">
				<img class="people" src="assets/images/people/{{ pre.img }}">
			</div>
			<div class="6u$ 12u$(xsmall)">
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
			<div class="6u 12u$(xsmall)">
				<img class="people" src="assets/images/people/{{ pre.img }}">
			</div>
			<div class="6u$ 12u$(xsmall)">
				<h4>{{pre.name}}</h4>
				<h5>{{pre.time}}</h5>
				<h5>{{pre.college}}</h5>
				
			</div>
		</div>
		{% endfor %}
	</div>
</div>


