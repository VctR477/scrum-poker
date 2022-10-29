const MY_ACTION = 'MY_ACTION';

export const myActionCreator = () => ({
    type: MY_ACTION,
});

export const myActionCreator2 = (arg) => (dispatch, getState) => {
    console.log(arg)

    console.log(getState());

    dispatch(myActionCreator());
};
