import React, { useContext } from 'react';
import styles from './Game.module.css';

export default (props)=>{
    const {path, label, core_path, core_name, crc32, db_name} = props;
    return (
        <div className={styles.container}>
            <div className={styles.label}>{label}</div>
            <div className={styles.path}>{path}</div>
            <div className={styles.crc32}>{crc32}</div>
            <div className={styles.dbName}>{db_name}</div>
            <div className={styles.core}>
            <div className={styles.coreName}>{`${core_name}: `}</div>
            <div className={styles.corePath}>{core_path}</div>
            </div>
        </div>
    );
}