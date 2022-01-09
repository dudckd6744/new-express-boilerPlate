export const err_message = (init_status_data) => {
  const err_result = [];
  for (let key in init_status_data) {
    let init_req_value = Object.keys(init_status_data[key])[0];
    init_status_data[key][init_req_value]
      ? ''
      : err_result.push(init_req_value);
  }
  return err_result;
};
