import { post, get, put } from '../base';
/**
 * 音频事件日志列表
 */
export const audiologListApi = payload => {
  const param = {
    url: '/audio/v1/record',
    query: payload
  };
  return get(param);
};
/**
 * 音频事件日志  添加
 */
export const updateaudiologApi = payload => {
  const param = {
    url: '/audio/v1/record',
    query: payload
  };
  console.log(param);
  return put(param);
};

// 音频事件日志 导出
export const audiologExportApi = payload => {
  const param = {
    url: '/audio/v1/record/explode',
    body: payload
  };
  return get(param);
};

// 音频操作日志 列表
export const audioOperatelogListApi = payload => {
  const param = {
    url: '/audio/v1/operatelog',
    query: payload
  };
  return get(param);
};

// 音频操作日志 导出
export const audioOperatelogExplodeApi = payload => {
  const param = {
    url: '/audio/v1/operatelog/explode',
    query: payload
  };
  return get(param);
};

// 操作类型枚举
export const audioOperateTypeApi = payload => {
  const param = {
    url: '/audio/v1/operatelog/type/list',
    query: payload
  };
  return get(param);
};