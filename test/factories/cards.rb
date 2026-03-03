FactoryBot.define do
  factory :card do
    sequence(:title) { |n| "Card #{n}" }
    description { "A test card" }
    column { "todo" }
    position { 0 }
    board
    creator factory: :user
  end
end
