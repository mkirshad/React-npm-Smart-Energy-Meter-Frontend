import API from './index';
import ErrorObject from './ErrorObject';
import { ENDPOINTS } from './config';

const api = new API();

export async function getDeviceInfo(id) {
  try {
    return await api.get(`${ENDPOINTS.GET_DEVICE_INFO}?id=${id}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function searchDevices(search_param, search_limit, offset, type, parent_id) {
  try {
    return await api.get(`${ENDPOINTS.DEVICE_SEARCH}?search_param=${search_param}&limit_param=${search_limit}&offset=${offset}&type=${type}&parent_id=${parent_id}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}


export async function GetDeviceSchedulesModelData(deviceId, offset, limit) {
  try {
    return await api.get(`${ENDPOINTS.DEVICE_SCHEDULES_DATA}?device_id=${deviceId}&offset=${offset}&limit_param=${limit}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}


export async function GetDeviceScheduleCommandsData(scheduleId) {
  try {
    return await api.get(`${ENDPOINTS.DEVICE_SCHEDULE_COMMANDS_DATA}?schedule_id=${scheduleId}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}


export async function get_dim_device_child_nodes(parent_id, SEARCH_LIMIT, offset) {
  try {
    return await api.get(`${ENDPOINTS.DEVICE_CHILD_NODES}?parent_id=${parent_id}&limit_param=${SEARCH_LIMIT}&offset=${offset}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function get_date_model_child_nodes(year, month, off_set, SEARCH_LIMIT) {
  try {
    return await api.get(`${ENDPOINTS.DATE_CHILD_NODES}?year_actual=${year}&month_actual=${month}&limit_param=${SEARCH_LIMIT}&offset=${off_set}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}


export async function get_obis_model_child_nodes(category, off_set, SEARCH_LIMIT) {
  try {
    return await api.get(`${ENDPOINTS.OBIS_CHILD_NODES}?category=${category}&limit_param=${SEARCH_LIMIT}&offset=${off_set}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function getAllDevices() {
  try {
    return await api.get(`${ENDPOINTS.GET_ALL_DEVICES}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function getMonthlyBillingData() {
  try {
    return await api.get(`${ENDPOINTS.MON_BILLING_DATA}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function getBillingData() {
  try {
    return await api.get(`${ENDPOINTS.BILLING_DATA}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function getInstantaneousData() {
  try {
    return await api.get(`${ENDPOINTS.INSTANTANEOUS_DATA}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function getGraphData() {
  try {
    return await api.get(`${ENDPOINTS.GRAPH_DATA}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function getEventData() {
  try {
    return await api.get(`${ENDPOINTS.EVENT_DATA}`);
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function PostAllMsnsIds(msnsdata) {
  try {
    return await api.post(ENDPOINTS.POST_ALL_MSNS_IDS, {
      msnsdata
      
    });
  } catch (error) {
    return new ErrorObject(error);
  }
}


export async function PostAnalysisRawData(postanalysisrawdata) {
  try {
    return await api.post(ENDPOINTS.POST_ANALYSIS_RAW_DATA, {
      postanalysisrawdata
      
    });
  } catch (error) {
    return new ErrorObject(error);
  }
}


export async function PostAnalysisHourlyConsumptionData(post_analysis_hourly_consumption) {
  try {
    return await api.post(ENDPOINTS.POST_ANALYSIS_HOURLY_CONSUMPTION_DATA, {
      post_analysis_hourly_consumption
      
    });
  } catch (error) {
    return new ErrorObject(error);
  }
}


export async function PostAnalysisDailyConsumptionData(post_analysis_daily_consumption) {
  try {
    return await api.post(ENDPOINTS.POST_ANALYSIS_DAILY_CONSUMPTION_DATA, {
      post_analysis_daily_consumption
      
    });
  } catch (error) {
    return new ErrorObject(error);
  }
}

export async function PostAnalysisMonthlyConsumptionData(post_analysis_monthly_consumption) {
  try {
    return await api.post(ENDPOINTS.POST_ANALYSIS_MONTHLY_CONSUMPTION_DATA, {
      post_analysis_monthly_consumption
      
    });
  } catch (error) {
    return new ErrorObject(error);
  }
}


export async function PostEditDeviceSchedulesFormData(post_edit_device_schedules_form_data) {
  try {
    return await api.post(ENDPOINTS.POST_EDIT_DEVICE_SCHEDULES_DATA, {
      post_edit_device_schedules_form_data
      
    });
  } catch (error) {
    return new ErrorObject(error);
  }
}


export async function PostAddNewDeviceScheduledFormData(post_add_new_device_scheduled_form_data) {
  try {
    return await api.post(ENDPOINTS.POST_ADD_NEW_DEVICE_SCHEDULED_DATA, {
      post_add_new_device_scheduled_form_data
      
    });
  } catch (error) {
    return new ErrorObject(error);
  }
}






