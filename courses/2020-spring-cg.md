---
layout: post
title: Computer Graphics - 2020 Spring
nav-menu: false
show_tile: false
---

* Instructor: [Yoonsang Lee](../people/yoonsang-lee.html)
* Teaching Assistant: [Geuntae Park](../people/geuntae-park.html)
* Undergraduate Mentor: Baek, Jong Woon 
* Time / Location: 
  * Live online lectures and labs due to the COVID-19 pandemic.
  * Mon 10:00-12:00 / Online (originally 207 IT.BT Building) - Lecture
  * Wed 13:00-15:00 / Online (originally 609 IT.BT Building) - Lab

## Course Outline

This course introduces the fundamental principles of computer graphics and the mathematical concepts required for them.
Topics includes the movement and placement of objects, animation, mapping to 2D screens, representation of shapes and appearance of 3D objects, and rendering pipeline.
Students will practice the principles using the legacy OpenGL API in the lab sessions.

## Schedule

|Week| Date            | Topics   | Reference Materials |
|--- | ---             | ---      | --- |
| 1  | Mar 16 / Mar 18 | [1 - Course Intro] / [1 - Lab - Environment Setting], Lab Assignment 1  | |
| 2  | Mar 23 / Mar 25 | [2 - Introduction to NumPy, OpenGL] / [2 - Lab - Gitlab], Lab Assignment 2  | |
| 3  | Mar 30 / Apr 01 | [3 - Transformation 1] / Lab Assignment 3  | |
| 4  | Apr 06 / Apr 08 | [4 - Transformation 2] / Lab Assignment 4  | |
| 5  | Apr 13 / Apr 15 | [5 - Affine Matrix, Rendering Pipeline] / Lab Assignment 5  | |
| 6  | Apr 20 / Apr 22 | [6 - Viewing, Projection] / Lab Assignment 6  | [6-reference-projection]<br/> [6-reference-viewing] |
| 7  | Apr 27 / Apr 29 | [7 - Hierarchical Modeling, Mesh] / Lab Assignment 7  | |
| 8  | May 04 / May 06 | [8 - Lighting & Shading] / Lab Assignment 8 | |
| 9  | May 11 / May 13 | [9 - Orientation & Rotation] / Lab Assignment 9 | [9-reference-naive-rotvec2rotmat]<br/> [9-reference-quaternions]<br/> [9-reference-rotmat-properties] |
| 10 | May 18 / May 20 | [10 - Animation] / Lab Assignment 10  | |
| 11 | May 25 / May 27 | [11 - Curves] / Lab Assignment 11  | [11-reference-splines] |
| 12 | Jun 01 / Jun 03 | [12 - More Lighting, Texture]  | |
| 13 | Jun 08 / Jun 10 | [13 - Rasterization & Visibility]  | [13-reference-rasterization,clipping]<br/> [13-reference-RayTracing] |
| 14 | Jun 15 / Jun 17 | Final Exam Week |  |
| 15 | Jun 22 / Jun 24 | Final Assignment   |  |

[1 - Course Intro]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/1-CourseIntro.pdf
[1 - Lab - Environment Setting]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/1-Lab-EnvSetting.pdf
[2 - Introduction to NumPy, OpenGL]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/2-IntroNumPyOpenGL.pdf
[2 - Lab - Gitlab]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/2-Lab-Gitlab.pdf
[3 - Transformation 1]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/3-Transformation1.pdf
[4 - Transformation 2]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/4-Transformation2.pdf
[5 - Affine Matrix, Rendering Pipeline]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/5-AffineMatrix,RdrPipe.pdf
[6 - Viewing, Projection]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/6-Viewing,Projection.pdf
[6-reference-projection]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/6-reference-projection.pdf
[6-reference-viewing]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/6-reference-viewing.pdf
[7 - Hierarchical Modeling, Mesh]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/7-Hierarchy,Mesh.pdf
[8 - Lighting & Shading]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/8-Lighting&Shading.pdf
[9 - Orientation & Rotation]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/9-Orientation&Rotation.pdf
[9-reference-naive-rotvec2rotmat]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/9-reference-naive-rotvec2rotmat.pdf
[9-reference-quaternions]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/9-reference-quaternions.pdf
[9-reference-rotmat-properties]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/9-reference-rotmat-properties.pdf
[10 - Animation]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/10-Animation.pdf
[11 - Curves]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/11-Curves.pdf
[11-reference-splines]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/11-reference-splines.pdf
[12 - More Lighting, Texture]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/12-MoreLighting,Texture.pdf
[13 - Rasterization & Visibility]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/13-Rasterization&Visibility.pdf
[13-reference-rasterization,clipping]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/13-reference-rasterization,clipping.pdf
[13-reference-RayTracing]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/lecture-slides/13-reference-RayTracing.pdf

## Class Assignments

| [Class Assignment 1: Basic OpenGL Viewer & Drawing a Hierarchical Model] |

<div class="row">
<div class="3u 12u$(small)">
박수한
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c1/박수한.png" alt="" />
</div>
<div class="3u 12u$(small)">
연승훈
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c1/연승훈.png" alt="" />
</div>
<div class="3u 12u$(small)">
위지승
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c1/위지승.png" alt="" />
</div>
<div class="3u 12u$(small)">
윤성우
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c1/윤성우.png" alt="" />
</div>
</div>


| [Class Assignment 2: Obj Viewer] ([sample objs]) |

<div class="row">
<div class="3u 12u$(small)">
고영욱
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c2/고영욱.png" alt="" />
</div>
<div class="3u 12u$(small)">
박수한
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c2/박수한.png" alt="" />
</div>
<div class="3u 12u$(small)">
위지승
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c2/위지승.png" alt="" />
</div>
<div class="3u 12u$(small)">
유수영
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c2/유수영.png" alt="" />
</div>
<div class="3u 12u$(small)">
전윤성
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c2/전윤성.png" alt="" />
</div>
</div>


| [Class Assignment 3: Bvh Viewer] ([sample bvhs]) |

<div class="row">
<div class="4u 12u$(small)">
고영욱
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c3/고영욱.png" alt="" />
</div>
<div class="4u 12u$(small)">
박수한
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c3/박수한.png" alt="" />
</div>
<div class="4u 12u$(small)">
전윤성
<img src="https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/c3/전윤성.png" alt="" />
</div>
</div>


[Class Assignment 1: Basic OpenGL Viewer & Drawing a Hierarchical Model]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/ClassAssignment1-2020.pdf
[Class Assignment 2: Obj Viewer]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/ClassAssignment2-2020.pdf
[sample objs]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/ClassAssignment2-obj.zip
[Class Assignment 3: Bvh Viewer]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/ClassAssignment3-2020.pdf
[sample bvhs]: https://gitcgr.hanyang.ac.kr/courses/2020-spring-cg/class-assignments/ClassAssignment3-bvh.zip
