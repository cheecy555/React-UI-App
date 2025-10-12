import React, { useState, useEffect, useRef, useMemo  } from 'react';
import FormList from './components/formlist';
import APIKeyContainer from './components/apikey-container';

function CheckListFormHome() {     
        const [showloader, setShowLoader] = useState(false);
        const [page, setPage] = useState('home');
        const Navi = (param) =>{
                setPage(param);
        }

        return (
            <>
                { showloader && <div class="load-container"><div class="loader"></div></div> }
                <div class="checklistform-container">
                    <div class="wrap">
                        <h1>Check List Form Settings</h1>
                        <div class="topnav">
                            <a className={page=='home' ? 'active': ''} onClick={()=>Navi('home')}>Forms List</a>
                            <a className={page=='formlist' ? 'active': ''} onClick={()=>Navi('formlist')}>Settings</a>
                        </div>
                        <div class="container">
                            {page == 'home' && (<FormList setShowLoader={setShowLoader}/>)}
                            {page == 'formlist' && (<APIKeyContainer setShowLoader={setShowLoader}/>)}
                        </div>

                    </div>
                        
                </div>
              
            </>
        );
   
    };

    export default CheckListFormHome;