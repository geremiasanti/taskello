module Api
  module V1
    class AttachmentsController < BaseController
      before_action :set_card

      def index
        attachments = @card.attachments.includes(:user)
        render json: attachments.map { |a| attachment_json(a) }
      end

      def create
        attachment = @card.attachments.build(attachment_params.merge(user: current_user))
        if attachment.save
          render json: attachment_json(attachment), status: :created
        else
          render json: { errors: attachment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        attachment = @card.attachments.find(params[:id])
        attachment.destroy
        head :no_content
      end

      private

      def set_card
        @card = Card.find(params[:card_id])
        render json: { error: "Forbidden" }, status: :forbidden unless @card.board.members.include?(current_user)
      end

      def attachment_params
        params.require(:attachment).permit(:attachment_type, :url, :link_text, :file)
      end

      def attachment_json(a)
        {
          id: a.id,
          attachment_type: a.attachment_type,
          url: a.attachment_type == "link" ? a.url : (a.file.attached? ? rails_blob_path(a.file, only_path: true) : nil),
          link_text: a.link_text,
          filename: a.file.attached? ? a.file.filename.to_s : nil,
          created_at: a.created_at,
          user: { id: a.user.id, username: a.user.username }
        }
      end
    end
  end
end
