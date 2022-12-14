import {PricingPlan} from '../../shared/enums';
import {axiosInstance} from '../../shared/requests/axiosInstance';
import {apiUsersPlanUrl} from '../../shared/requests/contants';

export const updatePlan = (plan: PricingPlan) => {
  return axiosInstance.patch<number>(apiUsersPlanUrl, undefined, {
    params: {
      plan: plan,
    },
  });
};
