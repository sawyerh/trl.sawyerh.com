# Compile SASS
guard 'sass', :input => 'assets/css', :output => 'assets/_/css', :smart_partials => true, :style => :compressed

# Compile Coffeescript
guard 'coffeescript', :input => 'assets/coffee', :output => 'assets/js'

# Compress JS
guard :jammit, :output_folder => "assets/_/js/" do
  watch(%r{^assets/js/(.*)\.js$})
end