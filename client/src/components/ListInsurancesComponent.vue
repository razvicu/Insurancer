<template>
<div>
    <div>
    <b-modal ref="editModal" hide-footer title="Modifica asiguratul">
      <div class="d-block text-center">
        <div class="insurance_type">
            <div class="form-group">
                <label for="insuredName">Nume</label>
                <input type="text" class="form-control" v-model="insurances[insuranceIndex].insuredName" id="insuredName" name="insuredName" placeholder="Introdu numele asiguratului">  
                <span class="error" v-if="!validateInsuredName(insurances[insuranceIndex].insuredName)">{{errmsg.insuredName}}</span>
            </div>
            <div class="form-group">
                <label for="licensePlate">Numar de inmatriculare</label>
                <input type="text" class="form-control" v-model="insurances[insuranceIndex].licensePlate" id="licensePlate" name="licensePlate" placeholder="Introdu numarul de inmatriculare al asiguratului">  
                <span class="error" v-if="!validateLicensePlate(insurances[insuranceIndex].licensePlate)">{{errmsg.licensePlate}}</span>
            </div>
            <div class="form-group">
                <label for="phoneNumber">Telefon</label>
                <input type="text" class="form-control" v-model="insurances[insuranceIndex].phoneNumber" id="phoneNumber" name="phoneNumber" placeholder="Introdu numarul de telefon asiguratului">  
                <span class="error" v-if="!validatePhoneNumber(insurances[insuranceIndex].phoneNumber)">{{errmsg.phoneNumber}}</span>
            </div>
            <div class="form-group">
                <label>Data expirarii</label>
                <div>
                    <date-picker v-model="insurances[insuranceIndex].expirationDate" valueType="format"></date-picker>
                </div>
                <span class="error" v-if="!validateExpirationDate(insurances[insuranceIndex].expirationDate)">{{errmsg.expirationDate}}</span>

            </div>
        </div>
      </div>
      <b-button class="mt-3" variant="outline-primary" block v-on:click="saveInsurance();hideModal('editModal')">Salveaza</b-button>
    </b-modal>
    <div>
        <b-modal ref="deleteModal" hide-footer title="Atentie!">
            <div class="d-block text-center">
                <div class="insurance_type">
                    <p>Esti sigur ca doresti sa stergi asigurarea?</p>
                    <p>{{insurances[insuranceIndex].insuredName}} -- {{insurances[insuranceIndex].licensePlate}} -- {{insurances[insuranceIndex].expirationDate | formatDate}}</p>
                </div>
            </div>
            <b-button class="mt-3" variant="outline-danger" block v-on:click="deleteInsurance(insuranceIndex);hideModal('deleteModal')">Da</b-button>
        </b-modal>
    </div>
    </div>
    <table class="table">
        <thead>
            <tr class="row">
                <th v-on:click="sort('name')" class="col-3">Nume</th>
                <th v-on:click="sort('licensePlate')" class="col-2">Numar de inmatriculare</th>
                <th v-on:click="sort('phoneNumber')" class="col-3">Numar de telefon</th>
                <th v-on:click="sort('expirationDate')" class="col-2">
                    Data expirarii
                    <font-awesome-icon v-bind:icon="sortedIcon"/>
                </th>
            </tr>
        </thead>
        <tbody>
            <InsuranceComponent 
                v-for = "(insurance, idx) in insurances" 
                :id = "insurance.id"
                :insured-name = "insurance.insuredName"
                :license-plate = "insurance.licensePlate"
                :phone-number = "insurance.phoneNumber"
                :expiration-date = "insurance.expirationDate"
                :key = "idx"
                v-on:delete-insurance-prompt="showModal('deleteModal');setInsuranceIndex(idx)"
                v-on:edit-insurance="editInsurance(idx)"> 
            </InsuranceComponent> 
        </tbody>
    </table>
</div>
</template>

<script>
import InsuranceService from '../InsuranceService';
import InsuranceComponent from './InsuranceComponent';

