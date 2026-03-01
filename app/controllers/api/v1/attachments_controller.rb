module Api
  module V1
    class AttachmentsController < BaseController
      before_action :set_task

      def index
        @attachments = @task.attachments
      end

      def create
        files = params[:files]
        if files.blank?
          render json: { errors: ["No files provided"] }, status: :unprocessable_entity
          return
        end

        @task.attachments.attach(files)
        @attachments = @task.attachments
        render :index, status: :created
      end

      def destroy
        @attachment = @task.attachments.find(params[:id])
        @attachment.purge
        head :no_content
      end

      private

      def set_task
        @task = Task.find(params[:task_id])
      end
    end
  end
end
