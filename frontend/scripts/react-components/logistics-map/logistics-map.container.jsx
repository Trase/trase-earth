import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getLogisticsMapLayers,
  getActiveLayers,
  getActiveParams
} from 'react-components/logistics-map/logistics-map.selectors';
import { setLayerActive as setLayerActiveFn } from 'react-components/logistics-map/logistics-map.actions';
import LogisticsMap from 'react-components/logistics-map/logistics-map.component';
import formatValue from 'utils/formatValue';
import startCase from 'lodash/startCase';

class LogisticsMapContainer extends React.PureComponent {
  static propTypes = {
    layers: PropTypes.array,
    activeLayers: PropTypes.array,
    commodity: PropTypes.string,
    setLayerActive: PropTypes.func.isRequired
  };

  state = {
    mapPopUp: null
  };

  bounds = {
    bbox: [-77.783203125, -35.46066995149529, -29.794921874999996, 9.709057068618208]
  };

  currentPopUp = null;

  onMouseOver = (e, layer) => {
    const { data } = e;
    const { commodity } = this.props;
    if (!data) return;
    const show = true;
    const x = 0;
    const y = 35;
    let text = {
      crushing_facilities: 'Crushing Facility',
      refining_facilities: 'Refinery',
      storage_facilities: 'Silo'
    }[layer.name];
    const items = [
      { title: 'Company', value: data.company },
      { title: 'Municipality', value: data.municipality }
    ];
    if (commodity === 'soy') {
      items.push({
        title: `Capacity (${commodity})`,
        value: formatValue(data.capacity, 'Trade volume'),
        unit: 't'
      });
    } else {
      items.splice(-1, 0, { title: 'State', value: data.state });
      items.push(
        { title: 'Subclass', value: data.subclass },
        { title: 'Inspection level', value: data.inspection_level }
      );
      text = startCase(layer.name);
    }
    const mapPopUp = { ...e, data: { x, y, text, show, items } };
    this.setState(() => ({ mapPopUp }));
  };

  buildEvents = layer => ({
    mouseover: e => this.onMouseOver(e, layer),
    mouseout: () => this.popUp && this.popUp.remove()
  });

  getCurrentPopUp = popUp => {
    this.popUp = popUp;
  };

  render() {
    const { activeLayers, layers, setLayerActive, commodity } = this.props;
    const { mapPopUp } = this.state;

    return (
      <LogisticsMap
        layers={layers}
        mapPopUp={mapPopUp}
        bounds={this.bounds}
        activeLayers={activeLayers}
        buildEvents={this.buildEvents}
        setLayerActive={setLayerActive}
        commodity={commodity}
        getCurrentPopUp={this.getCurrentPopUp}
      />
    );
  }
}

const mapStateToProps = state => {
  const { year: activeYear, commodity } = getActiveParams(state);
  return {
    activeYear,
    commodity,
    activeLayers: getActiveLayers(state),
    layers: getLogisticsMapLayers(state)
  };
};

const mapDispatchToProps = {
  setLayerActive: setLayerActiveFn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogisticsMapContainer);