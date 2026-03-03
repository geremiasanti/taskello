FactoryBot.define do
  factory :board do
    sequence(:name) { |n| "Board #{n}" }
    description { "A test board" }
    creator factory: :user
  end
end
