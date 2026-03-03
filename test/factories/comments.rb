FactoryBot.define do
  factory :comment do
    body { "A test comment" }
    card
    user
  end
end
