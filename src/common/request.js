import axios from "axios";

const serverAddr = "https://www.qsc.zju.edu.cn/zjurs/api/";

async function request(url, data, task) {
  console.log("req url: ", url, "data: ", data);
  try {
    //const ret = await axios.post('/api' + url, data);
    const ret = await axios.post(serverAddr + url, data);
    const returnData = ret.data;
    if (returnData.code !== 0) {
      switch (returnData.code) {
        case 10001:
          window.$message.error(task + "失败: 权限不足");
          break;
        case 10002:
          window.$message.error(task + "失败: 账号错误");
          break;
        case 10003:
          window.$message.error(task + "失败: 密码错误");
          break;
        case 50000:
          window.$message.error(task + "失败: 服务器错误");
          break;
        default:
          window.$message.error(task + "失败");
          break;
      }
      throw returnData;
    } else {
      return returnData.data;
    }
  } catch (e) {
    if (typeof e?.code != "number") {
      window.$message.error(task + "出错");
    }
    throw {
      task,
      error: e,
    };
  }
}

export default request;
