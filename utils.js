/**
 * Created by 黎阳 on 2016/11/17.
 */
exports.md5=function (inputStr) {
    //md5  算法是不可逆加密
    return require('crypto').createHash('md5').update(inputStr).digest('hex');
};