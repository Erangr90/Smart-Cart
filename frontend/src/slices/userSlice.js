import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserInfo: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
    },
});



export const { updateUserInfo } = userSlice.actions;

export default userSlice.reducer;
