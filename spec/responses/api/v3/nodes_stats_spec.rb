require 'rails_helper'

RSpec.describe 'Nodes stats', type: :request do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::NodesStats.refresh
  end

  describe 'GET /api/v3/nodes_stats' do
    context 'when a list of context is specified' do
      it 'returns the nodes stats for those contexts' do
        get '/api/v3/nodes_stats', params: {
          start_year: 2003,
          end_year: 2019,
          attribute_ids: [api_v3_volume.id],
          column_id: api_v3_country_node_type.id,
          contexts_ids: [api_v3_context.id]
        }

        expect(@response).to have_http_status(:ok)
        expect(@response).to match_response_schema('v3_nodes_stats')

        parsed_response = JSON.parse(@response.body)
        nodes_ids =
          parsed_response['data'].first['attributes'].first['targets'].map { |d| d['id'] }
        expect(nodes_ids).to eql([
          api_v3_country_of_destination1_node.id,
          api_v3_other_country_of_destination_node.id
        ])
      end
    end

    context 'when a commodity is specified' do
      it 'returns the nodes stats for the specified commodity' do
        get '/api/v3/nodes_stats', params: {
          start_year: 2003,
          end_year: 2019,
          attribute_ids: [api_v3_volume.id],
          column_id: api_v3_country_node_type.id,
          commodity_id: api_v3_soy.id
        }

        expect(@response).to have_http_status(:ok)
        expect(@response).to match_response_schema('v3_nodes_stats')

        parsed_response = JSON.parse(@response.body)
        nodes_ids =
          parsed_response['data'].first['attributes'].first['targets'].map { |d| d['id'] }
        expect(nodes_ids).to eql([
          api_v3_country_of_destination1_node.id,
          api_v3_other_country_of_destination_node.id
        ])
      end
    end
  end
end
