import { useReducer } from 'react'

export default function useToggle(
  initialState: boolean = false,
): [boolean, () => void] {
  return useReducer(toggle, initialState)
}

function toggle(s: boolean) {
  return !s
}
