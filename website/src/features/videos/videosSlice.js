import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import buildUrl from 'build-url';

const entityAdapter = createEntityAdapter({
    selectId: entity => entity.eTag,
    sortComparer: (a, b) => b.date - a.date,
});

const sliceName = 'videos';

export const selectVideosSlice = state => state[sliceName];

export const videosSelectors = entityAdapter.getSelectors(state => selectVideosSlice(state));

const shouldReload = videosSlice => !videosSlice.loading && videosSlice.doReload;

function jsonReviver(key, value) {
    switch (key) {
        case 'filename':
            const match = value.match(/\d+x(\d+p)/i);
            if (match) {
                this.videoQuality = match[1].toLowerCase();
            }
            return value;
        case 'date':
            return Date.parse(value);
        default:
            return value;
    }
}

export const fetchAllVideos = createAsyncThunk(
    `${sliceName}/fetchAllVideos`,
    async (accessToken, {getState, rejectWithValue}) => {
        const videoQuality = selectVideosSlice(getState()).videoQuality;
        const url = buildUrl('https://jbm3qrd33k.execute-api.us-east-1.amazonaws.com/dev/videos', {
            queryParams: videoQuality ? {encoding: videoQuality} : {},
        });
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const bodyText = await response.text();
            if (response.ok) {
                return JSON.parse(bodyText, jsonReviver);
            }
            return rejectWithValue(`HTTP ${response.status}: ${bodyText}`);
        } catch (e) {
            return rejectWithValue(e);
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
        videoQuality: '',
        doReload: true,
    }),
    reducers: {
        setVideoQuality: (state, action) => {
            if (action.payload !== state.videoQuality) {
                state.doReload = true;
            }
            state.videoQuality = action.payload;
        }
    },
    extraReducers: builder => builder
        .addCase(fetchAllVideos.fulfilled, (state, action) => {
            entityAdapter.setAll(state, action.payload.files);
            state.baseUrl = action.payload.baseUrl;
            state.doReload = false;
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
            state.error = action.payload;
        })
    ,
});

export const {setVideoQuality} = videosSlice.actions;

export default videosSlice.reducer;