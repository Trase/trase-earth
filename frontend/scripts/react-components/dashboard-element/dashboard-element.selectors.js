import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import range from 'lodash/range';
import capitalize from 'lodash/capitalize';
import { getPanelId } from 'utils/dashboardPanel';
import { makeGetResizeByItems, makeGetRecolorByItems } from 'selectors/indicators.selectors';
import { makeGetAvailableYears } from 'selectors/years.selectors';
import {
  makeGetPanelActiveTab,
  makeGetPanelTabs,
  makeGetPanelActiveItems,
  makeGetPanelActiveTabItems
} from 'selectors/panel.selectors';

const getCountriesData = state => state.dashboardElement.data.countries;
const getSourcesData = state => state.dashboardElement.data.sources;
const getCommoditiesData = state => state.dashboardElement.data.commodities;
const getCompaniesData = state => state.dashboardElement.data.companies;
const getDestinationsData = state => state.dashboardElement.data.destinations;

const getCountriesPanel = state => state.dashboardElement.countries;
const getSourcesPanel = state => state.dashboardElement.sources;
const getDestinationsPanel = state => state.dashboardElement.destinations;
const getCompaniesPanel = state => state.dashboardElement.companies;
const getCommoditiesPanel = state => state.dashboardElement.commodities;
const getDashboardPanelTabs = state => state.dashboardElement.tabs;

const getAppContexts = state => state.app.contexts;
const getSelectedYears = state => state.dashboardElement.selectedYears;
const getSelectedResizeBy = state => state.dashboardElement.selectedResizeBy;
const getSelectedRecolorBy = state => state.dashboardElement.selectedRecolorBy;
const getDashboardCharts = state => state.dashboardElement.charts;

export const getEditMode = state => state.dashboardElement.editMode;

export const getSourcesTabs = makeGetPanelTabs(getDashboardPanelTabs, () => 'sources');
export const getCompaniesTabs = makeGetPanelTabs(getDashboardPanelTabs, () => 'companies');
export const getSourcesActiveTab = makeGetPanelActiveTab(
  getSourcesPanel,
  getDashboardPanelTabs,
  () => 'sources'
);
export const getCompaniesActiveTab = makeGetPanelActiveTab(
  getCompaniesPanel,
  getDashboardPanelTabs,
  () => 'companies'
);

export const getDirtyBlocks = createSelector(
  [
    getCountriesPanel,
    getSourcesPanel,
    getDestinationsPanel,
    getCompaniesPanel,
    getCommoditiesPanel
  ],
  (countriesPanel, sourcesPanel, destinationsPanel, companiesPanel, commoditiesPanel) => ({
    countries: countriesPanel.activeItems.length > 0,
    sources: sourcesPanel.activeItems.length > 0,
    destinations: destinationsPanel.activeItems.length > 0,
    companies: companiesPanel.activeItems.length > 0,
    commodities: commoditiesPanel.activeItems.length > 0
  })
);

export const getCountriesActiveItems = makeGetPanelActiveItems(getCountriesPanel, getCountriesData);
const getCommoditiesActiveItems = makeGetPanelActiveItems(getCommoditiesPanel, getCommoditiesData);
const getDestinationsActiveItems = makeGetPanelActiveItems(
  getDestinationsPanel,
  getDestinationsData
);
const getSourcesActiveItems = makeGetPanelActiveTabItems(getSourcesPanel, getSourcesData);
const getCompaniesActiveItems = makeGetPanelActiveTabItems(getCompaniesPanel, getCompaniesData);

export const getDashboardPanelsValues = createStructuredSelector({
  countries: getCountriesActiveItems,
  sources: getSourcesActiveItems,
  commodities: getCommoditiesActiveItems,
  companies: getCompaniesActiveItems,
  destinations: getDestinationsActiveItems
});

