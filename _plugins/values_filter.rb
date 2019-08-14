module Jekyll
    module ValuesFilter
      def values(input)
        case
          when input.instance_of?(Hash)
            input.values
          else
            input
        end
      end
    end
  end
  
  Liquid::Template.register_filter(Jekyll::ValuesFilter) 