import { writable } from "svelte/store";
import type { ToastArgs } from "./types";

export const toastStore = writable<ToastArgs>({
    active: false,
    status: "pending",
    message:""
})

// might put all these in a single store object
// using stores so i can turn them off anywhere in the app (well just for when clicking on the main container in homepage)

export const mainContainerStore = writable({
    active: false
})

export const AiChatStore = writable({
    active: false
})

export const postOptionsStore = writable<{activePost:string | null}>({
    activePost: null
})

export const notificationsBellStore = writable({
    active: false
})