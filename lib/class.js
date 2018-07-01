
'use strict';

const log = console.log;
const program = require('commander');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const del = require('del');
const archiver = require('archiver');
const join = path.join;
const resolve = path.resolve;
const ora = require('ora');
const zipper = require("zip-local");
const handlebars = require('handlebars');
const { hint,isFile,getPath,getTime,httpDownload,getFileType,gitDownload } = require('./util');
const compressor = require('node-minify');
const util = require('util');


module.exports._class = async (cmd,option)=> {

  if( !cmd || !option ){
    return hint.error(`请输入参数!`);
  }

  var promps = [];
  let _path = getPath( cmd );
  let _name = option._name;

  switch( _name ){
    case 'delete':

      if( !isFile( _path ) ){
        return  hint.warning( `${cmd} 不存在` );
      }

      promps.push({
          type: 'confirm',
          name: 'del',
          message: '是否删除' + cmd
      });

      inquirer.prompt(promps).then( (answers)=> {
        if( answers.del ){

           del([ _path ])
           .then( (err)=>{
            hint.success(`${cmd} 删除完成`);
           }).catch(() => hint.error(`删除发生错误!`));
        }
      });
      break;
    case 'app':case 'pc':

      if( isFile( _path ) ){
        return hint.warning( `${cmd} 已存在` );
      }

      if( option.fast ){
        let answers = {
           base : false,
           framework : false,
           sass:true
        }
        createInfo( answers,cmd,option);
      }else{
        createFile(cmd,option);
      }
      break;
    case 'new-html':

      if( isFile(getFileType(_path,'html').fillFile) ){
        return  hint.warning( `${getFileType(_path,'html').fillFile} 存在` );
      }

      let answers = {
        base : false,
        framework : false,
        sass : false,
        newHtml : true
      }

      let newOption = {};
      if( option.newApp ){
        newOption._name = 'app';
      }else if( option.newPc ){
        newOption._name = 'pc';
      }

      createHtml(answers, cmd, newOption);

      break;
    case 'download-sass':
        let baseMixins = '/base_mixins';
        let _currentPath = getPath(cmd+baseMixins);
        if( isFile( _currentPath) ){
          await del( [ _currentPath ] ).then(()=>{
          });
        }
        await createSass('',_currentPath);
      break;
    case 'zip-local':

      let createZipName = cmd + '.zip';
      if( !isFile(_path) ){
        return  hint.warning( `${cmd} 不存在` );
      }

      if( isFile( createZipName ) ){
        return  hint.warning( `${createZipName} 已存在` );
      }
      let spinnerZip = ora('压缩中...').start();
      // zipping a file
      zipper.zip(_path, (error, zipped)=> {
        if(!error) {
          zipped.compress(); // compress before exporting

          let buff = zipped.memory(); // get the zipped file as a Buffer
          // or save the zipped file to disk
          zipped.save(_path+".zip", (error)=> {
            if(!error) {
              spinnerZip.succeed('压缩完成!');
              //hint.success(`${cmd} 压缩成功！`);
            }else{
              hint.error( error );
            }
          });
        }else{
          hint.error( error );
        }
      });
      break;
    case 'unzip-local':

      let createUnzipName = getFileType(cmd).fileName;

      if( isFile( createUnzipName ) ){
        return  hint.warning( `${createUnzipName} 已存在` );
      }
      let spinnerUnzip = ora('解压中...').start();
      fse.ensureDir(createUnzipName).then(()=>{
        let savePath = getPath( createUnzipName );
        zipper.sync.unzip(_path).save(savePath);
        spinnerUnzip.succeed('解压完成');
      });

      break;
    case 'min-css':
      let pathsMinCss = getPath(cmd);
      let spinnerMinjs = ora('min-css...').start();
      compressor.minify({
        compressor: 'clean-css',
        input: pathsMinCss,
        output: pathsMinCss,
        options: {
          advanced: false,
          aggressiveMerging: false
        },
        callback:  (err, min)=> {
          spinnerMinjs.succeed(`css 压缩完成！`);
          //hint.success(`css 压缩完成！`);
         }
      });

      break;
    case 'beautify-css':

      let pathsBeautifyCss = getPath(cmd);
      let spinnerbeautifyCss = ora('beautify-css...').start();
      compressor.minify({
        compressor: 'clean-css',
        input: pathsBeautifyCss,
        output: pathsBeautifyCss,
        options: {
          format: 'keep-breaks'
        },
        callback: (err, min) => {
          spinnerbeautifyCss.succeed(`css 格式化完成！`);
          //hint.success(`css 格式化完成！`);
        }
      });

      break;
      case 'min-js':

        let pathsMinJs = getPath(cmd);
        let spinnerMinJs = ora('min-js...').start();
        compressor.minify({
          compressor: 'gcc',
          input: pathsMinJs,
          output: pathsMinJs,
          options: {
            compilation_level: 'ADVANCED_OPTIMIZATIONS'
          },
          callback: (err, min)=> {
            spinnerMinJs.succeed(`js 压缩完成！`);
            //hint.success(`js 压缩完成！`);
          }
        });


      break;
      case 'beautify-js':

        let pathsBeautifyJs = getPath(cmd);
        let spinnerBeautifyJs = ora('beautify-js...').start();
        compressor.minify({
          compressor: 'uglifyjs',
          input: pathsBeautifyJs,
          output: pathsBeautifyJs,
          options: {
            output: {
              beautify: true
            }
          },
          callback: (err, min) => {
            spinnerBeautifyJs.succeed(`js 格式化完成！`);
            //hint.success(`js 格式化完成！`);
          }
        });
      break;

    default:

  }

};

