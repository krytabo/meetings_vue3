<template>
  {{ api }}
</template>

<script>
import axios from "axios";
export default {
  name: "testPage",
  data() {
    return {
      api: [],
    };
  },
  methods: {
    getData() {
      let url = "https://iotgw.ezplus.com.tw/iot-dashboard/api/security/get-event-list";
      axios
        .get(url, {
          headers: {
            Authorization:
              "Bearer " +
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjMyNDdjZDQwOGU1MmM2YWEyODM1NjQ0Y2Q4YzRiNjRhOTJiMWIxYWIyNWQ3MTdkNmQ3OTc0MTE4Y2MxMDI3MTg1OTYwOGU2MGQzMTFiZDk1In0.eyJhdWQiOiIzIiwianRpIjoiMzI0N2NkNDA4ZTUyYzZhYTI4MzU2NDRjZDhjNGI2NGE5MmIxYjFhYjI1ZDcxN2Q2ZDc5NzQxMThjYzEwMjcxODU5NjA4ZTYwZDMxMWJkOTUiLCJpYXQiOjE2NjkzNTI4ODUsIm5iZiI6MTY2OTM1Mjg4NSwiZXhwIjoxNjcwNjQ4ODg1LCJzdWIiOiI0MzMiLCJzY29wZXMiOltdfQ.fXO76pannnasEOHByNDv6jiwdnMIYQoLq7h1HRSwZ43TnSJ_E0ShgkTFMYgXehqYBKF3sJOyT1SwwrRxp-zjvgdjgg4k48_hNKcdTWCKoWSGUPrPoz93BSvSxMGF4fwjg4BV9QBZsIf5cqN6W8zT2grYV7c9Fx8frQeiYpgDQrtCnP-kDxNdPuNC0uypKCwOFiyKEGNVZzO7hzE6GOhBtbaQp3o6K0QBi5yk8TPaYqHC1y6dl2aCE49ZtgKnrOOwSHMdREnsoKNzGAuTPPgRHyrQ59svohBSJ8hkhH1DbOl_DgtyddY7iU_T19yq08DWUtAE2AViFgHtWjrgeIp0uHrDWzOcNtwESdGErW03KiYWgqzVvYtnb7xT_R6JSNHpE3PbY_0L02tCiUDO5D2l62Juh6dCNQvEETsGLGjnPprlNNi5_ZVIshQclLc9m1JhUquWY98zsFCxK83RAXyKIigMc36u4ywcnkpm5IGuNIR60IcW2f1Leqh8nCLGvYk2Smm8JX4gohnJID35lUdON3I34O0VZJv1gwGT90RiFtohz7qdVgtCBcLJ5loXaX8I41OSXnd-AMtSZDIyXYjYH8_ZaO1bAKDTfRaFpJDn7E9EOG6nb6EUm9P74gkYrba1LiJcbHpDu3XBUORneYXL6cYSvf12WKZr22h6Fi4nVwU",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        .then((response) => {
          this.api = response.data;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped></style>
