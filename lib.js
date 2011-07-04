(function(){
  // save loaded source to `loaded`
  var loaded = {};
  
  // lib start here
  this.lib = function(){
    
    // progress arguments to each type
    var args = arguments, css = [], js = [], funcs = [];
    for(i in args){
      var arg = args[i]
      if(typeof arg === 'string'){
        if(typeof loaded[arg] === 'undefined'){
          if(/\.css[^\.]*$/.test(arg)){
            css.push(arg);
          }else{
            js.push(arg);
          }
        }
      }else{
        funcs.push(arg);
      }
    }
    
    // progress css
    if(css.length > 0){
      if(js.length === 0 && funcs.length > 0){
        LazyLoad.css(css, function(){
          for(i in css){
            loaded[css[i]] = true
          }
          for(i in funcs){
            funcs[i]();
          }
        });
      }else{
        LazyLoad.css(css);
      }
    }
    
    // progress js
    if(js.length > 0){
      if(funcs.length > 0){
        LazyLoad.js(js, function(){
          for(i in js){
            loaded[js[i]] = true
          }
          for(i in funcs){
            funcs[i]();
          }
        });
      }else{
        LazyLoad.js(js);
      }
    }
    
    // if everything is loaded, run funcs
    if(css.length === 0 && js.length === 0 && funcs.length > 0){
      for(i in funcs){
        funcs[i]();
      }
      return true;
    }
    
    return false;
  };
  
  // leave api to control loaded
  this._lib = function(){
    var args = Array.prototype.slice.call(arguments);
    switch(args.shift()){
      case 'loaded':
        for(i in args){
          var source = args[i];
          if(typeof loaded[source] === 'undefined'){
            loaded[source] = true;
          }
        }
        break;
      case 'unload':
        for(i in args){
          var source = args[i];
          if(typeof loaded[source] !== 'undefined'){
            delete(loaded[source]);
          }
        }
        break;
    }
    return loaded;
  }
})();
