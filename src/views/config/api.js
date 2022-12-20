import axios from "axios";

const dataList = axios.create({
  baseURL: "https://mock.apifox.cn/m1/2093908-0-default",
});

export const userList = () => dataList.get("/memberList");
export const meetingList = () => dataList.get("/meetingList");
export const patch_meetingList = (data) => dataList.patch("/meetingList", data);
export const to_doList = () => dataList.get("/toDoList");
