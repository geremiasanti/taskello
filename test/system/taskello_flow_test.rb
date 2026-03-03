require "application_system_test_case"

class TaskelloFlowTest < ApplicationSystemTestCase
  test "signup, create board, create card, and comment" do
    # Signup
    visit "/"
    assert_text "Sign in to Taskello"
    click_on "Create an account"

    assert_text "Create your account"
    fill_in "Username", with: "testuser"
    fill_in "Email", with: "testuser@example.com"
    fill_in "Password", with: "password123"
    click_on "Create account"

    # Should redirect to boards
    assert_text "Your boards", wait: 5

    # Create a board
    click_on "New board"
    assert_text "Create board"
    fill_in "Board name", with: "Test Board"
    fill_in "Description", with: "A board for testing"
    click_on "Create board"

    # Should be on the board page
    assert_text "Test Board", wait: 5

    # Create a card in the todo column
    within(:xpath, "//div[contains(., 'todo')]//ancestor::div[contains(@class, 'rounded')]", match: :first) do
      find("button", text: "+").click
    end
    fill_in "Card title...", with: "My First Card"
    click_on "Add card"

    assert_text "My First Card", wait: 5

    # Click on the card to open detail
    find("[data-card-id]", text: "My First Card").click

    assert_text "todo", wait: 5
    assert_selector "button", text: "Edit"

    # Edit the card
    click_on "Edit"
    # TipTap editor should be present for description
    assert_selector ".tiptap-editor"

    click_on "Save"

    # Check comment section is visible
    assert_text "Comments"
  end

  test "login and view existing boards" do
    user = create(:user, email: "flow@example.com", password: "password")
    board = create(:board, creator: user, name: "Flow Board")
    create(:card, board: board, creator: user, title: "Flow Card", column: "todo", position: 0)

    visit "/"
    assert_text "Sign in to Taskello"

    fill_in "Email", with: "flow@example.com"
    fill_in "Password", with: "password"
    click_on "Sign in"

    assert_text "Your boards", wait: 5
    assert_text "Flow Board"

    # Navigate to board
    click_on "Flow Board"
    assert_text "Flow Board", wait: 5
    assert_text "Flow Card"
  end

  test "board CRUD as creator" do
    user = create(:user, email: "creator@example.com", password: "password")

    visit "/"
    fill_in "Email", with: "creator@example.com"
    fill_in "Password", with: "password"
    click_on "Sign in"

    assert_text "Your boards", wait: 5

    # Create
    click_on "New board"
    fill_in "Board name", with: "CRUD Board"
    click_on "Create board"
    assert_text "CRUD Board", wait: 5

    # Edit
    click_on "Edit"
    fill_in "Board name", with: "Updated Board"
    click_on "Update"
    assert_text "Updated Board", wait: 5

    # Delete
    accept_confirm "Delete this board?" do
      click_on "Delete"
    end
    assert_text "Your boards", wait: 5
    assert_no_text "Updated Board"
  end

  test "keyboard legend toggle with ? key" do
    user = create(:user, email: "kbd@example.com", password: "password")
    board = create(:board, creator: user, name: "Kbd Board")
    create(:card, board: board, creator: user, title: "Kbd Card", column: "todo", position: 0)

    visit "/"
    fill_in "Email", with: "kbd@example.com"
    fill_in "Password", with: "password"
    click_on "Sign in"

    assert_text "Your boards", wait: 5
    click_on "Kbd Board"
    assert_text "Kbd Board", wait: 5

    # Press ? to toggle keyboard legend
    find("body").send_keys("?")
    # Legend should be visible (contains shortcut info)
    assert_text "Keyboard shortcuts", wait: 3
  end
end
