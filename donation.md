---
title: 捐赠
layout: post
description: 
image:
---

<p>IT侠成立至今，秉承着为大家公益服务的理念，解决了广大师生的诸多软硬件问题。</p>

<p>这其中不乏各类疑难杂症，IT侠们在解决这些问题时，甚至要放下自己的事，来帮助有需要的校友。</p>

<p>时至今日，我们依然坚持完全免费、完全公益的原则，但随着订单的增多，团队运行中耗材、电费、小配件等支出越来越多。
<br>现在 GEEK 组的 IT 侠们在维修时，所用的工具还是当初成立时的校友捐赠的。而硅脂等耗材逐渐见底，无以后继。
<br>另外，IT侠在两个校区每年都会招新，培养新人时也需要旧的机器用于练习。</p>

<p>2013年起，IT侠的预约网站正式上线，为此IT侠又增加了服务器与域名的费用。
<br>然而学校主管网络建设的部门对此没有提供任何帮助，无奈之下仅能由我们几位前辈友情赞助。</p>

<p>所以，如果您手头正好有闲置的维修用品，亦或接受过IT侠帮助，想要捐赠部分金额的，请联系我们。
<br>我们将定期更新<a href="#donation_list">捐赠者列表</a>并公布<a href="#budget_list">物资去向</a>，如果您对资金去向有疑问，欢迎问询。<br>对于帮助过IT的校友，将会得到IT侠的急诊室服务。</p>



<div class="row">
	<div class="6u 12u$(medium)">
		<h3>物资捐助</h3>
		<p>捐赠可为以下物品（但不限于此）</p>		
		<ul>
			<li>闲置或者损坏的电脑</li>
			<li>硅脂/棉签/3M胶带/卫生纸/302/AB胶</li>
			<li>硅胶垫/硬盘盒/镊子/螺丝刀</li>
			<li>8g/16g/32g大小U盘</li>
		</ul>
		<p>在您确认捐赠后，请联系以下同学，我们将及时与您联系。您也可以在我们工作室值班时间内直接带来。</p>
		<ul>
			<li>鼓楼 梁同学 18805157617</li>
			<li>仙林 张同学 18351887819</li>
		</ul>
	</div>
	<div class="6u$ 12u$(medium)">
		<h3>经费募捐</h3>
		<div>
		<p>捐助经费请扫描以下二维码 <br> 或者直接支付宝转帐</p>
		<p>支付宝账户<br> 张目子 18052095926</p>
		<span class="image"><img style="width:50%;" src="assets/images/alipay-sm.jpg"></span>
		</div>
	</div>
</div>

<div class="row">
	<div class="table-wrapper 6u 12u$(medium)">
		<h3 id="donation_list">捐赠者列表</h3>
		<table>
			<thead>
				<tr>
					<th>捐赠者</th>
					<th>物资/金额</th>
					<th>捐赠日期</th>
				</tr>
			</thead>
			<tbody>
				{% for di in site.data.donation_list %}
				<tr>
					<td>{{ di.name }}</td>
					<td>{{ di.detail }}</td>
					<td>{{ di.date }}</td>
				</tr>
				{% endfor %}
			</tbody>
		</table>
	</div>
	<div class="table-wrapper 6u$ 12u$(medium)">
		<h3 id="budget_list">资金去向</h3>
		<table>
			<thead>
				<tr>
					<th>日期</th>
					<th>用途</th>
					<th>费用</th>
				</tr>
			</thead>
			<tbody>
				{% for bi in site.data.budget_list %}
				<tr>
					<td>{{ bi.date }}</td>
					<td>{{ bi.detail }}</td>
					<td>{{ bi.fee }}</td>
				</tr>
				{% endfor %}
			</tbody>
		</table>
	</div>
</div>

