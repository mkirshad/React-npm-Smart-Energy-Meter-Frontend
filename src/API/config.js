export const ENV = 'prod'; // dev || prod
export const SERVER_PORT =  parseInt(window.location.href.split(':').pop().split('/')[0]) + 5000;
export const BASE_URL = ENV === 'dev' ? `http://${window.location.hostname}:${SERVER_PORT}` : `http://${window.location.hostname}:${SERVER_PORT}`;
export const API_ENDPOINT = `${BASE_URL}/mdc`;
export const SEARCH_LIMIT = 20;
export const port = SERVER_PORT;



const BASE_ENDPOINTS = {
  DASHBOARD: `/dashboard`,
};

export const ENDPOINTS = {
  LOGIN: 'login/',
  REGISTRATION: 'registration/',
  POST_ALL_MSNS_IDS: `${BASE_ENDPOINTS.DASHBOARD}/post_check_online_status/`, 
  POST_ANALYSIS_RAW_DATA: `${BASE_ENDPOINTS.DASHBOARD}/post_analysis_raw_data/`,
  POST_ANALYSIS_HOURLY_CONSUMPTION_DATA: `${BASE_ENDPOINTS.DASHBOARD}/post_analysis_hourly_consumption_data/`, 
  POST_ANALYSIS_DAILY_CONSUMPTION_DATA: `${BASE_ENDPOINTS.DASHBOARD}/post_analysis_daily_consumption_data/`,
  POST_ANALYSIS_MONTHLY_CONSUMPTION_DATA: `${BASE_ENDPOINTS.DASHBOARD}/post_analysis_monthly_consumption_data/`,
  POST_EDIT_DEVICE_SCHEDULES_DATA: `${BASE_ENDPOINTS.DASHBOARD}/post_editable_device_schedules_data/`,
  POST_ADD_NEW_DEVICE_SCHEDULED_DATA: `${BASE_ENDPOINTS.DASHBOARD}/post_add_new_device_scheduled_data/`,
  DEVICE_CHILD_NODES: `${BASE_ENDPOINTS.DASHBOARD}/get_dim_device_child_nodes/`,
  DATE_CHILD_NODES: `${BASE_ENDPOINTS.DASHBOARD}/get_dim_date_child_nodes/`,
  OBIS_CHILD_NODES: `${BASE_ENDPOINTS.DASHBOARD}/get_dim_obis_child_nodes/`,
  DEVICE_SEARCH: `${BASE_ENDPOINTS.DASHBOARD}/device_search/`,
  DEVICE_SCHEDULES_DATA: `${BASE_ENDPOINTS.DASHBOARD}/get_device_schedules_data/`,
  DEVICE_SCHEDULE_COMMANDS_DATA: `${BASE_ENDPOINTS.DASHBOARD}/get_device_schedule_commands_data/`,
  GET_DEVICE_INFO: `${BASE_ENDPOINTS.DASHBOARD}/get_device_info/`,
  GET_ALL_DEVICES: `${BASE_ENDPOINTS.DASHBOARD}/get_all_devices/`,
  GRAPH_DATA: `${BASE_ENDPOINTS.DASHBOARD}/graph_data/`,
  MON_BILLING_DATA: `${BASE_ENDPOINTS.DASHBOARD}/mon_billing_data`,
  BILLING_DATA: `${BASE_ENDPOINTS.DASHBOARD}/billing_data`,
  INSTANTANEOUS_DATA: `${BASE_ENDPOINTS.DASHBOARD}/instantaneous_data`,
  EVENT_DATA: `${BASE_ENDPOINTS.DASHBOARD}/events_data`,
  ON_DEMAND_READING: `${BASE_ENDPOINTS.DASHBOARD}/on_demand_reading/`,
  GET_DEVICE_PARAM: `${BASE_ENDPOINTS.DASHBOARD}/get_device_param_value/`,
  
};
