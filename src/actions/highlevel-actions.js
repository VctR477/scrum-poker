const SET_DATA = 'HIGHLEVEL_SET_DATA';
const CHOOSE_CARD = 'HIGHLEVEL_CHOOSE_CARD';
const SET_READY = 'HIGHLEVEL_SET_READY';

export const TYPES = {
    SET_DATA,
    CHOOSE_CARD,
    SET_READY,
};

export const setDataAC = (payload) => ({
    type: SET_DATA,
    payload,
});

export const chooseCardAC = (payload) => ({
    type: CHOOSE_CARD,
    payload,
});

export const setReadyAC = (payload) => ({
    type: SET_READY,
    payload,
});
