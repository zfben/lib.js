require 'rubygems'
require 'bundler/setup'
Bundler.require
require 'yaml'
require 'sass/css'

require File.realpath('.lib.rb')

class String
  def partition_all(reg)
    r = self.partition(reg)
    if reg =~ r[2]
      r[2] = r[2].partition_all(reg)
    end
    return r.flatten
  end
end

# build files
# 1. load(download & copy) files to .source
# 2. convert files type to .sass, .js and image types
# 3. merge sass and js files into one css file and one js file
# 4. generate lib.js and minfy files
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
  
  p '== Starting Build @' + args[:config]
  
  # Get config.yml

  DATA = YAML.load(File.read(args[:config]))

  # Merge default config
  @config = {
    'src' => 'src/example',
    'download' => false,
    'minify' => true
  }.merge(DATA['config'])

  @config['url'] = @config['src'] unless @config.has_key?('url')
  system('mkdir ' + @config['src']) unless File.exists?(@config['src'])
  
  ['source'].each do |path|
    @config['src/' + path] = File.join(@config['src'], '.' + path) unless @config.has_key?('src/' + path)
    system('mkdir ' + @config['src/' + path]) unless File.exists?(@config['src/' + path])
  end
  
  ['javascripts', 'stylesheets', 'images'].each do |path|
    @config['src/' + path] = File.join(@config['src'], path) unless @config.has_key?('src/' + path)
    system('mkdir ' + @config['src/' + path]) unless File.exists?(@config['src/' + path])
  end

  # Merge default libs
  @libs = {
    'lazyload' => 'https://raw.github.com/rgrove/lazyload/master/lazyload.js'
  }.merge(DATA['libs'])
  
  @bundle = DATA['bundle']
  
  @preload = DATA['preload']
  
  if @config.has_key?('before')
    load @config['before']
  end
  
  
  p '== [1/2] Starting Progress Source =='
  length = @libs.length
  num = 0
  @libs.each do |name, urls|
    num = num + 1
    p "[#{num}/#{length}] #{name}"
    urls = [urls] unless urls.class == Array
    lib = []
    urls.each do |url|
      if @libs.has_key?(url)
        lib.push(url)
      else
        path = File.join(@config['src/source'], name, File.basename(url))
        dir = File.dirname(path)
        system('mkdir ' + dir) unless File.exists?(dir)
        download url, path
        case get_filetype(path)
          when 'css'
            css = css_import(url, dir)
            File.open(path, 'w'){ |f| f.write(css) }
            images = download_images(name, url, path)
            if images.length > 0
              lib.push images
            end
          when 'rb'
            script = eval(File.read(path))
            rb_path = path
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
              path = File.join(dir, File.basename(path, '.rb') << '.css')
              File.open(path, 'w'){ |f| f.write("/* @import #{rb_path} */\n" + css) }
            elsif js != ''
              path = File.join(dir, File.basename(path, '.rb') << '.js')
              File.open(path, 'w'){ |f| f.write("/* @import #{rb_path} */\n" + js) }
            end
          when 'sass'
            options = { :syntax => :sass, :cache => false }.merge(Compass.sass_engine_options)
            options[:load_paths].push File.dirname(path), File.dirname(url)
            css = "/* @import #{path} */\n" + Sass::Engine.new(File.read(path), options).render
            path = File.join(dir, File.basename(path, '.sass') << '.css')
            File.open(path, 'w'){ |f| f.write(css) }
          when 'scss'
            options = { :syntax => :scss, :cache => false }.merge(Compass.sass_engine_options)
            options[:load_paths].push File.dirname(path), File.dirname(url)
            css = "/* @import #{path} */\n" + Sass::Engine.new(File.read(path), options).render
            path = File.join(dir, File.basename(path, '.sass') << '.css')
            File.open(path, 'w'){ |f| f.write(css) }
          when 'coffee'
            js = "/* @import #{path} */\n" + CoffeeScript.compile(File.read(path))
            path = File.join(dir, File.basename(path, '.coffee') << '.js')
            File.open(path, 'w'){ |f| f.write(js) }
          else
            lib.push url
        end
        lib.push(path)
      end
    end
    lib = lib.flatten
    
    css = ''
    js = ''
    lib = lib.map{ |file|
      if File.exists?(file)
        content = "/* @import #{file} */\n" + File.read(file)
        case File.extname(file)
          when '.css'
            css << content
            file = nil
          when '.js'
            js << content << ';'
            file = nil
        end
      end
      file
    }.compact
    if css != ''
      file = File.join(@config['src/source'], name + '.css')
      File.open(file, 'w'){ |f| f.write(css) }
      lib.push(file)
    end
    if js != ''
      file = File.join(@config['src/source'], name + '.js')
      File.open(file, 'w'){ |f| f.write(js) }
      lib.push(file)
    end
    
    @libs[name] = lib.map{ |file|
      if File.exists?(file)
        case File.extname(file)
          when '.js'
            type = 'javascripts'
          when '.css'
            type = 'stylesheets'
          else
            type = 'images'
        end
        
        path = File.join(@config['src/' + type], File.basename(file))
        
        p '=> ' + path
        
        system('cp ' + file + ' ' + path)
        
        reg = /url\("?'?([^'")]+)'?"?\)/
        if type == 'stylesheets' && @config['changeImageUrl'] && reg =~ File.read(path)
          css = File.read(path).partition_all(reg).map{ |f|
            if reg =~ f
              if @config['url'] == @config['src']
                f = 'url("../images/' << File.basename(f.match(reg)[1]) << '")'
              else
                f = 'url("' + @config['url'] + '/images/' << File.basename(f.match(reg)[1]) << '")'
              end
            end
            f
          }.join('')
          File.open(path, 'w'){ |f| f.write(css) }
        end
        if type == 'images'
          path = nil
        end
        
        if @config['minify']
          if type == 'stylesheets'
            min = minify(File.read(path), :css)
            File.open(path, 'w'){ |f| f.write(min) }
          end
          if type == 'javascripts'
            min = minify(File.read(path), :js)
            File.open(path, 'w'){ |f| f.write(min) }
          end
        end
      else
        path = @libs[file]
      end
      path
    }.compact.flatten
    @libs[name] = @libs[name][0] if @libs[name].length == 1
  end
  
  p '== [2/2] Generate lib.js =='
  libjs = File.read(@libs['lazyload']) << ';'
  if @config['minify']
    libjs << minify(CoffeeScript.compile(File.read('lib.coffee')), :js)
  else
    libjs << CoffeeScript.compile(File.read('lib.coffee'))
  end
  
  @libs.each do |lib, path|
    path = [path] unless path.class == Array
    path = path.map{ |url|
      url = url.gsub(@config['src'], @config['url'])
      case File.extname(url)
        when '.css', '.js'
        else
          url = nil
      end
      url
    }.compact
  end
  
  libjs << "\n/* libs */\nlib.libs(#{@libs.to_json});"
  
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
        js << "\nif(typeof lib === 'function'){lib.loaded('add', '#{files}');}"
        file = File.join(@config['src/javascripts'], name + '.js')
        File.open(file, 'w'){ |f| f.write(js) }
        path.push(file)
      end
      
      if path.length > 0
        path = path[0] if path.length == 0
        @bundle[name] = path
      else
        @bundle.delete(name)
      end
    end
    
    libjs << "\n/* bundle */\nlib.libs(#{@bundle.to_json});"
  end
  
  if @preload.class == Array && @preload.length > 0
    libjs << "\n/* preload */\nlib('#{@preload.join(' ')}');"
  end
  File.open(File.join(@config['src/javascripts'], 'lib.js'), 'w'){ |f| f.write(libjs) }
  
  if @config.has_key?('after')
    load @config['after']
  end
  
  p '== End Build =='
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
