const initialState = {
    totalPeople: 0,
    voitedPeople: 0,
    result: {},
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
        case 'SET_DATA':
            return {
                ...state,
                ...payload,
            };
        case 'CHOOSE_CARD':
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
        case 'SET_READY':
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
