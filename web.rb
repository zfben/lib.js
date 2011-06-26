require 'rubygems'
require 'bundler/setup'
Bundler.require

set :public, './'

get '/' do
  redirect '/index.html'
end
