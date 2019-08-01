import useObjectQueryStringify from './useObjectQueryStringify';

/**
 * 封装 protocol buffers 请求方法
 * 范例：.proto 转 js 命令npx pbjs -t json-module -w es6 -o src/?.js  src/?.proto
 * @param {Object} protoRoot .proto文件转换成js的对象内容
 * @param {String} reqMessageName 对应请求消息格式的名称 比如 model.CommonReq
 */
export default (protoRoot, reqMessageName) => {
  let reqMessage;
  if (reqMessageName) {
    reqMessage = protoRoot.lookup(reqMessageName);
  }

  /**
   * @param {String} resMessageName 对应反馈消息格式的名称 比如 model.CommonRes
   */
  return function(resMessageName) {
    
    const resMessage = protoRoot.lookup(resMessageName);

    /**
     * @param {String} method 请求方法
     * @param {String} url 请求地址
     * @param {Object} data 请求内容
     */
    return function(method = 'get', url, data = {}) {
      let message, sendData;
      if (method.toLowerCase() === 'post') {
        message = reqMessage.create(data);
        sendData = reqMessage.encode(message).finish();
      } else {
        sendData = null;
        const querySearch = useObjectQueryStringify(data);
        url += querySearch === '' ? '' : `?${querySearch}`;
      }
  
      return new Promise((rs, rj) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Content-Type', 'application/x-protobuf');
        xhr.onload = function(response) {
          const result = resMessage.toObject(
            resMessage.decode(new Uint8Array(response.target.response)),
            {
              // 确保 byte 格式的会转换为 base64string
              bytes: String
            }
          );
          // 循环结果，将 base64string => string，忽略解码错误
          for (let k in result) {
            if (~toString.call(result[k]).indexOf('String')) {
              try {
                result[k] = atob(result[k]);
              } catch (e) {}
            }
          }
          rs(result);
        };
        xhr.onerror = function(error) {
          rj(error);
        };
        xhr.send(sendData);
      });
    };
  }
};
