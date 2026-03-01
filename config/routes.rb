Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tasks, only: [:index, :show, :create, :update, :destroy] do
        resources :comments, only: [:index, :create, :destroy]
        resources :attachments, only: [:index, :create, :destroy]
      end
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check

  root "pages#home"
end
