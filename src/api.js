import ENV from './env.json';


const apiPath = {
    auth: {
        login: ENV.api + 'api/users/login',
        register: ENV.api + 'api/users/register',
        me: ENV.api + 'api/me'
    },
    shape: {
        getList: ENV.api + 'api/shapelist',
        getShapeListByUser: (userId) => ENV.api + `api/shapelist/${userId}`,
        getShapeById: (id) => ENV.api + `api/shape/${id}`,
        addNewShape:  ENV.api + 'api/shape',
        removeShape: (id) => ENV.api + `api/shape/${id}`,
    },
}

export default apiPath;