export const getDynamicSentence = createSelector(
  [getDirtyBlocks, getDashboardPanelsValues, getEditMode],
  (dirtyBlocks, panelsValues, editMode) => {
    if (Object.values(dirtyBlocks).every(block => !block)) {
      return [];
    }
    const commoditiesPanelSentence = `${panelsValues.commodities ? '' : 'commodities'}`;
    const commoditiesPrefix = editMode
      ? capitalize(commoditiesPanelSentence)
      : `Your dashboard will include ${commoditiesPanelSentence}`;
    const capitalizeCommodities = editMode ? { transform: 'capitalize' } : {};
    const sourcesValues = panelsValues.sources || panelsValues.countries;
    return [
      {
        panel: 'commodities',
        id: 'commodities',
        prefix: commoditiesPrefix,
        value: panelsValues.commodities,
        ...capitalizeCommodities
      },
      {
        panel: 'sources',
        id: 'sources',
        prefix: sourcesValues ? `produced in` : 'produced in countries covered by Trase',
        value: sourcesValues,
        transform: 'capitalize'
      },
      {
        panel: 'companies',
        id: 'companies',
        prefix: panelsValues.companies ? 'traded by' : '',
        value: panelsValues.companies,
        optional: true,
        transform: 'capitalize'
      },
      {
        panel: 'destinations',
        id: 'destinations',
        prefix: panelsValues.destinations ? `going to` : '',
        value: panelsValues.destinations,
        optional: true,
        transform: 'capitalize'
      }
    ];
  }
);

export const getIsDisabled = createSelector(
  [getDynamicSentence, (state, ownProps) => ownProps.step],
  (dynamicSentence, step) => {
    if (dynamicSentence.length === 0 || typeof step === 'undefined') {
      return true;
    }
    const currentPanel = getPanelId(step);
    if (currentPanel === null) {
      return false;
    }
    const currentSentencePart = dynamicSentence.find(p => p.panel === currentPanel);
    if (!currentSentencePart.optional && !currentSentencePart.value) {
      return true;
    }
    return false;
  }
);

export const getDashboardsContext = createSelector(
  [getCountriesActiveItems, getCommoditiesActiveItems, getAppContexts],
  (countriesActiveItems, commoditiesActiveItems, contexts) => {
    const [{ id: countryId } = {}] = countriesActiveItems || [];
    const [{ id: commodityId } = {}] = commoditiesActiveItems || [];
    const context = contexts.find(
      ctx => ctx.countryId === countryId && ctx.commodityId === commodityId
    );

    return context || null;
  }
);

const getDashboardContextResizeBy = createSelector(
  getDashboardsContext,
  context => context && context.resizeBy
);

const getDashboardContextRecolorBy = createSelector(
  getDashboardsContext,
  context => {
    if (!context) return null;
    const emptyOption = {
      position: 0,
      groupNumber: -1,
      label: 'No selection',
      name: 'none',
      years: [],
      value: null,
      attributeId: null
    };
    // TODO: handle this indicators by bucketing either here or preferably in backend
    const contextRecolorByList = context.recolorBy.filter(
      item => !['LR_DEFICIT_PERC_PRIVATE_LAND', 'SMALLHOLDERS'].includes(item.name)
    );

    if (contextRecolorByList.length > 0) {
      return contextRecolorByList.concat(emptyOption);
    }

    return contextRecolorByList.length > 0 ? contextRecolorByList : null;
  }
);

export const getDashboardSelectedResizeBy = createSelector(
  [getSelectedResizeBy, getDashboardContextResizeBy],
  (selectedResizeBy, contextResizeByItems) => {
    if (!contextResizeByItems) {
      const attributeId = selectedResizeBy || null;
      return { label: 'Select an Indicator', value: attributeId, attributeId };
    }

    const itemIncludedInContext = contextResizeByItems.find(
      item => item.attributeId === selectedResizeBy
    );

    if (!selectedResizeBy || !itemIncludedInContext) {
      return contextResizeByItems.find(item => item.isDefault);
    }

    return itemIncludedInContext;
  }
);

export const getDashboardSelectedRecolorBy = createSelector(
  [getSelectedRecolorBy, getDashboardContextRecolorBy],
  (selectedRecolorBy, contextRecolorByItems) => {
    if (!contextRecolorByItems) {
      return null;
    }

    const contextSelectedRecolorBy = contextRecolorByItems.find(
      item => item.attributeId === selectedRecolorBy
    );

    if (contextSelectedRecolorBy) {
      return contextSelectedRecolorBy;
    }

    return contextRecolorByItems.find(item => item.attributeId === null);
  }
);

