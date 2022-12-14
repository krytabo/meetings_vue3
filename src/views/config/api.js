import axios from "axios";

const dataList = axios.create({
  baseURL: "https://631fb559-9d1d-4731-935d-58da2832fdd4.mock.pstmn.io",
});

export const userList = () => dataList.get("/getUser");
export const meetingList = () => dataList.get("/getMeeting");
export const to_doList = () => dataList.get("/getTo_doList");
