# 南京大学 IT 侠网站主页

- 框架: [Jekyll](https://jekyllrb.com/docs/)
- 主题: [Forty](https://github.com/andrewbanchich/forty-jekyll-theme)

## 项目地址

- NJU-GitLab: [https://git.nju.edu.cn/nju-itxia/home](https://git.nju.edu.cn/nju-itxia/home)
- GitHub: [https://github.com/NJU-itxia/home](https://github.com/NJU-itxia/home)

> 推荐从 NJU-GitLab 克隆仓库；建议使用 Git 远程更新，不要直接在网站上更改

## 本地启动

推荐使用 Docker 启动

### Docker

```sh
docker run --rm -it -p="4000:4000" -v="$PWD:/srv/jekyll" jekyll/jekyll jekyll serve
```

> 需要安装 Docker

### Ruby

```sh
gem install jekyll jekyll-timeago bundler
bundle exec jekyll serve
```

> 需要安装 Ruby 与 RubyGems

## 本地开发

### 新增页面

- 新建 Markdown 文件
- 增加头部说明，如下

```
---
layout: post
title: YOUR-TITLE
image: YOUR-IMAGE
--- 
```

- 增添后续内容
- 如需将链接加入首页模块，编辑`./_data/index_url.yml`并同步修改`./_config.yml`内的`tiles-count`一项数字

### 更新数据

更新内容常包括主席团更替、捐赠公示和资金去向等等

> 具体请直接参考`./_data`下的 .yml 文件，以及`./assets/images`下的图片

> 格式很简单，请务必注意缩进

## 目录结构

```sh
.
├── _data
│   ├── budget_list.yml # 资金去向公示
│   ├── donation_list.yml # 捐赠列表 
│   ├── index_url.yml # 首页模块
│   ├── president_xianlin.yml # 仙林主席
│   └── president.yml # 鼓楼主席
│
├── _includes
│   ├── footer.html # 底部导航栏
│   ├── head.html # 样式与脚本
│   ├── header.html # 顶部导航栏
│   └── tiles.html
│
├── _sass
│
├── _site # 构建产物
│
├── appointment # 预约系统（废弃）
│
├── assets
│   ├── css
│   ├── fonts
│   ├── images # 图片存放位置
│   └── js
│
├── guide
│   └── markdown # Markdown 教程
│
├── tools
│   └── mdcvt # 公众号工具
│
├── _config.yml
├── .gitignore
├── .gitlab-ci.yml
├── bonus.html # 蓝屏彩蛋
├── bsod.html # 蓝屏彩蛋
├── CNAME
├── favicon.ico # 图标
├── LICENSE.md
├── README.md
│
├── index.md # 主页
├── service.md # 预约页面
├── recruiment.md # 招新页面
├── document.md # 教程页面
├── warranty.md # 维权指引页面
├── donation.md # 捐赠页面
├── introduction.md # 关于页面
├── board_games.md # 桌游目录页面
│
```
