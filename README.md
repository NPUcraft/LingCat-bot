<div align="center">

# SiriusBot2

基于 [oicq](https://github.com/takayama-lily/oicq) 的 qq 机器人

[![license](https://img.shields.io/github/license/Sirius0v0/SiriusBot)](https://choosealicense.com/licenses/agpl-3.0/)
[![version](https://img.shields.io/github/package-json/v/Sirius0v0/SiriusBot)](https://github.com/NPUcraft/LingCat-bot)
[![node](https://img.shields.io/node/v/oicq)](https://github.com/takayama-lily/oicq)

</div>

## 简介

一款什么都想做的QQ机器人。基于 [`oicq`](https://github.com/takayama-lily/oicq ) 开发。

灵喵 致力于为群友提供一个娱乐的互动方案，让群友们友好交流，活跃群内话题。同时还期望其能够让qq群与MC服务器通信，带来更佳的游戏体验。

> 介于作者技术力低下，LingCat-bot 的体验可能并不是很好。如果使用中有任何意见或者建议都欢迎提交[issue](https://github.com/NPUcraft/LingCat-bot/issues)进行反馈，我会努力去完善它。

## 开始使用

~~**（推荐方式）通过脚手架安装【已废弃】**~~

1. 安装管理工具

```bash
$ npm i sirios-cli -g
```

2. 初始化项目：

```bash
$ sirios init
```

3. 运行：

```bash
$ sirios run
```
4. 创建插件 ：

```bash
# 注意在项目根目录下执行
$ sirios plugin new
```
**（纯净安装）不使用脚手架安装**

1. 从 GitHub 仓库拉取项目

>**注意**
>
>从 dev 分支中安装意味着你将使用最新特性的代码，它们并没有进行充分的稳定性测试 在任何情况下请不要将其应用于生产环境!

```bash
# main分支
$ git clone https://github.com/Sirius0v0/SiriusBot.git#main
# dev分支
$ git clone https://github.com/Sirius0v0/SiriusBot.git#dev
```

2. 安装依赖

```bash
$ npm i
```

3. 运行

```bash
$ npm run start
```


## TODO List

+ 小游戏
  - [x] 24点
  - [x] 超级井字棋
  - [x] 今日人品、今日菜品、今日MC、今日运势
  - [ ] 今日车万
  - [ ] 人生重开模拟器
  - [ ] 生命线
  - [ ] 魔塔
  - [ ] 灯神
  - [ ] 猜平均数游戏

+ 查询与服务
  - [x] MC服务器状态
  - [x] 为你百度
  - [x] 自定义回复
  - [x] 自定义正则回复
  - [x] 随机问答
  - [x] 年度水群报告
  - [ ] wiki查询
  - [ ] bilibili直播间推送
  - [ ] UP主视频更新推送
  - [ ] MC&QQ跨平台聊天
  - [ ] 限免游戏信息

## 技术细节

机器人基于 Node.js 开发，感谢以下开源项目：

+ [oicq](https://github.com/takayama-lily/oicq)
+ [Jimp](https://github.com/oliver-moran/jimp)
+ [cheerio](https://github.com/cheeriojs/cheerio)
+ [mathjs](https://github.com/josdejong/mathjs)
+ [lodash](https://github.com/lodash/lodash)
+ [got](https://github.com/sindresorhus/got)
+ [seed-random](https://github.com/ForbesLindesay/seed-random)
+ [log4js](https://github.com/log4js-node/log4js-node)

## 一些参考资料

> [JavaScript语言基础](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) 
> 
> [Node.js入门教程](http://nodejs.cn/learn) 
> 
> [5分钟上手TypeScript](https://www.tslang.cn/docs/handbook/typescript-in-5-minutes.html) 
> 
> [优秀npm三方库集合](https://github.com/sindresorhus/awesome-nodejs) 


## 贡献

如果你在使用过程中发现任何问题，可以 [提交 issue](https://github.com/NPUcraft/LingCat-bot/issues) 或自行 fork 修改后提交 pull request。

如果你要提交 pull request，请确保你的代码风格和项目已有的代码保持一致，变量命名清晰，有适当的注释。

## 许可证

本项目使用 [`AGPL-3.0`](https://choosealicense.com/licenses/agpl-3.0/) 作为开源许可证。

