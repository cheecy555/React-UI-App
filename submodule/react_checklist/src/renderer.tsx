import { Translate } from 'next-translate';
import { FormHTMLAttributes, MutableRefObject, useEffect, useState } from 'react';

import { Box, Button, SxProps, ThemeProvider, Typography } from '@mui/material';

import { DynFormMode, filterDetails } from './common/lib';
import { Checklist, Details } from './common/types';
import {
    Date, DateTime, Email, File, Num, Phone, Rate, Richtext, SelectorSwitcher, Text, Time
} from './renderer-components';
import { maneyTheme } from './utils/theme';
import useDynForm, { FormController } from './utils/use-dynamic-form';
import jsonLogic from 'json-logic-js';

type DynFormProps = {
  data: Checklist['data']
  initData?: Parameters<typeof useDynForm>[0]
  formControllerRef?: MutableRefObject<FormController>
  formProps?: FormHTMLAttributes<HTMLFormElement>
  layoutProps?: SxProps
  noForm?: boolean
  onChange?: (formData: FormController['formData']) => void
  mode?: DynFormMode
  fieldLabel?: boolean
  t?: Translate
  allowListAppend?: boolean
}

export function DynForm({
  data,
  formControllerRef,
  formProps,
  layoutProps,
  noForm,
  initData,
  /*onChange: handleFormInputChange,*/
  onChange,
  mode,
  fieldLabel,
  t,
  allowListAppend
}: DynFormProps) {
  const formController = useDynForm(initData ?? [])

  if (formControllerRef) {
    formControllerRef.current = formController
  }

  if (noForm && formProps) {
    throw new Error('Cannot have formProps while specifying noForm')
  }

  const [inputShow, setInputShow] = useState([]);
  let details = filterDetails(data?.details, mode);
  useEffect(() => {
     details.map(item => {
            const existed = inputShow.some(i => i.field === item.field);
            if(!existed){
                const newItem = {  field: item.field , showInput: true }; 
                setInputShow(prevArray => [...prevArray, newItem]); 
            }
      });
      handleFormInputChange();
  }, [formController.formData ]);
  


  const handleFormInputChange = () =>{         
          let cond = null, state = null, condoperator = '', val=null, element=[], obj=null, rule = null, formdataobj={};
          /*const updateddetails = data.details.map(item => {*/
          const updateddetails = details.map(item => {
                condoperator = '';
                cond = item.stateConds[0].cond;
                state = item.stateConds[0].state;
                
                if(cond.length > 0 ){
                      if(cond.includes("and", "or")){
                            if(cond.includes('and')){
                                  condoperator = 'and';
                            }else{
                                  condoperator = 'or';
                            }
                      }else{
                            condoperator = '';
                      }
                      element = [];
                      cond.map((citem:any, index: number) => {
                              if(condoperator=='and' || condoperator=='or')
                              {
                                      if(typeof citem === 'object'){
                                          val = (typeof citem[2] === 'number') ? citem[2] : citem[2];
                                          obj = {[citem[1]]: [{ "var": citem[0] }, val] };
                                          element.push(obj);
                                      }
                                      rule = {[condoperator]:element};
                              }else{
                                     obj = {[citem[1]]: [{ "var": citem[0] }, val] };
                                     element.push(obj);
                                     rule = {element};
                              }
                                
                      });
                      
                      formController.formData.map((i:any, idx:number)=>{
                          val = (i.type == 'num' || i.type == 'rate') ? Number(i.value) : i.value;
                          formdataobj = {...formdataobj,[i.name]: val};
                      });
                        if(item.field == 'wargaemasnum'){
                         // alert(`cond.length : ${cond.length}, condoperator : ${condoperator}, rule: ${JSON.stringify(rule)}`);
                      }
                     /*return {...item, jsonlogicshow: jsonLogic.apply(rule, formdataobj) };*/
                     return {...item, showInput: jsonLogic.apply(rule, formdataobj) };
                }else{
                  return item;
                }
          });
           setInputShow(updateddetails);
  }

   let filteredData = null;

  console.log(`.inputShow: ${JSON.stringify(inputShow)}`);

   return (
    <ThemeProvider theme={maneyTheme}>
      <Box
        component={noForm ? 'div' : 'form'}
        sx={{ display: 'grid', ...layoutProps }}
        {...formProps}
      >
        {details?.map((chunk: Details, ix: number) => {
          if (fieldLabel) {
            chunk.text = chunk.field
          }
          
         // if(chunk.field == 'schoolname'){
              const foundItem = inputShow.find(item => item.field === chunk.field);
              //console.log(`foundItem?.field: ${foundItem?.field}`);

          //}
          
          if(foundItem?.showInput){
          //if(chunk.showInput){
                
                  switch (chunk.type) {
                      case 'text':
                          return (
                            <Text
                              chunk={chunk}
                              key={chunk.field + ix}
                              formController={formController}
                              t={t}
                            />
                          )
                      case 'num':
                          return (
                            <Num
                              chunk={chunk}
                              key={chunk.field + ix}
                              formController={formController}
                              t={t}
                            />
                          )
                      case 'email':
                          return (
                            <Email
                              chunk={chunk}
                              key={chunk.field + ix}
                              formController={formController}
                              t={t}
                            />
                          )
                      case 'phone':
                          return (
                            <Phone
                              chunk={chunk}
                              key={chunk.field + ix}
                              formController={formController}
                              t={t}
                            />
                          )
                      case 'file':
                      case 'photo':
                          return (
                            <File
                              chunk={chunk}
                              key={chunk.field + ix}
                              formController={formController}
                              t={t}
                            />
                          )
                      case 'radioGroup':
                      case 'radio':
                      case 'list':
                          return (
                            <SelectorSwitcher
                              chunk={chunk}
                              key={chunk.field + ix}
                              formController={formController}
                              t={t}
                              allowListAppend={allowListAppend}
                          />
                      )
                      case 'toggle':
                      case 'slider':
                      case 'rate':
                          return (
                            <Rate
                              chunk={chunk}
                              key={chunk.field + ix}
                              formController={formController}
                              t={t}
                            />
                          ) 
                      case 'geo':
                          return <></>
                      case 'date':
                          return (
                            <Date
                              chunk={chunk}
                              key={chunk.field + ix}
                              formController={formController}
                              t={t}
                            />
                          )
                      case 'time':
                          return (
                            <Time
                              chunk={chunk}
                              key={chunk.field + ix}
                              formController={formController}
                              t={t}
                            />  
                          )
                      case 'datetime':
                          return (
                            <DateTime
                              chunk={chunk}
                              key={chunk.field + ix}
                              formController={formController}
                              t={t}
                            />
                          )
                      case 'title':
                          return (
                              <Typography fontWeight="bold" key={chunk.field + ix}>
                                  {t ? t(chunk.text) : chunk.text}
                              </Typography>
                          )
                      case 'richtext':
                          return (
                              <Richtext
                                  chunk={chunk}
                                  key={chunk.field + ix}
                                  formController={formController}
                                  t={t}
                              />
                          )
                      default: {
                          console.log('Unhandled type: ' + chunk.type)
                          console.log(chunk)
                          return <></>
                      }
                  }
          }        


        })}
        {Boolean(formProps?.onSubmit) && <Button type="submit">submit</Button>}
      </Box>
    </ThemeProvider>
  )
}
