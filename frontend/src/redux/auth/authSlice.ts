import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../../axios/axios";
import { IAuth, IResponse } from "../../interfaces/auth.internface";
import { RootState } from "../store";

interface InitialState {
  username: string;
  userId: string;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const initialState: InitialState = {
  username: "",
  userId: "",
  isLoggedIn: false,
  isLoading: false,
};

export const signUp = createAsyncThunk(
  "auth/signup",
  async (data: IAuth, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/signup", data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: IAuth, { rejectWithValue }) => {
    try {
      const res = await axios.post("/auth/signin", data);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  try {
    await axios.post("/auth/signout");
  } catch (error) {
    console.log(error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.userId = action.payload.id;
    },
    unSetUser: (state) => {
      state.isLoggedIn = false;
      state.username = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
      })

      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(login.pending, (state, action) => {
        state.isLoading = true;
      })

      .addCase(login.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoggedIn = true;
        state.username = action.payload?.data.username;
        state.userId = action.payload?.data.id;
        state.isLoading = false;
      })

      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;

export const { setUser, unSetUser } = authSlice.actions;

export default authSlice.reducer;
