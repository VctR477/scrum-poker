const SET_DATA = 'SET_DATA';
const CHOOSE_CARD = 'CHOOSE_CARD';
const SET_READY = 'SET_READY';

export const setData = (payload) => ({
    type: SET_DATA,
    payload,
});

export const chooseCard = (payload) => ({
    type: CHOOSE_CARD,
    payload,
});

export const setReady = () => ({
    type: SET_READY,
});

// export const fetchData = () => async (dispatch, getState) => {
//
//
//     // dispatch(setData(data));
// };
