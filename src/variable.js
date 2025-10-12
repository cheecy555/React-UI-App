export const installpath = '/'; 

export const formHandleParams = [
            { 'key': 'fetch-form-details', 'url': `${installpath}/wp-json/quickform/v1/retrieve-forms-details`, 'errmsg':'...Quick forms Details retrieval returned error. This could be due to the following reasons:\n a.Invalid Form Cert\n b. Internet / Network problems\n c. Provider server downed.' },
            { 'key': 'submit-form', 'url': `${installpath}/wp-json/quickform/v1/submit-forms`, 'errmsg':'After form submission, these are the response from server provider.' },
            { 'key': 'fetch-form-list', 'url': `${installpath}/wp-json/checklistform/v1/fetch-form-listing`, 'errmsg':'' },
            { 'key': 'delete-form', 'url': `${installpath}/wp-json/checklistform/v1/delete-form`, 'errmsg':'' },
            { 'key': 'fetch-checklistform-list', 'url': [`${installpath}/wp-json/quickform/v1/retrieve-forms`,`${installpath}/wp-json/quickform/v1/retrieve-submissions`], 'errmsg':'Quick forms retrieval returned error. This could be due to the following reasons:\n a.Invalid Form Cert\n b.Invalid URL\n c. Internet / Network problems\n d. Provider server downed.' },
            { 'key': 'create-new-form', 'url': `${installpath}/wp-json/checklistform/v1/create-new-form`, 'errmsg':'' },
            { 'key': 'update-form', 'url': `${installpath}/wp-json/checklistform/v1/update-form`, 'errmsg':'' },
            { 'key': 'fetch-saved-form', 'url': `${installpath}/wp-json/checklistform/v1/savedform`, 'errmsg':'' },
            { 'key': 'settings', 'url': `${installpath}/wp-json/quickform/v1/apiformparams`, 'errmsg':'' },
            { 'key': 'save-settings', 'url': `${installpath}/wp-json/checklistform/v1/settings`, 'errmsg':'' },
        ];


          
                      
                      
                      