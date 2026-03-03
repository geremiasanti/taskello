require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "valid user" do
    user = build(:user)
    assert user.valid?
  end

  test "requires username" do
    user = build(:user, username: nil)
    assert_not user.valid?
    assert_includes user.errors[:username], "can't be blank"
  end

  test "requires unique username" do
    create(:user, username: "taken")
    user = build(:user, username: "taken")
    assert_not user.valid?
    assert_includes user.errors[:username], "has already been taken"
  end

  test "requires email" do
    user = build(:user, email: nil)
    assert_not user.valid?
  end

  test "requires unique email" do
    create(:user, email: "taken@example.com")
    user = build(:user, email: "taken@example.com")
    assert_not user.valid?
  end

  test "requires valid email format" do
    user = build(:user, email: "invalid")
    assert_not user.valid?
  end

  test "requires password with minimum length" do
    user = build(:user, password: "short")
    assert_not user.valid?
    assert_includes user.errors[:password], "is too short (minimum is 6 characters)"
  end

  test "authenticates with correct password" do
    user = create(:user, password: "password")
    assert user.authenticate("password")
    assert_not user.authenticate("wrong")
  end
end
