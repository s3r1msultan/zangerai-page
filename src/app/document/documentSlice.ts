import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { DocumentSection, DocumentService } from "../../services/DocumentService";

interface DocumentState {
  documentSections: DocumentSection[];
  isLoading: boolean;
  error: string | null;
  loaded: boolean;
}

const initialState: DocumentState = {
  documentSections: [],
  isLoading: false,
  error: null,
  loaded: false,
};

export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async (country: string, { getState, rejectWithValue }) => {
    const state = getState() as { documents: DocumentState };
    if (state.documents.loaded) {
      return;
    }

    try {
      const documentSections = await DocumentService.fetchDocuments(country);
      return documentSections;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocumentsLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action: PayloadAction<DocumentSection[] | undefined>) => {
        state.isLoading = false;
        if (action.payload) {
          state.documentSections = action.payload;
          state.loaded = true; // Mark documents as loaded
        }
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDocumentsLoaded } = documentSlice.actions;

export default documentSlice.reducer;
