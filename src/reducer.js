const initialState = {
    totalPeople: 0,
    voitedPeople: 0,
    result: {},
    user: {
        isLogged: false,
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
        default:
            return state;
    }
};
