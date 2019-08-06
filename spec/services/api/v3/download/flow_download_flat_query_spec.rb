require 'rails_helper'

RSpec.describe Api::V3::Download::FlowDownloadFlatQuery do
  include_context 'api v3 brazil two flows'

  before do
    allow(
      Api::V3::Download::PrecomputedDownload
    ).to receive(:refresh)
  end

  before(:each) do
    Api::V3::Readonly::DownloadFlow.refresh(sync: true)
  end

  let(:query_builder) {
    Api::V3::Download::FlowDownloadQueryBuilder.new(api_v3_context, {})
  }

  let(:flat_query) {
    query_builder.flat_query
  }

  describe :all do
    it 'returns DEFORESTATION as value of INDICATOR column' do
      results = flat_query.all
      deforestation = results.find { |r| r['INDICATOR'] == 'DEFORESTATION' }
      expect(deforestation['TOTAL']).to eq('10')
    end

    it 'returns sum of quants' do
      results = flat_query.all
      flow2_deforestation = results.find do |r|
        r['INDICATOR'] == 'DEFORESTATION' &&
          r['IMPORTER'] == api_v3_importer2_node.name
      end
      expect(flow2_deforestation['TOTAL']).to eq('15')
    end

    it 'returns distinct values of quals' do
      results = flat_query.all
      flow2_zero_deforestation = results.find do |r|
        r['INDICATOR'] == 'ZERO DEFORESTATION' &&
          r['IMPORTER'] == api_v3_importer2_node.name
      end
      expect(flow2_zero_deforestation['TOTAL']).to eq('yes')
    end
  end

  describe :total do
    it 'returns count of flows per year per attribute' do
      expect(flat_query.total).to eq(4)
    end
  end
end
