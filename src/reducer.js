const initialState = {
    count: 0,
};

export const reducer = (
    state = initialState,
    { type, payload },
) => {
    switch (type) {
        case 'MY_ACTION':
            return { ...state, count: state.count + 1 };
        default:
            return state;
    }
};
