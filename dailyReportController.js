define(['app', 'urlTool'], function (app) {
    //  app.controller('flowController', flowController);
    //  flowController.$inject =  ['$scope', 'urlTool', 'http', 'toastr','utils', 'DailyReportService'];
    return function DailyReportWY($scope, urlTool, http, toastr, utils, DailyReportService, $location, routeService) {
        app.controller('DailyReportWY', DailyReportWY);
        var service = DailyReportService.lists;
        $scope.close = urlTool.close;
        $scope.create = urlTool.create;
        $scope.edit = urlTool.edit;

        //表格列表服务
        $scope.headerInfos = [
            { 'name': '项目编码', 'col': 'APMOProjectCode', 'isHide': true,'dataType':'str' },
            { 'name': '项目名称', 'col': 'APMOProjectName', 'isHide': true },
            { 'name': '开始时间', 'col': 'StartTime', 'isHide': true,'dataType':'str' },
            { 'name': '结束时间', 'col': 'EndTime', 'isHide': true,'dataType':'str' },
            { 'name': '记录人', 'col': 'CreateName', 'isHide': true,'dataType':'str' },
            { 'name': '记录人角色', 'col': 'CreateRole', 'isHide': true,'dataType':'str' },
            { 'name': '记录时间', 'col': 'CreateOn', 'isHide': true,'dataType':'str'},

        ];
        $scope.order = 'Container';
        $scope.key = '';
        $scope.paginationConf = {
            currentPage: 1,
            itemsPerPage: 50
        };
        $scope.refresh = function () {
            $scope.selectAll = false;
            $scope.key = "";
            $scope.arr = [];
            getAllData();

        };
        //列显示
        $scope.isOpen = false;
        function getAllData() {
            var params = {
                pageIndex: $scope.paginationConf.currentPage,
                pageSize: $scope.paginationConf.itemsPerPage
            };
            // 查询接口
            service.getListInfo(params.pageSize, params.pageIndex)
                .then(function (res) {
                    if (res.status == 200) {
                        utils.notifySuccess('查询成功', 'success');
                        
                        console.log(res, 'res')
                        $scope.paginationConf.totalItems = res.data.total;
                        $scope.datas = res.data.rows;
                        console.log($scope.datas, 'datas')

                    }
                    if (res.status == 404) {
                        utils.notifyError("资源未找到", 'error')
                    }
                })
        };
        $scope.toggleSort = function (index) {
            var obj = $scope.headerInfos[index];
            $scope.order = obj.col;
            if (obj.col.indexOf('-') == '0') {
                obj.col = obj.col.replace('-', '');
            } else {
                obj.col = '-' + obj.col;
            }
            console.log($scope.order, 'order')
            getAllData();
        }
        
         $scope.paginationConf = {
            currentPage: 1,
            itemsPerPage: 50    
        }

        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getAllData);
        //全选

        $scope.checkAll = function (v) {
            for (var i = 0; i < $scope.datas.length; i++) {
                $scope.datas[i].checked = v;
            }
            getArr();
        };
        $scope.isAll = function () {
            getArr();
            var b = $scope.arr.length == $scope.datas.length;
            if (b) {
                $scope.selectAll = true;
            } else {
                $scope.selectAll = false;
            }
        }
        $scope.toggleSort = function (index) {
            var obj = $scope.headerInfos[index];
            $scope.order = obj.col;
            if (obj.col.indexOf('-') == '0') {
                obj.col = obj.col.replace('-', '');
            } else {
                obj.col = '-' + obj.col;
            }
            getAllData();
        }

        function getArr() {
            $scope.arr = [];
            for (var i = 0; i < $scope.datas.length; i++) {
                if ($scope.datas[i].checked) {
                    $scope.arr.push($scope.datas[i]);
                }
            }
            if ($scope.arr.length == $scope.datas.length) {
                $scope.selectAll = true;
            } else {
                $scope.selectAll = false;
            }
        }
        
        $scope.testCk = function() {
        	console.log($scope.datas, 'datas')
        }
        
        $scope.ck = function (item) {
            item.isTrue = true;
            
            console.log($scope.datas, 'datas')
            
//          DailyReportService.set(item);
            var index = $scope.datas.indexOf(item); //得到当前的索引
            $scope.datas[index].checked = !$scope.datas[index].checked; //设置当前的状态
            getArr();
        };
        
        $scope.delArr = {};//用来放流程删除的数据
        $scope.IDs = [];//用来放流程删除的数据

        //删除 
        $scope.modal = {
            title: '删除',
            msg: '确定要删除吗？'
        };
        //根据流程ID删除对应流程\
        $scope.delVal = false;
        $scope.remove = function (item) {
            $scope.delVal = !$scope.delVal
            if (!item.length) {
                toastr.info('请选择一条数据');
                return false;
            }
            var delall=[];
            for (var i = 0; i < item.length; i++) {
                if(item[i].checked){
                    delall.push({
                        "id":item[i].ID
                    })
                }
            }
            var delIds = []
            
            angular.forEach(item, function(item1) {
            	delIds.push(item1.ID)
            })
            
            service.deleteListInfo({
			  "DeleteID": delIds
			}).then(function (res) {
                if (res.status == 200) {
                    utils.notifySuccess('删除成功', 'delete');
                    getAllData();
                } else if (res.status == 404) {
                    utils.notifyError("删除失败", 'error')
                } else if (res.status == 400) {
                    utils.notifyError("删除失败", 'error')
                } else {
                    utils.notifyError("删除失败", 'error')
                }

            })
            $scope.arr = [];
        };

        //删除时点击关闭，清空数组
        $scope.delClose = function (item) {
            $scope.delVal = !$scope.delVal;
            $scope.IDs = [];
            for (var i = 0; i < $scope.datas.length; i++) {
                $scope.chkItem[i] = false;
            }
        };
        
        $scope.searchBut = function() {
			
			if (!$scope.headers) {
				toastr.info('请选择一条搜索条件');
				return
			}else if (!$scope.key) {
				service.searchListInfoById(null, null, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage)
					.then(function(res) {itemsPerPage
						$scope.paginationConf.totalItems = res.data.total;
						$scope.datas = res.data.rows
					})
				return
			}
			
			console.log($scope.key, 'arr', $scope.headers)
			service.searchListInfoById($scope.headers, $scope.key, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage)
			.then(function(res) {
				$scope.paginationConf.totalItems = res.data.total;
				$scope.datas = res.data.rows
			})
		}


    }
})