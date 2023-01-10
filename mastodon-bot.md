---
layout: post
title: Mastodon bot
description: Use our bot to post or boost
image: assets/images/saturn.jpg
image-show: false
nav-menu: true
show-tile: true
order: 7
---

If you are a planetary scientist working in Ile-de-France, you can have your Mastodon posts automatically boosted by our account, or post directly using our account. We use a bot to do this, and in order for the bot to recognize you, it is necessary for the <a href="https://astrodon.social/@IDF_Planets">@IDF-Planets</a> account to follow you. Just send us a message and we will be happy to add you to the list.

### Automatically boost a post
If you would like to post something on Mastodon using your own account, and have @IDF_Planets automatically boost this post, just include
```
!@IDF_Planets@astrodon.social
```
at any place in your post. The bot looks for such posts every 5 minutes, and when a post is found, it will be automatically boosted.

### Post directly using @IDF_Planets
If you would like to post something directly from the @IDF_Planets account, you only need to send a private message to @IDF_Planets. To do so, start your post with
```
@IDF_Planets@astrodon.social
```
Then, make sure that the post visibility is set to "private": depending on the client you are using, this could be something similar to "@", "mentioned people only", "direct message", or the mailbox symbol. The bot will search for these private messages every 5 minutes, and then repost everything that comes after `@IDF_Planets` directly from the @IDF_Planets account.

Please be careful, as every direct message to @IDF_Planets is reposted if this account follows you! If this causes problems, we will deactivate this functionality.
