require "pagy/extras/overflow"
require "pagy/extras/countless"
Pagy::DEFAULT[:overflow] = :last_page
# Force small page size for testing
Pagy::DEFAULT[:items] = 2
