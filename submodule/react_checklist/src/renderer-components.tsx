import useTranslation from 'next-translate/useTranslation';
import { JSX, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFilePicker } from 'use-file-picker';
import { markdownParser } from './utils/markdown';
import { hasInitialized } from './utils/use-dynamic-form';
import { useTransition } from './utils/use-update';

import AttachmentIcon from '@mui/icons-material/Attachment';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup,
    FormHelperText, FormLabel, IconButton, InputAdornment, ListItemText, MenuItem, OutlinedInput,
    Radio, RadioGroup, Rating, Select, Slider, Stack, Switch, TextareaAutosize, TextField,
    Typography
} from '@mui/material';

import { ChunkProps, postFile } from './common/lib';
import { hasFlags } from './common/misc';
import { MultiSelect } from './utils/multiselect';
import { EditorController } from './utils/rte';
import { useCustomListById } from './utils/use-custom-list';

export function Text({ chunk, formController, t }: ChunkProps) {
  // console.log('DynForm Text', chunk)

  useEffect(() => {
    if (
      formController.formData.findIndex(({ name }) => name == chunk.field) == -1
    ) {
      formController?.updateFormClean([
        { name: chunk.field, value: '', type: chunk.type },
      ])
    }
    return () => {
      formController?.updateFormClean([
        { name: chunk.field, value: undefined, type: chunk.type },
      ])
    }
  }, [])

  return (
    <FormControl fullWidth required={chunk.required}>
      <FormLabel>{t ? t(chunk.text) : chunk.text}</FormLabel>
      <OutlinedInput
        size="small"
        multiline={chunk.maxlines > 1}
        rows={chunk.maxlines}
        placeholder={t ? t(chunk.label) : chunk.label}
        {...(!!chunk.maxlength && {
          inputProps: { maxLength: chunk.maxlength },
        })}
        {...formController?.register(chunk.field)}
      />
      <FormHelperText sx={{ m: 0, p: 0 }}>
        {t
          ? t(chunk.description || chunk?.['placeholder'])
          : chunk.description || chunk?.['placeholder']}
      </FormHelperText>
    </FormControl>
  )
}

export function Num({ chunk, formController, t }: ChunkProps) {
  // console.log('DynForm', chunk)

  // function validate(e) {
  //   const value = e.target.value
  //   if (chunk.min && !isNaN(chunk.min) && value < chunk.min)
  //     setError('minimum ' + chunk.min)
  //   else if (chunk.max && !isNaN(chunk.max) && value > chunk.max)
  //     setError('maximum ' + chunk.max)
  //   else setError('')
  // }

  useEffect(() => {
    if (!hasInitialized(formController, chunk.field)) {
      formController?.updateFormClean([
        {
          name: chunk.field,
          value: chunk.defaultValue ?? '0',
          type: chunk.type,
        },
      ])
    }
    return () => {
      formController?.updateFormClean([
        { name: chunk.field, value: undefined, type: chunk.type },
      ])
    }
  }, [])

  return (
    <FormControl
      fullWidth
      required={chunk.required}
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        columnGap: 2,
      }}
    >
      <Stack>
        <FormLabel>{t ? t(chunk.text) : chunk.text}</FormLabel>
        <FormHelperText
          sx={{ m: 0, p: 0, display: { xs: 'none', sm: 'initial' } }}
        >
          {t
            ? t(chunk.description || chunk?.['placeholder'])
            : chunk.description || chunk?.['placeholder']}
        </FormHelperText>
      </Stack>
      <Stack minWidth="10rem">
        <OutlinedInput
          type="number"
          size="small"
          fullWidth
          placeholder={t ? t(chunk.label) : chunk.label}
          inputProps={{
            min: chunk.min,
            max: chunk.max,
          }}
          endAdornment={
            Boolean(chunk.unitNum) && (
              <InputAdornment position="end">{chunk.unitNum}</InputAdornment>
            )
          }
          {...formController?.register(chunk.field)}
        />
        <FormHelperText
          sx={{ m: 0, p: 0, display: { xs: 'initial', sm: 'none' } }}
        >
          {t
            ? t(chunk.description || chunk?.['placeholder'])
            : chunk.description || chunk?.['placeholder']}
        </FormHelperText>
      </Stack>
    </FormControl>
  )
}

export function Email({ chunk, formController, t }: ChunkProps) {
  useEffect(() => {
    if (!hasInitialized(formController, chunk.field)) {
      formController?.updateFormClean([
        { name: chunk.field, value: '', type: chunk.type },
      ])
    }
    return () => {
      formController?.updateFormClean([
        { name: chunk.field, value: undefined, type: chunk.type },
      ])
    }
  }, [])

  return (
    <FormControl fullWidth required={chunk.required}>
      <FormLabel>{t ? t(chunk.text) : chunk.text}</FormLabel>
      <OutlinedInput
        type="email"
        size="small"
        placeholder={t ? t(chunk.label) : chunk.label}
        {...formController?.register(chunk.field)}
      />
      <FormHelperText>
        {t
          ? t(chunk.description || chunk?.['placeholder'])
          : chunk.description || chunk?.['placeholder']}
      </FormHelperText>
    </FormControl>
  )
}

export function Phone({ chunk, formController, t }: ChunkProps) {
  useEffect(() => {
    if (!hasInitialized(formController, chunk.field)) {
      formController?.updateFormClean([{ name: chunk.field, value: '' }])
    }
    return () => {
      formController?.updateFormClean([{ name: chunk.field, value: undefined }])
    }
  }, [])

  return (
    <FormControl fullWidth required={chunk.required}>
      <FormLabel>{t ? t(chunk.text) : chunk.text}</FormLabel>
      <OutlinedInput
        type="tel"
        size="small"
        placeholder={t ? t(chunk.label) : chunk.label}
        inputProps={{ pattern: '[0-9+][0-9-+ ]+[0-9]' }}
        {...formController?.register(chunk.field)}
      />
      <FormHelperText>
        {t
          ? t(chunk.description || chunk?.['placeholder'])
          : chunk.description || chunk?.['placeholder']}
      </FormHelperText>
    </FormControl>
  )
}

export function File({
  chunk,
  formController,
  t: t2,
}: ChunkProps): JSX.Element {
  const { t } = useTranslation('common')
  // const prevProps = useRef<any>(null)
  // const value = useRef<any>(null)
  // const onChange = useRef<any>(null)
  const [isUpdating, update] = useTransition()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const limit =
    chunk.limit ||
    (typeof chunk.multi !== 'undefined' && !chunk.multi && 1) ||
    -1

  const t_failed = t('Failed to upload file')
  const t_limitOne = t('Limit one file')
  const t_limit = t('Limit {{limit}} files', { limit })
  const t_limitFile = t('File upload limit is {{limit}}', { limit })
  const t_tooMany = t('Too many files. Limit is {{limit}}', { limit })

  const row = formController?.formData?.find((row) => row.name == chunk.field)
  const filenames = row
    ? Object.entries(row.value).map(([fileid, filename]) => filename)
    : []

  useEffect(() => {
    if (Number(limit) === -1) return
    if (filenames.length > Number(limit)) {
      inputRef.current?.setCustomValidity(t_tooMany)
      toast(t_tooMany)
    } else {
      inputRef.current?.setCustomValidity('')
    }
  }, [filenames.length])

  const { openFilePicker, plainFiles, clear } = useFilePicker({
    accept: chunk.type == 'file' ? '*' : 'image/*',
    multiple: limit !== 1,
  })

  useEffect(() => {
    if (plainFiles?.length) {
      update(async () => {
        try {
          const fileRes = await postFile(
            plainFiles.map((file) => ({
              lastModified: 0,
              name: file.name,
              content: file,
            })),
          )
          const newFileValue = Object.fromEntries(
            fileRes.map((fileData) => [fileData.id, fileData.fileName]),
          )
          const fileValue = {
            ...(row?.value ?? {}),
            ...newFileValue,
          }
          formController.updateForm([
            { name: chunk.field, value: fileValue, type: chunk.type },
          ])
          clear()
        } catch (err) {
          console.error(err.message)
          toast(t_failed)
        }
      })
    }
  }, [plainFiles])

  // console.log('file props', props)
  // console.log('file onchange', onChange)
  // console.log('limit', limit, chunk.limit, chunk.multi)
  // console.log('file chunk', chunk)
  //logObj('filechunk', chunk)

  return (
    <FormControl
      fullWidth
      required={chunk.required}
      sx={{ display: 'grid', gap: 1 }}
    >
      <FormLabel>{t2 ? t2(chunk.text) : chunk.text}</FormLabel>

      {limit === -1 ? null : (
        <FormHelperText sx={{ m: 0, p: 0, mt: -1 }}>
          {limit === 1 ? t_limitOne : t_limit}
        </FormHelperText>
      )}
      {Object.entries(row?.value ?? {}).map(([fileid, filename]) => (
        <Box
          key={fileid}
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid lightgray',
            borderRadius: 1,
            justifyContent: 'space-between',
            pl: 2,
            pr: 1,
          }}
        >
          <Typography>{filename as string}</Typography>
          <IconButton
            onClick={() => {
              const stripped = Object.assign({}, row.value)
              delete stripped[fileid]
              formController.updateForm([
                { name: chunk.field, value: stripped },
              ])
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ))}
      <div style={{ position: 'relative', display: 'contents' }}>
        <input
          ref={inputRef}
          required={chunk.required}
          value={filenames?.join(', ') ?? ''}
          onChange={() => undefined}
          tabIndex={-1}
          style={{
            pointerEvents: 'none',
            position: 'absolute',

            left: 0,
            bottom: 0,
            width: '100%',
            outline: 'none',
            border: 'none',
            caretColor: 'white',
            color: 'white',
          }}
        />
        <Button
          variant="outlined"
          sx={{ background: 'white' }}
          startIcon={
            isUpdating ? <CircularProgress size={16} /> : <AttachmentIcon />
          }
          onClick={() => {
            if (Number(limit) !== -1 && filenames.length >= Number(limit)) {
              return toast(t_limitFile)
            }
            openFilePicker()
          }}
          disabled={isUpdating}
        >
          {t('add files')}
        </Button>
      </div>
    </FormControl>
  )
}

