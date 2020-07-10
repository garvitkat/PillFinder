import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers/index';
import reduxThunk from 'redux-thunk';  

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const initstore = createStoreWithMiddleware(reducer);

export default initstore;
