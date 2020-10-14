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

  const newTargetPlaylist = ()=>{
    targetController.set(targetController.getEmptyPlaylist(),"New Retroarch playlist.lpl");
  }

  const sourceButtons={
    Reset: sourceController.empty.bind(sourceController),
    "Copy all": copyAll,
  }

  const fixAll = ()=>{
    const fixType="crc32";
    let list;
    switch (fixType) {
      case "label":
        list = targetController.filteredItems.map(wrap=>wrap.game.label);
        break;
      case "filename":
        list = targetController.filteredItems.map(wrap=>wrap.game.path.match(/([^\\#]+\....)$/)[1]);
        break;
      case "crc32":
        list = targetController.filteredItems.map(wrap=>wrap.game.crc32);
        break;
      case "path":
        list = targetController.filteredItems.map(wrap=>wrap.game.path);
        break;
      default:
        list = [];
        break;
    }
    list.forEach(i=>{
      switch (fixType) {
        case "label":
          if (sourceController.fullLabel[i] && sourceController.fullLabel[i].length===1) {
            while (targetController.fullLabel[i] && targetController.fullLabel[i].length>0) {
              targetController.delete(targetController.fullLabel[i][0].index);
            }
            targetController.add(sourceController.fullLabel[i][0].game);
          }
          break;
        case "filename":
          if (sourceController.fullFilename[i] && sourceController.fullFilename[i].length===1) {
            while (targetController.fullFilename[i] && targetController.fullFilename[i].length>0) {
              targetController.delete(targetController.fullFilename[i][0].index);
            }
            targetController.add(sourceController.fullFilename[i][0].game);
          }
          break;
        case "crc32":
          if (sourceController.fullCrc[i] && sourceController.fullCrc[i].length===1) {
            while (targetController.fullCrc[i] && targetController.fullCrc[i].length>0) {
              targetController.delete(targetController.fullCrc[i][0].index);
            }
            targetController.add(sourceController.fullCrc[i][0].game);
          }
          break;
        case "path":
          if (sourceController.fullPath[i] && sourceController.fullPath[i].length===1) {
            while (targetController.fullPath[i] && targetController.fullPath[i].length>0) {
              targetController.delete(targetController.fullPath[i][0].index);
            }
            targetController.add(sourceController.fullPath[i][0].game);
          }
          break;
        default:
          break;
      }
    });
  }

  const targetButtons={
    Reset: targetController.empty.bind(targetController),
    "New": newTargetPlaylist,
    "Fix visible by CRC": fixAll,
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
