const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('describe').where({
      _openid: "oieJN5VjL0BqzCn7Tmkn9-rTIV8c"
    }).update({
      data: {
        userReceiveName: "葱花王子",
        // userReceiverHeadPicture: event.userReceiverHeadPicture
      }
    })
  } catch (e) {
    console.error(e)
  }
}