FactoryBot.define do
  factory :label do
    sequence(:name) { |n| "Label #{n}" }
    color { "#e5534b" }
    board
  end
end
