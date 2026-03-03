FactoryBot.define do
  factory :notification do
    user
    actor factory: :user
    notifiable factory: :comment
    notification_type { "mention" }
    read { false }
  end
end
