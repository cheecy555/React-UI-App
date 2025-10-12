import React, { useState, useEffect, useRef, useMemo  } from 'react';
import {DynForm} from '../../submodule/react_checklist/lib';
import FormController from '../../submodule/react_checklist/src/utils/use-dynamic-form'

function CheckListForm({formjson}) {          
        const formControllerRef = useRef<FormController>(null);
        const dataObject = JSON.parse(formjson);
        return (
            <>
            <div class="checklistform-container">
                    <div class="wrap">
                <DynForm 
                    noForm
                    formControllerRef={formControllerRef}
                    data={dataObject.data[0].data} 
                    onChange={(fv) => { }}
                    layoutProps={{
                        display: 'grid',
                        gap: 2
                    }}
                />
                </div>
                </div>
            </>
        );
   
    };

    export default CheckListForm;