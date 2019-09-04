/* eslint-disable camelcase,react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import HelpTooltip from 'react-components/shared/help-tooltip/help-tooltip.component';
import TitleGroup from 'react-components/profiles/title-group';
import SummaryTitle from 'react-components/profiles/summary-title.component';
import Map from 'react-components/profiles/map.component';
import Text from 'react-components/shared/text';
import formatValue from 'utils/formatValue';

function PlaceSummary(props) {
  const {
    year,
    onYearChange,
    context,
    openModal,
    data: {
      countryName,
      jurisdiction1GeoId,
      summary,
      jurisdictionName,
      jurisdictionGeoId,
      jurisdiction1: stateName,
      jurisdiction2: biomeName,
      headerAttributes
    } = {},
    profileMetadata: { mainTopojsonPath, mainTopojsonRoot, availableYears } = {}
  } = props;

  const { commodityName } = context;
  const titles = [
    { name: commodityName, label: 'Commodity' },
    {
      dropdown: true,
      label: 'Year',
      value: { label: `${year}`, value: year },
      options: (availableYears
        ? availableYears.map(_year => ({ label: `${_year}`, value: _year }))
        : []
      ).sort((a, b) => b.value - a.value),
      onYearChange
    },
    { name: capitalize(countryName), label: 'Country' },
    { name: capitalize(biomeName), label: 'Biome' },
    { name: capitalize(stateName), label: 'State' }
  ];

  const renderMunicipalityMap = () => (
    <div className="c-overall-info page-break-inside-avoid">
      <div className="c-locator-map map-municipality-banner">
        {countryName && (
          <Map
            topoJSONPath={`./vector_layers${mainTopojsonPath.replace(
              '$stateGeoId$',
              jurisdiction1GeoId
            )}`}
            topoJSONRoot={mainTopojsonRoot.replace('$stateGeoId$', jurisdiction1GeoId)}
            getPolygonClassName={d =>
              d.properties.geoid === jurisdictionGeoId ? '-isCurrent' : ''
            }
          />
        )}
      </div>
    </div>
  );

  const renderStats = () =>
    Object.keys(headerAttributes).length > 0 &&
    Object.keys(headerAttributes).some(k => headerAttributes[k].value !== null) && (
      <div className="small-12">
        {Object.keys(headerAttributes).map(indicatorKey => {
          const { name, value, unit, tooltip } = headerAttributes[indicatorKey];
          if (!value) return null;
          return (
            <div className="stat-item">
              <Text variant="mono" color="grey-faded" transform="uppercase" className="legend">
                {name}
                {tooltip && <HelpTooltip text={tooltip} position="bottom" />}
              </Text>
              <Text as="span" variant="mono" size="lg" weight="bold">
                {formatValue(value, indicatorKey)}
              </Text>
              <Text as="span" variant="mono" size="lg" weight="bold">
                {' '}
                {unit === 'km2' ? 'km²' : unit}
              </Text>
            </div>
          );
        })}
      </div>
    );

  return (
    <React.Fragment>
      <div className="c-overall-info page-break-inside-avoid" data-test="place-summary">
        <div className="row">
          <div className="small-12 show-for-small profile-map-mobile">
            {renderMunicipalityMap()}
          </div>
          <div className="small-12 medium-9 columns">
            <SummaryTitle name={jurisdictionName} openModal={openModal} />
            <TitleGroup titles={titles} on={onYearChange} />
            {renderStats()}
          </div>
          <div className="small-12 medium-3 columns hide-for-small">{renderMunicipalityMap()}</div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            <Text
              variant="serif"
              size="md"
              weigth="light"
              lineHeight="lg"
              color="grey"
              className="summary"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

PlaceSummary.propTypes = {
  year: PropTypes.number,
  data: PropTypes.object,
  context: PropTypes.object,
  onYearChange: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  profileMetadata: PropTypes.object.isRequired
};

export default PlaceSummary;
