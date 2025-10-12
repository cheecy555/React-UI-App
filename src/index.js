import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import 'bootstrap/dist/css/bootstrap.min.css';
import '/style/custom.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import CheckListFormHome from './checklistform-home';
import CheckListForm from './components/checklistform';
import 'bootstrap-icons/font/bootstrap-icons.css';

domReady( () => {
    
    const container = document.getElementById('render-checklist-form-container');
    if (container) {
        const formjson = CheckListFormReactAppData.formjson; 
        const root = createRoot(container);
        /*const root = createRoot(
                document.getElementById( 'root' )
        );*/
         root.render( <CheckListForm formjson={formjson}/> );
    }else{
         const root = createRoot(
                document.getElementById( 'root' )
        );
        root.render( <CheckListFormHome /> );
    }
    
} );