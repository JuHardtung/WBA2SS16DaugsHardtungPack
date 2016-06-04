// Exposed Module
// Dokumentation / Reference: doc/ResponseHelper.md
//

//
var ResponseHelper = {
  //raw responses, legacy
  ok: SuccessResponse,
  error: FailureResponse,
  //
  informational: Informational,
  successful: Successful,
  redirection: Redirection,
  clientError: ClientError,
  serverError: ServerError,
};

// Legacy Methods
function SuccessResponse(payload) {
  this.status = "OK";
  this.payload = payload || [];
}
function FailureResponse(code, message, validation) {
  this.status = "error";
  this.code = code || 500;
  this.message = message || 'Unknown Error';
  this.validation = validation; // if validation is undefined it wont appear in the json key list
}
// /LegacyMethods
// ....
// Current Methods

function Informational(code, new_protocol){
	this.success = true;
	this.code = code;

	switch(code){
		case 100:
			this.status = 'Continue';
			break;

		case 101:
			this.status = 'Switching Protocols';
			this.upgrade = new_protocol;
			break;

		default:
			this.code = 100;
			this.status = 'Continue';
	}
}

function Successful(code, payload, resource_id, msg){

	this.success = true;
	this.code = code;
	this.payload = payload || [];

	switch(code){
		case 200:
			console.log('Response: ' + code );
			this.status = 'ok';
			this.payload = payload || [];
			this.message = 'Request succeeded';
      break;

		case 201:
			this.status = 'Created';
			this.message = 'New Resource created';
			this.location = resource_id;
      break;

		case 202:
			this.status = 'Accepted';
			this.message = 'Request accepted, not processed yet';
      break;

		case 204:
			this.status = 'No Content'
			//204 darf keinen Message Body haben
			//this.message = 'Request Successfull'
      break;

    case 205:
    	this.status = 'Reset Content';
    	this.message = 'Request fullfilled. Please reset Client-View to make changes visible.';
    	break;

		case 226:
			this.status = 'IM used'
			this.message = 'Resource Instance manipulated. Not Saved.'
      break;

		default:
			this.status = 'OK'
			this.message = 'Request Succeeded';
	}

}

function Redirection(code, resource_list, preferred_resource_location){
	this.success = true;
	this.code = code;

	switch(code){
		case 300:
			this.status = 'Multiple Choices';
			this.message = 'Please choose your appropriate Resource Representaion.';
			this.resources = resource_list;
			this.location = preferred_resource_location;
			break;

		case 301:
			this.status = 'Moved Permanently';
			break;

		case 302:
			this.status = 'Found';
			break;

		case 303:
			this.status = 'See other';
			break;

		case 304:
			this.status = 'Not modified';
			break;

		case 305:
			this.status = 'Use Proxy';
			break;
		//case 306 Currently specified as: Unused

		case 307:
			this.status = 'Temporary Redirect';
			break;

		default:
			this.status = 'Redirection'
	}
}

//
//code
//msg: Validierungsfehler, aus db zurückgegebene fehler oä...
function ClientError(code, resource, resource_id, msg){

	this.success = false;
	this.code = code;
	this.status = 'Client Error';
	//
	switch(code){
		case 400:
			this.status = 'Bad Request';
			this.message = msg || '';
			break;

		case 401:
			this.status = 'Unauthorized';
			this.message = msg || '';
			break;

		case 402:
			this.status = 'Payment Required';
			this.message = msg || '';
			break;

		case 403:
			this.status = 'Forbidden';
			this.message = msg || '';
			break;

		case 404:
			this.status = 'Not Found';
			this.message = 'Resource: '+resource+' with #Id: '+resource_id+' not found.';
			break;

		case 405:
			this.status = 'Not Allowed';
			this.message = 'Accessing Resource: '+resource+' with #Id: '+resource_id+' is not allowed.';
			this.message += (msg.method=='delete') ? 'Delete Request not allowed. To manipulate this ressource use PUT request.' : '' ;
			break;

		case 406:
			this.status = 'Not Acceptable';
			this.message = 'Resource: '+resource+' with #Id: '+resource_id+' not found.';
			break;

		/*case 407:
			this.status = 'Proxy Authentication Required';
			this.message = msg || '';
			break;
		*/
		case 409:
			//
			this.status = 'Conflict';
			this.message = msg || 'Request could not be completed due to Conflict of current State of Resource: '+resource+' with #Id: '+resource_id+' ';
      break;

		case 410:
			// deaktivierte
			this.status = 'Gone';
			this.message = msg || '';
			break;

		default:
			this.code = 400;
			this.status = 'Bad Request';
			this.message = msg || 'Error';
  }
}

function ServerError(code, resource, resource_id, msg){

	this.success = false;
	this.code = code;
	this.status = 'Internal Server Error';
	//
	switch(code){
		case 501:
			this.detail = 'Not Implemented';
			this.message = 'Requested Method not supported';
			this.resolve = '';
			break;

		case 503:
			this.detail = 'Service Unavailable';
			this.message = {'retry-after-secs': 60};
			break;

		default:
			this.code = 500;
			this.status = 'Internal Server Error';
	}
}


module.exports = ResponseHelper;