/* <OutlinedInput
  size="small"
  required={chunk.required}
  disabled={updateStatus == 'loading'}
  inputProps={{
    onClick: openFilePicker,
  }}
  value={
    updateStatus == 'loading' ? 'Uploading... ' : filenames.join(', ')
  }
  onChange={(e) => undefined}
  onKeyDown={(e) => {
    if (e.key == ' ' || e.key == 'Enter') {
      e.preventDefault()
      openFilePicker()
    }
  }}
  style={{ caretColor: 'transparent' }}
  startAdornment={<AttachmentIcon sx={{ mr: 2 }} />}
  endAdornment={
    updateStatus != 'loading' &&
    Boolean(filenames?.length) && (
      <IconButton
        onClick={() => {
          formController.updateForm([{ name: chunk.field, value: {} }])
        }}
      >
        <CloseIcon />
      </IconButton>
    )
  }
/> */

export function Rate({ chunk, formController, t }: ChunkProps) {
  const min = Number.isInteger(chunk.min) ? chunk.min : 0
  const max = Number.isInteger(chunk.max) ? chunk.max : Number(chunk.limit)
  const hasTextLabels =
    typeof chunk.min === 'string' &&
    chunk.min &&
    typeof chunk.max === 'string' &&
    chunk.max

  useEffect(() => {
    if (!hasInitialized(formController, chunk.field)) {
      if (chunk.limit === 1) {
        formController?.updateFormClean([
          { name: chunk.field, value: false, type: chunk.type },
        ])
      } else {
        formController?.updateFormClean([
          {
            name: chunk.field,
            value: chunk.defaultValue ?? '0',
            type: chunk.type,
          },
        ])
      }
    }
    return () => {
      formController?.updateFormClean([{ name: chunk.field, value: undefined }])
    }
  }, [])

  return (
    <FormControl
      fullWidth
      required={chunk.required}
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        columnGap: 2,
      }}
    >
      <FormLabel>{t ? t(chunk.text) : chunk.text}</FormLabel>

      {Number(chunk.limit) == 1 ? (
        <Stack direction="row" gap={2} alignItems="center">
          {hasTextLabels && (
            <Typography component="span">
              {t ? t(chunk.min) : chunk.min}
            </Typography>
          )}
          <Switch {...formController?.registerCheckbox(chunk.field)} />
          {hasTextLabels && (
            <Typography component="span">
              {t ? t(chunk.max) : chunk.max}
            </Typography>
          )}
        </Stack>
      ) : Number(chunk.limit) > 5 ? (
        <Stack direction="row" gap={2} alignItems="center">
          {hasTextLabels && (
            <Typography>{t ? t(chunk.min) : chunk.min}</Typography>
          )}
          <Slider
            sx={{ maxWidth: 'min(300px, 40%)', minWidth: '7.5rem' }}
            step={1}
            marks
            min={min}
            max={max}
            valueLabelDisplay="on"
            {...{
              ...formController?.register(chunk.field),
              value: Number(formController?.register(chunk.field).value),
            }}
          />
          {hasTextLabels && (
            <Typography>{t ? t(chunk.max) : chunk.max}</Typography>
          )}
        </Stack>
      ) : (
        <Rating
          max={Number(chunk.limit) || 5}
          {...{
            ...formController?.register(chunk.field),
            value: Number(formController?.register(chunk.field).value),
          }}
        />
      )}
    </FormControl>
  )
}

