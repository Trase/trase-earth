module Api
  module V3
    class CountryProfilesController < ApiController
      include Api::V3::Profiles::CrossContextHelpers

      skip_before_action :load_context
      before_action :load_contexts
      before_action :load_node
      before_action :set_year

      def top_consumer_actors
        @result = Api::V3::Profiles::CrossContextTopNodesChart.new(
          @contexts,
          @node,
          @year,
          {
            profile_type: profile_type,
            chart_identifier: :country_top_consumer_actors,
            context: @context
          }
        ).call

        render json: {data: @result}
      end

      def top_consumer_countries
        @result = Api::V3::Profiles::CrossContextTopNodesChart.new(
          @contexts,
          @node,
          @year,
          {
            profile_type: profile_type,
            chart_identifier: :country_top_consumer_countries,
            context: @context
          }
        ).call

        render json: {data: @result}
      end

      private

      def profile_type
        Api::V3::Profile::COUNTRY
      end
    end
  end
end
