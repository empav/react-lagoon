import axios from 'axios';

const login = async credentials => {
  try {
    const response = await axios.post('/rest/login', credentials);
    const token = response.headers.authorization;
    if (token) {
      localStorage.setItem('token', token);
      return Promise.resolve(response.data);
    } else {
      return Promise.reject('No token provided by login service.');
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const getRegistry = async ({ name, surname, birthDate }) => {
  try {
    const response = await axios.get(
      `/rest/noauth/importedRegistryUsers?name=${name}&surname=${surname}&birthDate=${birthDate}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const insertPrincipal = async principal => {
  try {
    const response = await axios.post('/rest/noauth/principals', principal);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const findPrincipalByFullName = async (fullname, limit, offset) => {
  try {
    const response = await axios.get(
      `/rest/all/principalsByFullname?fullname=${fullname}&limit=${limit}&offset=${offset}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const findPrincipal = async username => {
  try {
    const response = await axios.get(
      `/rest/all/principals?username=${username}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const updatePrincipal = async principal => {
  try {
    const response = await axios.patch('/rest/all/principals', principal);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const resetPasswordPrincipal = async (id, password) => {
  try {
    const response = await axios.patch('/rest/all/resetPassword', {
      id,
      password
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const confirmPrincipalSubscription = async id => {
  try {
    const response = await axios.patch(
      '/rest/noauth/principalSubscriptionConfirm',
      { id }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const invalidatePrincipal = async id => {
  try {
    const response = await axios.patch('/rest/noauth/invalidatePrincipal', {
      id
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const changeEmailPrincipal = async (userId, email) => {
  try {
    const response = await axios.get(
      `/rest/all/changeEmail?id=${userId}&email=${email}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const sendEmailSubscriptionConfirm = async username => {
  try {
    const response = await axios.post(
      '/rest/noauth/sendEmailSubscriptionConfirm',
      { username }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const changeForgotPassword = async (id, password) => {
  try {
    const response = await axios.patch('/rest/noauth/changeForgotPassword', {
      id,
      password
    });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const forgotPassword = async username => {
  try {
    const response = await axios.get(
      `/rest/noauth/forgotPassword?username=${username}`
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const insertNotice = async notice => {
  try {
    await axios.post('/rest/all/notices', notice);
    return Promise.resolve();
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const findNotices = async userId => {
  try {
    const response = await axios.get(`/rest/all/notices?receiverId=${userId}`);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const updateReadNotice = async ({ id, read }) => {
  try {
    const response = await axios.patch('/rest/all/notices', { id, read });
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const findRequests = async queryString => {
  try {
    const response = await axios.get(`/rest/all/requests${queryString}`);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const insertRequest = async request => {
  try {
    const response = await axios.post('/rest/patient/requests', request);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const updateRequest = async request => {
  try {
    const response = await axios.patch('/rest/all/requests', request);
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const getRequestStatuses = async request => {
  try {
    const response = await axios.get('/rest/all/domRequestStatuses');
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const importPatients = async formData => {
  try {
    const response = await axios.post(
      '/rest/mmg/importedRegistryUsers',
      formData,
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    );
    return Promise.resolve(response.data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export {
  login,
  importPatients,
  getRequestStatuses,
  getRegistry,
  insertRequest,
  updateRequest,
  findRequests,
  insertPrincipal,
  findPrincipal,
  findPrincipalByFullName,
  changeEmailPrincipal,
  invalidatePrincipal,
  changeForgotPassword,
  forgotPassword,
  updatePrincipal,
  resetPasswordPrincipal,
  confirmPrincipalSubscription,
  sendEmailSubscriptionConfirm,
  findNotices,
  insertNotice,
  updateReadNotice
};
