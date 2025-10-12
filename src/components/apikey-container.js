import React, { useState, useEffect, useRef, useMemo  } from 'react';
import { formHandleParams } from 'src/variable';

function APIKeyContainer({setShowLoader}) {     
      
      /* Cert and Url value */
      const [certError, setCertError] = useState('');
      const [urlError, setUrlError] = useState('');        
      const [urlSubmitError, setUrlSubmitError] = useState('');
      const [apiBaseError, setApiBaseUrlError] = useState('');
      const [formData, setFormData] = useState({ inputCert: '', fetchFormURL: '', fetchSubmissionURL:'', apibaseurl : '' });
      const [error, setError] = useState('');      
      const [infoMessage, setInfoMessage] = useState('');      
      //const [showloader, setShowLoader] = useState(false);
      const [showForm, setShowForm] = useState(true);
      const apifetch = async (frmData, apiurl, fetchtype, httpmethod) => {
        setShowLoader(true);
  	    let data = null;
	      try {
              let response;
              if(fetchtype == 'settings'){
                      response = 	await fetch(apiurl, { 
    					          method: httpmethod,
			                  headers: {'Content-Type': 'application/json; charset=UTF-8'}
					            });
              }else{
                      response = 	await fetch(apiurl, { 
    					          method: httpmethod,
			                  headers: {'Content-Type': 'application/json; charset=UTF-8'},
			                  body: JSON.stringify(frmData),
					            });
              }		       
		          if (!response.ok) {
		              throw new Error(`HTTP error! status: ${response.status}`);
		          }
		          data = await response.json();             
		          if(data==false){
                	
		          }else{
                    if(fetchtype == 'settings'){
                        let certval = '', urlval = '', submiturlval = '', apibaseurlval = '';  
                        if(data){
                              setCertError('Token Cert must be entered');
                              setUrlError('Fetch Checklist forms URL be entered');
                              setUrlSubmitError('Fetch forms submission URLs must be entered');
                              setApiBaseUrlError('API base Url must be entered');
                              if(data.apicert != false){
                                    certval = data.apicert;
                                    setCertError('');
                              }
                              if(data.apiurl != false){
                                  urlval =  data.apiurl; 
                                  setUrlError('');
                              }
                              if(data.formsubmiturl != false){
                                  submiturlval =  data.formsubmiturl; 
                                  setUrlSubmitError('');
                              }
                              if(data.apibaseurl != false){
                                  apibaseurlval =  data.apibaseurl; 
                                  setApiBaseUrlError('');
                              }
                              setFormData({ inputCert: certval, fetchFormURL: urlval, fetchSubmissionURL: submiturlval, apibaseurl: apibaseurlval});
                             setShowLoader(false);
                        }
                    }
                    if(fetchtype == 'save-settings'){
                          if(data.success){ 
                            setInfoMessage('Settings saved successfully.'); 
                            setShowForm(false);
                          }
                    }
              }
	      } catch (error) {
              let extraMessage = '';             
              if (error.message.includes('404')) {extraMessage += 'The requested resource was not found.'; }
              setError(`${error.message}. ${extraMessage}`);
	      } finally {
    		    setShowLoader(false);              
	      }
      };

      useEffect(() => {      
            const fetchOption = async () => {
                const index = formHandleParams.findIndex(item => item.key === 'settings');
                const apiurl = formHandleParams[index]['url'];
                apifetch (null, apiurl, 'settings', 'GET');
            };
            fetchOption();
      }, []);           
    
      const renderWithLineBreaks = (errormsg) => {
        return errormsg.split('\n').map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index < errormsg.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
      };   

    const handleChange = (e) => {              
                setFormData({ ...formData, [e.target.name]: e.target.value });
                setError('');
                setInfoMessage('');
    };
         
        const handleSaveSettings = async (event, typeflag, frmData) => {
            event.preventDefault();
            const index = formHandleParams.findIndex(item => item.key === typeflag);
            const apiurl = formHandleParams[index]['url'];          
            if(typeflag =='save-settings'){
                setCertError('');
                setUrlError('');
                setUrlSubmitError('');
                setApiBaseUrlError('');
                setError('');
                setInfoMessage('');
                if(formData.inputCert.trim()==''){
                    setCertError('Auth token must be entered.');
                }
                if(formData.fetchFormURL.trim()==''){
                    setUrlError('Fetch Checklist form Url must be entered.');
                }
                if(formData.fetchSubmissionURL.trim()==''){
                    setUrlSubmitError('Fetch form submission Url must be entered.');
                }
                 if(formData.apibaseurl.trim()==''){
                    setApiBaseUrlError('API base Url must be entered.');
                }
                if(formData.inputCert.trim() != '' && formData.fetchFormURL.trim() != '' && formData.fetchSubmissionURL.trim() != '' && formData.apibaseurl.trim() != '' ){
                           apifetch (formData, apiurl, typeflag, 'POST'); 
                }
            }
        };           
        
        const setEditSetting = () =>{
              setShowForm(true); 
              setInfoMessage('');
        }

        return (
        <>
         
<div class="accordion contact-class" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        <h3>Settings </h3>
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div class="accordion-body">
            {infoMessage && <div className="alert alert-info" role="alert">{renderWithLineBreaks(infoMessage)} <button class="new-form-button" onClick={setEditSetting}>Edit the Settings again</button>   </div> } 
            { showForm && (
              <form onSubmit={(e) => handleSaveSettings(e, 'save-settings', formData)}>
                <div className="alert alert-info" role="alert">Please fill in the <b>Auth Token</b>, <b>Fetch Forms Url</b> and <b>Fetch Submission</b> Urls and click the <b>Fetch Forms button</b>.</div>
                  {error && <div className="alert alert-danger" role="alert">{renderWithLineBreaks(error)}</div> } 
                <div class="mb-3">
                    <label for="inputCert" class="form-label">Auth Token</label>
                    <textarea class="form-control quickform-apikey-input" id="inputCert" name="inputCert" rows="4" value={formData.inputCert} onChange={handleChange} placeholder="Quick Form Cert.." ></textarea>
                    { certError && <div className="invalid-feedback">{certError}</div> }
                </div>
                <div class="mb-3">
                    <label for="apibaseurl" class="form-label">API Base URL</label>
                    <input type="text" class="form-control quickform-apikey-input" id="apibaseurl" name="apibaseurl" value={formData.apibaseurl} onChange={handleChange} placeholder="API Base Url"/>
                    {apiBaseError && <div className="invalid-feedback">{apiBaseError}</div> }
                </div>
                <div class="mb-3">
                    <label for="fetchFormURL" class="form-label">Fetch Forms URL</label>
                    <input type="text" class="form-control quickform-apikey-input" id="fetchFormURL" name="fetchFormURL" value={formData.fetchFormURL} onChange={handleChange} placeholder="URL to fetch forms list"/>
                    {urlError && <div className="invalid-feedback">{urlError}</div> }
                </div>
                <div class="mb-3">
                    <label for="fetchSubmissionsURL" class="form-label">Fetch Submissions URL</label>
                    <input type="text" class="form-control quickform-apikey-input" id="fetchSubmissionURL" name="fetchSubmissionURL" value={formData.fetchSubmissionURL} onChange={handleChange} placeholder="URL to fetch submission list"/>
                    {urlSubmitError && <div className="invalid-feedback">{urlSubmitError}</div> }
                </div>
                <div class="mb-3 text-center">
                    <button type="submit" class="btn btn-primary quickform-apikey-connect">Save Settings</button>
                </div>
                </form> 
            )}
      </div>
    </div>
  </div>
 
</div></>
);
      
   
    };

    export default APIKeyContainer;