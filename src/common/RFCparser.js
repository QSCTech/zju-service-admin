/**
 * 将RFC 3339字符串解析至分钟
 * @param {string} time 原始时间串
 * @returns {string} 精确到分钟的结果
 */
function toMinute(time) {
  const date = new Date(time);
  var newDate = new Date(+new Date(date) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\:[\d]{2}\.[\d]{3}Z/, "");
  
  return newDate;
}

export default {
  toMinute,
};
