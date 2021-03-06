# == Schema Information
#
# Table name: ind_properties
#
#  id                                                                    :integer          not null, primary key
#  ind_id                                                                :integer          not null
#  display_name(Name of attribute for display)                           :text             not null
#  unit_type(Type of unit, e.g. score. One of restricted set of values.) :text
#  tooltip_text(Generic tooltip text (lowest precedence))                :text
#
# Indexes
#
#  ind_properties_ind_id_key  (ind_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class IndProperty < YellowTable
      UNIT_TYPE = %w(
        currency
        ratio
        score
        unitless
      ).freeze

      belongs_to :ind

      validates :ind, presence: true, uniqueness: true
      validates :display_name, presence: true
      validates :unit_type, presence: true, inclusion: {in: UNIT_TYPE}

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::Attribute.refresh
      end
    end
  end
end
