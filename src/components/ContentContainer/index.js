import React from 'react';

const ContentContainer = ({ heading, children }) => (
  <div className="pane equal">
    <h2><span>{heading}</span></h2>
    {children}
  </div>
);

export default ContentContainer;
