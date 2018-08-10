define(['app', 'urlTool'], function (app) {
    // productPropertiesDetailController.$inject = ['$scope', 'urlTool', 'productPropertiesService', '$routeParams','routeService','toastr','$uibModal','utils']
    return function DailyReportDetailWY($scope, urlTool, DailyReportService, DailyReportJumpService, $routeParams, routeService, toastr, $uibModal, utils) {
        app.controller('DailyReportDetailWY', DailyReportDetailWY);
        var search = urlTool.search();
        var service = DailyReportService;
        $scope.dataClass = {};
        $scope.list = {};
        $scope.texing = search.mode == 'texing';
        
        $('.date-timepicker1').datetimepicker({
//          minView: 'month',            //设置时间选择为年月日 去掉时分秒选择
            format: 'yyyy-mm-dd hh:ii',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1,
            language: 'zh-CN'              //设置时间控件为中文
        }).on('changeDate', function(event) {  
		    event.preventDefault();  
		    event.stopPropagation();  
		    var startTime = event.date; 
		    
		    $(".date-timepicker2").datetimepicker('setStartDate',startTime);  
		});
        
         $('.date-timepicker2').datetimepicker({
//          minView: 'month',            //设置时间选择为年月日 去掉时分秒选择
            format: 'yyyy-mm-dd hh:ii',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1,
            language: 'zh-CN'              //设置时间控件为中文
        }).on('changeDate', function(event) {  
		    event.preventDefault();  
		    event.stopPropagation();  
		    var setEndDate = event.date;
		    $(".date-timepicker1").datetimepicker('setEndDate',setEndDate);  
		});
		
		if (typeof DailyReportService.getProcess() == 'object') {
			$scope.master = DailyReportService.getProcess();
		}else {
			$scope.master = {};
		}

        switch (search.mode) {
            case 'add':
            if (DailyReportService.get()) {
	        	$scope.list = DailyReportService.get()
	        }
                break;
            case 'edit':
            if (typeof DailyReportService.get() == 'object') {
	        	$scope.list = DailyReportService.get()
	        }else {
	        	service.lists.getListInfoById($routeParams.id).then(function(res) {
	        		console.log(res, 'getListInfoById')
	        		$scope.list = res.data[0];
	        		
                	$scope.master = angular.copy($scope.list);
                	DailyReportService.setProcess($scope.master)
	        	})
	        }
                
                break;
        }
        
//      $scope.propstatus = true; //总状态
//      //验证编码唯一性
//      if ($scope.list.PropId != null && $scope.list.PropId != undefined) {
//          $scope.id = $scope.list.PropId;
//      } else {
//          $scope.id = -1;
//      }
//      $scope.Codeurl = "/api/BasicData/ProductProperties/UniqueCheckPropCode/";
//          $scope.descurl = "/api/basicdata/ProductProperties/UniqueCheckPropDesc/";
        $scope.signupForm = function () {
            if ($scope.signup_form.$valid) {
                if ($scope.list.Active == undefined) {
                    $scope.list.Active = true;
                }
                
                if ($scope.list.ID) {
                	$scope.list.UpdateBy = localStorage.getItem('UserID')
                    service.lists.editListInfo($scope.list).then(function (res) {
                        if (res.status == 200) {
                            utils.notifySuccess('修改成功', 'success');
                            DailyReportJumpService.setClass('')
                            DailyReportService.set('')
                            DailyReportService.setProcess('')
                            routeService.path('/system/DailyReport')
                        } else if (res.status == 404) {
                            utils.notifyError("修改失败", 'error');
                        } else if (res.status == 400) {
                            utils.notifyError("修改失败", 'error');
                        } else {
                            utils.notifyError("修改失败", 'error');
                        }
                    })
                } else {
                	$scope.list.CreateBy = localStorage.getItem('UserID')
                    service.lists.addListInfo($scope.list).then(function (res) {
                        if (res.status == 200) {
                            utils.notifySuccess('添加成功', 'success');
                            DailyReportJumpService.setClass('')
                            DailyReportService.set('')
                            DailyReportService.setProcess('')
                            routeService.path('/system/DailyReport');
                        } else if (res.status == 400) {
                            utils.notifyError("请求参数有误", 'error');
                        } else {
                            utils.notifyError("添加失败", 'error');
                        }
                    })
                }
            } else {
                utils.notifyError('请填写必要字段', 'info');
                $scope.signup_form.submitted = true;
            }
        };

        $scope.IsCancel = false;
        $scope.refresh = function ($event) {
            var currentElement = angular.element($event.currentTarget);
            var text = currentElement.data('text');
            
            if (typeof DailyReportService.getClass() == 'object') {
            	$scope.signup_form.$dirty = true
            }
            
            if ($scope.signup_form.$dirty) {
                $scope.IsCancel = !$scope.IsCancel;
                $scope.newList = $scope.list;
                $scope.texts = text;

                if (text == 'r') {
                    $scope.modal = {
                        title: '提示信息',
                        msg: '重置后，修改内容将丢失，是否确认重置？'
                    };
                } else {
                    $scope.modal = {
                        title: '提示信息',
                        msg: '关闭后，数据丢失，是否确认关闭？'
                    };
                }
            } else {
                if (text != "r") {
                	DailyReportService.setProcess('')
                	DailyReportJumpService.setClass('')
                    routeService.path('/system/DailyReport')
                } else {
                	
                	$scope.list = angular.copy($scope.master);
                    return;
                }
            }
        }
        $scope.asdasd = function () {
            $scope.required = true;
        };
        $scope.ok = function ($event) {
            if ($scope.texts != "r") {
            	DailyReportJumpService.setClass('')
            	DailyReportService.set('')
            	DailyReportService.setClass('')
            	DailyReportService.setProcess('')
                routeService.path('/system/DailyReport');
                $scope.IsCancel = false;
            } else {
            	$scope.signup_form.$dirty = false
            	DailyReportService.set('')
        		DailyReportService.setClass('')
                angular.copy($scope.master, $scope.list);
                $scope.IsCancel = false;
                $scope.list.Active = true; 
                return;
            }
        }
        
        $scope.ac = function() {
        	DailyReportService.set($scope.list)
        }
    
    	
    	if (DailyReportJumpService.getClass().length > 0) {
    		$scope.list.APMOProjectID = DailyReportJumpService.getClass()[0].ID
    		$scope.list.APMOProjectCode = DailyReportJumpService.getClass()[0].ProjectCode
    		
    		$scope.list.APMOProjectName = DailyReportJumpService.getClass()[0].ProjectName
    	}else if (typeof DailyReportJumpService.getClass() == 'object') {
    		$scope.list.APMOProjectID = DailyReportJumpService.getClass().ID
    		$scope.list.APMOProjectCode = DailyReportJumpService.getClass().ProjectCode
    		
    		$scope.list.APMOProjectName = DailyReportJumpService.getClass().ProjectName
    	}
    	
    	$scope.deleteValue = function() {
    		$scope.list.APMOProjectCode = ''
    		$scope.list.APMOProjectName = ''
    			DailyReportJumpService.set('');
    			DailyReportJumpService.setClass('');
    	}
    
    
    
    }

})
