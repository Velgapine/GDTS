import request from '@/web/utils';

const user = {
  register(data: any) {
    return request.post('/register', data);
  },
  login(data: any) {
    return request.post('/login', data);
  },
  logout() {
    return request.get('/logout');
  },
};

export default user;
