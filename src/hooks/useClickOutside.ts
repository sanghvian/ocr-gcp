import useEventListener from "./useEventListener"

export default function useClickOutside(ref:any, cb:any) {

    // Simple hook consuming our useEventListener hook and runs a passed callback if we click outside our reference element
    useEventListener(
      "click",
      (e:any) => {
        if (ref.current == null || ref.current.contains(e.target)) return
        cb(e)
      },
      window.document
    )
  }