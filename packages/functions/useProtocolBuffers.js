import axios from "axios";
import protobuf from 'protobufjs';

/**
 * 实例化请求服务
 */
export const protoService = axios.create({
  timeout: 45000,
  method: 'post',
  headers: {
    // 'Content-Type': 'application/octet-stream',
    'Content-Type': 'application/protobuf'
  },
  responseType: 'arraybuffer'
});

/**
 * 判断是否 arraybuffer 类型
 * @param {Mixed} obj 
 */
export const isArrayBuffer = obj => Object.prototype.toString.call(obj) === '[object ArrayBuffer]';

/**
 * protoRoot: proto.js 文件 引入的 module
 * options: {
 *  lookupRequest: 请求体message
 *  lookupResponse: 响应体的message
 *  lookupType: 消息类型
 * }
 */
export default (protoRoot, {
  lookupRequest,
  lookupResponse,
  lookupType
}) => {
  
  const PBMessageRequest = protoRoot.lookup(lookupRequest);
  const PBMessageResponse = protoRoot.lookup(lookupResponse);
  const PBMessageType = protoRoot.lookup(lookupType);

  // 入参编码
  protoService.defaults.transformRequest = data => {
    return PBMessageRequest.encode(data).finish();
  };

  // 返回数据转码
  protoService.defaults.transformResponse = rawResponse => {
    if (rawResponse == null || !isArrayBuffer(rawResponse)) {
      // 非 buffer 原样输出
      return rawResponse;
    }
    try {
      // 解码输出
      const buf = protobuf.util.newBuffer(rawResponse);
      const decodedResponse = PBMessageResponse.decode(buf);
      return decodedResponse;
    } catch (error) {
      return error;
    }
  };

  // 返回 请求函数
  const request = function(msgType, url, requestBody={}) {
    const type = PBMessageType.values[msgType];
    const reqData = {
      type,
      ...requestBody
    };
    // 将对象序列化成请求体实例
    const req = PBMessageRequest.create(reqData);
    return protoService.post(url, req);
  };

  request.create = function(protoName, data) {
    return protoRoot.lookup(protoName).encode(data).finish();
  }

  return request;
};
