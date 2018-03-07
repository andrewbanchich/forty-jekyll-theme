---
layout: home
title: Home
landing-title: 'Blacksmith Project'
description: null
image: null
author: null
---

*Blacksmith Project* is my training project which purpose is to improve in being a Fullstack web developper.

#### Why this app:

I am building an Role Playing Game helper app, because I love playing RPGs, but I play with friends that live far away.
So, we play with VOIP software and [Roll20](https://roll20.net/).

But we had one problem that occurs frequently. Two players are playing with one computer, meaning that it is not possible 
to send a pm to one without the other being able to see it.
The other thing is that, in fine, we are not using many features from Roll20, only the character's data and the roll dice feature.
( You can type `/roll 100` to roll a dice of 100 faces).

That's why I choose to create this app. It will provide characters data, the ability to launch dices, and private messages to players. 
It will be accessible with smartphones, meaning that the couple will be able to have private messages from the GameMaster.

#### The stack:

- a **Symfony** (*PHP*) API, available [here](https://github.com/BlacksmithProject/API). It will provide the Users and Games system.
- a **Node** Server (*Javascript*). It will use sockets to inform all the players when a dice is cast. It will also call the API to register all the diceRolls.
- a Front app with **VueJs** (*Javascript*). This will be used by the final users (GameMasters and Players).