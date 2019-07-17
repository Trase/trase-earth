# Returns node types by which to break down for non-overview charts,
# taking into account user selection and availability of node types
# in the given context.
module Api
  module V3
    module Dashboards
      module ParametrisedCharts
        class NodeTypesToBreakBy
          # @param context [Api::V3::Context]
          # @param nodes [Api::V3::Node]
          def initialize(context, nodes = [])
            @context = context
            @nodes = nodes || []
          end

          def all_node_types
            return @all_node_types if defined?(@all_node_types)

            context_node_types = @context.context_node_types.
              includes(:context_node_type_property, :node_type).
              where.not('context_node_type_properties.role' => nil)
            @all_node_types = context_node_types.map(&:node_type)
          end

          def nodes_by_node_type_id
            return @nodes_by_node_type_id if defined? (@nodes_by_node_type_id)

            @nodes_by_node_type_id = @nodes.group_by(&:node_type_id)
          end

          # returns node types for which
          # - no nodes selected,or
          # - two or more nodes selected
          def node_types_for_comparisons
            all_node_types.select do |node_type|
              nodes = nodes_by_node_type_id[node_type.id]
              nodes.nil? || nodes.length > 1
            end
          end

          def selected_node_types
            all_node_types.select do |node_type|
              nodes_by_node_type_id.keys.include?(node_type.id)
            end
          end
        end
      end
    end
  end
end
