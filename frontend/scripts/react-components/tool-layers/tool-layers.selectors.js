import { createSelector, createStructuredSelector } from 'reselect';
import getChoropleth from 'reducers/helpers/getChoropleth';
import { getMapDimensionsWarnings as getMapDimensionsWarningsUtil } from 'scripts/reducers/helpers/getMapDimensionsWarnings';
import {
  getHighlightedNodesData,
  getSelectedColumnsIds,
  getSelectedNodesData
} from 'react-components/tool/tool.selectors';
import { getSelectedYears, getSelectedContext } from 'reducers/app.selectors';

const getToolNodes = state => state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks.data.columns;
const getToolNodeAttributes = state => state.toolLinks.data.nodeAttributes;
const getToolMapDimensions = state => state.toolLayers.data.mapDimensions;
const getMapContextualLayers = state => state.toolLayers.data.mapContextualLayers;
const getToolSelectedMapDimensions = state => state.toolLayers.selectedMapDimensions;
const getSelectedMapContextualLayers = state => state.toolLayers.selectedMapContextualLayers;
const getToolMapView = state => state.toolLayers.mapView;
const getIsMapVisible = state => state.toolLayers.isMapVisible;
const getSelectedMapBasemap = state => state.toolLayers.selectedMapBasemap;

const getNodesGeoIds = (nodesData, columns) =>
  nodesData
    .filter(node => {
      const column = columns[node.columnId];
      return column.isGeo === true && typeof node.geoId !== 'undefined' && node.geoId !== null;
    })
    .map(node => node.geoId);

export const getSelectedNodesGeoIds = createSelector(
  [getSelectedNodesData, getToolColumns],
  getNodesGeoIds
);

export const getHighlightedNodesGeoIds = createSelector(
  [getHighlightedNodesData, getToolColumns],
  getNodesGeoIds
);

const getSelectedGeoColumn = createSelector(
  [getToolColumns, getSelectedColumnsIds],
  (columns, selectedColumnsIds) =>
    columns &&
    Object.values(columns).find(column =>
      selectedColumnsIds.some(id => id === column.id && column.isGeo)
    )
);

export const getSelectedMapDimensionsUids = createSelector(
  [getSelectedGeoColumn, getToolMapDimensions, getToolSelectedMapDimensions],
  (selectedGeoColumn, mapDimensions, selectedMapDimensions) => {
    if (selectedGeoColumn && selectedGeoColumn.isChoroplethDisabled === false) {
      const allAvailableMapDimensionsUids = new Set(Object.keys(mapDimensions));
      const selectedMapDimensionsSet = new Set(selectedMapDimensions?.filter(Boolean));
      const intersection = new Set(
        [...selectedMapDimensionsSet].filter(x => allAvailableMapDimensionsUids.has(x))
      );

      // are all currently selected map dimensions available ?
      if (
        selectedMapDimensionsSet.size > 0 &&
        intersection.size === selectedMapDimensionsSet.size
      ) {
        return selectedMapDimensions;
      }

      // use default map dimensions but only if selectedMapDimensions is null
      // we want to allow the user to disable all selections
      if (!selectedMapDimensions) {
        const uids = Object.values(mapDimensions)
          .filter(dimension => dimension.isDefault)
          .map(selectedDimension => selectedDimension.uid);
        return [uids[0] || null, uids[1] || null];
      }
    }

    return [null, null];
  }
);

export const getSelectedMapDimensionsData = createSelector(
  [getSelectedMapDimensionsUids, getToolMapDimensions],
  (selectedMapDimensionsIds, mapDimensions) =>
    selectedMapDimensionsIds.filter(Boolean).map(uid => mapDimensions[uid])
);

export const getChoroplethOptions = createSelector(
  [
    getSelectedMapDimensionsUids,
    getToolNodes,
    getToolNodeAttributes,
    getToolColumns,
    getToolMapDimensions
  ],
  (selectedMapDimensions, nodes, attributes, columns, mapDimensions) => {
    if (!nodes || !attributes || !columns) {
      return { choropleth: {}, choroplethLegend: null };
    }

    return getChoropleth(selectedMapDimensions, nodes, attributes, columns, mapDimensions);
  }
);

export const getMapDimensionsWarnings = createSelector(
  [getToolMapDimensions, getSelectedMapDimensionsUids, getSelectedYears],
  (mapDimensions, selectedMapDimensions, selectedYears) => {
    if (selectedYears.length === 0) {
      return null;
    }
    return getMapDimensionsWarningsUtil(mapDimensions, selectedMapDimensions, selectedYears);
  }
);

export const getCurrentHighlightedChoroplethBucket = createSelector(
  [getHighlightedNodesData, getChoroplethOptions],
  (highlightedNodesData, choroplethOptions) => {
    const { choropleth } = choroplethOptions;
    if (
      highlightedNodesData.length === 1 &&
      highlightedNodesData[0].geoId !== null &&
      typeof choropleth !== 'undefined'
    ) {
      return choropleth[highlightedNodesData[0].geoId] || 'ch-default';
    }

    return undefined;
  }
);

export const getSelectedMapContextualLayersData = createSelector(
  [getSelectedMapContextualLayers, getMapContextualLayers],
  (selectedMapContextualLayers, mapContextualLayers) => {
    if (!selectedMapContextualLayers) {
      return [];
    }
    return selectedMapContextualLayers.map(layer => mapContextualLayers[layer]).filter(Boolean);
  }
);

export const getMapView = createSelector(
  [getToolMapView, getSelectedContext],
  (mapView, selectedContext) => {
    if (!mapView || !selectedContext) {
      return mapView;
    }

    if (
      mapView.latitude === selectedContext.map.latitude &&
      mapView.longitude === selectedContext.map.longitude &&
      mapView.zoom === selectedContext.map.zoom
    ) {
      return null;
    }

    return mapView;
  }
);

export const getToolLayersUrlProps = createStructuredSelector({
  mapView: getMapView,
  isMapVisible: getIsMapVisible,
  selectedMapBasemap: getSelectedMapBasemap,
  selectedMapDimensions: getToolSelectedMapDimensions,
  selectedMapContextualLayers: getSelectedMapContextualLayers
});
