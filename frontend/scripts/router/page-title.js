import capitalize from 'lodash/capitalize';

export default function(state) {
  switch (state.location.type) {
    case 'about':
      return 'TRASE - About TRASE';
    case 'team':
      return 'TRASE - Team';
    case 'data':
      return 'TRASE - Data Download';
    case 'profileRoot':
    case 'profileNode':
      return 'TRASE - Profiles';
    case 'tool':
      if (!state.app.selectedContext) {
        if (state.toolLayers.isMapVisible) {
          return 'TRASE - Map';
        }
        return 'TRASE - Supply Chain';
      }

      return `TRASE - ${capitalize(state.app.selectedContext.countryName)} ${capitalize(
        state.app.selectedContext.commodityName
      )}`;
    case 'explore':
      if (!state.app.selectedContext || !state.app.contextIsUserSelected) {
        return 'TRASE - Explore';
      }

      return `TRASE - ${capitalize(state.app.selectedContext.countryName)} ${capitalize(
        state.app.selectedContext.commodityName
      )}`;
    default:
      return 'TRASE';
  }
}
