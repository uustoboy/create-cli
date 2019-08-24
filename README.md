# create-cli
![](https://img.shields.io/npm/v/create-cli.svg?style=flat)&nbsp;&nbsp;&nbsp; ![](https://img.shields.io/npm/dt/create-cli.svg)&nbsp;&nbsp;&nbsp;[![GitHub stars](https://img.shields.io/github/stars/uustoboy/create-cli.svg?style=social)](https://github.com/uustoboy/create-cli/stargazers)

创建简易前端项目
(简单的创建三个文件夹和一个默认模板html页和Vue项目)


---
### 安装create-cli
```
  $ npm install -g create-cli
```
### 前提node >= 6.10.3

参考图片:<br/>
![image](https://github.com/uustoboy/create-cli/raw/master/explain-img/1.png)

### 查看create-cli版本命令
```
  $ cf -v
```

### 创建pc端模板命令
```
   $ cf p xiangmu / $ cf pc xiangmu
```
### 速建pc端模板命令
```
   $ cf p xiangmu -y  / $ cf pc xiangmu -y
```
### 创建app端模板命令
```
   $ cf a xiangmu / $ cf app xiangmu
```
### 速建app端模板命令
```
   $ cf p xiangmu -y / $ cf app xiangmu -y
```
### 删除项目文件
```
   $ cf del xiangmu
```
### 压缩项目文件
```
   $ cf zip xiangmu
```
### 压缩css
```
   $ cf mincss xiangmu/c/index.css
```
### 格式化css
```
   $ cf beacss xiangmu/c/index.css
```
### 压缩js
```
   $ cf minjs xiangmu/j/index.js
```
### 格式化js
```
   $ cf beajs xiangmu/j/index.js
```
### 单独下载base_mixins
```
   $ cf ds / $ cf ds xiangmu/s
```
### 创建默认HTML默认页
```
   $ cf n xiangmu/index.html -p (PC 端默认html页) / $ cf n xiangmu/index.html -a (APP 端默认html页)
```
### 启动静态服务器
```
   $ cf s 3000(端口号)
```
### 创建Vue项目(基于vue-cli 3)
```
   $ cf create projectName
```

参考图片:<br/>
![image](https://github.com/uustoboy/create-cli/raw/master/explain-img/2.png)<br/>
![image](https://github.com/uustoboy/create-cli/raw/master/explain-img/3.png)<br/>
![image](https://github.com/uustoboy/create-cli/raw/master/explain-img/4.png)<br/>
![image](https://github.com/uustoboy/create-cli/raw/master/explain-img/5.jpg)<br/>
