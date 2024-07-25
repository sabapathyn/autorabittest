(function(){
	'use strict';
	angular.module('ncTemplateGenerator').controller('TemplateGeneratorController', TemplateGeneratorController);
	TemplateGeneratorController.$inject = ['$scope', 'templateGeneratorService', 'config', 'messageService', 'metadataService', 'pubsub', 'label', 'ui', 'remotingManager'];
	function TemplateGeneratorController($scope, templateGeneratorService, config, messageService, metadataService, pubsub, label, ui, remotingManager) {
		$scope.config = config.get();
		$scope.labels = label.getLabels();

		$scope.initialize = function(){
			$scope.publishTopic = 'objectSelected';
			$scope.headers = [
				$scope.labels.Namespace,
				$scope.labels.Object
			];

			$scope.displayedColumns = [
				'namespacePrefix',
				'label'
			];

			pubsub.subscribe($scope.publishTopic, function(selectedRow){
				$scope.selectText = selectedRow.apiName;
				$scope.selectedObject = selectedRow;
			});
			$scope.successes = [];
			$scope.failures = [];
		}

		$scope.generateTemplates = function(){
			$scope.successes = [];
			$scope.failures = [];
			ui.block();
			var templateType = $scope.includeSecondaryNav ? "nFORCE__Template_Base" : "nFORCE__Template_Landing";
			var files = templateGeneratorService.generateAllFiles($scope.selectedObject.objectNameWithoutSuffix, $scope.selectedObject.apiName, 'LLC_BI.', templateType);

			metadataService.connectToSalesforce($scope.config.salesforceSessionId);

			metadataService.createMetadata('ApexPage', files, function(err, results) {
				var errorMessage, result;
				$scope.createdVFPage = false;
				$scope.createdRouteConfig = false;
				$scope.createdDefaultAppField = false;
				if(err && err.message){
					errorMessage = err.message;
				}
				if(results){
					if(results.errors){
						errorMessage = results.errors.message;
					}
					for (var i = 0; i < results.length; i++) {
						result = results[i];
						if(!result.success){
							errorMessage = result.errors.message;
							break;
						}
					}
				}
				if(!angular.isUndefined(errorMessage)){
					$scope.error = errorMessage;
					$scope.displayResults();
				}else{
					$scope.createdVFPage = true;
					$scope.createRouteConfig();
				}
			});
		}

		$scope.displayResults = function(){
			ui.unblock();
			if($scope.createdVFPage){
				$scope.successes.push($scope.labels.Visualforce_Page);
			}else{
				$scope.failures.push($scope.labels.Visualforce_Page);
			}
			if($scope.createdRouteConfig){
				$scope.successes.push($scope.labels.Route_With_Name + $scope.route.name);
				$scope.successes.push($scope.labels.Group_With_Name + $scope.group.name);
			}else{
				$scope.failures.push($scope.labels.Route_Configuration);
			}
			if($scope.createdDefaultAppField){
				$scope.successes.push($scope.labels.Default_App_Field);
			}else{
				$scope.failures.push($scope.labels.Default_App_Field);
			}
			$scope.$apply();
		}

		$scope.createRouteConfig = function(){
			remotingManager.invokeAction(
				$scope.config.configureObjectForUIAction,
				$scope.selectedObject.label,
				$scope.selectedObject.apiName,
				function(routeConfigResults, event){
					if(event.status){
						$scope.createdRouteConfig = true;
						$scope.group = {name: routeConfigResults.groupName, app: routeConfigResults.groupApp};
						$scope.route = {name: routeConfigResults.routeName, app: routeConfigResults.routeApp};
						if(!routeConfigResults.defaultAppFieldExists){
							$scope.createDefaultAppField();
						}else{
							$scope.error = $scope.labels.Default_App_Field_Already_Exists;
							$scope.displayResults();
						}
					}else{
						$scope.error = event.message;
						$scope.displayResults();
					}
				},
				{escape: false}
			);
		}

		$scope.createDefaultAppField = function(){
			var defaultAppMetadata = {
				fullName: $scope.selectedObject.apiName + '.Default_App__c',
				label: 'Default App',
				required: 'false',
				type: 'Text',
				length: 255,
				defaultValue: "'" + $scope.group.app + "." + $scope.route.app + "'"
			};
			metadataService.createMetadata('CustomField', defaultAppMetadata, function(error, fieldCreationResults){
				var errorMessage, fieldCreationResult;
				if(error && error.message){
					errorMessage = error.message;
				}
				if(fieldCreationResults){
					if(fieldCreationResults.errors){
						errorMessage = fieldCreationResults.errors.message;
					}
					for (var i = 0; i < fieldCreationResults.length; i++) {
						fieldCreationResult = fieldCreationResults[i];
						if(!fieldCreationResult.success){
							errorMessage = fieldCreationResult.errors.message;
							break;
						}
					}
				}
				if(angular.isUndefined(errorMessage)){
					$scope.createdDefaultAppField = true;
					$scope.setFieldPermissions();
				}else{
					$scope.error = errorMessage;
					$scope.displayResults();
				}

			});
		}

		$scope.setFieldPermissions = function(){
			var editableFieldPermissionsMetadata = [{
				field: $scope.selectedObject.apiName + '.Default_App__c',
				editable: true,
				readable: true
			}];
			var profileMetadata = [{
				fullName: 'Admin',
				custom: true,
				fieldPermissions: editableFieldPermissionsMetadata
			},
			{
				fullName: 'System Administrator',
				custom: false,
				fieldPermissions: editableFieldPermissionsMetadata
			}];

			metadataService.updateMetadata('Profile', profileMetadata, function(error, profilePermissionsResults){
				$scope.displayResults();
			});
		}

		$scope.initialize();
	}
})();