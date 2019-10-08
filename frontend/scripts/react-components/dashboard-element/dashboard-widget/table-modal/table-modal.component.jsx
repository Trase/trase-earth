import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Heading from 'react-components/shared/heading/heading.component';
import Button from 'react-components/shared/button';
import debounce from 'lodash/debounce';
import Table from 'react-components/dashboard-element/dashboard-widget/table-modal/table';
import 'react-components/dashboard-element/dashboard-widget/table-modal/table-modal.scss';

function TableModal({ title, tableData }) {
  const modalRef = useRef(null);
  const extraContentHeight = 255;
  const tableModalHeight = Math.min(
    window.innerHeight - 40,
    tableData.data.length * 50 + extraContentHeight
  );
  const [rect, setRect] = useState(null);
  const [height, setHeight] = useState(0);
  const debouncedSetRect = useRef(
    debounce(() => {
      const currentRect = modalRef.current.getBoundingClientRect();
      setRect(currentRect);
    }, 300)
  );
  useEffect(() => {
    const callback = debouncedSetRect.current;
    window.addEventListener('resize', callback, {
      passive: true
    });
    return () => window.removeEventListener('resize', callback);
  }, []);
  useEffect(() => {
    if (modalRef !== null) {
      if (rect) {
        const currentHeight = Math.ceil(rect.height) - extraContentHeight;
        if (height !== currentHeight) {
          setHeight(currentHeight);
        }
      } else {
        debouncedSetRect.current();
      }
    }
  }, [height, rect]);
  return (
    <div className="c-table-modal" ref={modalRef} style={{ height: tableModalHeight }}>
      {height > 0 && (
        <>
          <Heading size="md" align="center">
            {title}
          </Heading>
          {tableData && (
            <Table
              width={760}
              height={height}
              className="table-modal-content"
              data={tableData.data}
              headers={tableData.headers}
            />
          )}
          <div className="table-modal-footer">
            <Button color="pink" size="sm" disabled>
              Download CSV
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

TableModal.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.object
};

export default TableModal;