import validators from '../validators';


export default {
    name: "ListInsurancesComponent",
    components: {
        InsuranceComponent
    },
    data() {
        return {
            insurances: [{id: 0, insuredName: '', licensePlate: '', phoneNumber: '', expirationDate: ''}],
            sortUp: -1,
            insuranceIndex: 0,
            error: "",
            errmsg: {}
        }
    },
    mounted() {
        this.getAllInsurances();
    },
    methods: {
        showModal(modal) {
            this.$refs[modal].show();
        },
        hideModal(modal) {
            this.$refs[modal].hide();
        },
        async getAllInsurances() {
            await InsuranceService.getInsurances().then((res) => {
                for (let i = 0; i < res.length; ++i)
                    this.insurances.push(JSON.parse(res[i]))
            });
            this.insurances.splice(0,1);
        }, 
        sort(filter) {
            if (filter == "expirationDate") {
                if (this.sortUp == -1) {
                    this.sortUp = 0;
                } else {
                    this.sortUp = !this.sortUp;
                }   
                console.log(this.sortUp);
                this.insurances.sort((a,b) => {
                    if (a.expirationDate > b.expirationDate) {
                        if (this.sortUp == 1) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }
                    if (a.expirationDate < b.expirationDate) {
                        if (this.sortUp == 1) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    return 0;
                });
            }
        },
        validateInsuredName(value) {
            this.errmsg['insuredName'] = validators.validateInsuredName(value);
            return this.errmsg['insuredName'].length == 0;
        },
        validateLicensePlate(value) {
            this.errmsg['licensePlate'] = validators.validateLicensePlate(value);
            return this.errmsg['licensePlate'].length == 0;
        },
        validatePhoneNumber(value) {
            this.errmsg['phoneNumber'] = validators.validatePhoneNumber(value);
            return this.errmsg['phoneNumber'].length == 0;
        },
        validateExpirationDate(value) {
            this.errmsg['expirationDate'] = validators.validateExpirationDate(value);
            return this.errmsg['expirationDate'].length == 0;
        },
        saveInsurance() {
            const insurance = {
                id: this.insurances[this.insuranceIndex].id,
                insuredName: this.insurances[this.insuranceIndex].insuredName,
                licensePlate: this.insurances[this.insuranceIndex].licensePlate,
                phoneNumber: this.insurances[this.insuranceIndex].phoneNumber,
                expirationDate: this.insurances[this.insuranceIndex].expirationDate
            };
            let shouldReturn = false;
            Object.keys(insurance).forEach((key) => {
              if (insurance[key] == undefined || this.errmsg[key]) {
                this.displayMessage(false, "Datele introduse nu sunt complete!", 3000);
                console.log(insurance['id']);
                shouldReturn = true;
                return; 
              }
            });
            console.log(shouldReturn);
            if (shouldReturn) {
                return;
            }
            InsuranceService.editInsurance(insurance).then((res) => {
                console.log(res);
            });
        },
        editInsurance(idx) {
            this.setInsuranceIndex(idx);
            this.showModal('editModal');
        },
        setInsuranceIndex(idx) {
            this.insuranceIndex = idx;
        },
        deleteInsurance(idx) {
            InsuranceService.deleteInsurance(this.insurances[idx].id).then((res) => {
                console.log(res);
                this.insurances.splice(idx, 1);
            }).catch((err) => {
                console.log(err);
            });
        },
        displayMessage(reqSucceeded, resMessage, timeOut) {
            this.requestSucceded = reqSucceeded;
            this.responseMessage = resMessage;
            setTimeout(() => {
                this.responseMessage = "";
            }, timeOut);
        }
    },
    computed: {
        sortedIcon() {
            if (this.sortUp == 0) {
                return 'sort-down';
            } else if (this.sortUp == 1) {
                return 'sort-up';
            }
            return 'sort';
        }
    }
}
</script>
<style scoped>
.error {
    color: red;
}
</style>