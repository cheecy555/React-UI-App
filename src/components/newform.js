import React, { useState, useEffect, useRef, useMemo  } from 'react';
import { formHandleParams } from './variable';
import SelectForm from './selectForm';
import HandleReturn from './handleReturn';

function Newform({setFormAction, setCurrentFormName, setCurrentFormId, setCurrentSubmissionId, setShowLoader}) {     
       // const [showloader, setShowLoader] = useState(false);
        const [formoptions, setFormOptions] = useState([]);
        const [submissionOptions, setSubmissionOptions] = useState([]);
        const [formData, setFormData] = useState({ form_name: '', form_description: '', form_instruction_message: '', submission_success_message:'', submission_failure_message: '',  submit_button_text : '', checklist_form_id: '', submission_url_id: ''});  
        const [error, setError] = useState('');
        const [returnBtnLabel, setReturnBtnLabel] = useState('Cancel');

        const renderWithLineBreaks = (errormsg) => {
                return errormsg.split('\n').map((item, index) => (
                  <React.Fragment key={index}>
                    {item}
                    {index < errormsg.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ));
              };

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
                        setError('xx.An error has occurred while fetching Checklist form and Submission Url list. This is probably due to invalid or expired auth token. Please update the new auth token in the settings.');
                       //setError(response);
                    }else{
                        
                        if(fetchtype=='create-new-form') {
                            if(data.status == 200){
                                setCurrentFormName(formData.form_name);
                                setCurrentFormId(formData.checklist_form_id);
                                setCurrentSubmissionId(formData.submission_url_id);
                                setFormAction('form_created_notice');
                            }else{
                                setError('An error has occurred while creating new form.');
                            }
                        }else{
                            const jsonObject = JSON.parse(data);
                            const entriesArray = jsonObject.data;
                            const selarray = [];
                            entriesArray.map(item => {                                                 
                                selarray.push({'value':item.id, 'label':item.name});
                            });
                            if(fetchtype=='form-list') {
                                setFormOptions(selarray);
                            }
                            if(fetchtype=='submission-list') {                          
                                setSubmissionOptions(selarray);
                            }
                        }
                    }
            } catch (error) {
                    console.log(error.message);
            } finally {
                 setShowLoader(false);
            }
        }

        const handleSelectChange = (event) => {    
                setFormData({ ...formData, [event.target.name]: event.target.value });        
        };

        const handleSubmitNewForm = (event) => { 
                event.preventDefault();
                const index = formHandleParams.findIndex(item => item.key === 'create-new-form');
                const apiurl = formHandleParams[index]['url'];
                apifetch(apiurl, 'create-new-form', formData);
        }

        const fetchOption = async () => {
                    let apiurl='';
                    try {   
                                const index = formHandleParams.findIndex(item => item.key === 'fetch-checklistform-list');
                                const fetchurl = formHandleParams[index]['url'];
                                const fetcherrmsg = formHandleParams[index]['errmsg'];
                                apiurl = fetchurl[0];
                                apifetch(apiurl, 'form-list', null);
                                apiurl = fetchurl[1];                       
                                apifetch(apiurl, 'submission-list', null);
                                          
                    } catch (error) {

                    } finally {
                 
                    }
        };

        useEffect(() => {     
                fetchOption();
        }, []);  
     
        return (
            <>
                <div class="new-form">
                    <h1>Create New Form <HandleReturn setFormAction={setFormAction} returnBtnLabel={returnBtnLabel} /> </h1>
                     {error && <div className="alert alert-danger" role="alert">{renderWithLineBreaks(error)}</div> }
                   { /*<div class="container">*/}
                        <form onSubmit={handleSubmitNewForm}>
                                <label for="form_name">Form Name</label>
                                <input type="text" required id="form_name" name="form_name" placeholder="Form name.." value={formData.form_name} onChange={handleSelectChange}/>
                                <label for="form_description">Form description</label>
                                <textarea id="form_description" required name="form_description" rows="3" placeholder="Please enter form description" value={formData.form_description} onChange={handleSelectChange} ></textarea>
                                <label for="form_instruction_message">Form instruction message</label>
                                <textarea id="form_instruction_message" required name="form_instruction_message" rows="3" placeholder="Please enter form instruction message" value={formData.form_instruction_message} onChange={handleSelectChange} ></textarea>
                                <label for="submission_success_message">Success message after form submission</label>
                                <textarea id="submission_success_message" required name="submission_success_message" rows="3" placeholder="Please enter form success message" value={formData.submission_success_message} onChange={handleSelectChange} ></textarea>
                                <label for="submission_failure_message">Failure message after form submission</label>
                                <textarea id="submission_failure_message" required name="submission_failure_message" rows="3" placeholder="Please enter form failure message" value={formData.submission_failure_message} onChange={handleSelectChange} ></textarea>
                                <label for="submit_button_text">Submit button text</label>
                                <input type="text" id="submit_button_text" name="submit_button_text" placeholder="Submit button text" value={formData.submit_button_text} onChange={handleSelectChange} />
                                <SelectForm formoptions={formoptions} submissionoptions={submissionOptions} selectedValue={formData} onSelectChange={handleSelectChange}/>
                                <button class="new-form-button">Submit</button>
                        </form>
                    {/*</div>*/}
                </div>
              
            </>
        );
   
    };

    export default Newform;