import { getTableHeaders } from 'react-components/dashboard-element/dashboard-widget/table-modal/table-modal.selectors';
import { meta, data } from './table-modal-mocks';

describe('Table widget selectors', () => {
  describe('getTableHeaders', () => {
    const state = {
      dashboardElement: {
        countriesPanel: {
          activeItems: { 0: { name: 'Country Name' } }
        },
        commoditiesPanel: {
          activeItems: { 0: { name: 'Commodity Name' } }
        },
        sourcesPanel: {
          activeItems: null
        }
      }
    };
    // Single year, no non-cont indicator, no flow path filters
    it('returns the headings to Bar chart per biome', () => {
      const { sYear } = meta;
      const chartType = 'horizontalBar';
      expect(
        getTableHeaders(state, {
          meta: sYear,
          data,
          chartType
        })
      ).toEqual([
        { name: 'commodity' },
        { name: 'country' },
        { name: 'year' },
        { name: 'biome' },
        { name: 'trade volume', unit: 't', format: ',.2s' }
      ]);
    });
    // Multiple years, non-cont indicator, no flow path filters
    it('returns the headings for Stacked bar chart per year per value of non-continuous indicator - globally', () => {
      const chartType = 'stackedBar';
      const { mYearNCont } = meta;
      expect(
        getTableHeaders(state, {
          meta: mYearNCont,
          data,
          chartType
        })
      ).toEqual([
        { name: 'commodity' },
        { name: 'country' },
        { name: 'year' },
        { name: 'trade volume', unit: 't', format: ',.2s' },
        { name: 'zero deforestation commitment (exporter)' }
      ]);
    });
    // Multiple years, non-cont indicator, 1 source, no other flow path filters
    xit('returns the headings for Stacked bar chart per year per value of non-continuous indicator - globally', () => {
      const chartType = 'stackedBar';
      const { mYearNCont } = meta;
      const oneSourceState = {
        ...state,
        sourcesPanel: {
          activeItems: { 0: { name: 'Biome Name' } }
        }
      };

      expect(
        getTableHeaders(oneSourceState, {
          meta: mYearNCont,
          data,
          chartType
        })
      ).toEqual([
        { name: 'commodity' },
        { name: 'country' },
        { name: 'year' },
        { name: 'biome' },
        { name: 'trade volume', unit: 't', format: ',.2s' },
        { name: 'zero deforestation commitment (exporter)' }
      ]);
    });
  });
});
