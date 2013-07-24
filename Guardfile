# Compile SASS
guard 'sass', :input => 'css', :output => '_/css', :smart_partials => true, :style => :compressed

# Compile Coffeescript
guard 'coffeescript', :input => 'coffee', :output => 'js'

# Compress JS
guard :jammit, :output_folder => "_/js/min/" do
  watch(%r{^js/(.*)\.js$})
end