module Api
  module V1
    class LabelsController < BaseController
      include BoardAuthorizable

      before_action :set_board
      before_action :authorize_member!

      def index
        render json: @board.labels.select(:id, :name, :color)
      end

      def create
        color = params.dig(:label, :color) || Label.next_color(@board)
        label = @board.labels.build(label_params.merge(color: color))
        if label.save
          render json: { id: label.id, name: label.name, color: label.color }, status: :created
        else
          render json: { errors: label.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        label = @board.labels.find(params[:id])
        if label.update(label_params)
          render json: { id: label.id, name: label.name, color: label.color }
        else
          render json: { errors: label.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        label = @board.labels.find(params[:id])
        label.destroy
        head :no_content
      end

      private

      def label_params
        params.require(:label).permit(:name, :color)
      end
    end
  end
end
