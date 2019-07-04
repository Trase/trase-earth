# Module responsible for deriving details from top profile
# and assigning them to the new record
module Api
  module V3
    module TopProfiles
      class DeriveTopProfileDetails
        attr_reader :top_profile

        class << self
          def call(top_profile)
            new(top_profile).call
          end
        end

        def initialize(top_profile)
          @top_profile = top_profile
        end

        def call
          assign_profile_type
          assign_year
          assign_summary
        end

        private

        def assign_profile_type
          top_profile.profile_type = profile_type
        end

        def assign_year
          top_profile.year = year
        end

        def assign_summary
          service = "Api::V3::#{profile_type.pluralize.capitalize}::BasicAttributes".constantize
          top_profile.summary = service.new(
            top_profile.context, node, year
          ).call[:summary]
        end

        def node
          top_profile.node
        end

        def profile_type
          node.node_type.context_node_types.find_by(context_id: top_profile.context_id).profile.name
        end

        def year
          Api::V3::Readonly::Node.find(node.id).years.max
        end
      end
    end
  end
end
