import { apiPOST, logoutRequest } from "./ServerRequests";

export function AddFile(file: string) {
    apiPOST<object>('/addFile',  {file: file}).then((response) => {
        console.log(response);
    });
}

export function handleOpen() {
    console.log("Open");
}

export function handleSave() {
    console.log("Save");
}

export function handleSaveAs() {
    console.log("Save As");
}

export function handleUndo() {
    console.log("Undo");
}

export function handleRedo() {
    console.log("Redo");
}

export function handleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}

export function handleOptions() {
    console.log("Options");
}

export function handleLogout() {
    logoutRequest();
}