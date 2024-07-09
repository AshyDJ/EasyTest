import React from 'react'
import './testui.css'
import $ from 'jquery';

const Legend = () => {


    $("#slider").off("click").on("click",function(){
        $("#panel").slideToggle(500);
        
    });

    
  return (
    <>
    <div className='legend'>
    <div className='flex'>
        <h5>Keys</h5> <button id="slider"><b>Show/Hide</b></button>
        </div>
        <div  id="panel">
            <p>Click - To select a row</p>
            <p>Enter - Enter a new row at selected postition</p>
            <p>Delete - Delete selected row</p>
            <p>Tab - Make row a parent</p>
            <p>Esc - Toggle button of selected row</p>
            <p>Shift+Tab - Un-make a parent row</p>
            <p>Commit - To save changes</p>
            <p>Reload Page - To load the last commit</p>
            <p>If your having problems in Life Call : 9655503410 and 9150445733 or chatgpt</p>
        
    </div>
    </div>
    </>
  )
}

export default Legend
