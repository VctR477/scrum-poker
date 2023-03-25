import { combineReducers } from 'redux';

import scrum from './scrum-reducer';
import satisfaction from './satisfaction-reducer';
import results from './results-reducer';

export const reducer = combineReducers({
    scrum,
    satisfaction,
    results,
});
