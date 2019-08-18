const Types = {}
class VLX {
  constructor (data) {
    this.front = this.parseCube(data)
    this.back = this.parseCube(data.slice(4))
  }
  parseCube(arr) {
    return { top: arr[0], bot: arr[1], left: arr[2], right: arr[3] }
  }
}

Types.toType = function (dat) {
  switch (dat.type) {
    case 'vlx':
      return new VLX(dat.data);
    default:
      console.log('Unknown Type')
      return dat.data
  }
}
  
export default Types
