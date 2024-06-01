import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, firestore } from "../../configs/firebase-config";
import { UserModel } from "../../models/UserModel";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

const usersRef = collection(firestore, "users");

function userRef(phoneNumber: string) {
  return doc(usersRef, phoneNumber);
}

interface AuthState {
  isAuthenticated: boolean;
  isSentOTP: boolean;
  loading: boolean;
  error: string | null;
  verificationId: string | null;
  user: {
    uid: string | null;
    phoneNumber: string | null;
  } | null;
  userDB: UserModel | null;
}

const loadUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  isSentOTP: false,
  loading: false,
  error: null,
  verificationId: null,
  user: loadUserFromLocalStorage(),
  userDB: null,
};

export const sendSmsCode = async (phoneNumber: string) => {
  const appVerifier = window._recaptchaVerifier;

  if (!appVerifier) {
    throw new Error("Cannot use invisible captcha. Please reload the page.");
  }

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window._confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (confirmationErr) {
    let err = confirmationErr;

    if (window._captchaWidgetId) {
      window.grecaptcha?.reset(window._captchaWidgetId);
    } else {
      try {
        const widgetId = await window._recaptchaVerifier?.render();

        if (widgetId) {
          window._captchaWidgetId = widgetId;
          window.grecaptcha?.reset(widgetId);
        }
      } catch (captchaErr) {
        err = captchaErr;
      }
    }

    throw err;
  }
};

export const sendOTP = createAsyncThunk("auth/sendOTP", async ({ phone }: { phone: string }, { rejectWithValue }) => {
  try {
    const confirmationResult = await sendSmsCode(phone);
    return {
      verificationId: confirmationResult.verificationId,
    };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return rejectWithValue(error.message);
  }
});

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ verificationId, code }: { verificationId: string; code: string }, { rejectWithValue, dispatch }) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      const phoneNumber = user.phoneNumber;
      const userDoc = await getDoc(userRef(phoneNumber || ""));
      if (userDoc.exists()) {
        const userData = UserModel.fromFirestore(userDoc);
        return { uid: user.uid, phoneNumber, userDB: userData };
      } else {
        return rejectWithValue("User does not exist.");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "auth/createUser",
  async ({ firstName, lastName }: { firstName: string; lastName: string }, { rejectWithValue, dispatch }) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not found.");
      }
      const phoneNumber = user.phoneNumber!;
      const userDB = new UserModel(firstName, lastName, phoneNumber, new Date(), new Date(), "");
      const checkUserExists = await getDoc(userRef(phoneNumber));
      if (checkUserExists.exists()) {
        throw new Error("User already exists.");
      }
      await addDoc(usersRef, userDB.toFirestore());
      dispatch(setUser({ uid: user.uid, phoneNumber, userDB }));
    } catch (error: any) {
      console.error("Error creating user:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const checkUserExists = createAsyncThunk("auth/checkUserExists", async (phoneNumber: string) => {
  const checkUserExists = await getDoc(userRef(phoneNumber));
  return checkUserExists.exists();
});

export const logOut = createAsyncThunk("auth/logOut", async () => {
  localStorage.removeItem("user");
  window.location.href = "/";
  await signOut(auth);
});

export const loadUserFromSession = createAsyncThunk("auth/loadUserFromSession", async (_, { dispatch }) => {
  return new Promise<void>((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const phoneNumber = user.phoneNumber;
        const userDoc = await getDoc(userRef(phoneNumber || ""));
        if (userDoc.exists()) {
          const userData = UserModel.fromFirestore(userDoc);
          dispatch(setUser({ uid: user.uid, phoneNumber: phoneNumber!, userDB: userData }));
          resolve();
        } else {
          reject();
        }
      } else {
        reject();
      }
    });
  });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ uid: string; phoneNumber: string; userDB: UserModel | null }>) => {
      state.user = { uid: action.payload.uid, phoneNumber: action.payload.phoneNumber } || null;
      state.userDB = action.payload.userDB;
      state.isAuthenticated = true;
      localStorage.setItem(
        "user",
        JSON.stringify({ uid: action.payload.uid, phoneNumber: action.payload.phoneNumber })
      );
    },
    setIsSentOTP: (state, action: PayloadAction<boolean>) => {
      state.isSentOTP = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
        state.userDB = null;
        state.isAuthenticated = false;
      })
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isSentOTP = true;
        state.verificationId = action.payload.verificationId;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isSentOTP = false;
        state.verificationId = null;
        state.user = { uid: action.payload.uid, phoneNumber: action.payload.phoneNumber };
        state.userDB = action.payload.userDB;
        state.isAuthenticated = true;
        localStorage.setItem(
          "user",
          JSON.stringify({ uid: action.payload.uid, phoneNumber: action.payload.phoneNumber })
        );
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadUserFromSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromSession.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loadUserFromSession.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.isSentOTP = false;
        state.user = null;
        state.userDB = null;
        localStorage.removeItem("user");
      });
  },
});

export const { setUser, setIsSentOTP } = authSlice.actions;

export default authSlice.reducer;
