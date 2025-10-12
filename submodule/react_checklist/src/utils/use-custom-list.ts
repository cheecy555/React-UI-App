import useSWRImmutable from 'swr/immutable';

export function useCustomListById(id: string) {
    return useSWRImmutable<any>(
      id ? `/api/data/lookups-exp?find={"id":"${id}"}` : null,
      fetch,
    )
  }

  