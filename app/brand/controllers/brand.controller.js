(function() {
    'use strict';

    angular.module('app')
        .controller('BrandController', BrandController);

    BrandController.$inject = ['BrandService', 'brandPrepService'];

    /* @ngInject */
    function BrandController(BrandService, brandPrepService) {
        var vm = this;

        vm.brands = brandPrepService;
        vm.getBrands = getBrands;
        vm.hasDeleted = false;
        vm.response = {};
        vm.deleteBrand = deleteBrand;

        activate();

        ////////////////

        function activate() {
            return getBrands();
        }

        function getBrands() {
            return BrandService.getAll().then(function(data) {
                vm.brands = data;
                return vm.brands;
            });
        }

        function deleteBrand(brand) {
            bootbox.confirm({
                title: "Confirm Delete",
                message: "Are you sure you want to delete brand: <b>" + brand.title + "</b>?",
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
                        doDelete(brand.id);
                    }
                }
            });

        }

        function doDelete(id) {
            BrandService.delete(id).then(function(resp) {
                vm.hasDeleted = true;
                vm.response['success'] = "alert-success";
                vm.response['alert'] = "Success!";
                vm.response['msg'] = resp.data.message;
                getBrands();
                vm.hasAdded = true;
            }).catch(function() {
                vm.response['success'] = "alert-danger";
                vm.response['alert'] = "Error!";
                vm.response['msg'] = "Failed to delete brand.";
                vm.hasAdded = true;
            });
        }
    }
})();