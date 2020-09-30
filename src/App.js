import React from 'react';
import styles from './App.module.css';

import {sourceContext, targetContext} from './Context/PlaylistContext'

import Playlist from './UI/Playlist.js'

function App() {
  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <h1 className={styles.title}>Retroarch playlist mixer</h1>
      </header>
      <div className={styles.playlistPanel}>
        <Playlist controller={sourceContext} />
        <Playlist controller={targetContext} />
      </div>
      <div className={styles.textPanel}>
        <input />
        <textarea rows="6" disabled value="console"></textarea>
      </div>
    </div>
  );
}

export default App;
