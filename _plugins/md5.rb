require 'digest/md5'

module MDhash # generate a md5 hash
  def md5(input)
    Digest::MD5.hexdigest input.strip
  end
end

#register this module with Liquid
Liquid::Template.register_filter(MDhash)
