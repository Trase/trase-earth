require 'active_support/concern'

module Api
  module V3
    module DatabaseValidation
      module Checks
        module ErrorMessageWithViolatingFlows
          extend ActiveSupport::Concern

          N = 10

          def error_message(prefix)
            violating_flows_cnt = @violating_flows.size
            violating_ids, n_more =
              if violating_flows_cnt > N
                [@violating_flows[0..(N - 1)], violating_flows_cnt - N]
              else
                [@violating_flows, nil]
              end
            violating_ids_message = violating_ids.join(', ')
            violating_ids_message += " and #{n_more} more" if n_more

            [
              prefix,
              ' (violating flows ids: ',
              violating_ids_message,
              ')'
            ].join('')
          end
        end
      end
    end
  end
end
