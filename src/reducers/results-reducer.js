import { TYPES } from '../actions/results-actions';

const initialState = {
    list: [],
    openedId: null,
    openedData: {},
};

const reducer = (
    state = initialState,
    { type, payload },
) => {
    switch (type) {
        case TYPES.SET_LIST:
            return {
                ...state,
                list: payload,
            };
        case TYPES.SET_OPENED_ID:
            return {
                ...state,
                openedId: payload ? payload : null,
            };
        case TYPES.MERGE:
            return {
                ...state,
                payload,
            };
        case TYPES.SET_OPENED_DATA:
            return {
                ...state,
                openedData: {
                    ...state.openedData,
                    [state.openedId]: payload,
                },
            };
        default:
            return state;
    }
};

export default reducer;
