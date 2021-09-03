const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function g_bindMinus(dish_id, e_id, dish_quantity) {
    if (dish_id == e_id&&dish_quantity>0) {
      dish_quantity -= 1;
    }


  // 将数值与状态写回  
  // this.setData({
  //   group: this.data.group,
  // });
}

module.exports = {
  formatTime,
}
