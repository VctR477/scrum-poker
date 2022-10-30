const initialState = {
    totalPeople: 0,
    voitedPeople: 0,
    result: {},
    user: {
        isAdmin: false,
        isOpen: false,
        isReady: false,
        votes: {},
    },
};

export const reducer = (
    state = initialState,
    { type, payload },
) => {
    switch (type) {
        case 'SET_DATA':
            return {
                ...state,
                ...payload,
            };
        case 'CHOOSE_CARD':
            return {
                ...state,
                user: {
                    ...state.user,
                    votes: {
                        ...state.user.votes,
                        [payload.stackName]: payload.value,
                    }
                },
            };
        case 'SET_READY':
            return {
                ...state,
                user: {
                    ...state.user,
                    isReady: true,
                },
            };
        default:
            return state;
    }
};
