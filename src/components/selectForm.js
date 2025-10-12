import React, { useState, useRef, useEffect } from 'react';


const SelectForm = ({ formoptions, submissionoptions, selectedValue, onSelectChange }) => {

return (
     <>
          <div class="mb-3">
                <label for="checklist_form_id">Select the CheckList form</label>
               <select required value={selectedValue.checklist_form_id} onChange={onSelectChange} class="form-select mw-100 form-control" name="checklist_form_id" id="checklist_form_id" aria-label="Select Check List Form">
                         <option selected value="">Select the CheckList Form</option>
                         {formoptions.map((option) => (
                              <option  key={option.value} value={option.value} >{option.label}</option>
                         ))} 
               </select>
          </div>
          <div class="mb-3">
                <label for="submission_url_id">Select form submission Url</label>
               <select required value={selectedValue.submission_url_id} onChange={onSelectChange} class="form-select mw-100 form-control" name="submission_url_id" id="submission_url_id" aria-label="Select Form Submission Url">
                         <option selected value="">Select a Submision URL</option>
                         {submissionoptions.map((option) => (
                              <option  key={option.value} value={option.value} >{option.label}</option>
                         ))} 
               </select>
          </div>         
         { /*<div class="mb-3">
                    <textarea class="form-control quickform-apikey-input" id="formsubmitresponse" name="formsubmitresponse" rows="12" value={selectedValue.formsubmitresponse} onChange={onSelectChange} placeholder="Form Submission Response Message Template" ></textarea>
          </div>*/ }
          
     </>
    
  );

};

export default SelectForm;