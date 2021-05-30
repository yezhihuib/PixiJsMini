// exports.uploadFile = async (context) => {
//     const cloud = context.cloud;
//     let result;
//     try {
//         result = await cloud.file.uploadFile({
//             fileContent: new Buffer("333434"), fileName: "test"
//         })
//     } catch (e) {
//         console.log("e", e)
//     }
//     console.log("uploadFileResult", result);
//     return 'uploadFile';
// };

// saveUserInfo 云函数（Node版）
exports.main = async (context) => {
  return 'hello world';
};