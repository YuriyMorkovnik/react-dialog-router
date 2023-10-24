# React Dialog Router

The React Dialog Router is a versatile component that simplifies the management of dialogs within your React application. It provides a context-based approach to open, close, and navigate between dialogs. This README specifies its abilities and the functions available from the `useDialogs` hook.

## Playground
Here is a [codesandbox](https://codesandbox.io/s/react-dialog-router-example-746c29)

## Installation

You can install the React Dialog Router component using npm or yarn:

```bash
npm install react-dialog-router
# or
yarn add react-dialog-router
```
## Usage
To use the React Dialog Router, you first need to import DialogRouterProvider and add it to your root app. Here's an example of how to set it up:

```js
//App.js
import { DialogRouterProvider } from 'react-dialog-router';
import { DialogComponent, DialogComponent2 } from './dialogs';

const dialogs = {
  'DIALOG_NAME': DialogComponent,
  'DIALOG_NAME_2': DialogComponent2
};
function App() {
  return (
    <DialogRouter dialogs={dialogs}>
      {/* Your application content */}
    </DialogRouter>
  );
}
```

## Abilities
The React Dialog Router provides the following abilities:

* **Open a Dialog:** You can open a dialog by calling the openDialog function provided by the useDialogs hook.

* **Close the Last Dialog:** You can close the last opened dialog by calling the closeLastDialog function provided by the useDialogs hook.

* **Close All Dialogs:** You can close all open dialogs by calling the closeAll function provided by the useDialogs hook.

* **Navigate Back to a Specific Dialog:** You can navigate back to a specific dialog by calling the goBackToName function provided by the useDialogs hook and passing the dialog name.

* **Open a Secondary Dialog:** You can open a secondary dialog using the openSecondaryDialog function provided by the useDialogs hook.

* **Close the Secondary Dialog:** You can close the secondary dialog by calling the closeSecondaryDialog function provided by the useDialogs hook.

## Functions Available from useDialogs
`openDialog(dialogConfig: Object)`
Opens a new dialog based on the provided dialogConfig. The dialogConfig should contain at least a name property that corresponds to the name of the dialog component to be opened.

`closeLastDialog()`
Closes the last opened dialog.

`closeAll()`
Closes all open dialogs, including secondary dialogs.

`goBackToName(dialogName: string)`
Navigates back to the specified dialog by closing all dialogs that follow it in the history.

`openSecondaryDialog(dialogConfig: Object)`
Opens a secondary dialog based on the provided dialogConfig.

`closeSecondaryDialog()`
Closes the secondary dialog.

## `withDialogs` Higher-Order Component (HOC)
You can wrap your components with the withDialogs HOC to inject the dialogContext prop, which allows you to access the dialog-related functions within your component.

```js
import { withDialogs } from 'react-dialog-router';

const MyComponent = ({ dialogContext }) => {
  // Access dialog functions using dialogContext
  const { openDialog, closeLastDialog } = dialogContext;

  return (
    // Your component JSX
  );
};
```
## Example
Here's an example of how to use the React Dialog Router to open a dialog:
```js
import React from 'react';
import { useDialogs } from 'react-dialog-router'; // Replace with the actual path

function MyButton() {
  const { openDialog } = useDialogs();

  const handleOpenDialog = () => {
    openDialog({ name: 'DIALOG_NAME', props: { /* dialog props */ } });
  };

  return (
    <button onClick={handleOpenDialog}>Open Dialog</button>
  );
}

export default withDialogs(MyComponent);

```
