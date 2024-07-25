public class DemoSetupConstants {
    public static final String PORTAL_UPLOAD_APP_NAME = 'CustomerPortalFileUploadApp';
    public static final String OAUTH_APP_NAME = 'Portal_OAuth66';
    public static final String SECRET_GUID = new nFORCE.GuidGenerator().randomUUIDNoUnderscores();
    public static final String BASEURL = String.valueOf(URL.getSalesforceBaseUrl().toExternalForm()).substringBefore('--');
    public static final String PORTAL_CREDENTIAL_NAME = 'PortalUploadCredential';
	public static final String CALLBACK_URL = '/apex/LLC_BI__Admin?app=admin.ruleengineoauth2';
    public static final String RULES_ENGINE_CATEGORY = 'Rule_Engine_Communicator';
    public static final String CUSTOMER_PORTAL_CATEGORY = 'CUSTOMER_PORTAL';
    public static final String OCR_CATEGORY = 'OCR_Communicator';
    public static final String OAUTH2_CONSUMER_KEY = 'OAUTH2_CONSUMER_KEY';
    public static final String URL_STRING = '/services/oauth2/authorize?client_id=';
    public static final String RESPONSE_TYPE = '&response_type=code';
    public static final String REDIRECT_URI = 'redirect_uri';
    public static final Double VERSION_NUMBER = 49.0;
    public static final String DATA_RECOGNITION_APP_NAME = 'Data_Recognition';
    public static final String DATA_RECOGNITION_LABEL = 'Data Recognition Demo ';
    public static final String DATA_RECOGNITION_DESCRIPTION = 'Data Recognition Demo';
    public static final String DATA_RECOGNITION_CALLBACK = '/apex/ncinoocr__ocrcommunicator';
    public static final String DATA_RECOGNITION_PERMSET = 'Automated_Spreading_Authorization';
    public static final String WEB_SERVICES_AUTHORIZER_BEAN_NAME = 'ncinoocr.WebServicesAuthorizerXpkg';
    public static final String WEB_SERVICES_AUTHORIZER_RESULT_FIELD = 'result';
    public static final String nCino_UI_Category = 'nCino UI built with LWC';

}