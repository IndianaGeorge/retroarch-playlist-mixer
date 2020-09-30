import React, { useContext } from 'react';
import styles from './App.module.css';

import { useStateEvents } from 'react-state-events';
import {sourceContext, targetContext} from './Context/PlaylistContext'
import filterContext from './Context/FilterContext'

import Playlist from './UI/Playlist.js'

function App() {
  const filterController = useContext(filterContext);
  const sourceController = useContext(sourceContext);
  const targetController = useContext(targetContext);
  const filterEvents = filterController.getEvents();
  const [filter, setFilter] = useStateEvents("", filterEvents);
  const updateFilter = filterText=>{
    sourceController.filter("label",filterText.target.value);
    targetController.filter("label",filterText.target.value);
  }
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
        <input onChange={updateFilter}/>
        <textarea rows="6" disabled value="console"></textarea>
      </div>
    </div>
  );
}

export default App;
