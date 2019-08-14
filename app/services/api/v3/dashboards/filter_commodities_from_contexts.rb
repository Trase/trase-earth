module Api
  module V3
    module Dashboards
      class FilterCommoditiesFromContexts < BaseFilter
        include CallWithQueryTerm

        def initialize(params)
          @meta = {}
          @self_ids = params.delete(:commodities_ids)
          @include_countries = params[:include] == 'countries'
          @countries_ids = params[:countries_ids] || []
          super(params)
        end

        def call
          {data: @query, meta: @meta}
        end

        private

        def initialize_query
          @query = Api::V3::Context.
            select('contexts.commodity_id AS id', 'commodities.name AS name').
            joins('INNER JOIN commodities ON commodities.id = contexts.commodity_id').
            group(:commodity_id, 'commodities.name')

          if @countries_ids.any?
            @query = @query.where(country_id: @countries_ids)
          end

          include_countries if @include_countries
        end

        def include_countries
          @query = @query.select(
            :commodity_id,
            'commodities.name',
            'ARRAY_AGG(contexts.country_id) AS country_ids'
          )

          country_ids = @query.map(&:country_ids).flatten.uniq
          countries = Api::V3::Country.where(id: country_ids)
          @meta[:countries] = ActiveModel::Serializer::CollectionSerializer.new(
            countries, serializer: Api::V3::Dashboards::CountrySerializer
          ).as_json
        end
      end
    end
  end
end
