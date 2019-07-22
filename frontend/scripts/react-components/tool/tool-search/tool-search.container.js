import { connect } from 'react-redux';
import ToolSearch from 'react-components/tool/tool-search/tool-search.component';
import { selectSearchNode } from 'react-components/tool/tool.actions';
import { setIsSearchOpen } from 'react-components/tool-links/tool-links.actions';
import { getSearchResults } from 'react-components/tool/tool-search/tool-search.selectors';
import { loadSearchResults } from 'actions/app.actions';
import { getSelectedContext } from 'reducers/app.selectors';

const mapStateToProps = state => {
  const selectedContext = getSelectedContext(state);
  const { selectedNodesIds, isSearchOpen, isMapVisible } = state.toolLinks;
  const searchResults = getSearchResults(state);
  return {
    selectedNodesIds,
    isSearchOpen,
    isMapVisible,
    nodes: searchResults,
    contextId: selectedContext && selectedContext.id
  };
};

const mapDispatchToProps = {
  setIsSearchOpen,
  onAddResult: selectSearchNode,
  onInputValueChange: loadSearchResults
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSearch);
