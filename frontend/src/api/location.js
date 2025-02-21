import { axiosService } from "./index";

export function getListFromGeoLocation(reqParams) {
  return axiosService.post('/api/location/getListFromGeoLocation', reqParams);
}

export function getSecondList(reqParams) {
  return axiosService.post('/api/location/getSecondList', reqParams);
}

export function getThirdList(reqParams) {
  return axiosService.post('/api/location/getThirdList', reqParams);
}

export function getScoreInfo(reqParams) {
  return axiosService.post('/api/location/getScoreInfo', reqParams);
}
