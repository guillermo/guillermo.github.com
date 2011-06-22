

module Jekyll
  # Sass plugin to convert .scss to .css
  # 
  # Note: This is configured to use the new css like syntax available in sass.
  require 'sass'
  class SassConverter < Converter
    safe true
    priority :normal

    def matches(ext)
      ext =~ /scss/i
    end

    def output_ext(ext)
      ".css"
    end
 
    def convert(content)
      begin
        engine = ::Sass::Engine.new(content, :syntax => :scss)
        engine.render
      rescue StandardError => e
        puts "!!! SASS Error: " + e.message
      end
    end
  end
end



module Jekyll
  require 'coffee-script'
  class CoffeeScriptConverter < Converter
    safe true
    priority :normal

    def matches(ext)
      ext =~ /coffee/i
    end

    def output_ext(ext)
      ".js"
    end

    def convert(content)
      begin
        CoffeeScript.compile content
      rescue StandardError => e
        puts "CoffeeScript error:" + e.message
      end
    end
  end
end