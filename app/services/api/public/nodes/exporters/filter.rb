module Api
  module Public
    module Nodes
      module Exporters
        class Filter < Api::Public::Nodes::Filter
          private

          def initialize_query
            @query = Api::V3::Readonly::NodeWithFlows.
              without_unknowns.
              without_domestic.
              where(role: Api::V3::ContextNodeTypeProperty::EXPORTER_ROLE)
          end
        end
      end
    end
  end
end
