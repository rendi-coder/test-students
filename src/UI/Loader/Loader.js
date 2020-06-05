import React from 'react'
import classes from './Loader.module.css'

const Loader=props=>
     (  <div className={classes.center}>
             <div className={classes.Loader}>
                     <div/><h1>...Loading</h1><div/>
            </div>
        </div>
     )

export default Loader