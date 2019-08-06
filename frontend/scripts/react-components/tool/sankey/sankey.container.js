/* eslint-disable no-shadow */
import { connect } from 'react-redux';
import { mapToVanilla } from 'react-components/shared/vanilla-react-bridge.component';

import {
  collapseSankey,
  expandSankey,
  highlightNode,
  clearSankey,
  selectNodes
} from 'react-components/tool-links/tool-links.actions';
import {
  getIsVisible,
  getIsReExpand,
  getHasExpandedNodesIds
} from 'react-components/tool/sankey/sankey.selectors';
import {
  getVisibleNodesByColumn,
  getMergedLinks,
  getNodesColored,
  getSelectedResizeBy,
  getSelectedRecolorBy
} from 'react-components/tool-links/tool-links.selectors';
import Sankey from 'react-components/tool/sankey/sankey.component';

const mapStateToProps = state => ({
  links: getMergedLinks(state),
  isVisible: getIsVisible(state),
  isReExpand: getIsReExpand(state),
  sankeySize: state.app.sankeySize,
  selectedResizeBy: getSelectedResizeBy(state),
  detailedView: state.toolLinks.detailedView,
  nodeHeights: state.toolLinks.data.nodeHeights,
  selectedNodesIds: state.toolLinks.selectedNodesIds,
  selectedRecolorBy: getSelectedRecolorBy(state),
  hasExpandedNodesIds: getHasExpandedNodesIds(state),
  highlightedNodeId: state.toolLinks.highlightedNodeId,
  visibleNodesByColumn: getVisibleNodesByColumn(state),
  nodesColoredAtColumn: getNodesColored(state).nodesColoredAtColumn,
  lang: state.location.query && state.location.query.lang
});

const mapDispatchToProps = {
  onNodeClicked: selectNodes,
  onNodeHighlighted: highlightNode,
  onExpandClick: expandSankey,
  onCollapseClick: collapseSankey,
  onClearClick: clearSankey
};

const methodProps = [
  {
    name: 'showLoadedLinks',
    compared: ['links', 'visibleNodesByColumn'],
    returned: [
      'sankeySize',
      'nodeHeights',
      'selectedRecolorBy',
      'selectedResizeBy',
      'selectedNodesIds',
      'links',
      'detailedView',
      'visibleNodesByColumn',
      'nodesColoredAtColumn'
    ]
  },
  {
    name: 'resizeViewport',
    compared: ['sankeySize'],
    returned: ['sankeySize', 'selectedRecolorBy', 'selectedResizeBy', 'selectedNodesIds']
  },
  {
    name: 'selectNodes',
    compared: ['selectedNodesIds'],
    returned: ['selectedNodesIds']
  },
  {
    name: 'toggleExpandActionButton',
    compared: ['isVisible', 'isReExpand'],
    returned: ['isVisible', 'isReExpand']
  },
  {
    name: 'toggleCollapseActionButton',
    compared: ['hasExpandedNodesIds'],
    returned: ['hasExpandedNodesIds']
  },
  {
    name: 'highlightNodes',
    compared: ['highlightedNodeId'],
    returned: ['highlightedNodeId']
  },
  {
    name: 'translateNodes',
    compared: ['lang'],
    returned: ['selectedResizeBy', 'selectedRecolorBy', 'selectedNodesIds']
  }
];

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(mapToVanilla(Sankey, methodProps, Object.keys(mapDispatchToProps)));
