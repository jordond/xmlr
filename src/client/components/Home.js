import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';


export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <button>Load XMLs</button>
          <br />
          <Link to="/counter">to Counter</Link>
        </div>
      </div>
    );
  }
}
