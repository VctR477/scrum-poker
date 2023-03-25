const SET_LIST = 'SET_LIST';
const SET_OPENED_ID = 'SET_OPENED_ID';
const MERGE = 'MERGE';
const SET_OPENED_DATA = 'SET_OPENED_DATA';

export const TYPES = {
    SET_LIST,
    SET_OPENED_ID,
    MERGE,
    SET_OPENED_DATA,
};

export const setList = (payload) => ({
    type: SET_LIST,
    payload,
});

export const setOpenedId = (payload) => ({
    type: SET_OPENED_ID,
    payload,
});

export const mergeResultsData = (payload) => ({
    type: MERGE,
    payload,
});

export const setOpenedData = (payload) => ({
    type: TYPES.SET_OPENED_DATA,
    payload,
});


export const fetchResultsList = () => async (dispatch) => {
    const response = await fetch('/results');
    const result = await response.json();
    dispatch(setList(result));
};

export const fetchResultData = (name) => async (dispatch) => {
    const response = await fetch(`/results/?item=${name}`);
    const result = await response.json();
    dispatch(setOpenedData(result));
};
