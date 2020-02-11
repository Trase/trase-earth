SELECT
  nodes_with_co_nodes.node_id AS id,
  nodes_with_co_nodes.context_id,
  contexts.country_id,
  contexts.commodity_id,
  nodes.node_type_id,
  cnt.id AS context_node_type_id,
  nodes.main_id,
  cnt.column_position,
  nodes_with_co_nodes.year,
  nodes.is_unknown,
  nodes.name AS name,
  TO_TSVECTOR('simple', COALESCE(nodes.name, '')) AS name_tsvector,
  node_types.name AS node_type,
  UPPER(TRIM(nodes.geo_id)) AS geo_id
FROM (
  SELECT DISTINCT
    flow_nodes.node_id,
    flow_nodes.context_id,
    flow_nodes.position,
    flow_nodes.year
  FROM flow_nodes
) nodes_with_co_nodes
JOIN nodes ON nodes_with_co_nodes.node_id = nodes.id
JOIN node_types ON nodes.node_type_id = node_types.id
JOIN contexts ON nodes_with_co_nodes.context_id = contexts.id
JOIN context_node_types cnt ON
  nodes_with_co_nodes.context_id = cnt.context_id
  AND nodes_with_co_nodes.position = cnt.column_position + 1
  AND contexts.id = cnt.context_id
  AND nodes.node_type_id = cnt.node_type_id
  AND node_types.id = cnt.node_type_id;
