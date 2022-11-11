import { TYPES } from './actions';

const initialState = {
    isOpen: false,
    all: 0,
    ready: 0,
    sumByStack: {
        Front: 0,
        Middle: 0,
        Pega: 0,
        Test: 0,
        Analyst: 0,
    },
    result: {
        Front: {},
        Middle: {},
        Pega: {},
        Test: {},
        Analyst: {},
    },
    user: {
        isAdmin: false,
        isReady: false,
        votes: {},
    },
};

export const reducer = (
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
            const {
                stackName,
                value,
            } = payload;
            if (state?.user?.votes && state?.user?.votes[stackName] === value) {
                const newVotes = { ...state.user.votes };
                delete newVotes[stackName];
                return {
                    ...state,
                    user: {
                        ...state.user,
                        votes: newVotes,
                    },
                }
            }
            return {
                ...state,
                user: {
                    ...state.user,
                    votes: {
                        ...state.user.votes,
                        [stackName]: value,
                    }
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
