import axios from 'axios';

const uri = process.env.VUE_APP_PRODUCTION == "TRUE" ? '18.193.23.31' : 'localhost';
const port = (uri == 'localhost') ? process.env.VUE_APP_PORT : '';

const getURL = `http://${uri}` + port + `/api/insurances/`;
const postURL = `http://${uri}` + port + `/api/createInsurance/`;
const deleteURL = `http://${uri}` + port + `/api/deleteInsurance/`;
const putURL = `http://${uri}` + port + `/api/editInsurance/`;
const statusURL = `http://${uri}` + port + `/api/status`;

class InsuranceService {
    static getInsurances() {
        return new Promise ((resolve,reject) => {
            axios.get(getURL).then((res) => {
                resolve(res.data);
            })
            .catch((err)=> {
                reject(err);
            }) 
        });
    }

    static submitInsurance(insurance) {
        return new Promise ((resolve,reject) => {
            axios.post(postURL, insurance).then((res) => {
                resolve(res);
            })
            .catch((err)=> {
                reject(err);
            })
        });
    }

    static editInsurance(insurance) {
        return new Promise ((resolve,reject) => {
            axios.put(putURL, insurance).then((res) => {
                resolve(res);
            })
            .catch((err)=> {
                reject(err);
            })
        });
    }

    static deleteInsurance(insuranceID) {
        return new Promise ((resolve,reject) => {
            axios.delete(deleteURL + insuranceID).then((res) => {
                resolve(res);
            })
            .catch((err)=> {
                reject(err);
            })
        });
    }

    static getStatus() {
        return new Promise ((resolve, reject) => {
            axios.get(statusURL).then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
}

export default InsuranceService;