export function RadioField({ chunk, formController, t }: ChunkProps) {
  if (!chunk.list) console.error("Component can't render")
  // console.log('RadioField', chunk)

  const { data } = useCustomListById(chunk.list?.toString())
  const clist = data?.length
    ? data[0].data.objlist || data[0].data.list || []
    : []

  const val = formController.formData?.find((f) => f.name === chunk.field)
  return (
    <FormControl fullWidth required={chunk.required}>
      <FormLabel>{t ? t(chunk.text) : chunk.text}</FormLabel>
      <RadioGroup {...formController?.register(chunk.field)}>
        {clist.map((ii, ix) => {
          const [flag, title, desc] =
            typeof ii == 'string' ? ii.split('|') : [ii['name'], ii['name'], '']

          return (
            <FormControlLabel
              key={title}
              control={<Radio />}
              name={chunk.field}
              value={title}
              label={
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                  }}
                >
                  <ListItemText
                    primary={t ? t(title) : title}
                    secondary={desc}
                  />
                  {val?.value == title && hasFlags(chunk.flags, 'q') && (
                    <TextField
                      onChange={(v) => {
                        formController?.updateFormClean([
                          {
                            name: chunk.field,
                            value: val?.value,
                            qty: [Number(v.target.value)],
                          },
                        ])
                      }}
                      required
                      type="number"
                      sx={{ maxWidth: 80 }}
                      inputProps={{ min: chunk.min, max: chunk.max }}
                      InputProps={{ endAdornment: chunk.unitNum }}
                      size="small"
                      variant="standard"
                    />
                  )}
                </Box>
              }
            />
          )
        })}

        <Radio
          required={chunk.required}
          sx={{
            /* horrible hack */
            visibility: 'hidden',
            height: 0,
            padding: 0,
            pointerEvents: 'none',
          }}
        />
      </RadioGroup>
    </FormControl>
  )
}

export function CheckboxGroup({ chunk, formController, t }: ChunkProps) {
  if (!chunk.list) console.error("Component can't render")
  // console.log(chunk)
  const { data } = useCustomListById(chunk.list as string)
  const clist = data?.length
    ? data[0].data.objlist || data[0].data.list || []
    : []

  const row = formController?.formData?.find((row) => row.name == chunk.field)
  const selected = Array.isArray(row?.value) ? row.value : []
  const qtyArray = row?.qty || []

  const limit: number = Number(chunk.limit)
  const atLimit = limit > 0 && selected.length >= limit

  return (
    <FormControl fullWidth required={chunk.required}>
      <FormLabel>{t ? t(chunk.text) : chunk.text}</FormLabel>
      <FormGroup sx={{ alignItems: 'flex-start' }}>
        <input
          type="checkbox"
          tabIndex={-1}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            opacity: 0,
          }}
          required={chunk.required && !selected.length}
        />
        {clist.map((ii, ix) => {
          function splitString(s: string) {
            const split = s.split('|')
            if (split.length > 1) {
              return split
            }
            return [split[0], split[0], '']
          }

          let [flag, title, desc] =
            typeof ii == 'string'
              ? splitString(ii)
              : [ii['name'], ii['name'], '']

          const candidate = flag || ii?.name
          const isChecked = selected.includes(candidate)

          // logObj('limit', limit)

          function handleCheckChange(e, checked) {
            if (checked) {
              formController?.updateForm([
                {
                  name: chunk.field,
                  value: selected.concat(candidate),
                  type: chunk.type,
                },
              ])
            } else {
              formController?.updateForm([
                {
                  name: chunk.field,
                  value: selected.filter((s) => s != candidate),
                  type: chunk.type,
                },
              ])
            }
          }

          function handleQtyChange(v) {
            if (!isChecked) return
            formController?.updateForm([
              {
                name: chunk.field,
                value: selected,
                type: chunk.type,
                qty: clist?.map((s, idx) => {
                  if (idx === ix) {
                    return Number(v)
                  } else {
                    return Number(qtyArray?.[idx] ?? 1)
                  }
                }),
              },
            ])
          }
          // logObj('ix', ix)
          // logObj('qtyArray', qtyArray)

          return (
            <FormControlLabel
              key={title}
              disableTypography
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <ListItemText
                    primary={t ? t(title) : title}
                    secondary={t ? t(desc) : desc}
                  />
                  {isChecked && hasFlags(chunk.flags, 'q') && (
                    <TextField
                      value={qtyArray?.[ix] ?? 1}
                      onChange={(v) => {
                        handleQtyChange(v.target.value)
                      }}
                      required
                      type="number"
                      sx={{ maxWidth: 80 }}
                      inputProps={{ min: chunk.min, max: chunk.max }}
                      InputProps={{ endAdornment: chunk.unitNum }}
                      size="small"
                      variant="standard"
                    />
                  )}
                </Box>
              }
              disabled={!isChecked && atLimit}
              checked={isChecked}
              onChange={handleCheckChange}
              control={<Checkbox sx={{ alignSelf: 'end' }} />}
            />
          )
        })}
      </FormGroup>
    </FormControl>
  )
}

