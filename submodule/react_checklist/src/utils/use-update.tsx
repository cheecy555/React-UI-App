import { useCallback, useState } from 'react';

export function useTransition(): [boolean, <T>(fn: () => Promise<T>) => void] {
    const [isPending, setPending] = useState(false)
  
    const update = useCallback(async (updateFn: () => Promise<any>) => {
      setPending(true)
      updateFn()
        .then((res) => {
          setPending(false)
        })
        .catch((err) => {
          setPending(false)
          throw err
        })
    }, [])
  
    return [isPending, update]
  }
  