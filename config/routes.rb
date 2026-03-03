Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post "signup", to: "sessions#signup"
      post "login", to: "sessions#create"
      delete "logout", to: "sessions#destroy"
      get "me", to: "sessions#me"

      resources :boards do
        resources :members, controller: "board_members", only: [:create, :destroy]
        resources :labels, only: [:index, :create, :update, :destroy]
      end

      resources :cards, only: [:show, :create, :update, :destroy] do
        patch "move", on: :member
        resources :comments, only: [:index, :create, :destroy]
        resources :attachments, only: [:index, :create, :destroy]
        resources :participants, controller: "card_participants", only: [:create, :destroy]
        resources :card_labels, only: [:create, :destroy]
      end

      resources :notifications, only: [:index] do
        patch "read", on: :member
        post "read_all", on: :collection
      end
    end
  end

  root "pages#home"
  get "*path", to: "pages#home", constraints: ->(req) { !req.path.start_with?("/rails/") }
end
