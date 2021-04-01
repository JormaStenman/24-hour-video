import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import buildUrl from 'build-url';

const entityAdapter = createEntityAdapter({
    selectId: entity => entity.eTag,
    sortComparer: (a, b) => b.date - a.date,
});

const sliceName = 'videos';

export const selectVideosSlice = state => state[sliceName];

export const videosSelectors = entityAdapter.getSelectors(state => selectVideosSlice(state));

const shouldReload = videosSlice => !videosSlice.loading;

export const fetchAllVideos = createAsyncThunk(
    `${sliceName}/fetchAllVideos`,
    async ({accessToken, size}, {rejectWithValue}) => {
        const url = buildUrl('https://jbm3qrd33k.execute-api.us-east-1.amazonaws.com/dev/videos', {
            queryParams: {
                encoding: size,
            },
        });
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const bodyText = await response.text();
            if (response.ok) {
                return JSON.parse(bodyText, (key, value) => key === 'date' ? Date.parse(value) : value);
            }
            rejectWithValue(`${response.statusText} (${response.status}): ${bodyText}`);
        } catch (e) {
            rejectWithValue(e);
        }
    },
    {
        condition: (_, {getState}) => shouldReload(selectVideosSlice(getState())),
    },
);

export const videosSlice = createSlice({
    name: sliceName,
    initialState: entityAdapter.getInitialState({
        loading: false,
        error: null,
        baseUrl: null,
        lastLoaded: 0,
    }),
    reducers: {},
    extraReducers: builder => builder
        .addCase(fetchAllVideos.fulfilled, (state, action) => {
            entityAdapter.setAll(state, action.payload.files);
            state.baseUrl = action.payload.baseUrl;
            state.lastLoaded = Date.now();
        })
        .addMatcher(action => action.type.endsWith('/pending'), state => {
            state.loading = true;
            state.error = null;
        })
        .addMatcher(action => action.type.endsWith('/fulfilled'), state => {
            state.loading = false;
            state.error = null;
        })
        .addMatcher(action => action.type.endsWith('/rejected'), (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    ,
});

export default videosSlice.reducer;