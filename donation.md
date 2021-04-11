---
layout: post
title: 捐赠
---

## 关于捐赠

<p>IT侠成立至今，秉承着为大家公益服务的理念，解决了广大师生的诸多软硬件问题。</p>

<p>这其中不乏各类疑难杂症，IT侠们在解决这些问题时，甚至要放下自己的事，来帮助有需要的校友。</p>

<p>时至今日，我们依然坚持完全免费、完全公益的原则，但随着订单的增多，团队运行中耗材、电费、小配件等支出越来越多。
<br>现在 GEEK 组的 IT 侠们在维修时，所用的工具还是当初成立时的校友捐赠的。而硅脂等耗材逐渐见底，无以后继。
<br>另外，IT侠在两个校区每年都会招新，培养新人时也需要旧的机器用于练习。</p>

<p>2013年起，IT侠的预约网站正式上线，为此IT侠又增加了服务器与域名的费用。
<br>然而学校主管网络建设的部门对此没有提供任何帮助，无奈之下仅能由我们几位前辈友情赞助。
<br>时至今日，IT侠的网站等服务仍架设在自费的学生服务器上。</p>

<p>所以，如果您手头正好有闲置的维修用品，亦或接受过IT侠帮助，想要捐赠部分金额的，请联系我们。
<br>我们将定期更新<a href="#donation_list">捐赠者列表</a>并公布<a href="#budget_list">物资去向</a>，如果您对资金去向有疑问，欢迎问询。<br>对于帮助过IT侠的校友，将会得到IT侠的优先急诊服务。</p>

---

## 捐赠方式

<div class="inner row">
	<div class="6u 12u$(medium)">
		<h3>物资捐助</h3>
		<p>捐赠可为以下物品（但不限于此）</p>		
		<ul>
			<li>闲置或者损坏的电脑/闲置或淘汰的电脑配件</li>
			<li>硅脂/棉签/3M胶带/卫生纸/302/AB胶/酒精</li>
			<li>硅胶垫/硬盘盒/螺丝盒/镊子/螺丝刀/螺丝</li>
			<li>8g/16g/32g大小U盘</li>
		</ul>
		<p><b>注：更换下的污损电脑外壳、鼓包电池等废物我们无法处理，请另寻恰当方式处理。</b></p>
		<p>若您有捐赠意向，可在IT侠微信公众号留言或发邮件至<a href="mailto:{{ site.email }}">njuitxia@outlook.com</a>，我们将及时与您联系。您也可以在我们工作室值班时间内直接带来。</p>
	</div>
	<div class="6u 12u$(medium)">
		<h3>资金捐助</h3>
		<p> IT侠接受任何金额的捐赠（下方支付宝扫码），请在捐赠时备注说明<b>【IT侠捐款】+ 您的信息</b>（若无则默认使用支付宝的记录）以便我们管理记录，我们将公示您的捐赠信息和去向。</p>		
		<div align="center">
			<img src="assets/images/alipay_donation.jpg" height='141' width='141'>
		</div>
	</div>
</div>

---

## 捐赠公示

> 注：由于工作室腾挪、记录丢失等问题，2018 年上半年有些捐赠电脑或物品的用户信息我们未及时收集，因此下面没有列出，如果您曾经捐赠帮助过我们，请微信联系我们来认领您的捐赠。

<div class="row">
	<div class="table-wrapper 6u 12u$(medium)">
		<h3 id="donation_list">捐赠者列表</h3>
		<table>
			<thead>
				<tr>
					<th width="25%">捐赠者</th>
					<th>物资/金额</th>
					<th>捐赠日期</th>
				</tr>
			</thead>
			<tbody>
				{% for di in site.data.donation_list %}
				<tr>
					<td width="25%">{{ di.name }}</td>
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
