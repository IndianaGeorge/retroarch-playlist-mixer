import { createContext } from 'react';
import PlaylistController from '../Controller/PlaylistController';

const sourceContext = createContext(new PlaylistController());
const targetContext = createContext(new PlaylistController());

export { sourceContext, targetContext };
