import axios from 'axios';

const getURL = 'http://localhost:9000/api/insurances/';
const postURL = 'http://localhost:9000/api/createInsurance/';
const deleteURL = 'http://localhost:9000/api/deleteInsurance/';
const putURL = 'http://localhost:9000/api/editInsurance/';
const statusURL = 'http://localhost:9000/api/status';

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