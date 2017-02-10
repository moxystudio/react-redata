import React, { PureComponent, PropTypes } from 'react';
import { reactRedata } from 'redata';
import fetchBag from './fetchBag';

class ShoppingBag extends PureComponent {
    render() {
        const { result, loading, error } = this.props;

        console.log('rendering shopping bag', this.props);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>ERROR: { error.message }</div>;
        }

        return (
            <ul>{ result.map((item) => (
                <li key={ item.id }>{ item.name }</li>
            )) }</ul>
        );
    }
}

ShoppingBag.propTypes = {
    bagId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    loading: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
    result: PropTypes.array,
};

export default reactRedata(
    ({ nextProps }) => fetchBag(nextProps.bagId), // loader
    ({ props, nextProps }) => props.bagId !== nextProps.bagId, // shouldReload policy
)(ShoppingBag);
