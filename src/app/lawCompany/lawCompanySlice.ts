import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LawCompaniesService } from "../../services/LawCompaniesService";
import { LawCompanyModel } from "../../models/LawCompanyModel";

interface LawCompanyState {
  lawCompanies: LawCompanyModel[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LawCompanyState = {
  lawCompanies: [],
  isLoading: false,
  error: null,
};

export const fetchLawCompanies = createAsyncThunk(
  "lawCompanies/fetchLawCompanies",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { lawCompanies: LawCompanyState };
      if (state.lawCompanies.lawCompanies.length > 0) {
        return state.lawCompanies.lawCompanies;
      }
      const service = new LawCompaniesService();
      const lawCompanies = await service.getLawCompanies();
      return lawCompanies;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const lawCompanySlice = createSlice({
  name: "lawCompanies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLawCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLawCompanies.fulfilled, (state, action: { payload: LawCompanyModel[] }) => {
        state.isLoading = false;
        state.lawCompanies = action.payload;
      })
      .addCase(fetchLawCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default lawCompanySlice.reducer;
