'use strict';

var app = angular.module('ncTemplateGenerator');

app.service('metadataService', function() {
	var connection;

	this.connectToSalesforce = function(salesforceSessionId){
		connection = new jsforce.Connection({ accessToken: salesforceSessionId});
	}

	this.createMetadata = function(metadataType, metadata, callback){
		connection.metadata.create(metadataType, metadata, callback);
	}

	this.updateMetadata = function(metadataType, metadata, callback){
		connection.metadata.update(metadataType, metadata, callback);
	}
});