module.exports._default = async (option)=>{
  let _name = option._name;
  switch( _name ){
    case 'download-sass':
      let baseMixins = '/base_mixins';
      let _currentPath = process.cwd()+baseMixins;
      if( isFile( _currentPath ) ){
        await del( [ _currentPath ] ).then(()=>{
        });
      }
      await createSass('',_currentPath);
      break;
    default:

  }
}

let jsStr = '';
let  createInfo = async ( answers,cmd,option ) => {

    await createFolder(cmd,cmd);
    await createFolder(join(cmd,'i'),'img');
    await createFolder(join(cmd,'j'),'js');
    await createFolder(join(cmd,'c'),'css');
    await createHtml(answers,cmd, option);

    if( answers.base ){
      await createCss(cmd, option);
    }
    if( answers.framework ){
      await createJs(answers,cmd, option);
    }
    if( answers.sass ){
      await createFolder(join(cmd,'s'),'sass');
      await createSass(cmd);
    }

}


//创建文件夹；
let createFolder = (cmd,txt)=>{
  fse.ensureDir(cmd).then(()=>{
    hint.success(`${txt} 文件夹创建`);
  }).catch((err)=>{
    hint.error(err);
  });
}

//创建CSS;
let createCss = ( cmd, option )=>{
  let originalBaseCss = join(__dirname,'..','lib/templates/',option._name,'base.css');
  let createBaseCss = join(process.cwd(),cmd,'c','base.css');
  fse.readFile(originalBaseCss,'utf8').then(data=>{
    fs.writeFile(createBaseCss,data,()=>{
      hint.success(`base.css 文件创建完成!`);
    });
  });
}

//创建JS;
let createJs = async (answers,cmd,option)=>{
  let createPathJs = path.join(cmd,'j');
  let newPromise;
  //加载jquery.js;
  if( answers.framework == 'jquery' ){
    let httpPath = 'http://apps.bdimg.com/libs/jquery/1.8.3/jquery.min.js';
    await httpDownload(httpPath,createPathJs,'Jquery 创建完成');
    jsStr = '<script src="j/jquery.min.js"></script>';
  }

  //加载zepto.js;
  if( answers.framework == 'zepto' ){
    let httpPath = 'http://apps.bdimg.com/libs/zepto/1.1.4/zepto.min.js';
    await httpDownload(httpPath,createPathJs,'zepto 创建完成');
    jsStr = '<script src="j/zepto.min.js"></script>';
  }
}

//创建HTML;
let createHtml = (answers,cmd,option)=>{

  let originalHtml = join(__dirname, '..', 'lib/templates/', option._name, 'index.html');
  let fileName = answers.newHtml ? getFileType(cmd,'html').fileComplete : 'index.html';
  let currentPath = answers.newHtml ? getFileType(cmd,'html').lastPath : cmd;
  let newHtmlPath = join(process.cwd(), currentPath, fileName );

  fse.readFile(originalHtml, 'utf8').then((data) => {

    const tpl = {
      setCss: null,
      setJs: null,
      setHotcss: null,
      setIndexCss : '<link rel="stylesheet" href="c/index.css">'
    }

    if ( answers.base ) {
      tpl.setCss = `<link rel="stylesheet" href="c/base.css">`;
    }

    if(answers.newHtml){
      tpl.setIndexCss = null;
    }

    if ( answers.framework ) {
      tpl.setJs = jsStr;
    }

    if ( answers.sass && option._name == 'app' ) {
      let originalHotcss = join(__dirname, '..', 'lib/templates/', option._name, 'hotcss.min.js');
      let createHotcss = join(process.cwd(), cmd, 'j/hotcss.min.js');
      fse.copy(originalHotcss, createHotcss)
        .catch(err => hint.error(err));
      tpl.setHotcss = `<script src="j/hotcss.min.js"></script>`;
    }
    const result = handlebars.compile(data)(tpl);
    fs.writeFile(newHtmlPath, result, () => {
      hint.success(`html 文件创建完成!`);
    });

  })
}
//创建SASS;
let createSass = async (cmd,currentPath)=>{
  let newPath = currentPath?currentPath:join(cmd, '/s/base_mixins');
  await gitDownload('uustoboy/base_mixins',newPath,'base_mixins 创建完成!',()=>{
    if(!currentPath){
      let annotationTxt = `@charset "UTF-8";\n@import "./base_mixins/_base_mixins.scss";\n$BG_ULR :"../i/"; //路径;\n\n/**\n  * @project : ${cmd};\n  * @author : name;\n  * @date : ${getTime()};\n  * @Description : ${cmd} scss文件;\n*/\n\n\n`;
      fse.outputFile(join(process.cwd(), cmd, '/s/index.scss'), annotationTxt);
    }

  });
}


let createFile = (cmd,option)=>{
  var promps = [];

  promps.push({
      type: 'confirm',
      name: 'base',
      message: '创建base.css文件'
    });

  promps.push({
      type: 'list',
      name: 'framework',
      message: '使用框架库',
      choices:[
        {
          name: '不使用框架库',
          value: false
        },
        {
          name: 'jquery.js',
          value: 'jquery'
        },
        {
          name: 'zepto.js',
          value: 'zepto'
        }
      ]
    });

    promps.push({
      type: 'confirm',
      name: 'sass',
      message: '是否使用sass'
    });

    inquirer.prompt(promps).then( (answers) => {
        createInfo(answers,cmd,option);
    });

}
