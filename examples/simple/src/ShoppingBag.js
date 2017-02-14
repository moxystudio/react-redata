import React, { PureComponent, PropTypes } from 'react';
import redata, { reactRedata } from 'redata';
import fetchBag from './fetchBag';
import fetchUser from './fetchUser';

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

        console.log('render()', JSON.parse(JSON.stringify(this.props)));

        // return null;

        // const { user, bag } = result;
        const user = null;
        const bag = result;

        return (
            <div>
                { !user ? null :
                    <div>
                        <div>User id: { user.id }</div>
                        <div>User name: { user.name }</div>
                    </div>
                }
                { !bag ? null :
                    <div>
                        <ul>{ bag.map((item, i) => (
                            <li key={ item.id } onClick={ () => this._handleOnClick(i) }>{ item.name }</li>
                        )) }</ul>
                    </div>
                }
            </div>
        );
    }

    _handleOnClick(i) {
        this.setState({ clicked: i });
    }
}

ShoppingBag.propTypes = {
    bagId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    loading: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
    result: PropTypes.array,
};

// export default reactRedata.props({
//     bag: redata(
//         ({ nextProps }) => fetchBag(nextProps.bagId, 2000),
//         ({ props, nextProps }) => props.bagId !== nextProps.bagId
//     ),
//     // user: redata(
//     //     ({ nextProps }) => fetchUser(nextProps.userId, 500),
//     //     ({ props, nextProps }) => props.userId !== nextProps.userId
//     // ),
// })(ShoppingBag);

export default reactRedata(
    ({ nextProps }) => fetchBag(nextProps.bagId, 2000),
    ({ props, nextProps }) => props.bagId !== nextProps.bagId
)(ShoppingBag);
