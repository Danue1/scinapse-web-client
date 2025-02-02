import PlutoAxios from './pluto';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

class HomeAPI extends PlutoAxios {
  public async getPapersFoundCount() {
    const res = await this.get(`/papers/found-count`);

    return camelCaseKeys(res.data);
  }
}

const homeAPI = new HomeAPI();

export default homeAPI;
