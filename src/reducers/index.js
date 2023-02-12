import { combineReducers } from 'redux';

import scrum from './scrum-reducer';
import satisfaction from './satisfaction-reducer';

export const reducer = combineReducers({
    scrum,
    satisfaction,
});
