module Api
  module V1
    class SessionsController < BaseController
      skip_before_action :authenticate_user!, only: [:create, :signup]

      def signup
        user = User.new(signup_params)
        if user.save
          session[:user_id] = user.id
          set_encrypted_cookie(user)
          render json: user_json(user), status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def create
        user = User.find_by(email: login_params[:email])
        if user&.authenticate(login_params[:password])
          session[:user_id] = user.id
          set_encrypted_cookie(user)
          render json: user_json(user), status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def destroy
        reset_session
        cookies.delete(:user_id)
        head :no_content
      end

      def me
        render json: user_json(current_user), status: :ok
      end

      private

      def signup_params
        params.require(:user).permit(:username, :email, :password)
      end

      def login_params
        params.require(:session).permit(:email, :password)
      end

      def set_encrypted_cookie(user)
        cookies.encrypted[:user_id] = { value: user.id, httponly: true, same_site: :lax }
      end

      def user_json(user)
        {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar.attached? ? rails_blob_path(user.avatar, only_path: true) : nil,
          created_at: user.created_at
        }
      end
    end
  end
end
