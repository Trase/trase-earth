class GetColumnsSerializer < ActiveModel::Serializer
  attributes :id, :name, :position, :group, :is_default, :is_geo, :profile_type
end
