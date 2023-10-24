import React, { createContext, useContext, useState, FunctionComponent } from 'react'
import { last, slice, dropLast, isEmpty, append, propEq, findIndex, has, prop } from 'ramda'

export const switchCase = (cases: object) => (defaultCase: any) => (key: any) =>
  has(key, cases) ? prop(key, cases) : defaultCase instanceof Function ? defaultCase(key) : defaultCase

type DialogObj = { name: string, props: object }

type ContextObject = {
  openDialog: (obj: DialogObj) => void,
  closeAll: () => void,
  closeLastDialog: () => void,
  goBackToName: (name: string) => void,
  openSecondaryDialog: (obj: DialogObj) => void,
  closeSecondaryDialog: () => void
}

const DialogsContext = createContext<ContextObject | {}>({})

export const useDialogs = () => {
  return useContext(DialogsContext)
}

export const withDialogs = (Component: FunctionComponent) => {
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
type DialogsObj = {
  [dialogName: string]: FunctionComponent
}
const getModalByType = (dialogs: DialogsObj) => switchCase(dialogs)('div')

// eslint-disable-next-line react/display-name
export const DialogRouterProvider = ({ children, dialogs }: { children: React.ReactNode, dialogs: DialogsObj }) => {
  // Primary dialog
  const [history, setHistory] = useState<DialogObj[]>([])
  const { name, props = {} } = last(history) || { name: null, props: {} }
  const isOpen = !isEmpty(history)

  const closeLastDialog = () => {
    setHistory(dropLast(1))
  }

  const closeAll = () => {
    setHistory([])
    setSecondaryHistory([])
  }

  const openDialog = (dialogConfig: DialogObj) => {
    setHistory(append(dialogConfig))
  }

  const goBackToName = (dialogName: string) => {
    if (isEmpty(history)) return
    const dialogIndex = findIndex(propEq(dialogName, 'name'))(history)
    setHistory(slice(0, dialogIndex + 1))
  }
  // Secondary dialog
  const [secondaryHistory, setSecondaryHistory] = useState<DialogObj[]>([])
  const { name: secondaryName, props: secondaryProps = {} } = last(secondaryHistory) || { name: null, props: {} }
  const isSecondaryOpen = !isEmpty(secondaryHistory)

  const openSecondaryDialog = (dialogConfig: DialogObj) => {
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
