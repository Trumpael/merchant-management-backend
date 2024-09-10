// 封装一个函数：获取一个结果：当前时段
export const getTime = () => {
    let message = ""
    let hours = new Date().getHours()
    if (hours < 10) {
        message = "早上"
    } else if (hours >= 10 && hours < 14) {
        message = "中午"
    } else if (hours >= 14 && hours < 18) {
        message = "下午"
    } else if (hours >= 18) {
        message = "晚上"
    }
    return message
}