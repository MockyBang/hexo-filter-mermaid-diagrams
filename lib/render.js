const reg = /(\s*)(`{3}) *(mermaid) *\n?([\s\S]+?)\s*(\2)(\n+|$)/g;

const ignore = data => {
  var source = data.source;
  var ext = source.substring(source.lastIndexOf('.')).toLowerCase();
  return ['.js', '.css', '.html', '.htm'].indexOf(ext) > -1;
}

module.exports = function (data) {
  const mermaidConfig = this.config.mermaid;
  let { enable } = mermaidConfig;
  enable = enable || false;
  if (!enable) {
    return;
  }
  if (!ignore(data)) {
    data.content = data.content
      .replace(reg, function (raw, start, startQuote, lang, content, endQuote, end) {
        var reg = RegExp(/[<>"&'￠£¥§©®×÷]/g)
        if (reg.test(content)) {
          // true
          var result = content.replace(reg, function () {
            // console.dir(arguments)
            switch (arguments[0]) {
              case '<':
                return '&lt;';
              case '>':
                return '&gt;';
              case '"':
                return '&quot;';
              case '&':
                return '&amp;';
              case "'":
                return '&#39;';
              case '￠':
                return '&cent;';
              case '£':
                return '&pound;';
              case '¥':
                return '&yen;';
              case '§':
                return '&sect;';
              case '©':
                return '&copy;';
              case '®':
                return '&reg;';
              case '×':
                return '&times;';
              case '÷':
                return '&divide;';
      
              default:
                break;
            }
          })
        } else {
          // no symbol in the mermaid code.
          result = content
        }
        return `${start}<pre class="mermaid">${result}</pre>${end}`;
      });
  }
};
