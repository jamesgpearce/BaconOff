dir = File.dirname(__FILE__)
load File.join(dir, 'themes')

sass_path    = dir
css_path     = dir
images_path     = File.join(dir, '..', 'img')
environment  = :production
output_style = :compressed