export function ListView(props: ChunkProps) {
  const chunk = props.chunk
  if (!chunk.list) console.error("Component can't render")
  // console.log('list chunk', chunk)
  if (chunk.multi || (typeof chunk.limit == 'number' && chunk.limit != 1)) {
    return <MultiSelectListView {...props} />
  }
  return <SingleSelectListView {...props} />
}

export function SingleSelectListView({ chunk, formController, t }: ChunkProps) {
  const { data } = useCustomListById(chunk.list?.toString())
  const clist = data?.length
    ? data[0].data.objlist || data[0].data.list || []
    : []
  // if (clist) console.log('custom list', clist)

  return (
    <FormControl fullWidth required={chunk.required}>
      <FormLabel>{t ? t(chunk.text) : chunk.text}</FormLabel>
      <Select size="small" {...formController?.register(chunk.field)}>
        {clist?.map((item) => {
          const [flag, title, desc] =
            typeof item == 'string'
              ? item.split('|')
              : [item['name'], item['name'], '']
          return (
            <MenuItem value={flag} key={flag}>
              {title ? (
                <ListItemText
                  primary={t ? t(title) : title}
                  secondary={t ? t(desc) : desc}
                />
              ) : t ? (
                t(flag)
              ) : (
                flag
              )}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

export function MultiSelectListView({ chunk, formController, t }: ChunkProps) {
  const { data } = useCustomListById(chunk.list as string)
  const clist = data?.length
    ? data[0].data.objlist || data[0].data.list || []
    : []

  const row = formController?.formData?.find((row) => row.name == chunk.field)
  const selected = Array.isArray(row?.value) ? row.value : []

  const limit: number = Number(chunk.limit)
  const atLimit = limit > 0 && selected.length >= limit

  return (
    <FormControl fullWidth required={chunk.required}>
      <FormLabel>{t ? t(chunk.text) : chunk.text}</FormLabel>
      <MultiSelect
        required={chunk.required}
        size="small"
        value={selected}
        onChange={(e) => {
          // console.log('MultiSelectListView', e.target.value)
          formController.updateForm([
            { name: chunk.field, value: e.target.value as any },
          ])
        }}
      >
        {clist?.map((item) => {
          const [flag, title, desc] =
            typeof item == 'string'
              ? item.split('|')
              : [item['name'], item['name'], '']

          const isChecked = selected.includes(flag)

          return (
            <MenuItem value={flag} key={flag} disabled={!isChecked && atLimit}>
              <Checkbox checked={isChecked} />
              {title ? (
                <ListItemText
                  primary={t ? t(title) : title}
                  secondary={t ? t(desc) : desc}
                />
              ) : t ? (
                t(flag)
              ) : (
                flag
              )}
            </MenuItem>
          )
        })}
      </MultiSelect>
    </FormControl>
  )
}

export function DateTime({ chunk, formController }: ChunkProps) {
  return (
    <FormControl fullWidth required={chunk.required}>
      <FormLabel>{chunk.text}</FormLabel>
      <OutlinedInput
        type="datetime-local"
        placeholder={chunk.label}
        {...formController?.register(chunk.field)}
      />
    </FormControl>
  )
  // return (
  //   <TextField
  //     // name={chunk.field}
  //     label={chunk.text}
  //     type="datetime-local"
  //     placeholder={chunk.label}
  //     required={chunk.required}
  //     sx={{ width: 220 }}
  //     InputLabelProps={{
  //       shrink: true,
  //     }}
  //     {...formController?.register(chunk.field)}
  //   />
  // )
}

export function Time({ chunk, formController }: ChunkProps) {
  return (
    <FormControl fullWidth required={chunk.required}>
      <FormLabel>{chunk.text}</FormLabel>
      <OutlinedInput
        type="time"
        placeholder={chunk.label}
        {...formController?.register(chunk.field)}
      />
    </FormControl>
  )
  // return (
  //   <TextField
  //     // name={chunk.field}
  //     label={chunk.text}
  //     type="time"
  //     placeholder={chunk.label}
  //     required={chunk.required}
  //     sx={{ width: 220 }}
  //     InputLabelProps={{
  //       shrink: true,
  //     }}
  //     {...formController?.register(chunk.field)}
  //   />
  // )
}

export function Date({ chunk, formController }: ChunkProps) {
  return (
    <FormControl fullWidth required={chunk.required}>
      <FormLabel>{chunk.text}</FormLabel>
      <OutlinedInput
        type="date"
        placeholder={chunk.label}
        {...formController?.register(chunk.field)}
      />
    </FormControl>
  )
  // return (
  //   <TextField
  //     // name={chunk.field}
  //     label={chunk.text}
  //     type="date"
  //     placeholder={chunk.label}
  //     required={chunk.required}
  //     sx={{ width: 220 }}
  //     InputLabelProps={{
  //       shrink: true,
  //     }}
  //     {...formController?.register(chunk.field)}
  //   />
  // )
}

export function SelectorSwitcher(props: ChunkProps) {
  const { chunk, formController, allowListAppend, t } = props
  const { data } = useCustomListById(chunk.list as any)
  const clist = data?.length
    ? data[0].data.objlist ?? data[0].data.list ?? []
    : []
  // console.log('SelectorSwitcher', { chunk, data })

  /**maney/many-web#422
   * Hide this question according to parent directive
   */
  if (hasFlags(chunk.flags, '-') || !chunk.field) {
    return null
  }
  if (allowListAppend) {
    const val = formController.formData?.find((f) => f.name === chunk.field)
      ?.value
    const initVal =
      typeof val == 'string'
        ? val?.split('\n')
        : Array.isArray(val)
          ? val.join('\n')
          : null
    return (
      <FormControl fullWidth required={chunk.required}>
        <FormLabel>{t ? t(chunk.text) : chunk.text}</FormLabel>
        <TextareaAutosize
          value={initVal}
          style={{ resize: 'vertical', maxHeight: 200 }}
          onChange={(e) => {
            formController?.updateFormClean([
              {
                name: chunk.field,
                type: chunk.type,
                value: e.target.value?.split('\n'),
              },
            ])
          }}
          aria-label="SelectorSwitcher"
          placeholder={'Enter to add more options'}
        />
      </FormControl>
    )
  }

  if (clist.length < 5 || hasFlags(chunk.flags, 'q')) {
    return chunk.limit && Number(chunk.limit) == 1 ? (
      <RadioField {...props} />
    ) : (
      <CheckboxGroup {...props} />
    )
  }

  return (
    <ListView chunk={chunk} key={chunk.field} formController={formController} />
  )
}

export function Richtext({ chunk, formController, t }: ChunkProps) {
  const editorRef = useRef<EditorController | null>(null)
  const [content, setContent] = useState('')
  useEffect(() => {
    if (
      formController.formData.findIndex(({ name }) => name == chunk.field) == -1
    ) {
      formController?.updateFormClean([
        { name: chunk.field, value: '', type: chunk.type },
      ])
    }
    return () => {
      formController?.updateFormClean([
        { name: chunk.field, value: undefined, type: chunk.type },
      ])
    }
  }, [])

  return (
    <FormControl fullWidth required={chunk.required}>
      <Box
        dangerouslySetInnerHTML={{
          __html: markdownParser(chunk.text),
        }}
      />
      <FormHelperText sx={{ m: 0, p: 0 }}>
        {t
          ? t(chunk.description || chunk?.['placeholder'])
          : chunk.description || chunk?.['placeholder']}
      </FormHelperText>
    </FormControl>
  )
}
