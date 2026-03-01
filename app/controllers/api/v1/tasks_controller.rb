module Api
  module V1
    class TasksController < BaseController
      before_action :set_task, only: [:show, :update, :destroy]

      def index
        @tasks = Task.with_attached_attachments.ordered
        @tasks = @tasks.by_status(params[:status]) if params[:status].present?
      end

      def show
      end

      def create
        @task = Task.create!(task_params)
        render :show, status: :created
      end

      def update
        @task.update!(task_params)
        render :show
      end

      def destroy
        @task.destroy
        head :no_content
      end

      private

      def set_task
        @task = Task.with_attached_attachments.find(params[:id])
      end

      def task_params
        params.require(:task).permit(:title, :description, :status, :due_date, :priority)
      end
    end
  end
end
