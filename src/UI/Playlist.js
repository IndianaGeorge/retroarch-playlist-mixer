import React, { useState, useContext, useCallback } from 'react';
import { useStateEvents } from 'react-state-events';
import { useDropzone } from 'react-dropzone';
import LoadOverlay from 'react-loading-retry-overlay';

import styles from './Playlist.module.css';

import Game from './Game'

export default (props)=>{
  const Controller = useContext(props.controller);
  const [filteredItems] = useStateEvents(null, Controller.getfilteredItemsEvents());
  const [filename] = useStateEvents(null, Controller.getFilenameEvents());
  const [loading,setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length>0) {
      setLoading(true);
      const file = acceptedFiles[0];
      const reader = new FileReader()
  
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const text = reader.result
        Controller.set(JSON.parse(text),file.path);
        setLoading(false);
      }
      reader.readAsText(file)  
    }
  }, [Controller]);

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div className={`${props.className?props.className+" ":""}${styles.wrap}`}>
      <div className={styles.filename}>
        {filename}
      </div>
      <LoadOverlay className={styles.content} loading={loading}>
        {
          filteredItems?
            filteredItems.map(
              (wrappedgame)=> (
                <Game
                  onClick={()=>props.onGameClick(wrappedgame.game,wrappedgame.index)}
                  key={wrappedgame.index}
                  path={wrappedgame.game.path}
                  label={wrappedgame.game.label}
                  core_path={wrappedgame.game.core_path}
                  core_name={wrappedgame.game.core_name}
                  crc32={wrappedgame.game.crc32}
                  db_name={wrappedgame.game.db_names}
                />
              )
            )
          :
            <div {...getRootProps()} className={styles.dropzone}>
              <input {...getInputProps()} />
              <div className={styles.dropzoneTitle}>Drop playlist here!</div>
            </div>
        }
      </LoadOverlay>

      <div className={styles.buttonPanel}>
        {
          Object.keys(props.buttons).map(
            (key)=>(
              <button key={key} onClick={props.buttons[key]}>{key}</button>
            )
          )
        }
      </div>
    </div>
  );
}
