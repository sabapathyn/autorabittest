jQuery(function () {
  jQuery('[data-toggle="tooltip"]').tooltip()
})

function loading(val) {
	if(val) {
		jQuery('#slds-loading-generate').removeClass('slds-hide');
	} else {
		jQuery('#slds-loading-generate').addClass('slds-hide');
	}
}
