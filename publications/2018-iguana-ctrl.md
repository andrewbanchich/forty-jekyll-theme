---
layout: post
title: Control of an Iguana Character Using Soft-Body Simulation
nav-menu: false
show_tile: false
---

[Taesoo Kwon](http://calab.hanyang.ac.kr/cgi-bin/home.cgi?node=Taesoo), Hoimin Kim, [Yoonsang Lee](../people/yoonsang-lee.html)  
IEEE Access (2018)

## Abstract
The locomotion of lizards is characterized by lateral bending of the body, which is distinct from quadrupedal mammals such as dogs. We propose a method to control a physically simulated iguana character as a representative species of lizards, which can move while physically interacting with the environment, and reproduces the flexible characteristics of a lizard in real time. The main challenges lie in expressing the deformable characteristics of an iguana and adapting low-quality captured motions to various terrain conditions and iguana poses. Our iguana character is designed as a soft-body character, which models the elasticity of an iguana body so that it can express flexible and realistic motions. Applying the motion capture data obtained from an iguana is problematic because it is captured using only a sparse set of markers in an environment different to the simulation environment. To resolve these problems, we transform the low-quality captured motion into full-body motion and adapt it to the terrain in real time using our motion adaptation algorithm. To control the various movements of an iguana, a motion graph is constructed to choose an appropriate motion depending on the situation. The chosen reference motion is adapted to the local terrain, which has irregular height, in real time. A soft-body iguana model is then simulated by physically tracking the time-varying reference motion. We demonstrate that our approach can generate natural and flexible movements of an iguana on hilly terrain. 

## Paper
Download: [pdf](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8555550) (2.7MB)  
[IEEE Xplore page](https://ieeexplore.ieee.org/document/8555550)

## Video 
<div id="iframe_container"> <div id="iframe">
<iframe width="1280" height="720" src="https://www.youtube.com/embed/c37VEexDZaY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  
</div></div>  
Download: [mp4](https://gitcgr.hanyang.ac.kr/publications/2018-iguana-ctrl/FINAL video.mp4) (49.1MB)
