---
layout: post
title: Calendar
description: Online calendar of seminars and events
image: assets/images/jupiter.jpg
image-show: false
nav-menu: true
show-tile: true
order: 5

---

<script>
function CopyToClipboard(id)
{
var r = document.createRange();
r.selectNode(document.getElementById(id));
window.getSelection().removeAllRanges();
window.getSelection().addRange(r);
document.execCommand('copy');
window.getSelection().removeAllRanges();
}
</script>

<iframe width="1000" height="800" src="https://framagenda.org/apps/calendar/embed/BJkXk4dmeB3P89Lz"></iframe>

<p></p>
*You can subscribe to this calendar by using this url in your calendar application:*

<span id="calendar">
```https://framagenda.org/remote.php/dav/public-calendars/BJkXk4dmeB3P89Lz?export```</span>
<a href="#" onclick="CopyToClipboard('calendar');return false;" class="button small">Copy</a>
