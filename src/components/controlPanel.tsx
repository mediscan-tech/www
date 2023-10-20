import * as React from 'react';

function ControlPanel() {
  return (
    <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        maxWidth: '320px',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        padding: '12px 24px',
        margin: '20px',
        fontSize: '13px',
        lineHeight: 2,
        color: '#6b6b76',
        textTransform: 'uppercase',
        outline: 'none'
    }}>
      <h3>Average Hospital Wait Times Near You</h3>
      <p>
        This map shows nearby hospitals in a 15 mile radius and their average wait times according to the Centers for Medicare and Medicaid Services.
      </p>
      <p>
        Data source:{' '}
        <a href="https://data.cms.gov/">
            (CMS)
        </a>
      </p>
    </div>
  );
}

export default React.memo(ControlPanel);