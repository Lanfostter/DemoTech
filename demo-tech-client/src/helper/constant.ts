import {ROLE} from "./enum.ts";

export const isAdmin = (): boolean => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser") as string);
    return currentUser?.roles.includes(ROLE.ADMIN)
}
export const getUserName = ():string => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser") as string);
    return currentUser?.username
}
export const TYPE_FIELD = {
    INPUT_SEARCH: "search",
    DATE: "date",
    INPUT: "text",
    PASSWORD: "password",
    RADIO: "radio",
    CHECKBOX: "checkbox",
};