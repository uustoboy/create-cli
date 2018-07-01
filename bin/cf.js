#!/usr/bin/env node
'use strict';
const program = require('commander');
const appInfo = require('./../package.json');
const {_class,_default} = require('../lib/class.js');
const log = console.log;

program
  .version(appInfo.version,'-v, --version')
  .usage('创建简单前端项目! [options] <package>')
  .parse(process.argv);

program
    .command('delete')
    .alias('del')
    .description('删除文件')
    .action((cmd,option) => {
        _class(cmd,option);
    })

program
    .command('zip-local')
    .alias('zip')
    .description('压缩文件')
    .action((cmd,option) => {
        _class(cmd,option);
    })

program
    .command('unzip-local')
    .alias('unzip')
    .description('解压缩文件')
    .action((cmd,option) => {
        _class(cmd,option);
    })

program
    .command('min-css')
    .alias('mincss')
    .description('压缩css')
    .action((cmd,option) => {
        _class(cmd,option);
    })

program
    .command('beautify-css')
    .alias('beacss')
    .description('格式化css')
    .action((cmd, option) => {
        _class(cmd, option);
    })

program
    .command('min-js')
    .alias('minjs')
    .description('压缩js')
    .action((cmd,option) => {
        _class(cmd,option);
    })

program
    .command('beautify-js')
    .alias('beajs')
    .description('格式化js')
    .action((cmd, option) => {
        _class(cmd, option);
    })

program
    .command('new-html')
    .alias('n')
    .description('创建默认html')
    .option('-a, --newApp', '创建app端默认html')
    .option('-p, --newPc', '创建pc端默认html')
    .action((cmd, option) => {
        _class(cmd, option);
    })

program
    .command('download-sass')
    .alias('ds')
    .description('下载base_mixins')
    .action((cmd,option) => {
        if( option ){
            _class(cmd, option);
        }else{
            _default(cmd);
        }
    })

program
    .command('app [cmd]')
    .alias('a')
    .description('创建app项目文件夹')
    .option('-y, --fast', '快速创建默认目录')
    .action((cmd,option) => {
        _class(cmd,option);
    }).on('--help', function() {

        // 图片文字 http://ascii.mastervb.net/text_to_ascii.php

        log("                   ___                __    _   ");
        log("                 .' ..]              [  |  (_)  ");
        log("         .---.  _| |_  ______  .---.  | |  __   ");
        log("        / /'`\]'-| |-'|______|/ /'`\] | | [  |  ");
        log("        | \__.   | |          | \__.  | |  | |  ");
        log("        '.___.' [___]         '.___.'[___][___] ");

        log();
        log('     app 创建app项目文件夹');
        log();
        log('    -y, --fast 快速创建默认目录');
        log();
    });

program
    .command('pc [cmd]')
    .alias('p')
    .description('创建pc项目文件夹')
    .option('-y, --fast', '快速创建默认目录')
    .action((cmd,option) => {
        _class(cmd,option);
    }).on('--help', function() {

        // 图片文字 http://ascii.mastervb.net/text_to_ascii.php

        log("                   ___                __    _   ");
        log("                 .' ..]              [  |  (_)  ");
        log("         .---.  _| |_  ______  .---.  | |  __   ");
        log("        / /'`\]'-| |-'|______|/ /'`\] | | [  |  ");
        log("        | \__.   | |          | \__.  | |  | |  ");
        log("        '.___.' [___]         '.___.'[___][___] ");

        log();
        log('     pc 创建pc项目文件夹');
        log();
        log('    -y, --fast 快速创建默认目录');

        log();
    });




//默认不传参数输出help
if (!process.argv[2]) {
    program.help();
}

program.parse(process.argv);
