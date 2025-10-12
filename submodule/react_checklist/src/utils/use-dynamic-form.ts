import { Reducer, useCallback, useMemo, useReducer, useState } from 'react';

type FormValue = boolean | string | any[] | any

export type FormRow = {
  name: string
  value: FormValue
  percent?: boolean
  basis?: string
  flags?: string
  discount?: boolean
  taxincl?: boolean
  depKey?: string
  depKey2?: string
  depKeyMap?: {}
  type?: string
  qty?: number[]
  durationUom?: 'm' | 'h' | 'd'
}

export type FormController = Result

export type Result = {
    formData: FormRow[]
    updateForm: (value: FormRow[]) => void
    updateFormClean: (value: FormRow[]) => void
    clearForm: () => void
    formDirty: boolean
    register: (name: string, defaultVal?: any) => { name: string; value: any }
    registerCheckbox: (name: string) => { name: string; checked: any }
    registerMuiSpecial: (name: string) => { name: string; value: any }
  }


export default function useDynForm(init: FormRow[]): Result {
    const [formData, updateFormClean] = useReducer(
      formReducer as Reducer<FormRow[], FormRow[]>,
      init,
    )
    const [formDirty, setFormDirty] = useState(false)
  
    const clearForm = useCallback(() => {
      updateFormClean(init)
      setFormDirty(false)
    }, [])
  
    const register = useCallback(
      (name: string, defaultVal?: any) => {
        const temp = formData.find((row) => row.name == name)
        const value = (temp?.value || defaultVal)?.toString() || ''
  
        return {
          name: name,
          value,
          onChange: (e) => {
            const { name, value } = e.target
            updateFormClean([{ name, value }])
            setFormDirty(true)
          },
        }
      },
      [formData],
    )
  
    const registerCheckbox = useCallback(
      (name: string) => ({
        name: name,
        checked: formData.find((row) => row.name == name)?.value || false,
        onChange: (e) => {
          const { name, checked } = e.target
          updateFormClean([{ name, value: checked }])
          setFormDirty(true)
        },
      }),
      [formData],
    )
  
    const registerMuiSpecial = useCallback(
      (name: string) => ({
        name: name,
        value: formData.find((row) => row.name == name)?.value || '',
        onChange: (e, value) => {
          updateFormClean([{ name, value }])
          setFormDirty(true)
        },
      }),
      [formData],
    )
  
    const updateForm = useCallback((value: FormRow[]) => {
      updateFormClean(value)
      setFormDirty(true)
    }, [])
  
    return {
      formData,
      updateForm,
      updateFormClean,
      clearForm,
      formDirty,
      register,
      registerCheckbox,
      registerMuiSpecial,
    }
  }

  function formReducer(state: FormRow[], update: FormRow[]): FormRow[] {
    const stateNew = state.slice()
  
    for (const {
      name,
      value,
      percent,
      flags,
      basis,
      discount,
      taxincl,
      depKey,
      depKey2,
      type,
      qty,
      durationUom,
    } of update) {
      const updateIx = stateNew.findIndex(
        (row) =>
          row.name == name &&
          (depKey ? row.depKey === depKey : true) &&
          (depKey2 ? row.depKey2 === depKey2 : true),
      )
  
      if (updateIx == -1) {
        if (typeof value != 'undefined') {
          stateNew.push({
            name,
            value,
            percent,
            flags,
            basis,
            discount,
            depKey,
            depKey2,
            type,
            qty,
            durationUom,
          })
        }
      } else {
        const s = stateNew[updateIx]
        let splice = true
        if (typeof value != 'undefined') {
          s.value = value
          splice = false
        }
        if (typeof flags != 'undefined') {
          s.flags = flags
          splice = false
        }
        if (typeof percent != 'undefined') {
          s.percent = percent
          splice = false
        }
        if (typeof basis != 'undefined') {
          s.basis = basis
          splice = false
        }
        if (typeof discount != 'undefined') {
          s.discount = discount
          splice = false
        }
        if (typeof taxincl != 'undefined') {
          s.taxincl = taxincl
          splice = false
        }
        if (typeof depKey != 'undefined') {
          s.depKey = depKey
          splice = false
        }
        if (typeof depKey2 != 'undefined') {
          s.depKey2 = depKey2
          splice = false
        }
        if (typeof qty != 'undefined') {
          s.qty = qty
          splice = false
        }
  
        if (typeof durationUom != 'undefined') {
          s.durationUom = durationUom
          splice = false
        }
        if (splice) {
          stateNew.splice(updateIx, 1)
        }
      }
    }
  
    return stateNew
  }

  export function hasInitialized(fc: FormController, key: string) {
    return fc.formData.findIndex(({ name }) => name == key) > -1
  }
  