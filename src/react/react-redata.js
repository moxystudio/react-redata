import redata from '../redata';
import redataComponent from './redata-component';

// public stuff -----------------------------------------------------------------------------------

function reactRedata(loader, shouldReload, mapper) {
    // Curry redata with provided information, only the initial data is missing.
    return redataComponent.bind(null, redata.bind(null, loader, shouldReload, mapper));
}

// private stuff ----------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------

export default reactRedata;
