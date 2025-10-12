import React, { useState, useEffect, useRef, useMemo  } from 'react';
import { installpath, formHandleParams } from './variable';
import Newform from './newform';
import NewformCreated from './form-created-notice';
import Editform from './editform';

function FormList({setShowLoader}) {     
        const [formDataList, setFormDataList] = useState([]);
        const [formAction, setFormAction] = useState('form_list');
        const [currenFormName, setCurrentFormName] = useState('');
        const [currenFormId, setCurrentFormId] = useState('');
        const [currenSubmissionId, setCurrentSubmissionId] = useState('');
        const doformAction = (event, fAction, param) => {
            if(fAction == 'form_edit'){ setCurrentFormId(param); }
            setFormAction(fAction);  
        }
        let apiurl = '';

        const apifetch = async (apiurl, fetchtype, payload, fetchmethod) => {
            	setShowLoader(true);
                let response;
		        try {
                    if(fetchtype == 'form-list' || fetchtype == 'delete-form' ){
                            response = await fetch(apiurl, { 
                                method: fetchmethod,
				        	    headers: {'Content-Type': 'application/json; charset=UTF-8'}
                            });  
                    }else{
			                response = await fetch(apiurl, { 
                                method: fetchmethod,
				        	    headers: {'Content-Type': 'application/json; charset=UTF-8'},
						        body: JSON.stringify(payload)
                            });
                    }

			        if (!response.ok) {
		                    throw new Error(`HTTP error! status: ${response.status}`);
			        }
		            const data = await response.json();
                    if(fetchtype == 'form-list'){
                        if(data)
                        {  setFormDataList(data); }
                    }else{
                        if(fetchtype == 'delete-form'){
                            const index = formHandleParams.findIndex(item => item.key === 'fetch-form-list');
                            const apiurl = formHandleParams[index]['url'];
                            apifetch (apiurl, 'form-list', null, 'GET');
                        }
                    }
		        } catch (error) {
			            console.log(error.message);
            	} finally {
			            setShowLoader(false);
		        }
        }
			            	
        useEffect(() => {
                const index = formHandleParams.findIndex(item => item.key === 'fetch-form-list');
                const apiurl = formHandleParams[index]['url'];
                apifetch (apiurl, 'form-list', null, 'GET');
        }, []);  

        const handleFormDelete = (itemid) =>{
                const isConfirmed = window.confirm('Are you sure you want to delete this form?');
                if(isConfirmed){
                        const index = formHandleParams.findIndex(item => item.key === 'delete-form');
                        const apiurl = formHandleParams[index]['url'];
                        apifetch (`${apiurl}/${itemid}`, 'delete-form', null, 'DELETE'); 
                }
        }
       
        return (
            <>
                { formAction == 'form_list' && (
                        <div class="">
                            <h1>Forms List <button class="new-form-button" onClick={(event)=>doformAction(event, 'form_new', '')}>Add New Form</button> </h1>
                            <div class="table_component" role="region" tabindex="0">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Form Name</th>
                                            <th>Description</th>
                                            <th>Created At</th>
                                            <th>Updated At</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formDataList.map((item, index) => (
                                            <tr>
                                                <td>{item.form_name}</td>
                                                <td>{item.form_description}</td>
                                                <td>{item.created_at}</td>
                                                <td>{item.updated_at}</td>
                                                <td>{item.status}</td>
                                                <td><i onClick={(event)=>doformAction(event, 'form_edit', item.id)}  className="bi bi-pencil-square"></i><i onClick={()=>handleFormDelete(item.id)} className="bi bi-trash"></i></td>
                                            </tr>
                                        ))} 
                                    </tbody>
                                </table>
                            </div>    
                        </div>
                ) }
                { formAction == 'form_new' && (
                        <Newform setFormAction={setFormAction} setCurrentFormName={setCurrentFormName} setCurrentFormId={setCurrentFormId} setCurrentSubmissionId={setCurrentSubmissionId} setShowLoader={setShowLoader}/>
                ) }
                { formAction == 'form_created_notice' && (
                        <NewformCreated currenFormName={currenFormName} currenFormId={currenFormId} currenSubmissionId={currenSubmissionId} setFormAction={setFormAction} fetchListOption={apifetch} />
                ) }
                { formAction == 'form_edit' && (
                        <Editform setFormAction={setFormAction} setCurrentFormName={setCurrentFormName} setCurrentFormId={setCurrentFormId} setCurrentSubmissionId={setCurrentSubmissionId} currenFormId={currenFormId} setShowLoader={setShowLoader} />
                ) }

            </>
        );
   
    };

    export default FormList;