import redata from '../redata';
import redataComponent from './redata-component';
import redataCompose, {
    defaultShouldReload as defaultComposeShouldReload,
    defaultMapper as defaultComposeMapper,
} from '../composition/compose';
import redataProps from '../composition/props';

// public stuff -----------------------------------------------------------------------------------

function reactRedata(loader, shouldReload, mapper) {
    // Curry redata with provided information, only the redata initial ctx is missing.
    return redataComponent.bind(null, redata.bind(null, loader, shouldReload, mapper));
}

// Most generic composer.
reactRedata.compose = function (collectionHandler, items, shouldReload = defaultComposeShouldReload, mapper = defaultComposeMapper) {
    return reactRedata(redataCompose(collectionHandler, items), shouldReload.bind(null, items), mapper);
};

reactRedata.props = reactRedata.compose.bind(null, redataProps);

// private stuff ----------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------

export default reactRedata;
