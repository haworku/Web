import { LOADING } from '@app/redux/constant/loading';


function loading(payload) {
  return {
    type: LOADING,
    payload,
  };
}


export default {
  loading,
};
