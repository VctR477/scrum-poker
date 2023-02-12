import { TYPES } from '../actions/satisfaction-actins';

const initialState = {
    isOpen: false,
    // всего людей
    all: 0,
    // проголосовавших
    ready: 0,
    result: {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0,
        '9': 0,
        '10': 0,
    },
    user: {
        isAdmin: false,
        isReady: false,
        vote: null,
    },
};

const reducer = (
    state = initialState,
    { type, payload },
) => {
    switch (type) {
        case TYPES.SET_DATA:
            return {
                ...state,
                ...payload,
            };
        case TYPES.CHOOSE_CARD:
            return {
                ...state,
                user: {
                    ...state.user,
                    vote: state.user.vote === payload ? null : payload,
                },
            };
        case TYPES.SET_READY:
            return {
                ...state,
                user: {
                    ...state.user,
                    isReady: payload,
                },
            };
        default:
            return state;
    }
};

export default reducer;
