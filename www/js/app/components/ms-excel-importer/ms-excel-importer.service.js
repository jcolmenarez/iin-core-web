export class MSExcelImporterServices {

        constructor ($http){

            this.$http = $http;

        }

        enrollStudentInEvent (data){

            return this.$http.post('/api/event-enroll-student', data);

        }

        insertEventPromotionCode (data){

            return this.$http.post('/api/event-promotion-code', data);

        }

    }

MSExcelImporterServices.$inject = ['$http']