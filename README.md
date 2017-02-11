# redata

**DISCLAIMER:** THIS MODULE IS COMPLETELY WORK IN PROGRESS, AND WILL BE FOR THE NEXT FEW DAYS. IF YOU LIKE THE WORK SO FAR, KEEP AN EYE OUT, WE SHOULD BE RELEASING A STABLE VERSION IN A WEEK OR SO.

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
- It should be compatible with ReactNative.
- It should sound like a verb, so you can say something like *you just need to redata the component*, meaning that the data will load & reload automatically and in a consistent fashion.

## Installation

`$ npm install --save redata`


## Usage


Here's an example of how you would redata a `ShoppingBag` component which requires that the contents of the bag be loaded via a `fetchBag()` that already exists, and returns a `Promise`:

```js
import React, { PureComponent, PropTypes } from 'react';
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
	({ nextProps }) => fetchBag(nextProps.bagId),              // loader
	({ props, nextProps }) => props.bagId !== nextProps.bagId, // shouldReload policy
)(ShoppingBag);
```


`redata` is a *Higher Order Component* with the following signature:

```js
redata(loader[, shouldReload, mapper])(WrappedComponent)
```

- `loader`: The function that is responsible for loading the data. Function is invoked with `({ props, nextProps, state, nextState, data })` and should return a `Promise` for the retrieved data.
- `shouldReload` *(optional)*:
	- Function that decides whether the data should be reloaded or not, should return `boolean`.
	- Called every time props or state changes, and defaults to `({ props, nextProps, state, nextState, data }) => false`, meaning that by default the data is only loaded once, and reused until the component is unmounted. `data` refers to the result of the last redata.
- `mapper` *(optional)*:
	- Function that is called after the loader, and defaults to an identity function, or `(data) => data`. `data` is an object containing:
		- `loading`: `true` if the loader is still running, `false` otherwise.
		- `error`: An instance of `Error` in case the loader failed, `undefined` otherwise.
		- `result`: The result of the loader, or `undefined` if the loader is still running.
	- The return value of this function is spread as props for your component.


## The nitty-gritty details

So you're interested in understanding how redata works under the hood. That's awesome.

The motivation behind redata is already explained in the introduction, but in order to get it to work, there were a few pitfalls that we had to avoid.

In terms of the server side rendering, the way that redata discovers async dependencies in data is inspired by [`Apollo`](https://github.com/apollographql/react-apollo).

Here's a breakdown of how the whole redata flow works:

- Server:
- Client:
	1. `redata` component is rendered for the first time.
	2. Checks a global store for any previously loaded data. In React, a really hard to collide and predictable key is stored in `window` by the server-side render, which is then accessed by the client.
	3. If data was loaded, the redata cycle is restarted, by calling the `shouldReload` function, which determines if the data is still good, or if it needs to reload.
	4. If data is still good, the data is returned, which can mean one of two things:
		- redata is wrapping a component: data is spread and injected as props into the underlying component.
		- redata is not wrapping a component, typically because it is composing a larger redata: the promise that was returned by redata resolves.
	5. If data is no longer good, the loader is called.

## TODO

- `react-redata`:
    - Traverse tree, find redatas, wait for them to resolve, and store data in global store for client to pick up on.
    - Provide `state` and `nextState` to `shouldReload`.
- `redata`:
    - Apply `mapper` to data.
- Misc:
    - Update README.
    - Draw simple diagram explaining the data flow in `redata`.
    - Unit tests overall.

## License

[MIT License](http://opensource.org/licenses/MIT)
