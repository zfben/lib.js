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

# Get config.yml

DATA = YAML.load(File.read('config.yml'))

# Merge default config

@config = {
  'url' => 'src/lib/'
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
      File.open(path, 'w'){ |f| f.write(download_css(lib, url, @config['url'] + File.basename(url))) }
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
      p sub = File.join(File.dirname(path), reg.match(f)[1])
      f = download_css(lib, File.dirname(url) + '/' + reg.match(f)[1], sub)
    end
    f
  }.join "\n"
end

desc 'build files from lib.yml'
task :build do
  @libs.each do |lib, url|
    if url.class == String
      @libs[lib] = download(lib, url)
    else
      @libs[lib] = url.map{ |u| download(lib, u) }
    end
  end
  libjs = File.read('src/lib/headjs.js')
  @libs.each do |lib, url|
    url = url.join("','") if url.class == Array
    libjs << "head.#{lib}=function(callback){head.js('#{url}',function(){if(typeof callback!=='undefined'){callback();}});};\n"
  end
  File.open('src/lib.js', 'w'){ |f| f.write(libjs) }
  if @config['minify'] == true
    minify 'src/lib.js'
  end
end
