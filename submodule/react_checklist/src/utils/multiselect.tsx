import { ComponentPropsWithoutRef, useId } from 'react';

import {
    FilledInput, FormControl, FormHelperText, InputLabel, OutlinedInput, Select
} from '@mui/material';

  export type MultiSelectProps = ComponentPropsWithoutRef<typeof Select> & {
    value: string[]
    helperText?: string
  }
  
  export function MultiSelect({
    value,
    children,
    label,
    helperText,
    ...props
  }: MultiSelectProps) {
    const generatedId = useId()
    const usedId = props.id ? props.id : generatedId
  
    return (
      <FormControl
        fullWidth
        {...(props.variant ? { variant: props.variant } : {})}
      >
        <InputLabel
          id={usedId + '-label'}
          sx={props.sx}
          {...(props.size ? { size: props.size as any } : {})}
        >
          {label}
        </InputLabel>
        <Select
          labelId={usedId + '-label'}
          id={usedId}
          multiple
          value={value}
          {...props}
          input={
            props.variant && props.variant == 'filled' ? (
              <FilledInput />
            ) : (
              <OutlinedInput label={label} />
            )
          }
          {...(!props.renderValue && {
            renderValue: (selected) =>
              {
                return Array.isArray(selected)
                  ? selected.join(', ')
                  : (selected as string)
              },
          })}
        >
          {children}
        </Select>
        {Boolean(helperText) && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    )
  }
  