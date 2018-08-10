
define(['app', 'urlTool'], function (app) {
    // companyController.$inject = ['$scope', 'urlTool', 'http', 'toastr', 'DailyReportJumpService', 'utils', '$rootScope', '$routeParams'];

  return  function DailyReportJumpControllerWY($scope, urlTool, http, toastr, DailyReportJumpService, utils, $rootScope, $routeParams) {
    app.controller('DailyReportJumpControllerWY', DailyReportJumpControllerWY);
        var service = DailyReportJumpService.lists;
        $scope.close = urlTool.close;
        $scope.create = urlTool.create;
        $scope.flag = false;
        //表格列表服务
        $scope.headerInfos = [
         	{ 'name': '项目编码', 'col': 'ProjectCode' , 'isHide': true ,'dataType':'str'},
            { 'name': '项目名称', 'col': 'ProjectName' , 'isHide': true,'dataType':'str' },
            { 'name': '项目状态', 'col': 'ProjectStatus', 'isHide': true ,'dataType':'str' },
        ];
        $scope.order = 'Container';
        $scope.key = '';
        //列显示
        $scope.isOpen = false;
        $scope.refresh = function () {
            $scope.key="";
            getAllData();
        };

        function getAllData() {
        	
        	if ($scope.forSearch) {
        		$scope.forSearch = false
        		return
        	}
        	
            var orderBy = '';
            var sort = '';
            if ($scope.order.indexOf('-') == '0') {
                orderBy = $scope.order.replace('-', '');
                sort = 'desc';
            } else {
                orderBy = $scope.order;
                sort = 'asc';
            }
            var params = {
                pageIndex: $scope.paginationConf.currentPage,
                pageSize: $scope.paginationConf.itemsPerPage
            };
            service.getPage(params.pageSize, params.pageIndex)
                .then(function (res) {
                    if (res.status == 200) {
                        $scope.paginationConf.totalItems = res.data.total;
                        $scope.datas = res.data.rows;
//                      if ($rootScope.showCurSelect) {
//                          for (var i = 0; i < $scope.datas.length; i++) {
//                              if ($scope.datas[i].EnterpriseID == $rootScope.showCurSelect) {
//                                  // for (var j = 0; j < $scope.chkItem.length; j++) {
//                                  //     $scope.chkItem[i] = false;
//                                  // }
//                                  // $scope.chkItem[i - 1] = true;
//                              }
//                              if ($scope.datas[i].UnitID == $rootScope.showCurSelect) {
//                                  // for (var j = 0; j < $scope.chkItem.length; j++) {
//                                  //     $scope.chkItem[i] = false;
//                                  // }
//                                  // $scope.chkItem[i - 1] = true;
//                              }
//                          }
//                      }
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
            getAllData();
        }
        $scope.paginationConf = {
            currentPage: 1,
            itemsPerPage: 50    
        }
        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getAllData);
        $scope.arr = []; //用来显示选中的内容
        $scope.chkItem = []; //用来标志每一项的状态
        $scope.edit = urlTool.edit;
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
        $scope.isdisabled = true;
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

            if ($scope.arr.length > 1 || $scope.arr.length == 0) {
                $scope.isdisabled = true;
            } else {
                $scope.isdisabled = false;
            }
        }
        $scope.ck = function (item) {
            //  if (item.length>1) {
            //         toastr.info('请选择一条数据');
            //         return false;
            //     }
            
            console.log(item, 'item')

            DailyReportJumpService.set(item);
            var index = $scope.datas.indexOf(item); //得到当前的索引
            $scope.datas[index].checked = !$scope.datas[index].checked; //设置当前的状态

            if ($scope.datas[index].checked) {
                $scope.arr = $scope.datas[index]

            }
            getArr();
        };
        var init = function (sel) {
            for (var i = 0; i < $scope.datas.length; i++) {
                $scope.chkItem[i] = sel || false;
            }
        };
        //删除 
        $scope.modal = {
            title: '删除',
            msg: '确定要删除吗？'
        };
        $scope.delVal = false;
        $scope.remove = function (item) {
            $scope.delVal = !$scope.delVal
            if (!item.length) {
                toastr.info('请选择一条数据');
                return false;
            }
            for (var i = 0; i < item.length; i++) {
                var num = $scope.datas.indexOf(item[i]);
                $scope.datas.splice(num, 1);
                service.delete(item[i].EnterpriseID).then(function (res) {
                    if (res.status == 200) {
                        utils.notifySuccess('删除成功', 'delete');
                    } else if (res.status == 404) {
                        utils.notifyError("删除失败", 'error')
                    } else if (res.status == 400) {
                        utils.notifyError("删除失败", 'error')
                    } else {
                        utils.notifyError("删除失败", 'error')
                    }
                })
            }
            $scope.arr = [];
            for (var i = 0; i < $scope.datas.length; i++) {
                $scope.chkItem[i] = false;
            }
        };

        $scope.selectData = function (item) {

            DailyReportJumpService.setClass(item);
            //   ?console.log(workorderListService.getClass())
            history.back();
        }
        $scope.close = function (item) {
DailyReportJumpService.setClass('');
            history.back();
        }



		$scope.searchBut = function() {
			
			if (!$scope.headers) {
				toastr.info('请选择一条搜索条件');
				return
			}else if (!$scope.key) {
				service.getPageByID(null, null, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage)
					.then(function(res) {
						$scope.datas = res.data.rows
						$scope.paginationConf.totalItems = res.data.total
						console.log(res, 'res')
					})
				return
			}
			
			console.log('arr', $scope.headers)
			service.getPageByID($scope.headers, $scope.key, $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage)
			.then(function(res) {
				$scope.datas = res.data.rows
				
				$scope.paginationConf.totalItems = res.data.total
				
//				$scope.paginationConf = {
//					totalItems : res.data.total,
//					currentPage : 1,
//					itemsPerPage : $scope.paginationConf.itemsPerPage
//				}
				
				
				
				$scope.forSearch = true
				console.log(res, 'res')
			})
		}

    }
})