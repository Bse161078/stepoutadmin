import React from 'react';

export default class Trips extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <h3 style={{color: 'red'}} className="text-center">Trips</h3>
        </nav>
      </div>
    );
  }
}
