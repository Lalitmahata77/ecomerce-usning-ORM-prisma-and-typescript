import {createSlice} from "@reduxjs/toolkit"
// import { userInfo } from "os"

const initialState = {
    userInfo : localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo") as string) : null,
}

const userSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
      
            const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
            localStorage.setItem("expirationTime", expirationTime.toString());
          },
          logout: (state) => {
            state.userInfo = null;
            localStorage.clear();
          },
    }
})

export const { setCredentials, logout } = userSlice.actions;

export default userSlice.reducer;