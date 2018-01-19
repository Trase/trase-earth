module Api
  module V3
    class Quant < BaseModel
      include Api::V3::Import::BlueTableHelpers

      has_one :quant_property
      delegate :display_name, to: :quant_property

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
