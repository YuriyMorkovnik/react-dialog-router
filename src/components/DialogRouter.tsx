import React, { createContext, useContext, useState } from 'react'
import { last, slice, dropLast, isEmpty, append, propEq, findIndex, has, prop } from 'ramda'

export const switchCase = (cases: object) => (defaultCase: any) => (key: any) =>
  has(key, cases) ? prop(key, cases) : defaultCase instanceof Function ? defaultCase(key) : defaultCase

const DialogsContext = createContext({})

export const useDialogs = () => {
  return useContext(DialogsContext)
}

export const withDialogs = (Component: any) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const dialogContext = useContext(DialogsContext)
    return <Component {...props} dialogContext={dialogContext} />
  }
}
// {
//  'DIALOG_NAME': DialogComponent,
//  'DIALOG_NAME_2': DialogComponent2
// }
const getModalByType = (dialogs: object) => switchCase(dialogs)('div')

interface DialogHistoryItem {
  props: object;
  name: string;
}

// eslint-disable-next-line react/display-name
export const DialogRouterProvider = ({ children, dialogs }: any) => {
  // Primary dialog
  const [history, setHistory] = useState<DialogHistoryItem[]>([])
  const { name, props = {} } = last(history) || { name: null, props: {} }
  const isOpen = !isEmpty(history)

  const closeLastDialog = () => {
    setHistory(dropLast(1))
  }

  const closeAll = () => {
    setHistory([])
    setSecondaryHistory([])
  }

  const openDialog = (dialogConfig: any) => {
    setHistory(append(dialogConfig))
  }

  const goBackToName = (dialogName: any) => {
    if (isEmpty(history)) return
    const dialogIndex = findIndex(propEq(dialogName, 'name'))(history)
    setHistory(slice(0, dialogIndex + 1))
  }
  // Secondary dialog
  const [secondaryHistory, setSecondaryHistory] = useState<DialogHistoryItem[]>([])
  const { name: secondaryName, props: secondaryProps = {} } = last(secondaryHistory) || { name: null, props: {} }
  const isSecondaryOpen = !isEmpty(secondaryHistory)

  const openSecondaryDialog = (dialogConfig: any) => {
    setSecondaryHistory(append(dialogConfig))
  }

  const closeSecondaryDialog = () => {
    setSecondaryHistory(dropLast(1))
  }

  const DialogPrimary = getModalByType(dialogs)(name)
  const DialogSecondary = getModalByType(dialogs)(secondaryName)

  return (
    <DialogsContext.Provider
      value={{
        openDialog,
        closeAll,
        closeLastDialog,
        goBackToName,
        openSecondaryDialog,
        closeSecondaryDialog
      }}
    >
      {isOpen && (
        <DialogPrimary open={isOpen} onClose={closeAll} {...props} />
      )}
      {isSecondaryOpen && (
				<DialogSecondary open={isSecondaryOpen} onClose={closeAll} {...secondaryProps}/>
			)}
      {children}
    </DialogsContext.Provider>
  )
}
