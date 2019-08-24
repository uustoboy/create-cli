'use strict';

const log = console.log;
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const path = require('path');
const join = path.join;
const resolve = path.resolve;
const fse = require('fs-extra');
const download = require('download');
const gitdown = require('download-git-repo');
const ora = require('ora');


//提示；
let hint = {
    info( info ){
        log( logSymbols.info, chalk.whiteBright( chalk.bgBlue( ` ${info} ` ) ) );
    },
    success( success ){
        log( logSymbols.success, chalk.whiteBright( chalk.bgGreen( ` ${success} ` ) ) );
    },
    warning( warn ){
        log( logSymbols.warning, chalk.whiteBright( chalk.bgYellow( ` ${warn} ` ) ) );
    },
    error( error ){
        log(logSymbols.error, chalk.red( error ) );
    }
}

module.exports.hint = {
    ...hint
}

//判断文件/文件夹 是否存在;
module.exports.isFile = ( _path ) => fse.pathExistsSync( _path )?true:false;

//返回绝对路径；
module.exports.getPath = ( _path ) => resolve( process.cwd(),_path?_path:'/' );

//返回时间戳;
module.exports.getTime = () =>{
    let fillZero = ( num )=>{ return num > 9 ? num :'0'+num; }
    let date = new Date();
    let year = date.getFullYear();
    let month = fillZero( (date.getMonth()+1) );
    let day = fillZero( date.getDate() );
    let hour = fillZero( date.getHours() );
    let minute = fillZero( date.getMinutes() );
    let second = fillZero( date.getSeconds() );
    let time = `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    return time;
}

//下载;
module.exports.httpDownload =  (downloadPath,createPath,hintTxt)=>{
    let progress = new staticProgress();
    progress.start('Download....');
    download( downloadPath, createPath ).then(() => {
        progress.succeed('Download 下载完成!');
        hint.success(`${hintTxt}`);
    }).catch(err => {
        progress.error();
        hint.error(err);
    });

}

//Git下载;
module.exports.gitDownload = (downloadPath,createPath,hintTxt,callback)=>{
    let progress = new staticProgress();
    progress.start('Git Download....');
    gitdown(downloadPath,createPath, (err) => {
        if (err) {
          progress.error();
          hint.error(err);
          return ;
        }
        //hint.success(`${hintTxt}`);
        progress.succeed(`${hintTxt}`);
        callback&&callback();
    });
}

//文件类型;
module.exports.getFileType = ( file,type )=>{
    let fileType,
    regType = /\.[^\.]+$/;
    if( regType.exec(file)){
         fileType = regType.exec(file)[0];
    }else{
        fileType = null;
    }
    let fileType2 = fileType?fileType.replace(/^\./,''):null;
    let fileName = fileType ?  file.replace(fileType,''): file;
    let isType = type && type == fileType2  ? true : false;
    let fillFile = null;
    if( type ){
        if( fileType ){
            if( isType ){
                fillFile = file;
            }else{
                fillFile = file.replace( fileType2 ,type);
            }
        }else{
            fillFile = `${file}.${type}`;
        }
    }else{
        fillFile = file;
    }
    let fileComplete =  /[^\/]+$/gi.exec(fillFile)[0];
    let lastPath = fillFile.replace(/[^\/]+$/gi,'');
    return {
        fileName,
        fileType,
        isType,
        fillFile,
        fileComplete,
        lastPath
    };
}

//假加载;
class staticProgress{
    constructor(){
        this.time = null;
        const cliSpinners = require('cli-spinners');
        this.slog = require('single-line-log').stdout;
        this.dot = cliSpinners.dots;
        const chalk = require('chalk');
        this.framesTxt = '';
    }
    start(txt){
        let num=0;
        this.time = setInterval(()=>{
            let ci = num++%this.dot .frames.length;
            this.framesTxt = `${chalk.green(this.dot .frames[ci])} ${txt} \n`;
            this.slog(this.framesTxt);
        },80);
    }
    succeed(txt){
        clearInterval(this.time);
        this.slog.clear();
        //this.slog.stderr;
        //this.slog(hint.success(`${txt} \n`));
        hint.success(`${txt}`)
    }
    end(){
        clearInterval(this.time);
        this.slog.clear();
    }
    error(){
        clearInterval(this.time);
        this.slog.clear();
        //this.slog.stderr;
        //this.slog(hint.error(`下载失败！\n`));
        hint.error(`下载失败`)
    }
}
