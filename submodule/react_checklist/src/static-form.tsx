import { MutableRefObject } from 'react';
import { markdownParser } from './utils/markdown';
import { FormController } from './utils/use-dynamic-form';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
    Box, Button, FormControl, FormLabel, Rating, Slider, SxProps, Typography as T
} from '@mui/material';

import { Checklist, Details } from './common/types';
import { MediaFilesView } from './utils/filesview';
import { strClamp } from './utils/string-clamp';

type ChunkProps = {
  chunk: Details
  formController?: FormController
  separate?: boolean
}

type StaticFormProps = {
  data: Checklist['data']
  formControllerRef?: MutableRefObject<FormController>
  layoutProps?: SxProps
  separate?: boolean
}

export function StaticForm({
  data,
  formControllerRef,
  layoutProps,
  separate,
}: StaticFormProps) {
  return (
    <Box sx={{ display: 'grid', ...layoutProps }}>
      {data?.details?.map((chunk: Details, ix: number) => {
        switch (chunk.type) {
          case 'num':
            return (
              <Num
                key={chunk.field}
                chunk={chunk}
                formController={formControllerRef.current}
                separate={separate}
              />
            )
          case 'text':
          case 'email':
          case 'phone':
          case 'radioGroup':
          case 'radio':
          case 'toggle':
          case 'slider':
          case 'rate':
          case 'list':
          case 'geo':
          case 'date':
          case 'time':
          case 'datetime':
            return (
              <Text
                key={chunk.field}
                chunk={chunk}
                formController={formControllerRef.current}
                separate={separate}
              />
            )
          case 'file':
          case 'image': {
            return (
              <File
                key={chunk.field}
                chunk={chunk}
                formController={formControllerRef.current}
                separate={separate}
              />
            )
          }
          case 'title':
            return (
              <T
                fontWeight="bold"
                key={chunk.field + ix}
                gridColumn="1 / -1"
                px={2}
              >
                {chunk.text}
              </T>
            )
          case 'richtext':
            return (
              <Richtext
                key={chunk.field}
                chunk={chunk}
                formController={formControllerRef.current}
                separate={separate}
              />
            )
          default: {
            return null
          }
        }
      })}
    </Box>
  )
}

function Text({ chunk, formController, separate }: ChunkProps) {
  const value =
    formController?.formData?.find(({ name }) => name == chunk.field)?.value ||
    'N/A'
  // console.log('StaticForm', { value, chunk })
  const displayValue =
    typeof value == 'boolean'
      ? value
        ? chunk.max || 'true'
        : chunk.min || 'false'
      : Array.isArray(value)
        ? value.join(', ')
        : typeof value == 'string' && value.includes('|')
          ? value.split('|').slice(1).join(' - ')
          : typeof value == 'string' || typeof value == 'number'
            ? value
            : value['name'] || JSON.stringify(value)

  return (
    <FormControl fullWidth {...(separate && { sx: { display: 'contents' } })}>
      <FormLabel>{chunk.text}</FormLabel>
      <T my="7px" border={1} borderColor="white">
        {displayValue}
      </T>
    </FormControl>
  )
}

function File({ chunk, formController, separate }: ChunkProps) {
  const value: Record<string, string> =
    formController?.formData?.find(({ name }) => name == chunk.field)?.value ||
    {}
  // console.log('StaticForm value', value)

  const fileList = Object.entries(value)

  return (
    <FormControl fullWidth {...(separate && { sx: { display: 'contents' } })}>
      <FormLabel>{chunk.text}</FormLabel>
      <Box
        my={{ xs: '8px', sm: '0px' }}
        py={1}
        display="flex"
        flexWrap="wrap"
        gap={1}
      >
        {fileList.map(([fileid, filename]) => (
          <Button
            key={fileid}
            variant="outlined"
            href={`/api/f/${fileid}`}
            download
            startIcon={<FileDownloadIcon />}
            title={filename}
          >
            {strClamp(filename, 24)}
          </Button>
        ))}
        {!fileList?.length && <span>N/A</span>}
      </Box>
    </FormControl>
  )
}

