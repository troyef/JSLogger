

var JSLogger = function JSLogger(){
  this.logArray = [];
  this.shortcutCount = 0;
};
module.exports = new JSLogger();

JSLogger.prototype.init = function init(){
  //Catch and log console messages
  var consoleMembers = ['log', 'error', 'info', 'warn'];
  function buildNewHandler(member, nativeFn){
      return function(message){
          this.log('Console.' + member + ' -> ' + message, undefined, (member === 'error'));
          nativeFn.apply(console, arguments);
      };

  }
  for (var j = 0; j < consoleMembers.length; j++){
      var member = consoleMembers[j];
      var nativeFn = window.console[member];
      window.console[member] = buildNewHandler(member, nativeFn);
  }

  /**
   * catch and log window errors
   */
  var nativeErrorHandler = window.onerror;
  window.onerror = function(msg, url, lineNumber){
      this.log('Error: ' + msg,{ url: url, lineNumber: lineNumber}, true);
      nativeErrorHandler.apply(window, arguments);
  };


  /**
   * Set up the shortcut entry - Pressing '?' 5 times in a row.
   */
  window.addEventListener('keypress', function(event){
      if (event.which === 63){
         shortcutCount++;
      } else {
         shortcutCount = 0;
      }

      if (shortcutCount === 5){
          shortcutCount = 0;
          this.openLog();
      }
  });

    
};
    
    
JSLogger.prototype.log = function log( msg, data, isError){
    var logObj = {
        msg: msg,
        time: Date(),
        error: (isError === true)
    };

    if (typeof data !== 'undefined'){
        logObj.data = data;
    }

    return this.logArray.push(logObj);
};

JSLogger.prototype.openLog = function openLog(){
    var win = window.open('','_blank','resizable=yes,scrollbars=yes');
    win.document.write(this.createLogMarkup());
};

/**
 * Escapes the html in a string if the argument is, in fact, a string
 * @param {string} text
 * @returns {*}
 */
JSLogger.prototype._escapeHtml = function _escapeHtml(text) {
    if (typeof text === 'string'){
        return '"' + text
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;") + '"';
    }
    return text;
};


/**
 * Create the html markup for the debug log window
 * @returns {string}
 */
JSLogger.prototype._createLogMarkup = function _createLogMarkup(){
    var output = '',
        i,key,data,
        logObj,
        dtNow = new Date();

    output += '<html >';
    output += '<head>';

    output += '<style>' +
        'body {' +
        '   font-size:12px;' +
        '   line-height:17px;' +
        '   color:#333;' +
        '   font-family: "OpenSansRegular", OpenSansRegular, "Helvetica Neue", Helvetica, Arial, sans-serif;' +
        '}' +
        '.link {color:#008bb9;cursor:pointer;}' +
        '.link:hover {text-decoration:underline;}' +
        '.error {color:#db3a3a;}' +
        '</style>';

    output += '<script>function setDownloadHref(){' +
        'var a = document.getElementById("dlLink");' +
        'a.href="data:text/html;charset=utf-8,"+document.documentElement.outerHTML;' +
        'return true;' +
        '}</script>';

    output += '</head>';
    output += '<body>';

    output += '<div style="float:right;" ><a id="dlLink" download="JSLog_' + dtNow.toISOString() + '.html" onclick="setDownloadHref()" href="">Download HTML Log</a></div>';

    output += '<h2 >JSLogger Activity Log - ' + dtNow.toString() + '</h2><br/>';

    for (i = 0;i < this.logArray.length; i++){
        logObj = this.logArray[i];

        output += '<div class="'+ (logObj.error === true ? 'error': '') + '">';

        if (typeof logObj.data !== 'undefined'){
            output += '<span class="link '+ (logObj.error === true ? 'error': '') + '" onclick="var d = document.getElementById(\'' + i + '\');d.style.display = (d.style.display === \'block\'?\'none\' :\'block\')">[' + logObj.time + '] ' + logObj.msg + '</span>';
            output += '<div id="' + i +'" class="" style="margin-left:10px;padding:2px 5px;background-color: #e4e4e4;display:none;">';
            data = logObj.data;
            for (key in logObj.data){
                if (logObj.data.hasOwnProperty(key)){
                    output += '<div style="text-indent:-10px;padding-left:10px;" >' + key + ' : ' + escapeHtml(data[key]) + '</div>';
                }
            }

            output += '</div >';
        } else {
            output += '[' + logObj.time + '] ' + logObj.msg;
        }
        output += '</div >';
    }

    output += '</body></html >';

    return output;
};




