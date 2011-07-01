(function(){
  this.lib = function(){
    var args = arguments, css = [], js = [], funcs = [];
    for(i in args){
      var arg = args[i]
      if(typeof arg === 'string'){
        if(/\.css[^\.]*$/.test(arg)){
          css.push(arg);
        }else{
          js.push(arg);
        }
      }else{
        funcs.push(arg);
      }
    }
    if(css.length > 0){
      if(js.length === 0 && funcs.length > 0){
        LazyLoad.css(css, function(){
          for(i in funcs){
            funcs[i]();
          }
        });
      }else{
        LazyLoad.css(css);
      }
    }
    if(js.length > 0){
      if(funcs.length > 0){
        LazyLoad.js(js, function(){
          for(i in funcs){
            funcs[i]();
          }
        });
      }else{
        LazyLoad.js(js);
      }
    }
  }
})();
