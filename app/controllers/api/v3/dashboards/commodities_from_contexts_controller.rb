module Api
  module V3
    module Dashboards
      class CommoditiesFromContextsController < ApiController
        include FilterParams
        include Collection
        skip_before_action :load_context

        def index
          initialize_collection_for_index

          render json: @collection,
                 each_serializer: Api::V3::Dashboards::CommoditySerializer,
                 root: :data
        end

        private

        def filter_klass
          FilterCommoditiesFromContexts
        end
      end
    end
  end
end
