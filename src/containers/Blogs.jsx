import React from 'react';

export default class Blogs extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <h3 style={{color: 'red'}} className="text-center">Blogs</h3>
        </nav>
      </div>
    );
  }
}
