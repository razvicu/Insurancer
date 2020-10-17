<template>
 <div class="container">
    <div class="text-center">
        <h2>Incarca polita RCA</h2>
    </div>
    <div class="container">
        <div class="insurance_upload">
            <div>
                <div class="custom-file">
                    <input type="file" class="custom-file-input" v-on:change="onFileChange" ref="insuranceFile" name="insuranceFile" id="insuranceFile">
                    <label class="custom-file-label" for="insuranceFile">{{insuranceFileLabel}}</label>
                </div>
                <div class="text-center">
                    <button v-on:click="submitPdf" style="margin-top: 20px;" type="submit" class="btn btn-primary">Incarca</button>
                </div>
            </div>
        </div>
    </div>
    <div class="__spacer"></div>
    <div class="text-center">
        <h2>SAU</h2>
        <h2>Completeaza manual datele</h2>
    </div>
    <div class="container">
        <div class="insurance_type">
            <div class="form-group">
                <label for="insuredName">Nume</label>
                <input type="text" class="form-control" v-model="insuredName" id="insuredName" name="insuredName" placeholder="Introdu numele asiguratului">  
                <span class="error" v-if="msg.insuredName">{{msg.insuredName}}</span>
            </div>
            <div class="form-group">
                <label for="licensePlate">Numar de inmatriculare</label>
                <input type="text" class="form-control" v-model="licensePlate" id="licensePlate" name="licensePlate" placeholder="Introdu numarul de inmatriculare al asiguratului">  
                <span class="error" v-if="msg.licensePlate">{{msg.licensePlate}}</span>
            </div>
            <div class="form-group">
                <label for="phoneNumber">Telefon</label>
                <input type="text" class="form-control" v-model="phoneNumber" id="phoneNumber" name="phoneNumber" placeholder="Introdu numarul de telefon asiguratului">  
                <span class="error" v-if="msg.phoneNumber">{{msg.phoneNumber}}</span>
            </div>
            <div class="form-group">
                <label>Data expirarii</label>
                <div>
                    <date-picker v-model="expirationDate" valueType="format"></date-picker>
                </div>
                <span class="error" v-if="msg.expirationDate">{{msg.expirationDate}}</span>
            </div>
            <div class="text-center">
                <button v-on:click="submitInsurance" type="submit" class="btn btn-primary">Salveaza</button>
            </div>
        </div>
        <div v-if="responseMessage.length">
            <div class="alert" v-bind:class="{'alert-success': requestSucceded, 'alert-danger': !requestSucceded}">
                {{ responseMessage }}
            </div>
        </div>
    </div>
  </div>
 </template>

<script>
import InsuranceService from '../InsuranceService';
import validators from '../validators';

export default {
  name: 'AddInsuranceComponent',
  data() {
    return {
      insuredName: "",
      licensePlate: "",
      expirationDate: "",
      phoneNumber: "",
      requestCompleted: false,
      error: "",
      responseMessage: "",
      requestSucceded: false,
      insuranceFileLabel: "Adauga un fisier",
      msg: {}
    }
  },
  watch: {
      insuranceFile(value) {
          this.insuranceFileLabel = value.name;
      },
      insuredName(value) {
          this.msg['insuredName'] = validators.validateInsuredName(value);
      },
      licensePlate(value) {
          this.msg['licensePlate'] = validators.validateLicensePlate(value);
      },
      phoneNumber(value) {
          this.msg['phoneNumber'] = validators.validatePhoneNumber(value);
      },
      expirationDate(value) {
          console.log(value);
          this.msg['expirationDate'] = validators.validateExpirationDate(value);
      }
  },
  methods: {
        onFileChange(event) {
            let file =  event.target.files[0];
            this.insuranceFileLabel = file.name;
        },
        async submitPdf() {
            let formData = new FormData();
            let file = this.$refs['insuranceFile'].files[0];
            formData.append('insuranceFile', file);
            await InsuranceService.submitInsurancePdf(formData).then((res) => {
                console.log(res);
                this.insuredName = res.data.name;
                this.licensePlate = res.data.licenseNumber;
                this.phoneNumber = res.data.phoneNumber;
                this.expirationDate = res.data.expDate.split('.').reverse().join('-');
            })
            .catch((err) => {
                console.log(err);
            });
        },
        async submitInsurance() {
            const insurance = {
              insuredName: this.insuredName,
              licensePlate: this.licensePlate,
              phoneNumber: this.phoneNumber,
              expirationDate: this.expirationDate
            };
          console.log(insurance);
          let shouldReturn = false;
          Object.keys(insurance).forEach((key) => {
              if (!insurance[key].length || this.msg[key]) {
                this.displayMessage(false, "Datele introduse nu sunt complete!", 3000);
                shouldReturn = true;
                return; 
              }
          });
          if (shouldReturn) {
            return;
          }
          await InsuranceService.submitInsurance(insurance).then((res) => {
            if (res.status == 200) {
                console.log(res);
                this.displayMessage(true, res.data, 3000);
            } 
            }).catch((err) => {
                console.log(err);
                this.displayMessage(false, "A aparut o problema la salvarea datelor!", 3000);
            });
        },
        displayMessage(reqSucceeded, resMessage, timeOut) {
            this.requestSucceded = reqSucceeded;
            this.responseMessage = resMessage;
            setTimeout(() => {
                this.responseMessage = "";
            }, timeOut);
        }
  }
}
</script>

<style scoped>
.error {
    color: red;
}
.alert {
    margin-top: 20px;
}
</style>
