import useObjectQueryStringify from './useObjectQueryStringify';

/**
 * 独立一个创建请求数据函数用于嵌套
 * @param {Object} data 请求内容
 * @param {Object} { protoRoot: proto 转 js 后的对象, reqType: 请求格式描述 } 
 */
export const createSendData = (data, {
  protoRoot,
  reqType
}) => {
  const reqMessage = protoRoot.lookup(reqType);
  return reqMessage.encode(reqMessage.create(data)).finish();
};

/**
 * 封装 protocol buffers 请求方法
 * @param {Object} proto 转 js 后的对象
 */
export default protoRoot => ({ reqType, resType }) => {

  /** reqType: 请求格式描述; resType: 响应格式描述 */
  let resMessage;
  resMessage = protoRoot.lookup(resType);

  /**
   * @param {String} method 请求方法
   * @param {String} url 请求地址
   * @param {Object} data 请求内容
   */
  return function(method = 'get', url, data = {}) {
    let sendData;
    if (method.toLowerCase() === 'post') {
      sendData = createSendData(data, { protoRoot, reqType });
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
};
