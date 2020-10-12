import React, { useContext, useState } from 'react';
import styles from './App.module.css';

import {sourceContext, targetContext} from './Context/PlaylistContext'

import Playlist from './UI/Playlist.js'

export default ()=>{
  const sourceController = useContext(sourceContext);
  const targetController = useContext(targetContext);
  const [filter,setFilter] = useState("");
  const [filterType,setFilterType] = useState("label");

  const copyOnClick = (gameData,index)=>{
    if (targetController.playlist) {
      targetController.add(gameData);
      targetController.filter(filterType, filter);
    }
  }

  const copyAll = ()=>{
    if (sourceController.playlist) {
      sourceController.playlist.items.forEach(gameData => {
        targetController.add(gameData);
      });
      targetController.filter(filterType, filter);
    }
  }

  const deleteOnClick = (gameData,index)=>{
    targetController.delete(index);
    targetController.filter(filterType, filter);
  }

  const clearFilter = ()=>{
    setFilter("");
    updateFilter(filterType,"");
  }

  const onFilterTypeChange = newFilterType=>{
    setFilterType(newFilterType.target.value);
    if (filter!=="") {
      updateFilter(newFilterType.target.value,filter);
    }
  }

  const onFilterChange = filterText=>{
    setFilter(filterText.target.value);
    updateFilter(filterType,filterText.target.value);
  }

  const updateFilter = (newFilterType,newFilter)=>{
    sourceController.filter(newFilterType,newFilter);
    targetController.filter(newFilterType,newFilter);    
  }

  const sourceButtons={
    Reset: sourceController.empty.bind(sourceController),
    "Copy all": copyAll,
  }

  const targetButtons={
    Reset: targetController.empty.bind(targetController),
    Export: targetController.exportPlaylist.bind(targetController),
  }

  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <h1 className={styles.title}>Retroarch playlist mixer</h1>
      </header>
      <div className={styles.playlistPanel}>
        <Playlist controller={sourceContext} onGameClick={copyOnClick} buttons={sourceButtons}/>
        <Playlist controller={targetContext} onGameClick={deleteOnClick} buttons={targetButtons}/>
      </div>
      <div className={styles.textPanel}>
        <div className={styles.filter}>
          <input onChange={onFilterChange} value={filter} className={styles.filterText} />
          <select value={filterType} onChange={onFilterTypeChange}>
            <option value="label">Label</option>
            <option value="filename">Filename</option>
            <option value="crc32">CRC32</option>
            <option value="path">Full path</option>
          </select>
          <button onClick={clearFilter}>clear</button>
        </div>
        <textarea rows="6" disabled value="console"></textarea>
      </div>
    </div>
  );
}
