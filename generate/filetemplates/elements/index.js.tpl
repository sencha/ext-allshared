    var toolkit = '{toolkit}';

    console.log(process.cwd())

    var baseFolder = "./node_modules/@sencha/ext-web-components-" + toolkit + "/ext-runtime-" + toolkit;
    var xhrObj = new XMLHttpRequest();
    xhrObj.open('GET', baseFolder + "/" + toolkit + ".material.js", false);
    xhrObj.send('');
    if (xhrObj.status != 200) {
      //console.warn('cant find Ext engine - see https://docs.sencha.com/extwebcomponents/7.1.0/guides/deprecation_message.html')
      console.warn('cant find Ext engine - see https://docs.sencha.com')
      return
    }


{ewcimports}