 // frontend/src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

const userFromStorage = JSON.parse(localStorage.getItem("user")) || null;

export const login = createAsyncThunk("auth/login", async ({ emailOrUsername, password }, { rejectWithValue }) => {
  try {
    const res = await API.post("/auth/login", { emailOrUsername, password });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Login failed" });
  }
});

export const register = createAsyncThunk("auth/register", async ({ username, email, password }, { rejectWithValue }) => {
  try {
    const res = await API.post("/auth/register", { username, email, password });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Register failed" });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    // update user in redux + localStorage
    setUser(state, action) {
      state.user = action.payload;
      try {
        if (action.payload) localStorage.setItem("user", JSON.stringify(action.payload));
        else localStorage.removeItem("user");
      } catch (e) {
        console.warn("localStorage set user failed", e);
      }
    },

    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        try {
          localStorage.setItem("user", JSON.stringify(a.payload.user));
          localStorage.setItem("token", a.payload.token);
        } catch (e) {
          console.warn("localStorage write failed", e);
        }
      })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; })

      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s) => { s.loading = false; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; });
  }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
 























