---
layout: post
title: 教程
---

## 快速检索

为了方便大家对知识库（<a href="#docintro">介绍见下方</a>）的教程内容进行检索，可以直接下方输入进行搜索噢~

<form>
  <input id="doc-search-input" style="color: #272727">
  <a id= "doc-search-button" class="button small"><font size="4">检索</font></a>
</form>

<script>
  // 一个简单粗暴的搜索 by某个萌新 ╮(╯▽╰)╭
  // 被另一个萌新更新了一下
  document.querySelector('#doc-search-button').addEventListener('click', () => {
    var text = document.querySelector('#doc-search-input').value;
    if (!text) return;
    var q = encodeURIComponent(text);
    window.open('https://www.yuque.com/search?scope=itxia&q=' + q);
  });
</script>

> 空格隔开搜索更佳，如“无法上网”可以搜“无法（空格）上网”。常用关键词：（无法）上网、激活、蓝屏、卸载

## IT 侠文档

### 推荐阅读

无论你是社团新人还是感兴趣的路人或者尝试自救的勇者，都非常推荐你了解下面的文档：

- [无法上网类问题自我排查指南](https://www.yuque.com/itxia/help/network_problem)
- [PE 制作与常用工具](https://www.yuque.com/itxia/help/itxia_toolkits)
- [IT 侠软件工具箱下载](https://pan.baidu.com/s/1D_YV4T-Lv43jF8bWD72SoA)（提取码：yosh）
- [面向小白的 Windows10 重装/安装教程](https://www.yuque.com/itxia/article/install_win10_from_scratch)
- [关于南大正版 Adobe 全家桶，你还需要知道……](https://www.yuque.com/itxia/article/nju_adobe_tips)

### IT 侠知识库

更多的教程文档可以直接进入我们的文档库浏览。

- [IT 侠在线互助常见问题集（杂烩版）](https://www.yuque.com/itxia/timdoc/help_original)
- [IT 侠在线互助常见问题集（优化版）](https://www.yuque.com/itxia/help)
- [IT 侠教程&记录系列](https://www.yuque.com/itxia/article)

## <span id="docintro">介绍</span>

<p>与众多社团相比，IT侠虽然成立并不算久，却也在努力发展、积累。</p>

<p>“久病成医”，是大多数“小白”成长为“大佬”的必经之路；IT侠也不例外。</p>

<p>IT侠每次施展的技术，几乎都源自过去其某个不具名的时刻所踩过的坑。“小白”时期的IT侠也会上网检索大量的网页，参考千奇百怪的方案，折腾到抓狂。而这些，无论是对于求助者、对于本社新人，探索之路都是极其花费时间的，甚至还有一定风险。网上的教程眼花缭乱，良莠不齐，比较突出的问题有：</p>

- 过时的内容——软件或操作系统版本更迭，使用过时的方法处理新的问题。
- 不具普遍性——自己的问题解决后，并不会给出详细的症状、触发条件，因此并不意味着这个教程在其他人那里有效。
- 缺乏原创性——人云亦云，以某些社区为例，大量的文章内容雷同，文章很多但实际上信息很少。
- 缺乏严谨性——知其然而不知其所以然，甚至误导他人，造成“病情恶化”的后果。
- 阅读不友好——完全没有从阅读者的角度来分享知识。

<p>因此，IT侠整合了许多社团的积累，将其发布到公开的平台上，以帮助<b>无论是不是社团成员</b>的任何感兴趣的、喜欢自己尝试的、爱折腾的、有求知欲的同学，同时也欢迎他们参与到这些“共享知识”的行动中来。</p>
