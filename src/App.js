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
    targetController.add(gameData);
    targetController.filter("label", filter);
  }

  const deleteOnClick = (gameData,index)=>{
    targetController.delete(index);
    targetController.filter("label", filter);
  }

  const clearFilter = ()=>{
    setFilter("");
    sourceController.filter("label","");
    targetController.filter("label","");
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
        <div className={styles.filter}>
          <input onChange={onFilterChange} value={filter} className={styles.filterText} />
          <select value={filterType} onChange={onFilterTypeChange}>
            <option value="label">Label</option>
            <option value="crc32">CRC32</option>
            <option value="path">Full path</option>
            <option value="filename">Filename</option>
          </select>
          <button onClick={clearFilter}>clear</button>
        </div>
        <textarea rows="6" disabled value="console"></textarea>
      </div>
    </div>
  );
}