function Num({ chunk, formController, separate }: ChunkProps) {
  const value =
    formController?.formData?.find(({ name }) => name == chunk.field)?.value ||
    'N/A'

  const displayValue = chunk.unitNum ? `${value} ${chunk.unitNum}` : value

  return (
    <FormControl fullWidth {...(separate && { sx: { display: 'contents' } })}>
      <FormLabel>{chunk.text}</FormLabel>
      <T my="7px" border={1} borderColor="white">
        {displayValue}
      </T>
    </FormControl>
  )
}

function Richtext({ chunk, formController, separate }: ChunkProps) {
  const value =
    formController?.formData?.find(({ name }) => name == chunk.field)?.value ||
    'N/A'

  return (
    <FormControl fullWidth {...(separate && { sx: { display: 'contents' } })}>
      <Box
        dangerouslySetInnerHTML={{
          __html: markdownParser(chunk.text),
        }}
      />
    </FormControl>
  )
}

type PriceDataRow = {
  key: string
  type: string
  title: string

  files?: Record<string, string>
  val?: number
  value?: number
  text?: string | Boolean
  list?: string[]

  limit?: any
  max?: any
  min?: any
  unitNum?: string
}

type StaticPriceFormProps = {
  data: PriceDataRow[]
  layoutProps?: SxProps
}

export function StaticPriceForm({ data, layoutProps }: StaticPriceFormProps) {
  return (
    <Box sx={layoutProps}>
      {data.map((row) => {
        switch (row.type) {
          case 'text':
          case 'num': {
            return <TextRow key={row.key} row={row} />
          }
          case 'list':
          case 'radioGroup':
          case 'radio': {
            return <ListRow key={row.key} row={row} />
          }
          case 'toggle':
            return <RateRowBinary key={row.key} row={row} />
          case 'slider':
            return <SliderRow key={row.key} row={row} />
          case 'rate': {
            return <RateRow key={row.key} row={row} />
          }
          case 'file': {
            return <FileRow key={row.key} row={row} />
          }
          default: {
            return <></>
          }
        }
      })}
    </Box>
  )
}

type RowProps = {
  row: PriceDataRow
}

function RateRow({ row }: RowProps) {
  return (
    <FormControl>
      <FormLabel>{row.title}</FormLabel>
      <Rating readOnly value={row.val} max={row.limit} />
    </FormControl>
  )
}

function SliderRow({ row }: RowProps) {
  return (
    <FormControl>
      <FormLabel>{row.title}</FormLabel>
      <T>
        {row.val?.toString() || 'N/A'}/{row.limit}
      </T>
      {/* <Box display="flex" gap={1} alignItems="center">
        <span>0</span>
        <Slider value={row.val ?? 0} max={row.limit} />
        <span>{row.limit}</span>
      </Box> */}
    </FormControl>
  )
}

function RateRowBinary({ row }: RowProps) {
  const max = row.max || 'Yes'
  const min = row.min || 'No'
  const isYessed = Boolean(row.val)

  return (
    <FormControl>
      <FormLabel>{row.title}</FormLabel>
      <T>
        <T
          component="span"
          sx={{ textDecoration: !isYessed ? 'line-through' : 'initial' }}
        >
          {max}
        </T>
        &nbsp;/&nbsp;
        <T
          component="span"
          sx={{ textDecoration: isYessed ? 'line-through' : 'initial' }}
        >
          {min}
        </T>
      </T>
    </FormControl>
  )
}

function TextRow({ row }: RowProps) {
  return (
    <FormControl>
      <FormLabel>{row.title}</FormLabel>
      <T>
        {row.text.toString() || 'N/A'}&nbsp;
        {row.unitNum}
      </T>
    </FormControl>
  )
}

function ListRow({ row }: RowProps) {
  return (
    <FormControl>
      <FormLabel>{row.title}</FormLabel>
      <T>{row.text?.toString() || row.list.join(', ') || 'N/A'}</T>
    </FormControl>
  )
}

function FileRow({ row }: RowProps) {
  const files = Object.entries(row.files ?? {})
  return (
    <FormControl>
      <FormLabel>{row.title}</FormLabel>
      {!files.length && <T>N/A</T>}
      <MediaFilesView
        files={files?.map(([id, name]) => {
          return {
            id,
            name,
          }
        })}
      />
    </FormControl>
  )
}
