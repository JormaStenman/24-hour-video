import {configureStore} from '@reduxjs/toolkit';
import videosReducer from '../features/videos/videosSlice';

export default configureStore({
  reducer: {
    videos: videosReducer,
  },
});