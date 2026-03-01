module Api
  module V1
    class CommentsController < BaseController
      before_action :set_task

      def index
        @comments = @task.comments.order(created_at: :asc)
      end

      def create
        @comment = @task.comments.create!(comment_params)
        render :show, status: :created
      end

      def destroy
        @comment = @task.comments.find(params[:id])
        @comment.destroy
        head :no_content
      end

      private

      def set_task
        @task = Task.find(params[:task_id])
      end

      def comment_params
        params.require(:comment).permit(:body)
      end
    end
  end
end
