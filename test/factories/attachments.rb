FactoryBot.define do
  factory :attachment do
    attachment_type { "link" }
    url { "https://example.com" }
    link_text { "Example" }
    card
    user
  end
end
