import axios from 'axios';

const uri = process.env.VUE_APP_API;

const getURL = `${uri}insurances/`;
const postURL = `${uri}createInsurance/`;
const postPdfURL = `${uri}parsePdfInsurance/`;
const deleteURL = `${uri}deleteInsurance/`;
const putURL = `${uri}editInsurance/`;
const statusURL = `${uri}status`;

class InsuranceService {
    static getInsurances() {
        console.log(process.env);
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

    static submitInsurancePdf(insurance, onUploadProgress) {
        return new Promise ((resolve, reject) => {
            axios.post(postPdfURL, insurance, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress
            }).then((res) => {
                resolve(res);
            })
            .catch((err) => {
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