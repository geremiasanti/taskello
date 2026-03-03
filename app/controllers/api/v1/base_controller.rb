module Api
  module V1
    class BaseController < ActionController::Base
      protect_from_forgery with: :null_session

      before_action :authenticate_user!

      private

      def current_user
        @current_user ||= User.find_by(id: session[:user_id])
      end
      helper_method :current_user

      def authenticate_user!
        render json: { error: "Unauthorized" }, status: :unauthorized unless current_user
      end
    end
  end
end
