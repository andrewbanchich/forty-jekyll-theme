# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "matthiasbruns_freelancer_page"
  spec.version       = "1.0"
  spec.authors       = ["Matthias Bruns"]
  spec.email         = ["info@matthiasbruns.com"]

  spec.summary       = %q{Website based on https://gitlab.com/andrewbanchich/forty-jekyll-theme}
  spec.homepage      = "https://gitlab.com/andrewbanchich/forty-jekyll-theme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass|LICENSE|README)}i) }

  spec.add_development_dependency "jekyll", "~> 3.8.5"
  spec.add_development_dependency "bundler", "~> 2.0.1"
  spec.add_development_dependency "wdm", "~> 0.1.1"
end
