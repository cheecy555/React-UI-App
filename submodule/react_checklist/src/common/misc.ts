import { JSX } from 'react';
import useToggle from '../utils/use-toggle';

export function isObject(obj: any) {
    return obj instanceof Object && obj.constructor === Object
}


function sanitizeInput(v: any): string {
    if (v === undefined || v === null) v = ''
    if (isObject(v)) {
        if (v.hasOwnProperty('flags')) v = v.flags || ''
        else v = ''
    }
    return v
}

export function anyFlags(v, ...flags: string[]) {
    if (!v) return false
    v = sanitizeInput(v)
    return flags.some((f) => {
        if (f.length > 1) {
            return false
        }
        // console.log(f, v, v.indexOf(f))
        return v.indexOf(f) > -1
    })
}

export function hasFlags(v, ...flags: string[]) {
    if (!v) return false
    v = sanitizeInput(v)
    return flags.every((f) => {
      if (f && f.length > 1) {
        return false
      }
      // console.log(f, v, v.indexOf(f))
      return v.indexOf(f) > -1
    })
  }
  


export function encodeParams(params, prefix='') {
    const queryString = Object.keys(params).map(key => {
      const value = params[key];
      const prefixedKey = prefix ? `${prefix}[${key}]` : key;
  
      if (typeof value === 'object' && value !== null) {
        return encodeParams(value, prefixedKey);
      } else if(value) {
        return `${encodeURIComponent(prefixedKey)}=${encodeURIComponent(value)}`;
      }
    }).filter(f=> f?.length).join('&');
  
    return queryString;
  }

  type ToggleViewProps = {
    defaultOpen?: boolean
    children: (
      open: ReturnType<typeof useToggle>[0],
      toggleOpen: ReturnType<typeof useToggle>[1],
    ) => JSX.Element
  }

  export function ToggleView({ defaultOpen, children }: ToggleViewProps) {
    const [open, toggleOpen] = useToggle(defaultOpen)
  
    return children(open, toggleOpen)
  }