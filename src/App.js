import React, { useContext, useState } from 'react';
import styles from './App.module.css';

import {sourceContext, targetContext} from './Context/PlaylistContext'

import Playlist from './UI/Playlist.js'

export default ()=>{
  const sourceController = useContext(sourceContext);
  const targetController = useContext(targetContext);
  const [filter,setFilter] = useState("");

  const copyOnClick = (gameData)=>{
    targetController.add(gameData);
    targetController.filter("label", filter);
  }

  const deleteOnClick = ()=>{
    targetController.delete(`Delete this game!`);
  }
  
  const updateFilter = filterText=>{
    setFilter(filterText.target.value);
    sourceController.filter("label",filterText.target.value);
    targetController.filter("label",filterText.target.value);
  }
  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <h1 className={styles.title}>Retroarch playlist mixer</h1>
      </header>
      <div className={styles.playlistPanel}>
        <Playlist controller={sourceContext} onGameClick={copyOnClick}/>
        <Playlist controller={targetContext} onGameClick={deleteOnClick}/>
      </div>
      <div className={styles.textPanel}>
        <input onChange={updateFilter}/>
        <textarea rows="6" disabled value="console"></textarea>
      </div>
    </div>
  );
}
