import axios from "axios";

const dataList = axios.create({
  baseURL: "https://krytabo.github.io/meetings_vue3",
});

export const userList = () => dataList.get("/memberList.json");
export const meetingList = () => dataList.get("/meetingList.json");
export const patch_meetingList = (data) => dataList.patch("/meetingList.json", data);
export const to_doList = () => dataList.get("/toDoList.json");
