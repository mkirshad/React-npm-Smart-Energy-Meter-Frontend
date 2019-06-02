import API from './index';
import ErrorObject from './ErrorObject';
import { ENDPOINTS } from './config';

const api = new API();

export async function getOnDemandReading(group, deviceId, source_page ) {
  // energy || instantaneous || demand
  try {
    return await api.get(`${ENDPOINTS.ON_DEMAND_READING}?group=${group}&device_id=${deviceId}&source=${source_page}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function getDeviceParamValue(obic, deviceId) {
  try {
    return await api.get(`${ENDPOINTS.GET_DEVICE_PARAM}?param=${obic}&device_id=${deviceId}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

