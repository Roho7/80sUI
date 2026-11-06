export const CRT_STORAGE_KEY = "ui95-crt"

export const RESTORE_CRT_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(CRT_STORAGE_KEY)})==="on")document.documentElement.dataset.crt="on"}catch(e){}`
