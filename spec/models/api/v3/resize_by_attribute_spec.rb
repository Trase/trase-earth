require 'rails_helper'
require 'models/api/v3/shared_attributes_examples'

RSpec.describe Api::V3::ResizeByAttribute, type: :model do
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 node types'

  describe :validate do
    let(:attribute_without_context) {
      FactoryBot.build(:api_v3_resize_by_attribute, context: nil)
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_resize_by_attribute,
        context: api_v3_context,
        group_number: api_v3_volume_resize_by_attribute.group_number,
        position: api_v3_volume_resize_by_attribute.position
      )
    }
    it 'fails when context missing' do
      expect(attribute_without_context).to have(2).errors_on(:context)
    end
  end

  describe :destroy_zombies do
    let!(:referenced) { FactoryBot.create(:api_v3_resize_by_attribute) }
    let!(:resize_by_quant) {
      FactoryBot.create(
        :api_v3_resize_by_quant,
        resize_by_attribute: referenced,
        quant: FactoryBot.create(:api_v3_quant)
      )
    }
    let!(:zombie) { FactoryBot.create(:api_v3_resize_by_attribute) }
    let(:subject) { Api::V3::ResizeByAttribute }
    include_examples 'destroys zombies'
  end

  describe :save do
    let(:years) { [2017, 2018, 2019] }
    let(:quant) { FactoryBot.create(:api_v3_quant) }
    let(:resize_by_attribute) {
      FactoryBot.build(:api_v3_resize_by_attribute, context: api_v3_context)
    }
    let!(:resize_by_quant) {
      FactoryBot.build(
        :api_v3_resize_by_quant,
        resize_by_attribute: resize_by_attribute,
        quant: quant
      )
    }
    before(:each) do
      years.each do |year|
        flow = FactoryBot.create(
          :api_v3_flow,
          path: [
            FactoryBot.create(:api_v3_node, node_type: api_v3_biome_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_state_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_municipality_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_logistics_hub_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_port_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_exporter_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_importer_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_country_node_type)
          ].map(&:id),
          context: api_v3_context,
          year: year
        )
        FactoryBot.create(:api_v3_flow_quant, flow: flow, quant: quant)
      end
    end

    it 'automatically populates available years' do
      Sidekiq::Testing.inline! do
        resize_by_attribute.save
      end
      expect(resize_by_attribute.reload.years).to eq(years)
    end
  end
end
