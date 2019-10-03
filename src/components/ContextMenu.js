import React, { useState, useEffect } from 'react';

function MenuItem(props) {
  const [isHover, setHover] = useState(false);
  return (
    <div
      style={isHover ? props.options.hoverStyle : props.options.style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href="#"
        style={props.options.linkStyle}
        onClick={e => {
          e.preventDefault();
          props.action();
        }}
      >
        {props.text}
      </a>
    </div>
  );
}

function ContextMenu(props) {
  const menuStyle = {
    position: 'absolute',
    font: '12px solid Helvetica, Arial, Ubuntu sans-serif',
    top: props.coordinates.y,
    left: props.coordinates.x
  };

  return (
    <div style={menuStyle}>
      {props.actions.map(action => (
        <props.menuItem.component
          key={action.text}
          text={action.text}
          options={props.menuItem.options}
          action={() => {
            action.action(props.data);
            props.close();
          }}
        />
      ))}
    </div>
  );
}

ContextMenu.defaultProps = {
  menuItem: {
    component: MenuItem,
    options: {
      style: {
        background: '#eee',
        padding: '5px',
        boxShadow: '2px 2px #c0c0c0'
      },
      linkStyle: {
        color: '#222',
        textDecoration: 'none'
      },
      hoverStyle: {
        background: '#ddd',
        padding: '5px',
        boxShadow: '2px 2px #c0c0c0'
      }
    }
  }
};

export default ContextMenu;
