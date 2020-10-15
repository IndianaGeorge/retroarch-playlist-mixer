import React, { useContext, useState } from 'react';
import styles from './App.module.css';

import {sourceContext, targetContext} from './Context/PlaylistContext'

import Playlist from './UI/Playlist.js'

export default ()=>{
  const sourceController = useContext(sourceContext);
  const targetController = useContext(targetContext);
  const [filter,setFilter] = useState("");
  const [filterType,setFilterType] = useState("label");
  const [changeCoreOnCopy,setChangeCoreOnCopy] = useState(false);
  const [deduceLabelOnCopy,setDeduceLabelOnCopy] = useState(false);
  const [changeBasePathOnCopy,setChangeBasePathOnCopy] = useState(false);
  const [coreSourceOnCopy,setCoreSourceOnCopy] = useState("detect");
  const [labelCheckOnCopy,setLabelCheckOnCopy] = useState("");
  const [basePathOnCopy,setBasePathOnCopy] = useState("C:\\");
  const [changeCoreOnFix,setChangeCoreOnFix] = useState(false);
  const [pickOnlyOnFix,setPickOnlyOnFix] = useState(false);
  const [appendToLabelOnFix,setAppendToLabelOnFix] = useState(false);
  const [changeBasePathOnFix,setChangeBasePathOnFix] = useState(false);
  const [coreSourceOnFix,setCoreSourceOnFix] = useState("detect");
  const [pickOnlyOnFixType,setPickOnlyTypeOnFix] = useState("label");
  const [pickOnlyOnFixSpec,setPickOnlyOnFixSpec] = useState("");
  const [appendToLabelOnFixText,setAppendToLabelOnFixText] = useState("(fixed)");
  const [changeBasePathOnFixPath,setChangeBasePathOnFixPath] = useState("C:\\");
  const [copyOptsVisible,setCopyOptsVisible] = useState(false);
  const [fixOptsVisible,setFixOptsVisible] = useState(false);
  
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

  const onChangeChangeCoreOnCopy = (newChangeCoreOnCopy)=>{
    setChangeCoreOnCopy(newChangeCoreOnCopy.target.checked);
  }

  const onChangeDeduceLabelOnCopy = (newDeduceLabelOnCopy)=>{
    setDeduceLabelOnCopy(newDeduceLabelOnCopy.target.checked);
  }

  const onChangeChangeBasePathOnCopy = (newChangeBasePathOnCopy)=>{
    setChangeBasePathOnCopy(newChangeBasePathOnCopy.target.checked);
  }

  const onChangeCoreSourceOnCopy = (newCoreSourceOnCopy)=>{
    setCoreSourceOnCopy(newCoreSourceOnCopy.target.value);
  }

  const onChangeLabelCheckOnCopy = (newLabelCheckOnCopy)=>{
    setLabelCheckOnCopy(newLabelCheckOnCopy.target.value);
  }

  const onChangeBasePathOnCopy = (newBasePathOnCopy)=>{
    setBasePathOnCopy(newBasePathOnCopy.target.value);
  }

  const onChangeChangeCoreOnFix = (newChangeCoreOnFix)=>{
    setChangeCoreOnFix(newChangeCoreOnFix.target.checked);
  }
  const onChangePickOnlyOnFix = (newPickOnlyOnFix)=>{
    setPickOnlyOnFix(newPickOnlyOnFix.target.checked);
  }
  const onChangeAppendToLabelOnFix = (newAppendToLabelOnFix)=>{
    setAppendToLabelOnFix(newAppendToLabelOnFix.target.checked);
  }
  const onChangeChangeBasePathOnFix = (newChangeBasePathOnFix)=>{
    setChangeBasePathOnFix(newChangeBasePathOnFix.target.checked);
  }

  const onChangeCoreSourceOnFix = (newCoreSourceOnFix)=>{
    setCoreSourceOnFix(newCoreSourceOnFix.target.value);
  }

  const onChangePickOnlyOnFixType = (newPickOnlyOnFixType)=>{
    setPickOnlyTypeOnFix(newPickOnlyOnFixType.target.value);
  }

  const onChangePickOnlyOnFixSpec = (newPickOnlyOnFixSpec)=>{
    setPickOnlyOnFixSpec(newPickOnlyOnFixSpec.target.value);
  }

  const onChangeAppendToLabelOnFixText = (newAppendToLabelOnFixText)=>{
    setAppendToLabelOnFixText(newAppendToLabelOnFixText.target.value);
  }

  const onChangeChangeBasePathOnFixPath = (newChangeBasePathOnFixPath)=>{
    setChangeBasePathOnFixPath(newChangeBasePathOnFixPath);
  }

  const onClickCopyOpts = ()=>{
    setCopyOptsVisible(!copyOptsVisible);
  }

  const onClickFixOpts = ()=>{
    setFixOptsVisible(!fixOptsVisible);
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
      <div>
        <h4 onClick={onClickCopyOpts}>({copyOptsVisible?'-':'+'})When copying:</h4>
        {
          copyOptsVisible?(
            <ul>
              <li><input type="checkbox" checked={changeCoreOnCopy} onChange={onChangeChangeCoreOnCopy} />
                Change core name and path to <select value={coreSourceOnCopy} onChange={onChangeCoreSourceOnCopy}>
                  <option value="sourcePlaylist">Source Playlist default core</option>
                  <option value="targetPlaylist">Target Playlist default core</option>
                  <option value="detect">DETECT</option>
                </select>
              </li>
              <li><input type="checkbox" checked={deduceLabelOnCopy} onChange={onChangeDeduceLabelOnCopy} />
                If label is <input type="text" value={labelCheckOnCopy} onChange={onChangeLabelCheckOnCopy}/>, deduce label from filename
              </li>
              <li><input type="checkbox" checked={changeBasePathOnCopy} onChange={onChangeChangeBasePathOnCopy} />
                change base path to <input type="text" value={basePathOnCopy} onChange={onChangeBasePathOnCopy}/>
              </li>
            </ul>
          ):null
        }

        <h4 onClick={onClickFixOpts}>({fixOptsVisible?'-':'+'})When fixing:</h4>
        {
          fixOptsVisible?(
            <ul>
              <li><input type="checkbox" checked={changeCoreOnFix} onChange={onChangeChangeCoreOnFix} />
                Change core name/path to <select value={coreSourceOnFix} onChange={onChangeCoreSourceOnFix}>
                  <option value="sourcePlaylist">Source Playlist default core</option>
                  <option value="targetPlaylist">Target Playlist default core</option>
                  <option value="detect">DETECT</option>
                </select>
              </li>
              <li><input type="checkbox" checked={pickOnlyOnFix} onChange={onChangePickOnlyOnFix} />
                pick only entries with <select value={pickOnlyOnFixType} onChange={onChangePickOnlyOnFixType}>
                  <option value="label">label</option>
                  <option value="crc">crc</option>
                  <option value="basePath">base path</option>
                </select> matching <input type="text" value={pickOnlyOnFixSpec} onChange={onChangePickOnlyOnFixSpec}/>
              </li>
              <li><input type="checkbox" checked={appendToLabelOnFix} onChange={onChangeAppendToLabelOnFix} />
                Append <input type="text" value={appendToLabelOnFixText} onChange={onChangeAppendToLabelOnFixText}/> to label
              </li>
              <li><input type="checkbox" checked={changeBasePathOnFix} onChange={onChangeChangeBasePathOnFix} />
                change base path to <input type="text" value={changeBasePathOnFixPath} onChange={onChangeChangeBasePathOnFixPath}/>
              </li>
            </ul>
          ):null
        }
      </div>
      <div className={styles.textPanel}>
        <div className={styles.filter}>
          Filter visible by <input onChange={onFilterChange} value={filter} className={styles.filterText} />
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
