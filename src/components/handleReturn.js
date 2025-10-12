import React, { useState } from 'react';


const HandleReturn = ({setFormAction, returnBtnLabel}) => {     

    const handleReturn = ()=>{
                    setFormAction('form_list');
    }

    //onClick={handleReturn}

    return (<>
        <button class="new-form-button" onClick={handleReturn}>{returnBtnLabel}</button>
    </>
  );

};

export default HandleReturn;
