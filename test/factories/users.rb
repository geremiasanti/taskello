FactoryBot.define do
  factory :user do
    sequence(:username) { |n| "user_#{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password" }
  end
end
