(function() {
    'use strict';

    angular.module('app.deals')
        .controller('DealController', DealController);

    DealController.$inject = ['DealService', 'dealPrepService', '$timeout', '$window'];

    /* @ngInject */
    function DealController(DealService, dealPrepService, $timeout, $window) {
        var vm = this;

        vm.prepDeals = dealPrepService;
        vm.deals = vm.prepDeals.deals;
        vm.getDeals = getDeals;
        vm.getBrands = getBrands;
        vm.hasDeleted = false;
        vm.response = {};
        vm.deleteDeal = deleteDeal;
        vm.isDone = false;
        vm.search = search;
        vm.searchItem = '';
        vm.isLoading = false;
        vm.isRetrieving = false;
        vm.isSearch = false;
        vm.clearSearch = clearSearch;
        vm.isDealEmpty = isDealEmpty;

        if ($window.__env.apiUrl.toLowerCase().indexOf('stageapi') > -1) {
          vm.customerHost = 'http://staging.launchii.com';
        } else {
          vm.customerHost = 'http://www.launchii.com';
        }

        activate();

        ////////////////
        
        function activate() {
            getBrands();
            // return getDeals();
        }

        function isDealEmpty() {
            return vm.prepDeals.total == 0;
        }

        function getBrands(){
            angular.forEach(vm.deals, function(deal, index) {
                DealService.findInList(deal.uid).then(function(data) {
                    deal = data;
                });
            });
        }

        function clearSearch() {
            vm.searchItem = '';
            search();
        }

        function search() {
            vm.isLoading = true;

            if (vm.searchItem.trim().length > 0) {
                vm.isSearch = true;
            } else {
                vm.isSearch = false;
            }

            DealService.search(vm.searchItem).then(function(resp) {
                vm.deals = resp;
                vm.isLoading = false;
            }).catch(function(err) {
                $log.log(err);
            });
        }

        function getDeals() {
            vm.isRetrieving = true;
            return DealService.getAll().then(function(data) {
                vm.prepDeals = data;
                vm.deals = vm.prepDeals.deals;
                getBrands();
                vm.isRetrieving = false;
                $timeout(function() {
                    vm.response.msg = false;
                }, 3000);
                return vm.deals;
            });
        }

        function deleteDeal(element, deal) {
            bootbox.confirm({
                title: "Confirm Delete",
                message: "Are you sure you want to delete deal: <b>" + deal.name + "</b>?",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function(result) {
                    if (result) {
                        Ladda.create(element).start();
                        doDelete(deal);
                    }
                }
            });
        }

        function doDelete(deal) {
            DealService.delete(deal.uid).then(function(resp) {
                vm.hasDeleted = true;
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = "Deleted deal: " + deal.name;
                getDeals();
                vm.hasAdded = true;
                vm.isDone = true;
            }).catch(function() {
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to delete deal: " + deal.name;
                vm.hasAdded = true;
                vm.isDone = true;
            });
        }
    }
})();
