(function(){var a=this,b=a._,c={},d=Array.prototype,e=Object.prototype,f=Function.prototype,g=d.slice,h=d.unshift,i=e.toString,j=e.hasOwnProperty,k=d.forEach,l=d.map,m=d.reduce,n=d.reduceRight,o=d.filter,p=d.every,q=d.some,r=d.indexOf,s=d.lastIndexOf,t=Array.isArray,u=Object.keys,v=f.bind,w=function(a){return new B(a)};typeof module!="undefined"&&module.exports?(module.exports=w,w._=w):a._=w,w.VERSION="1.1.6";var x=w.each=w.forEach=function(a,b,d){if(a!=null)if(k&&a.forEach===k)a.forEach(b,d);else if(w.isNumber(a.length)){for(var e=0,f=a.length;e<f;e++)if(b.call(d,a[e],e,a)===c)return}else for(var g in a)if(j.call(a,g)&&b.call(d,a[g],g,a)===c)return};w.map=function(a,b,c){var d=[];if(a==null)return d;if(l&&a.map===l)return a.map(b,c);x(a,function(a,e,f){d[d.length]=b.call(c,a,e,f)});return d},w.reduce=w.foldl=w.inject=function(a,b,c,d){var e=c!==void 0;a==null&&(a=[]);if(m&&a.reduce===m){d&&(b=w.bind(b,d));return e?a.reduce(b,c):a.reduce(b)}x(a,function(a,f,g){!e&&f===0?(c=a,e=!0):c=b.call(d,c,a,f,g)});if(!e)throw new TypeError("Reduce of empty array with no initial value");return c},w.reduceRight=w.foldr=function(a,b,c,d){a==null&&(a=[]);if(n&&a.reduceRight===n){d&&(b=w.bind(b,d));return c!==void 0?a.reduceRight(b,c):a.reduceRight(b)}var e=(w.isArray(a)?a.slice():w.toArray(a)).reverse();return w.reduce(e,b,c,d)},w.find=w.detect=function(a,b,c){var d;y(a,function(a,e,f){if(b.call(c,a,e,f)){d=a;return!0}});return d},w.filter=w.select=function(a,b,c){var d=[];if(a==null)return d;if(o&&a.filter===o)return a.filter(b,c);x(a,function(a,e,f){b.call(c,a,e,f)&&(d[d.length]=a)});return d},w.reject=function(a,b,c){var d=[];if(a==null)return d;x(a,function(a,e,f){b.call(c,a,e,f)||(d[d.length]=a)});return d},w.every=w.all=function(a,b,d){var e=!0;if(a==null)return e;if(p&&a.every===p)return a.every(b,d);x(a,function(a,f,g){if(!(e=e&&b.call(d,a,f,g)))return c});return e};var y=w.some=w.any=function(a,b,d){b||(b=w.identity);var e=!1;if(a==null)return e;if(q&&a.some===q)return a.some(b,d);x(a,function(a,f,g){if(e=b.call(d,a,f,g))return c});return e};w.include=w.contains=function(a,b){var c=!1;if(a==null)return c;if(r&&a.indexOf===r)return a.indexOf(b)!=-1;y(a,function(a){if(c=a===b)return!0});return c},w.invoke=function(a,b){var c=g.call(arguments,2);return w.map(a,function(a){return(b.call?b||a:a[b]).apply(a,c)})},w.pluck=function(a,b){return w.map(a,function(a){return a[b]})},w.max=function(a,b,c){if(!b&&w.isArray(a))return Math.max.apply(Math,a);var d={computed:-Infinity};x(a,function(a,e,f){var g=b?b.call(c,a,e,f):a;g>=d.computed&&(d={value:a,computed:g})});return d.value},w.min=function(a,b,c){if(!b&&w.isArray(a))return Math.min.apply(Math,a);var d={computed:Infinity};x(a,function(a,e,f){var g=b?b.call(c,a,e,f):a;g<d.computed&&(d={value:a,computed:g})});return d.value},w.sortBy=function(a,b,c){return w.pluck(w.map(a,function(a,d,e){return{value:a,criteria:b.call(c,a,d,e)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")},w.sortedIndex=function(a,b,c){c||(c=w.identity);var d=0,e=a.length;while(d<e){var f=d+e>>1;c(a[f])<c(b)?d=f+1:e=f}return d},w.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(w.isArray(a))return a;if(w.isArguments(a))return g.call(a);return w.values(a)},w.size=function(a){return w.toArray(a).length},w.first=w.head=function(a,b,c){return b!=null&&!c?g.call(a,0,b):a[0]},w.rest=w.tail=function(a,b,c){return g.call(a,b==null||c?1:b)},w.last=function(a){return a[a.length-1]},w.compact=function(a){return w.filter(a,function(a){return!!a})},w.flatten=function(a){return w.reduce(a,function(a,b){if(w.isArray(b))return a.concat(w.flatten(b));a[a.length]=b;return a},[])},w.without=function(a){var b=g.call(arguments,1);return w.filter(a,function(a){return!w.include(b,a)})},w.uniq=w.unique=function(a,b){return w.reduce(a,function(a,c,d){if(0==d||(b===!0?w.last(a)!=c:!w.include(a,c)))a[a.length]=c;return a},[])},w.intersect=function(a){var b=g.call(arguments,1);return w.filter(w.uniq(a),function(a){return w.every(b,function(b){return w.indexOf(b,a)>=0})})},w.zip=function(){var a=g.call(arguments),b=w.max(w.pluck(a,"length")),c=Array(b);for(var d=0;d<b;d++)c[d]=w.pluck(a,""+d);return c},w.indexOf=function(a,b,c){if(a==null)return-1;var d,e;if(c){d=w.sortedIndex(a,b);return a[d]===b?d:-1}if(r&&a.indexOf===r)return a.indexOf(b);for(d=0,e=a.length;d<e;d++)if(a[d]===b)return d;return-1},w.lastIndexOf=function(a,b){if(a==null)return-1;if(s&&a.lastIndexOf===s)return a.lastIndexOf(b);var c=a.length;while(c--)if(a[c]===b)return c;return-1},w.range=function(a,b,c){arguments.length<=1&&(b=a||0,a=0),c=arguments[2]||1;var d=Math.max(Math.ceil((b-a)/c),0),e=0,f=Array(d);while(e<d)f[e++]=a,a+=c;return f},w.bind=function(a,b){if(a.bind===v&&v)return v.apply(a,g.call(arguments,1));var c=g.call(arguments,2);return function(){return a.apply(b,c.concat(g.call(arguments)))}},w.bindAll=function(a){var b=g.call(arguments,1);b.length==0&&(b=w.functions(a)),x(b,function(b){a[b]=w.bind(a[b],a)});return a},w.memoize=function(a,b){var c={};b||(b=w.identity);return function(){var d=b.apply(this,arguments);return j.call(c,d)?c[d]:c[d]=a.apply(this,arguments)}},w.delay=function(a,b){var c=g.call(arguments,2);return setTimeout(function(){return a.apply(a,c)},b)},w.defer=function(a){return w.delay.apply(w,[a,1].concat(g.call(arguments,1)))};var z=function(a,b,c){var d;return function(){var e=this,f=arguments,g=function(){d=null,a.apply(e,f)};c&&clearTimeout(d);if(c||!d)d=setTimeout(g,b)}};w.throttle=function(a,b){return z(a,b,!1)},w.debounce=function(a,b){return z(a,b,!0)},w.once=function(a){var b=!1,c;return function(){if(b)return c;b=!0;return c=a.apply(this,arguments)}},w.wrap=function(a,b){return function(){var c=[a].concat(g.call(arguments));return b.apply(this,c)}},w.compose=function(){var a=g.call(arguments);return function(){var b=g.call(arguments);for(var c=a.length-1;c>=0;c--)b=[a[c].apply(this,b)];return b[0]}},w.after=function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}},w.keys=u||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[];for(var c in a)j.call(a,c)&&(b[b.length]=c);return b},w.values=function(a){return w.map(a,w.identity)},w.functions=w.methods=function(a){return w.filter(w.keys(a),function(b){return w.isFunction(a[b])}).sort()},w.extend=function(a){x(g.call(arguments,1),function(b){for(var c in b)b[c]!==void 0&&(a[c]=b[c])});return a},w.defaults=function(a){x(g.call(arguments,1),function(b){for(var c in b)a[c]==null&&(a[c]=b[c])});return a},w.clone=function(a){return w.isArray(a)?a.slice():w.extend({},a)},w.tap=function(a,b){b(a);return a},w.isEqual=function(a,b){if(a===b)return!0;var c=typeof a,d=typeof b;if(c!=d)return!1;if(a==b)return!0;if(!a&&b||a&&!b)return!1;a._chain&&(a=a._wrapped),b._chain&&(b=b._wrapped);if(a.isEqual)return a.isEqual(b);if(w.isDate(a)&&w.isDate(b))return a.getTime()===b.getTime();if(w.isNaN(a)&&w.isNaN(b))return!1;if(w.isRegExp(a)&&w.isRegExp(b))return a.source===b.source&&a.global===b.global&&a.ignoreCase===b.ignoreCase&&a.multiline===b.multiline;if(c!=="object")return!1;if(a.length&&a.length!==b.length)return!1;var e=w.keys(a),f=w.keys(b);if(e.length!=f.length)return!1;for(var g in a)if(!(g in b)||!w.isEqual(a[g],b[g]))return!1;return!0},w.isEmpty=function(a){if(w.isArray(a)||w.isString(a))return a.length===0;for(var b in a)if(j.call(a,b))return!1;return!0},w.isElement=function(a){return!!a&&a.nodeType==1},w.isArray=t||function(a){return i.call(a)==="[object Array]"},w.isArguments=function(a){return!!a&&!!j.call(a,"callee")},w.isFunction=function(a){return!!(a&&a.constructor&&a.call&&a.apply)},w.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)},w.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)},w.isNaN=function(a){return a!==a},w.isBoolean=function(a){return a===!0||a===!1},w.isDate=function(a){return!!(a&&a.getTimezoneOffset&&a.setUTCFullYear)},w.isRegExp=function(a){return!(!(a&&a.test&&a.exec)||!a.ignoreCase&&a.ignoreCase!==!1)},w.isNull=function(a){return a===null},w.isUndefined=function(a){return a===void 0},w.noConflict=function(){a._=b;return this},w.identity=function(a){return a},w.times=function(a,b,c){for(var d=0;d<a;d++)b.call(c,d)},w.mixin=function(a){x(w.functions(a),function(b){D(b,w[b]=a[b])})};var A=0;w.uniqueId=function(a){var b=A++;return a?a+b:b},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g},w.template=function(a,b){var c=w.templateSettings,d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(c.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(c.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",e=new Function("obj",d);return b?e(b):e};var B=function(a){this._wrapped=a};w.prototype=B.prototype;var C=function(a,b){return b?w(a).chain():a},D=function(a,b){B.prototype[a]=function(){var a=g.call(arguments);h.call(a,this._wrapped);return C(b.apply(w,a),this._chain)}};w.mixin(w),x(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=d[a];B.prototype[a]=function(){b.apply(this._wrapped,arguments);return C(this._wrapped,this._chain)}}),x(["concat","join","slice"],function(a){var b=d[a];B.prototype[a]=function(){return C(b.apply(this._wrapped,arguments),this._chain)}}),B.prototype.chain=function(){this._chain=!0;return this},B.prototype.value=function(){return this._wrapped}})()