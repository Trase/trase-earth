# == Schema Information
#
# Table name: top_profile_images
#
#  id                 :bigint(8)        not null, primary key
#  commodity_id       :bigint(8)
#  image_file_name    :string
#  image_content_type :string
#  profile_type       :string
#  image_file_size    :integer
#
# Indexes
#
#  index_top_profile_images_on_commodity_id  (commodity_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id)
#

module Api
  module V3
    class TopProfileImage < YellowTable
      PROFILE_TYPES = %w(actor place).freeze

      belongs_to :commodity
      has_many :top_profiles, dependent: :nullify
      has_attached_file :image, styles: {small: '320x320>', large: '640x640>'}
      validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/
      validates :profile_type, inclusion: PROFILE_TYPES

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context},
          {name: :node_id, table_class: Api::V3::Node}
        ]
      end
    end
  end
end
