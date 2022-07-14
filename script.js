jQuery(document).ready(function ($) {
	var _FULL_NAME_PATTERN = /^[a-z ,.'-]+$/i;
	var _MOBILE_NUMBER_PATTERN = /^[0-9 +()]+$/i;
	var _NUMBER_PATTERN = /^[0-9]+$/i;
	var _TEXT_PATTERN = /^[a-z0-9 ,.'-]+$/i;
	var _EMAIL_PATTERN = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
	var isValidForm = true, isValidDistributorForm = true, postCode = "", postCodeDetails = null, gas="", isValidPostcode = false, companyId = "", 
	companyDetails = {
		id: '',
		name: '',
		address: '',
		phone: '',
		email: '',
		facebook: '',
		website: ''
	};

	function setUpValidation() {
		isValidForm = true;
		let inputs = $(".validate");
		for (let i = 0; i < inputs.length; i++) {
			validateAndSetClass(inputs[i]);
		}
		return isValidForm;
	}

	function distributorValidation() {
		isValidForm = true;
		let inputs = $(".validateDistributor");
		for (let i = 0; i < inputs.length; i++) {
			validateDistributorAndSetClass(inputs[i]);
		}
		return isValidForm;
	}

	function validateAndSetClass(input) {
		if (input.id === "fullName") {
			testInputAndSetClass(input, _FULL_NAME_PATTERN);
		}

		if (input.id === "phone") {
			testInputAndSetClass(input, _MOBILE_NUMBER_PATTERN);
		}

		if (input.id === "email") {
			testInputAndSetClass(input, _EMAIL_PATTERN);
		}

		if (input.id === "address") {
			testInputAndSetClass(input, _TEXT_PATTERN);
		}

		return input;
	}

	function validateDistributorAndSetClass(input) {
		switch(input.id) {
			case "fullNameDistributor":
				testInputAndSetClass(input, _FULL_NAME_PATTERN);
				break;
			case "phoneDistributor":
				testInputAndSetClass(input, _MOBILE_NUMBER_PATTERN);
				break;
			case "emailDistributor":
				testInputAndSetClass(input, _EMAIL_PATTERN);
				break;
			case "addressDistributor":
				testInputAndSetClass(input, _TEXT_PATTERN);
				break;
			case "postcodeDistributor":
				testInputAndSetClass(input, _NUMBER_PATTERN);
				break;
			case "cityDistributor":
				testInputAndSetClass(input, _TEXT_PATTERN);
				break;
			case "businessNameDistributor":
				input.classList.add('is-valid');
				break;
			default:
				break;
		}
		return input;
	}

	function testInputAndSetClass(input, pattern) {
		if (pattern.test(input.value)) {
			input.classList.remove('is-invalid');
			input.classList.add('is-valid');
		} else {
			input.classList.remove('is-valid');
			input.classList.add('is-invalid');
			isValidForm = false;
		}
	}

	$('#btnMapCheck').click(function() {
		var postcodeSearchVal = $('#postcodeSearch').val();
		if(postcodeSearchVal != "") {
			postCodeDetailsTemp = postCodeList.find(el => (el.postcode == postcodeSearchVal || el.city.toLowerCase() == postcodeSearchVal.toLowerCase()));
			var companyNumberMap = 7;
			if(postCodeDetailsTemp) {
				switch(postCodeDetailsTemp.column) {
					// Bendigo Cylinder Testing
					case 'bct':
						companyNumberMap = 2;
						break;
					// Macedon Ranges Gas Company
					case 'mrg':
						companyNumberMap = 3;
						break;
					// Goulburn Valley Oil Supplies (Gulf Western)
					case 'shepparton':
						companyNumberMap = 4;
						break;
					// Redcastle Farm and Rural Montasell Pty Ltd
					case 'redcastle':
						companyNumberMap = 5;
						break;
					// Statewide Fire Protection
					case 'statewide':
						companyNumberMap = 6;
						break;
					// Hilditch Oilchem Gas n Go
					default:
						companyNumberMap = 7;
						break;
				}	
			}
			else {
				companyNumberMap = 7;
			}
			var selectorTemp = "#mapContainer [role='button']:nth-child(" + companyNumberMap + ")";
			$(selectorTemp).trigger('click');
		}
		else {
			triggerAlert(false, 'Enter your postcode or surburb.');
		}
	});

	$(".alert-submit").hide();
	
	$('#postCode1').change(function () {
		var selectedPostcode = $('#postCode1').val();
		$('#postcodeModal').val(selectedPostcode);
	});

	$("#postCode1").keyup(function(){
		postCode = $("#postCode1").val();
		if(postCode === "") {
			$('#btnCheckPostCode').prop('disabled', true);
			$('#iconValidPostcode').addClass('invisible');
			$('#btnNext').prop('disabled', true);
		}
		else
		{
			$('#btnCheckPostCode').prop('disabled', false);
			if(gas != '')
				$('#btnNext').prop('disabled', false);	
		}
	});

	$('#btnCheckPostCode').click(function() {
		validatePostcode();			
	});

	function validatePostcode() {
		postCodeDetails = postCodeList.find(el => el.postcode == postCode);
		if(postCodeDetails) {
			isValidPostcode = true;
			$('#step1CheckMark').removeClass('d-none');
			$('#step1ErrorMark').addClass('d-none');
			$('#textInvalidPostcode').removeClass('d-block').addClass('d-none');
		}
		else {
			isValidPostcode = false;
			$('#step1CheckMark').addClass('d-none');
			$('#step1ErrorMark').removeClass('d-none');
			$('#textInvalidPostcode').removeClass('d-none').addClass('d-block');
		}
	}

	$('#btnNext').click(function() {
		getCompanyId();
	});

	function getCompanyId() {
		postCodeDetails = postCodeList.find(el => el.postcode == postCode);
		if(/cylinderExchange|cylinder45/.test(gas) && postCodeDetails) {
			switch(postCodeDetails.column) {
				case 'bct':
					companyId = 'BendigoCylinderTesting';
					break;
				case 'mrg':
					companyId = 'MacedonRangesGas';
					break;
				case 'shepparton':
					companyId = 'GoulburnValleyOilSupplies';
					break;
				case 'redcastle':
					companyId = 'RedcastleFarmandRuralMontasell';
					break;
				case 'statewide':
					companyId = 'StatewideFireProtection';
					break;
				default:
					companyId = 'HilditchOilchemGasnGo';
					break;
			}	
		}
		else {
			companyId = 'HilditchOilchemGasnGo';
		}
		getCompany();
	}
	function getCompany() {
		companyDetails = companyList.find(cpy => cpy.id == companyId);
		$('#selectCompanies').val(companyId);
		$('#companyAddressModal').text(companyDetails.address);
		$('#dropdownCompanyName').text(companyDetails.name);
		$('#companyNameModal').text(companyDetails.name);
		$('#companyPhoneModal').text(companyDetails.phone);
		$('#companyEmailModal').text(companyDetails.email);

		if(companyDetails.facebook != '') {
			// $('#companyFacebookModal').text(companyDetails.facebook);
			$('#companyFacebookModal').attr("href", companyDetails.facebook);
			$('#companyFacebookContainer').removeClass('d-none');
		}
		else {
			$('#companyFacebookContainer').addClass('d-none');
		}

		if(companyDetails.website != '') {
			$('#companyWebsiteModal').text(companyDetails.website);
			$('#companyWebsiteContainer').removeClass('d-none');
		}
		else {
			$('#companyWebsiteContainer').addClass('d-none');
		}
		if(postCodeDetails)
			$('#cityModal').val(postCodeDetails.city);
		else
			$('#cityModal').val('');
	}

	// $('.gas-dropdown-item').css('cursor','pointer');
	$('.gas-dropdown-item').click(function() {
	// $(document).on('click', '.gas-dropdown-item',  function(event) {
	// $('.gas-dropdown-item').on('click', function() {
		gas = $(this).attr('id');
		var gasText = $(this).text();
		if($( window ).width() < 600)
			gasText = gasText.slice(0, 17);
		$('#gasValHome').text(gasText);
		$('#gasValModal').text(gasText);
		$('#productModal').val(gas);
		$('#btnNext').prop('disabled', false);
		if(gas != "" && postCode != "") {
			$('#btnNext').prop('disabled', false);
		}
		else {
			$('#btnNext').prop('disabled', true);
		}
	});

	$('.company-dropdown-item').click(function() {
		companyId = $(this).attr('id');
		getCompany();
		
	});
	
	
	function triggerAlert(isSuccess, message) {
		if(isSuccess) {
			$("#submit-alert").removeClass('alert-danger').addClass('alert-success');
		}
		else {
			$("#submit-alert").removeClass('alert-success').addClass('alert-danger');
		}
		$('#alert-content').text(message);
		$("#submit-alert").fadeTo(2000, 500).slideUp(500, function() {
			$("#submit-alert").slideUp(500);
		});
	}
	
	var frm = $('#ajaxformid');
    frm.submit(function (e) {
		if(setUpValidation())
		{
			triggerAlert(true, 'Sent emails successfully.');
			gasDetails = gasList.find(item => item.name == gas);
			var formData = {
				fullName: jQuery('#fullName').val(),
				phone: jQuery('#phone').val(),
				email: jQuery('#email').val(),
				address: jQuery('#address').val(),
				city: jQuery('#cityModal').val(),
				postcode: jQuery('#postcodeModal').val(),
				company: companyDetails.name,
				companyPhone: companyDetails.phone,
				companyEmail: companyDetails.email,
				gas: gasDetails.value,
				action:'distributor_mail'
			};
			$.ajax({
				type        : 'POST', 
				url         : jQuery('#ajaxURL').val(),
				data        : formData,
				dataType    : 'json',
				encode          : true
			}).done(function(data) {
				console.log('email_done', data);        
			}).fail(function(data) {
				console.log('email_fail', data);
			});
		} 
		else {
			triggerAlert(false, 'Error: Check your fields again.');
		}
		e.preventDefault();    
    });

	function initializeDistributorForm() {
		jQuery('#fullNameDistributor').val('');
		jQuery('#businessNameDistributor').val('');
		jQuery('#phoneDistributor').val('');
		jQuery('#emailDistributor').val('');
		jQuery('#addressDistributor').val('');
		jQuery('#cityDistributor').val('');
		jQuery('#postcodeDistributor').val('');
		let inputs = $(".validateDistributor");
		for (let i = 0; i < inputs.length; i++) {
			inputs[i].classList.remove('is-invalid');
			inputs[i].classList.remove('is-valid');
		}
	}

	function initializeOrderForm() {
		postCode = "";
		postCodeDetails = null;
		gas="";
		isValidPostcode = false;
		companyId = "";
		companyDetails = {
			id: '',
			name: '',
			address: '',
			phone: '',
			email: '',
			facebook: '',
			website: ''
		};
		jQuery('#fullName').val('');
		jQuery('#phone').val('');
		jQuery('#email').val('');
		jQuery('#address').val('');
		jQuery('#cityModal').val('');
		jQuery('#postcodeModal').val('');
		jQuery('#postCode1').val('');
		jQuery('#gasValHome').text('Select gas');
		$('#btnCheckPostCode').prop('disabled', true);
		$('#btnNext').prop('disabled', true);
		$('#textInvalidPostcode').removeClass('d-block').addClass('d-none');
		$('#step1CheckMark').addClass('d-none');
		$('#step1ErrorMark').addClass('d-none');
		let inputs = $(".validate");
		for (let i = 0; i < inputs.length; i++) {
			inputs[i].classList.remove('is-invalid');
			inputs[i].classList.remove('is-valid');
		}
	}

	$("#modalDistributor").on("hidden.bs.modal", function () {
		initializeDistributorForm();
	});

	$("#modalOrder").on("hidden.bs.modal", function () {
		initializeOrderForm();
	});

    $('#distributorForm').submit(function (e) {
		if(distributorValidation())
		{
			triggerAlert(true, 'Sent emails successfully.');
			var formData = {
				fullName: jQuery('#fullNameDistributor').val(),
				businessName: jQuery('#businessNameDistributor').val(),
				phone: jQuery('#phoneDistributor').val(),
				email: jQuery('#emailDistributor').val(),
				address: jQuery('#addressDistributor').val(),
				city: jQuery('#cityDistributor').val(),
				postcode: jQuery('#postcodeDistributor').val(),
				action:'become_distributor_mail'
			};
			$.ajax({
				type        : 'POST', 
				url         : jQuery('#ajaxURL').val(),
				data        : formData,
				dataType    : 'json',
				encode          : true
			}).done(function(data) {
				console.log('email_done', data);        
			}).fail(function(data) {
				console.log('email_fail', data);
			});
		} 
		else {
			triggerAlert(false, 'Error: Check your fields again.');
		}
		e.preventDefault();    
    });
});