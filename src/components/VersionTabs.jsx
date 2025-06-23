import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function VersionTabs({ children }) {
  return (
    <Tabs>
      {React.Children.map(children, (child, index) => {
        if (!child || !child.props) return null;
        
        const value = child.props.value || child.props.label?.toLowerCase().replace(/\s+/g, '-') || `tab-${index}`;
        
        return (
          <TabItem 
            value={value} 
            label={child.props.label || `Version ${index + 1}`}
            default={child.props.default}
          >
            {child.props.children}
          </TabItem>
        );
      })}
    </Tabs>
  );
}