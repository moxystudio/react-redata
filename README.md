# redata

[![Greenkeeper badge](https://badges.greenkeeper.io/moxystudio/react-redata.svg)](https://greenkeeper.io/)

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/redata
[downloads-image]:http://img.shields.io/npm/dm/redata.svg
[npm-image]:http://img.shields.io/npm/v/redata.svg
[travis-url]:https://travis-ci.org/moxystudio/react-redata
[travis-image]:http://img.shields.io/travis/moxystudio/react-redata/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/react-redata
[david-dm-image]:https://img.shields.io/david/moxystudio/react-redata.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/react-redata#info=devDependencies
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/react-redata.svg

React data container for isomorphic applications, providing a unified and performant load & reload pattern.

The motivation behind redata is to create a flexible, efficient and simple solution for isomorphic react components to asynchronously load information. A few driving concepts behind redata:

- You should only need to write your loading routines once, and it should run both on the server and client without any added control.
- The component should automatically react *(pun intended)* to prop changes and potentially reload the data if necessary.
- In case a prop change does not affect the relevance of the already loaded data, the loaded data should be reused automatically.
- Loading data might require a single async operation, but it also might require multiple operations, and you should be able to inspect progress on a granular level if needed, but also be able to quickly understand if everything is loaded, loading, or errored, in case you don't need the granularity.
- It should be useful and easy to use if you're just using React, but also if you're using React + Redux.
- It should sound like a verbe, so you can say something like *you just need to redata the component*, meaning that the data will load & reload automatically and in a consistent fashion.

## Installation

`$ npm install --save redata`


## Usage


Here's an example of how you would redata a `ShoppingBag` component that requires that the contents of the bag be loaded via a `fetchBag()` that already exists, and returns a `Promise`:

```js
import React, { PropTypes } from 'react';
import redata from 'redata';
import fetchBag from './fetchBag';

class ShoppingBag extends PureComponent {
	render() {
		const { result, loading, error } = this.props;
		
		// loading and error are provided by redata, but you can rename
		// or even drop any property that you don't need in the mapper
		if (error || loading) {
			return null; // you could render an error message or loading respectively
		}
		
		return (
			<ul>{ result.map((item) => (
				<li key={ item.id }>{ item.name }</li>
			)) }</ul>
		);
	}
}

ShoppingBag.propTypes = {
	bagId: PropTypes.number.isRequired,
	loading: PropTypes.bool,
	error: PropTypes.instanceOf(Error),
	result: PropTypes.array,
};

export default redata(
	({ props }) => fetchBag(props.bagId),                     // loader
	({ props, nextProps } => props.bagId !== nextProps.bagId) // shouldReload policy
)(ShoppingBag);
```


`redata` is a *Higher Order Component* with the following signature:

```js
redata(loader[, shouldReload, mapper])
```

- `loader`: The function that is responsible for loading the data. It should return a `Promise` for the data.
- `shouldReload` *(optional)*:
	- Function that decides whether the data should be reloaded or not, should return `boolean`.
	- Called every time props or state changes, and defaults to `({ props, nextProps, state, nextState, data }) => false`, meaning that by default the data is only loaded once, and reused until the component is unmounted. `data` refers to the result of the last redata.
- `mapper` *(optional)*:
	- Function that is called after the loader, and defaults to an identity function, or `(data) => data`. `data` is an object containing:
		- `loading`: `true` if the loader is still running, `false` otherwise.
		- `error`: An instance of `Error` in case the loader failed, `undefined` otherwise.
		- `result`: The result of the loader, or `undefined` if the loader is still running.
	- The return value of this function is spread as props for your component.

## License

[MIT License](http://opensource.org/licenses/MIT)
