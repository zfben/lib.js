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

def minify path
  if File.exists?(path) && File.read(path).length > 10
    p '== minify: ' + path
    min = ''
    case File.extname(path)
      when '.js'
        min = Uglifier.new(:copyright => false).compile(File.read(path))
      when '.css'
        min = Sass::Engine.new(Sass::CSS.new(File.read(path)).render(:sass), :syntax => :sass, :style => :compressed, :cache => false).render
    end
    if min.length > 10
      new_path = path.split('.')
      new_path[-1] = 'min.' + new_path[-1]
      new_path = new_path.join('.')
      File.open(new_path, 'w'){ |f| f.write(min) }
      return new_path
    end
  end
  return path
end

def download lib, url
  if url =~ /:\/\//
    path = "#{@config['src/lib']}#{lib}/#{lib}#{url.match(/\.([^.]+)$/)[0]}"
    dir = File.dirname(path)
    system('mkdir ' + dir) unless File.exists?(dir)
    if File.extname(path) == '.css'
      css = download_css(lib, url, File.join(dir, File.basename(url)))
      File.open(path, 'w'){ |f| f.write(css) }
      p download_images(lib, url, path)
    else
      if @config['download'] == true || !File.exists?(path)
        system 'wget ' + url + ' -O ' + path + ' -N'
      end
    end
    if @config['minify'] == true
      path = minify(path)
    end
  else
    path = @libs[url]
  end
  return path
end

def download_css lib, url, path
  if @config['download'] == true || !File.exists?(path)
    system 'wget ' + url + ' -O ' + path + ' -N'
  end
  reg = /@import[^"]+"([^"]+)"[^;]*;/
  return File.read(path).partition_all(reg).map{ |f|
    if reg =~ f
      sub = File.join(File.dirname(path), reg.match(f)[1])
      f = download_css(lib, File.dirname(url) + '/' + reg.match(f)[1], sub)
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
      if @config['download'] == true || !File.exists?(sub)
        system 'wget ' + suburl + ' -O ' + sub + ' -N'
      end
    else
      f = nil
    end
    f
  }.compact
end

desc 'build files from lib.yml'
task :build, :config do |task, args|
  args = {
    :config => 'default.yml'
  }.merge(args.to_hash)
  
  unless File.exists?(args[:config])
    p 'File is not exists!'
    exit!
  end
  
  # Get config.yml

  DATA = YAML.load(File.read(args[:config]))

  # Merge default config

  @config = {
    'src' => 'src/',
    'download' => false,
    'minify' => true
  }.merge(DATA['config'])

  @config['src/lib'] = 'src/lib/' unless @config.has_key?('src/lib')

  [@config['src'], @config['src/lib']].each{ |f| system('mkdir ' + f) unless File.exists?(f) }

  # Merge default libs

  @libs = {
    'headjs' => 'https://raw.github.com/benz303/headjs/master/dist/head.js'
  }.merge(DATA['libs'])
  
  
  @libs.each do |lib, url|
    if url.class == String
      @libs[lib] = download(lib, url)
    else
      @libs[lib] = url.map{ |u| download(lib, u) }
    end
  end
  libjs = File.read(@libs['headjs']) << ';'
  @libs.each do |lib, url|
    url = url.join("','") if url.class == Array
    libjs << "head.#{lib}=function(callback){head.js('#{url}',function(){if(typeof callback!=='undefined'){callback();}});};"
    libjs << "\n" if @config['minify'] == false
  end
  path = File.join(@config['src'], 'lib.js')
  File.open(path, 'w'){ |f| f.write(libjs) }
end
