import React from 'react';
import PropTypes from 'prop-types';
import TopDestinationsChart from 'react-components/profiles/top-destinations-chart.component';
import TopDestinationsMap from 'react-components/profiles/top-destinations-map.component';
import {
  GET_ACTOR_TOP_COUNTRIES,
  GET_ACTOR_TOP_SOURCES,
  GET_NODE_SUMMARY_URL
} from 'utils/getURLFromParams';
import Widget from 'react-components/widgets/widget.component';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner/shrinking-spinner.component';

class TopDestinationsWidget extends React.PureComponent {
  state = {
    activeTabIndex: this.props.printMode && this.props.contextId === 1 ? 1 : 0
  };

  getActiveTabProps(data) {
    const { activeTabIndex } = this.state;

    const tabs = [...data.tabs].reverse();
    const activeTab = tabs[activeTabIndex];
    const linesData = data[activeTab];
    const { includedYears, buckets } = data;
    const { lines, style, unit } = linesData;

    return {
      tabs,
      unit,
      lines,
      style,
      buckets,
      activeTab,
      includedYears,
      profileType: linesData.profile_type
    };
  }

  updateTab = index => this.setState({ activeTabIndex: index });

  render() {
    const {
      printMode,
      year,
      nodeId,
      contextId,
      type,
      className,
      commodityName,
      countryName,
      onLinkClick,
      testId
    } = this.props;
    const mainQuery = {
      actor_top_countries: GET_ACTOR_TOP_COUNTRIES,
      actor_top_sources: GET_ACTOR_TOP_SOURCES
    }[type];

    const params = { node_id: nodeId, context_id: contextId, year };
    return (
      <Widget
        query={[mainQuery, GET_NODE_SUMMARY_URL]}
        params={[{ ...params, year }, { ...params, profile_type: 'actor' }]}
      >
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <div className="spinner-section" data-test="loading-section">
                <ShrinkingSpinner className="-large" />
              </div>
            );
          }

          if (error) {
            // TODO: display a proper error message to the user
            console.error('Error loading top destinations data for profile page', error);
            return null;
          }

          const {
            includedYears,
            lines,
            unit,
            profileType,
            style,
            buckets,
            activeTab,
            tabs
          } = this.getActiveTabProps(data[mainQuery]);

          if (!lines || lines.length === 0) {
            return null;
          }

          const { nodeName, columnName } = data[GET_NODE_SUMMARY_URL];
          const verb = columnName === 'EXPORTER' ? 'exported' : 'imported';
          return (
            <div className={className} data-test={testId}>
              <div className="row align-justify">
                <div className="column small-12 medium-7">
                  <TopDestinationsChart
                    height={250}
                    type={type}
                    tabs={tabs}
                    onChangeTab={this.updateTab}
                    onLinkClick={onLinkClick}
                    contextId={contextId}
                    year={year}
                    includedYears={includedYears}
                    lines={lines.slice(0, 5)}
                    unit={unit}
                    profileType={profileType}
                    style={style}
                    nodeName={nodeName}
                    commodityName={commodityName}
                    columnName={columnName}
                    verb={verb}
                    testId={`${testId}-chart`}
                  />
                </div>
                <div className="column small-12 medium-5 top-destinations-map-widget">
                  <TopDestinationsMap
                    height={250}
                    year={year}
                    printMode={printMode}
                    verb={verb}
                    buckets={buckets}
                    lines={lines}
                    nodeName={nodeName}
                    testId={`${testId}-map`}
                    profileType={profileType}
                    countryName={countryName}
                    includedYears={includedYears}
                    commodityName={commodityName}
                    activeTab={type === 'actor_top_sources' ? activeTab : undefined}
                  />
                </div>
              </div>
            </div>
          );
        }}
      </Widget>
    );
  }
}

TopDestinationsWidget.propTypes = {
  testId: PropTypes.string,
  printMode: PropTypes.bool,
  className: PropTypes.string,
  countryName: PropTypes.string,
  commodityName: PropTypes.string,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  onLinkClick: PropTypes.func.isRequired
};

export default TopDestinationsWidget;
