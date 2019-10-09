import React from 'react';
import PropTypes from 'prop-types';
import GridList from 'react-components/shared/grid-list/grid-list.component';
import GridListItem from 'react-components/shared/grid-list-item/grid-list-item.component';
import ResizeListener from 'react-components/shared/resize-listener.component';

function ProfilesCommoditiesPanel(props) {
  const { loading, commodities, activeCommodities, onSelectCommodity, getMoreItems, page } = props;
  return (
    <ResizeListener>
      {({ windowWidth }) => {
        const columnsCount = windowWidth > 1000 ? 5 : 3;
        return (
          <GridList
            className="dashboard-panel-pill-list"
            items={commodities}
            height={commodities.length > columnsCount ? 200 : 50}
            width={950}
            rowHeight={50}
            columnWidth={190}
            columnCount={columnsCount}
            getMoreItems={getMoreItems}
            page={page}
            loading={loading}
          >
            {itemProps => (
              <GridListItem
                {...itemProps}
                isActive={activeCommodities.includes(itemProps.item?.id)}
                enableItem={onSelectCommodity}
                disableItem={() => onSelectCommodity(null)}
              />
            )}
          </GridList>
        );
      }}
    </ResizeListener>
  );
}

ProfilesCommoditiesPanel.propTypes = {
  commodities: PropTypes.array,
  loading: PropTypes.bool,
  page: PropTypes.number.isRequired,
  activeCommodities: PropTypes.object,
  getMoreItems: PropTypes.func.isRequired,
  onSelectCommodity: PropTypes.func.isRequired
};

export default ProfilesCommoditiesPanel;
