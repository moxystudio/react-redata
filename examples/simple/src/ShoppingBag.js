import React, { PureComponent, PropTypes } from 'react';
import { reactRedata } from 'redata';
import fetchBag from './fetchBag';

class ShoppingBag extends PureComponent {
    render() {
        const { result, loading, error } = this.props;

        // console.log('rendering shopping bag', this.props);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>ERROR: { error.message }</div>;
        }

        return (
            <ul>{ result.map((item, i) => (
                <li key={ item.id } onClick={ () => this._handleOnClick(i) }>{ item.name }</li>
            )) }</ul>
        );
    }

    _handleOnClick(i) {
        this.setState({ clicked: i });
    }
}

ShoppingBag.propTypes = {
    bagId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    loading: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
    result: PropTypes.array,
};

export default reactRedata(
    ({ props, nextProps, state, nextState, data }) => /*console.log({props, nextProps, state, nextState, data}) ||*/ fetchBag(nextProps.bagId), // loader
    ({ props, nextProps, state, nextState, data }) => /*console.log({props, nextProps, state, nextState, data}) ||*/ props.bagId !== nextProps.bagId, // shouldReload policy
)(ShoppingBag);
