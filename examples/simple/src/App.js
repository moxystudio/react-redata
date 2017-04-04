import React, { Component, PropTypes } from 'react';
import logo from './logo.svg';
import ShoppingBag from './ShoppingBag';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={ logo } className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <ShoppingBag bagId={ this.props.bagId } userId={ this.props.userId } somethingElse={ this.props.somethingElse } />
            </div>
        );
    }
}

App.propTypes = {
    bagId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    somethingElse: PropTypes.string.isRequired,
};

export default App;
