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
        min = Sass::Engine.new(Sass::CSS.new(source).render(:sass), :syntax => :sass, :style => :compressed, :cache => false).render
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
  if url =~ /:\/\//
    path = File.join(@config['src/source'], lib, File.basename(url))
    dir = File.dirname(path)
    system('mkdir ' + dir) unless File.exists?(dir)
    if File.extname(path) == '.css'
      css = download_css(lib, url, File.join(dir, File.basename(url)))
      File.open(path, 'w'){ |f| f.write(css) }
      download_images(lib, url, path)
    else
      download url, path
    end
  else
    path = url
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

desc 'build files from lib.yml'
task :build, :config do |task, args|
  args = {
    :config => 'example.yml'
  }.merge(args.to_hash)
  
  unless File.exists?(args[:config])
    p 'File is not exists!'
    exit!
  end
  
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
  
  @preload = DATA['preload']
  
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
      file = File.join(@config['src/source'], lib + '.css')
      File.open(file, 'w'){ |f| f.write(css) }
      path.push(file)
    end
    if js != ''
      file = File.join(@config['src/source'], lib + '.js')
      js = minify(js, :js) if @config['minify'] == true
      File.open(file, 'w'){ |f| f.write(js) }
      path.push(file)
    end
    path = path[0] if path.length == 1
    @libs[lib] = path
  end
  
  libjs = File.read(@libs['lazyload']) << ';'
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
  end
  
  @libs.each do |lib, path|
    css = []
    js = []
    path = [path] unless path.class == Array
    path.each do |url|
      url = url.gsub(@config['src'], @config['url'])
      case File.extname(url)
        when '.css'
          css.push url
        when '.js'
          js.push url
      end
    end
    css = css.join("','")
    js = js.join("','")
    libjs << "LazyLoad['#{lib}']=function(callback){"
    libjs << "LazyLoad.css(['#{css}']);" if css.length > 0
    libjs << "LazyLoad.js(['#{js}'],function(){if(typeof callback!=='undefined'){callback();}});};"
    libjs << "\n" if @config['minify'] == false
  end
  
  if @preload.class == Array && @preload.length > 0
    @preload.each do |lib|
      libjs << "LazyLoad['#{lib}']();"
    end
  end
  File.open(File.join(@config['src/javascripts'], 'lib.js'), 'w'){ |f| f.write(libjs) }
end
