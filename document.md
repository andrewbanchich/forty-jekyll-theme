---
title: 教程
layout: post
description: 
image:
---

## 我们的想法

<p>与众多社团相比，IT侠虽然成立并不算久，却也在努力发展、积累。</p>

<p>“久病成医”，是大多数“小白”成长为“大佬”的必经之路；IT侠也不例外。</p>

<p>IT侠每次施展的技术，几乎都源自过去其某个不具名的时刻所踩过的坑。“小白”时期的IT侠也会上网检索大量的网页，参考千奇百怪的方案，折腾到抓狂。而这些，无论是对于求助者、对于本社新人，探索之路都是极其花费时间的，甚至还有一定风险。网上的教程眼花缭乱，良莠不齐，比较突出的问题有：</p>

- 过时的内容——软件或操作系统版本更迭，使用过时的方法处理新的问题。
- 不具普遍性——自己的问题解决后，并不会给出详细的症状、触发条件，因此并不意味着这个教程在其他人那里有效。
- 缺乏原创性——人云亦云，以某些社区为例，大量的文章内容雷同，文章很多但实际上信息很少。
- 缺乏严谨性——知其然而不知其所以然，甚至误导他人，造成“病情恶化”的后果。
- 阅读不友好——完全没有从阅读者的角度来分享知识。

<p>因此，IT侠整合了许多社团的积累，将其发布到公开的平台上，以帮助<b>无论是不是社团成员</b>的任何感兴趣的、喜欢自己尝试的、爱折腾的、有求知欲的同学，同时也欢迎他们参与到这些“共享知识”的行动中来。</p>

## 我们的分享

### 快捷搜索

为了方便大家对内容进行检索，可以直接下方进行搜索噢~

> 空格隔开搜索更佳，如“无法上网”可以搜“无法 联网”
> 常用关键词：无法上网、Windows激活*

<form>
<input id="yqsearch" style="color:#272727">
<a class="button small" onclick="search()"><font size="4">检索知识库</font></a>
</form>

<script>
    //一个简单粗暴的搜索 by某个萌新 ╮(╯▽╰)╭
    function search() {
        var x, encodedx, url;
        url = "https://www.yuque.com/itxia/help/s?q="
        // 获取 id="yqsearch" 的值
        x = document.getElementById("yqsearch").value;
        if (x!=""){
            //转换url
            encodedx = encodeURI(x)
            window.open(url + encodedx);
        }
    }
</script>

### IT侠知识库 

- [IT侠在线互助常见问题集（杂烩版）](https://www.yuque.com/itxia/timdoc/help_original)
- [IT侠在线互助常见问题集（优化版）](https://www.yuque.com/itxia/help)
- [IT侠教程&记录系列](https://www.yuque.com/itxia/article)

### 推荐阅读

- [PE制作与常用工具](https://www.yuque.com/itxia/help/itxia_toolkits)