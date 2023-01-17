import axios from "axios";

const dataList = axios.create({
  baseURL: "https://krytabo.github.io/meetings_vue3",
  // baseURL: "https://mock.apifox.cn/m1/2093908-0-default",
});

export const userList = () => dataList.get("/memberList.json");
export const meetingList = () => dataList.get("/meetingList.json");
export const patch_meetingList = (data) => dataList.patch("/meetingList.json", data);
export const to_doList = () => dataList.get("/toDoList.json");

/*const dataList = axios.create({
  baseURL: "http://localhost:3000",
});

export const userList = () => dataList.get("/memberList");
export const meetingList = () => dataList.get("/meetingList");
export const patch_meetingList = (data) => dataList.patch("/meetingList", data);
export const to_doList = () => dataList.get("/toDoList");*/
