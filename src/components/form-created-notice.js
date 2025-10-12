import React, { useState, useEffect, useRef, useMemo  } from 'react';
import { installpath, formHandleParams } from './variable';
import SelectForm from './selectForm';
import {DynForm} from '../../submodule/react_checklist/lib';
import FormController from '../../submodule/react_checklist/src/utils/use-dynamic-form'




function NewformCreated({currenFormName, currenFormId, currenSubmissionId, setFormAction, fetchListOption}) {     
        const [showloader, setShowLoader] = useState(false);
        const [error, setError] = useState('');
        const [formjson, setFormJson] = useState(null);
        const formControllerRef = useRef<FormController>(null);
        const renderWithLineBreaks = (errormsg) => {
                return errormsg.split('\n').map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {index < errormsg.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ));
        };
        const [showNotice, setShowNotice] = useState(true);
        const [returnBtnLabel, setReturnBtnLabel] = useState('Back to form list');

        const apifetch = async (apiurl, fetchtype, payload) => {

            setShowLoader(true);
            try {
                    const response = 	await fetch(apiurl, { 
                            method: 'POST',
                            headers: {'Content-Type': 'application/json; charset=UTF-8'},
                            body: JSON.stringify(payload)
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    if(data==false){
                        if(fetchtype =='submit-form'){
                            setError('An error has occurred testing submssion of form. This may be due to invalid or expired auth token or provider server is downed or mis-match between checklist form and submission URL.');
                        }
                        else{
                            setError('An error has occurred while fetching Checklist form and Submission Url list. This is probably due to invalid or expired auth token or provider server is downed.');
                        }
                    }else{
                        const jsonObject = JSON.parse(data);
                        if(fetchtype =='fetch-form-details'){ 
                            let jsonData = jsonObject.data[0].data;
                            const updateddetails = jsonData.details.map(item => {
                                return {
                                        ...item, 
                                        showInput: true
                                };
                            });
                            jsonData.details = updateddetails;
                           // console.log(`jsonData: ${JSON.stringify(jsonData)}`);
                            setFormJson(jsonData); 
                            setShowNotice(false);
                            setError('');
                        }
                        if(fetchtype =='submit-form'){
                            alert(`data: ${data}`);
                        }
                    }
            } catch (error) {
                    //console.log(error.message);
                    setError(error.message);
            } finally {
                 setShowLoader(false);
            }
        }

        const fetchOption = async () => {
                    let apiurl='';
                    try {   
                                /*const index = formHandleParams.findIndex(item => item.key === 'fetch-form-list');
                                const fetchurl = formHandleParams[index]['url'];
                                const fetcherrmsg = formHandleParams[index]['errmsg'];
                                apiurl = fetchurl[0];
                                apifetch(apiurl, 'form-list', null);
                                apiurl = fetchurl[1];                       
                                apifetch(apiurl, 'submission-list', null);*/
                                          
                    } catch (error) {

                    } finally {
                 
                    }
        };

        const handleAction = (event, actionType, params)=>{
                event.preventDefault();
                const index = formHandleParams.findIndex(item => item.key === actionType);
                const apiurl = formHandleParams[index]['url'];
                
                if(actionType =='fetch-form-details'){
                    if(params.selectform != '')
                    {  
                        apifetch(apiurl, actionType, {selectform:params.selectform});
                    }
                    else{
                        setError(`An error has occurred. Either Checklist form or Submission Url has not been selected.`);
                        return;
                    }
                }
                if(actionType =='submit-form'){
                    const frmData = new FormData(event.currentTarget); 
                    const values = Object.fromEntries(frmData.entries());
                    const payload = { formSubmitData: values, selectform:params.selectform }
                    apifetch(apiurl, actionType, payload);
                }
        }

        const handleReturn = ()=>{
            const index = formHandleParams.findIndex(item => item.key === 'fetch-form-list');
            const apiurl = formHandleParams[index]['url'];
            fetchListOption (apiurl, 'form-list', null, 'GET');
            setFormAction('form_list');
        }

        useEffect(() => {     
                fetchOption();
        }, []);  
     
        return (
            <>
                { showloader && <div class="load-container"><div class="loader"></div></div> }
                { showNotice && (
                    <div class="new-form-created">
                        {error && <div className="alert alert-danger" role="alert">{renderWithLineBreaks(error)}</div> }
                        <div class="notice-container">
                                <div><h2 class="notice-message">New '<b>{currenFormName}</b>' form has been created. Do you wish to test the form generation and submission ? </h2></div>
                                <div>
                                    <button class="confirmation-button button-yes" onClick={(e)=>handleAction(e, 'fetch-form-details',{selectform: currenFormId})}>Yes</button>
                                    <button class="confirmation-button button-no" onClick={handleReturn}>No</button>
                                </div>
                        </div>
                    </div>
                )}

                {Boolean(formjson) && (
                    <>
                        <div className="alert alert-info" role="alert">Please fill in the form details and then click <b>Submit Form</b> button to preview the response. <br></br><button class="new-form-button" onClick={handleReturn}>{returnBtnLabel}</button></div>
                        <form onSubmit={(e) => handleAction(e, 'submit-form', {selectform: currenFormId})} >
                            {error && <div className="alert alert-danger" role="alert">{renderWithLineBreaks(error)}</div> }
                            <div class="container border border-primary bg-light p-3">
                                    <div class="mb-3">
                                        <DynForm 
                                            noForm
                                            formControllerRef={formControllerRef}
                                            data={formjson} 
                                            onChange={(fv) => { }}
                                            layoutProps={{
                                                display: 'grid',
                                                gap: 2
                                            }}
                                        />
                                    </div>
                                    <div class="mb-3 text-center">
                                        <button type='submit' class="btn btn-primary quickform-apikey-connect">Submit Form</button>
                                    </div>
                            </div>
                        </form>
                    </>   
                )}
            </>
        );
    };

    export default NewformCreated;