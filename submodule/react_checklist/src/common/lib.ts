import { Translate } from 'next-translate';

import { FormController } from '../utils/use-dynamic-form';
import { anyFlags, encodeParams } from './misc';
import { Details } from './types';

export type ChunkProps = {
  chunk: Details
  formController?: FormController
  t?: Translate
  allowListAppend?: boolean
}

export type DynFormMode = 'V' | 'B' | 'BP' | 'BS'

export function filterDetails(details: Details[], mode: DynFormMode) {
  return !mode || !details
    ? details
    : mode == 'BP'
      ? details.filter(
        (d) => anyFlags(d.flags, 'B', '*') && anyFlags(d.flags, 'P', 'D'),
      )
      : mode == 'BS'
        ? details.filter(
          (d) => anyFlags(d.flags, 'B', '*') && !anyFlags(d.flags, 'P', 'D'),
        )
        : details.filter(
          (d) => d.flags?.includes('*') || d.flags.includes(mode),
        )
}

export function tr(t: Translate, tt: any) {
  if (!t || !tt) return tt
  return t(tt)
}


interface FileContent {
  lastModified: number
  name: string
  content: string | Blob
}

const endpoint = '/api/f'
const nonJWTendpoint = '/api/xuzapedifd'

export interface FileFormData {
  name: string
  value: string | Blob
  fileName?: string
}

type F_Response = {
  id: string
  fileName: string
}

export const postFile = async (
  fileFormData: FileContent[],
  aref?: string,
  perms = 'pub',
): Promise<F_Response[]> => {
  var formData = new FormData()

  for (const ff of fileFormData) {
    formData.append(ff.name, ff.content)
  }

  const q = {
    perms,
    aref,
  }

  const response = await fetch(`${endpoint}?${encodeParams(q)}`, {
    method: 'POST',
    body: formData,
  }).then(async (response) => {
    if (response.ok) {
      return response.json()
    } else {
      throw new Error(await response.text())
    }
  })

  return response.data
}