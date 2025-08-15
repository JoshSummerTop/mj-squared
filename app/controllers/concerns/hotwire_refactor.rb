module HotwireRefactor
  extend ActiveSupport::Concern

  # This module now exists mainly for historical reference
  # All new Hotwire implementations are active by default
  
  # Future: This can be removed entirely once we're confident
  # all legacy references have been cleaned up
end
