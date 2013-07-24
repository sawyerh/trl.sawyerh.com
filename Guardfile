# A sample Guardfile
# More info at https://github.com/guard/guard#readme

# Compile SASS
guard 'sass', :input => 'css', :output => '_/css', :smart_partials => true, :style => :compressed

# Compress JS
guard :jammit, :output_folder => "_/js/min/" do
  watch(%r{^js/(.*)\.js$})
end