export const getDashboardSelectedYears = createSelector(
  [
    getSelectedYears,
    getDashboardsContext,
    makeGetAvailableYears(
      getDashboardSelectedResizeBy,
      getDashboardSelectedRecolorBy,
      getDashboardsContext
    )
  ],
  (selectedYears, context, availableYears) => {
    if (!selectedYears && !context) {
      return [];
    }

    if (context && !selectedYears) {
      return [context.defaultYear, context.defaultYear];
    }

    if (context && selectedYears) {
      const selectedYearsRange = range(selectedYears[0], selectedYears[1] + 1);
      const intersectedYears = intersection(selectedYearsRange, availableYears);
      const selectedAreUnavailable = isEmpty(intersectedYears);

      if (selectedAreUnavailable) {
        return [context.defaultYear, context.defaultYear];
      }

      return [intersectedYears[0], intersectedYears[intersectedYears.length - 1]];
    }

    return selectedYears;
  }
);

export const getDashboardFiltersProps = createStructuredSelector({
  years: makeGetAvailableYears(
    getDashboardSelectedResizeBy,
    getDashboardSelectedRecolorBy,
    getDashboardsContext
  ),
  selectedYears: getDashboardSelectedYears,
  selectedResizeBy: getDashboardSelectedResizeBy,
  selectedRecolorBy: getDashboardSelectedRecolorBy,
  resizeBy: makeGetResizeByItems(getDashboardContextResizeBy, getDashboardSelectedYears),
  recolorBy: makeGetRecolorByItems(getDashboardContextRecolorBy, getDashboardSelectedYears)
});

export const getDashboardGroupedCharts = createSelector(
  [getDashboardCharts],
  charts => {
    if (!charts) {
      return null;
    }
    const {
      data,
      meta: { groupings }
    } = charts;
    const groupingList = Object.values(groupings);
    const groupingsByChartId = groupingList.reduce(
      (acc, grouping) => ({
        ...acc,
        ...grouping.options.reduce((acc2, option) => ({ ...acc2, [option.id]: grouping.id }), {})
      }),
      {}
    );
    const chartsData = data.map((chart, id) => ({
      ...chart,
      id,
      groupingId: typeof groupingsByChartId[id] !== 'undefined' ? groupingsByChartId[id] : null
    }));
    const singleCharts = chartsData.filter(chart => chart.groupingId === null);
    const chartsWithGrouping = chartsData.filter(chart => chart.groupingId !== null);
    const groupedCharts = chartsWithGrouping
      .reduce((acc, chart) => {
        if (!acc[chart.groupingId]) {
          acc[chart.groupingId] = {
            items: {
              [chart.id]: chart
            },
            groupingId: chart.groupingId
          };
        } else {
          acc[chart.groupingId].items[chart.id] = chart;
        }
        return acc;
      }, [])
      .filter(Boolean);
    return {
      groupings,
      charts: [...singleCharts, ...groupedCharts]
    };
  }
);

const getURLDashboardSelectedYears = createSelector(
  [getDashboardSelectedYears, getDashboardsContext],
  (selectedYears, dashboardContext) => {
    if (
      selectedYears[0] === dashboardContext?.defaultYear &&
      selectedYears[1] === dashboardContext?.defaultYear
    ) {
      return null;
    }
    return selectedYears;
  }
);

const getURLDashboardSelectedResizeBy = createSelector(
  [getDashboardSelectedResizeBy, getDashboardsContext],
  (selectedResizeBy, dashboardContext) => {
    const defaultResizeBy = dashboardContext?.resizeBy.find(
      item => item.attributeId === selectedResizeBy.attributeId
    );
    if (defaultResizeBy?.isDefault) {
      return null;
    }
    return selectedResizeBy;
  }
);

export const getDashboardElementUrlProps = createStructuredSelector({
  countries: getCountriesPanel,
  sources: getSourcesPanel,
  commodities: getCommoditiesPanel,
  destinations: getDestinationsPanel,
  companies: getCompaniesPanel,
  selectedYears: getURLDashboardSelectedYears,
  selectedResizeBy: getURLDashboardSelectedResizeBy,
  selectedRecolorBy: getDashboardSelectedRecolorBy
});
