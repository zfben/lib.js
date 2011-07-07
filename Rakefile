require 'rubygems'
require 'bundler/setup'
Bundler.require
require 'yaml'
require 'sass/css'

class String
  def partition_all(reg)
    r = self.partition(reg)
    if reg =~ r[2]
      r[2] = r[2].partition_all(reg)
    end
    return r.flatten
  end
end

def minify source, type
  if source.length > 10
    min = ''
    case type
      when :js
        min = Uglifier.compile(source, :copyright => false)
      when :css
        min = Sass::Engine.new(Sass::CSS.new(source).render(:sass), { :syntax => :sass, :style => :compressed, :cache => false }).render
    end
    if min.length > 10
      return min
    end
  end
  return source
end

def download url, path
  if @config['download'] == true || !File.exists?(path)
    unless system 'wget ' + url + ' -O ' + path + ' -N'
      p url + ' download fail!'
      system('rm ' + path)
      exit!
    end
  end
end

def download_source lib, url
  path = File.join(@config['src/source'], lib, File.basename(url))
  dir = File.dirname(path)
  system('mkdir ' + dir) unless File.exists?(dir)
  if url =~ /:\/\//
    if File.extname(path) == '.css'
      css = download_css(lib, url, File.join(dir, File.basename(url)))
      File.open(path, 'w'){ |f| f.write(css) }
      download_images(lib, url, path)
    else
      download url, path
    end
  else
    case File.extname(url)
      when '.rb'
        script = eval(File.read(url))
        css = ''
        js = ''
        script.each do | type, content |
          case type
            when :css
              css << content
            when :js
              js << content
          end
        end
        if css != ''
          path = File.join(dir, File.basename(url, '.rb') << '.css')
          File.open(path, 'w'){ |f| f.write(css) }
        elsif js != ''
          path = File.join(dir, File.basename(url, '.rb') << '.js')
          File.open(path, 'w'){ |f| f.write(js) }
        end
      when '.sass'
        css = Sass::Engine.new(File.read(url), { :syntax => :sass }.merge(Compass.sass_engine_options)).render
        path = File.join(dir, File.basename(url, '.sass') << '.css')
        File.open(path, 'w'){ |f| f.write(css) }
      when '.scss'
        css = Sass::Engine.new(File.read(url), { :syntax => :scss }.merge(Compass.sass_engine_options)).render
        path = File.join(dir, File.basename(url, '.sass') << '.css')
        File.open(path, 'w'){ |f| f.write(css) }
      when '.coffee'
        coffee = CoffeeScript.compile(File.read(url))
        path = File.join(dir, File.basename(url, '.coffee') << '.js')
        File.open(path, 'w'){ |f| f.write(coffee) }
    else
      path = url
    end
  end
  return path
end

