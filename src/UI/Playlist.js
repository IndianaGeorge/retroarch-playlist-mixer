import React, { useContext, useCallback } from 'react';
import { useStateEvents } from 'react-state-events';
import { useDropzone } from 'react-dropzone';
import FileSaver from 'file-saver';

import styles from './Playlist.module.css';

import Game from './Game'

const save=(text,filename)=>{
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, filename);
}

export default (props)=>{
  const Controller = useContext(props.controller);
  const [playlist] = useStateEvents(null, Controller.getPlaylistEvents());
  const [filteredItems] = useStateEvents(null, Controller.getfilteredItemsEvents());
  const [filename] = useStateEvents(null, Controller.getFilenameEvents());

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length>0) {
      const file = acceptedFiles[0];
      const reader = new FileReader()
  
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const text = reader.result
        Controller.set(JSON.parse(text),file.path);
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
      <div className={styles.content}>
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
      </div>

      <div className={styles.buttonPanel}>
        <button onClick={Controller.empty.bind(Controller)}>reset</button>
        <button onClick={()=>{save(JSON.stringify(playlist,null,2),filename)}}>export</button>
      </div>
    </div>
  );
}
