module Api
  module V1
    class CardLabelsController < BaseController
      before_action :set_card

      def create
        label = Label.find(params[:label_id])
        card_label = @card.card_labels.create!(label: label)
        render json: { id: card_label.id, label_id: label.id }, status: :created
      rescue ActiveRecord::RecordInvalid
        render json: { error: "Label already added" }, status: :unprocessable_entity
      end

      def destroy
        card_label = @card.card_labels.find_by!(label_id: params[:id])
        card_label.destroy
        head :no_content
      end

      private

      def set_card
        @card = Card.find(params[:card_id])
        render json: { error: "Forbidden" }, status: :forbidden unless @card.board.members.include?(current_user)
      end
    end
  end
end