def download_css lib, url, path
  download url, path
  reg = /@import[^"]+"([^"]+)"[^;]*;/
  return File.read(path).partition_all(reg).map{ |f|
    if reg =~ f
      sub = File.join(File.dirname(path), reg.match(f)[1])
      f = download_css(lib, File.join(File.dirname(url), reg.match(f)[1]), sub)
    end
    f
  }.join "\n"
end

def download_images lib, url, path
  reg = /url\("?'?([^'")]+)'?"?\)/
  return File.read(path).partition_all(reg).map{ |f|
    if reg =~ f
      sub = File.join(File.dirname(path), reg.match(f)[1])
      suburl = File.dirname(url) + '/' + reg.match(f)[1]
      unless File.exists?(File.dirname(sub))
        system('mkdir ' + File.dirname(sub))
      end
      download(suburl, sub)
      @libs[lib].push(sub)
    else
      f = nil
    end
    f
  }.compact
end

desc 'build files from config.yml'
task :build, :config do |task, args|
  args = {
    :config => 'example'
  }.merge(args.to_hash)
  
  args[:config] = args[:config] + '.yml'
  
  unless File.exists?(args[:config])
    p args[:config] + ' is not exists!'
    exit!
  end
  
  p '== Starting Build'
  
  # Get config.yml

  DATA = YAML.load(File.read(args[:config]))

  # Merge default config
  @config = {
    'src' => 'src/example',
    'download' => false,
    'minify' => true
  }.merge(DATA['config'])

  @config['url'] = @config['src'] unless @config.has_key?('url')
  @config['src/source'] = File.join(@config['src'], '.source') unless @config.has_key?('src/source')
  
  ['source', 'javascripts', 'stylesheets', 'images'].each do |path|
    @config['src/' + path] = File.join(@config['src'], path) unless @config.has_key?('src/' + path)
  end
  [@config['src'], @config['src/source'], @config['src/javascripts'], @config['src/stylesheets'], @config['src/images']].each{ |f| system('mkdir ' + f) unless File.exists?(f) }

  # Merge default libs
  @libs = {
    'lazyload' => 'https://raw.github.com/rgrove/lazyload/master/lazyload.js'
  }.merge(DATA['libs'])
  
  @bundle = DATA['bundle']
  
  @preload = DATA['preload']
  
  if @config.has_key?('before')
    load @config['before']
  end
  
  # Download source
  @libs.each do |lib, url|
    if url.class == String
      @libs[lib] = download_source(lib, url)
    else
      @libs[lib] = url.map{ |u| download_source(lib, u) }
    end
  end
  
  # Merge source
  @libs.each do |lib, path|
    css = ''
    js = ''
    path = [path] unless path.class == Array
    path = path.map{ |file|
      if File.exists?(file)
        case File.extname(file)
          when '.css'
            css << File.read(file)
            file = nil
          when '.js'
            js << File.read(file) << ';'
            file = nil
        end
      end
      file
    }.compact
    if css != ''
      p file = File.join(@config['src/source'], lib + '.css')
      css = minify(css, :css) if @config['minify'] == true
      File.open(file, 'w'){ |f| f.write(css) }
      path.push(file)
    end
    if js != ''
      p file = File.join(@config['src/source'], lib + '.js')
      js = minify(js, :js) if @config['minify'] == true
      File.open(file, 'w'){ |f| f.write(js) }
      path.push(file)
    end
    path = path[0] if path.length == 1
    @libs[lib] = path
  end
  
  @libs.each do |lib, path|
    path = [path] if path.class != Array
    @libs[lib] = path.map{ |subpath|
      if File.exists?(subpath)
        case File.extname(subpath)
          when '.js'
            type = 'javascripts'
          when '.css'
            type = 'stylesheets'
          else
            type = 'images'
        end
        file = File.join(@config['src/' + type], File.basename(subpath))
        system('cp ' + subpath + ' ' + file)
        subpath = file
        reg = /url\("?'?([^'")]+)'?"?\)/
        if type == 'stylesheets' && reg =~ File.read(file)
          css = File.read(file).partition_all(reg).map{ |f|
            if reg =~ f
              f = 'url("../images/' << File.basename(f.match(reg)[1]) << '")'
            end
            f
          }.join('')
          css = minify(css, :css) if @config['minify'] == true
          File.open(file, 'w'){ |f| f.write(css) }
        end
        if type == 'images'
          subpath = nil
        end
        File.open(file, 'w'){ |f| f.write(minify(File.read(file), :js)) } if @config['minify'] == true && type == 'javascript'
      else
        subpath = @libs[subpath]
      end
      subpath
    }.compact.flatten
    @libs[lib] = @libs[lib][0] if @libs[lib].length == 1
  end
  
  libjs = File.read(@libs['lazyload']) << ';' << (@config['minify'] ? minify(File.read('lib.js'), :js) : File.read('lib.js')) << ';'
  
  # Merge js and css files to one js and one css.
  @libs.each do |lib, path|
    css = []
    js = []
    path = [path] unless path.class == Array
    path = path.each do |url|
      url = url.gsub(@config['src'], @config['url'])
      case File.extname(url)
        when '.css'
          css.push url
        when '.js'
          js.push url
      end
    end
    source = (css + js).join("','")
    libjs << "lib['#{lib}']=function(callback){lib('#{source}',function(){if(typeof callback!=='undefined'){callback();}});};"
    libjs << "\n" if @config['minify'] == false
  end
  
  if @bundle != nil && @bundle.length > 0
    @bundle.each do |name, libs|
      css = ''
      js = ''
      files = []
      libs.each do |lib|
        source = @libs[lib]
        source = [source] if source.class != Array
        source.each do |file|
          files.push(file)
          case File.extname(file)
            when '.css'
              css << File.read(file)
            when '.js'
              js << File.read(file) << ';'
          end
        end
      end
      
      path = []
      if css != ''
        file = File.join(@config['src/stylesheets'], name + '.css')
        File.open(file, 'w'){ |f| f.write(css) }
        path.push(file)
      end
      if js != ''
        files = files.join("','")
        js << "if(typeof lib==='function'){lib.loaded('add','#{files}');}"
        file = File.join(@config['src/javascripts'], name + '.js')
        File.open(file, 'w'){ |f| f.write(js) }
        path.push(file)
      end
      if path.length > 0
        code = path.join("','")
        libjs << "lib['#{name}']=function(callback){lib('#{code}',function(){if(typeof callback!=='undefined'){callback();}});};"
      end
    end
  end
  
  if @preload.class == Array && @preload.length > 0
    @preload.each do |lib|
      libjs << "lib['#{lib}']();"
    end
  end
  File.open(File.join(@config['src/javascripts'], 'lib.js'), 'w'){ |f| f.write(libjs) }
  
  if @config.has_key?('after')
    load @config['after']
  end
  
  p '== End Build'
end

desc 'watch files changes and auto build'
task :watch, :config do |task, args|
  args = {
    :config => 'example'
  }.merge(args.to_hash)
  
  config = args[:config]
  
  args[:config] = args[:config] + '.yml'
  
  unless File.exists?(args[:config])
    p args[:config] + ' is not exists!'
    exit!
  end
  
  p path = File.realpath(YAML.load(File.read(args[:config]))['config']['watchr']) + '/*'
  
  script = Watchr::Script.new
  script.watch(path){ Rake::Task['build'].invoke(config) }
  contrl = Watchr::Controller.new(script, Watchr.handler.new)
  contrl.run
  p '== Starting Watch, You can use Ctrl+C to close it'
end
