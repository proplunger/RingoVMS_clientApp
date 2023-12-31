export enum AppPermissions {
    ADMIN_CLIENT_VIEW = "admin_client_view",
    ADMIN_DASHBOARD_VIEW = "admin_dashboard_view",
    ADMIN_GLOBAL_VIEW = "admin_global_view",
    ADMIN_ONBOARD_TASK_CREATE = "admin_onboard_task_create",
    ADMIN_ONBOARD_TASK_DELETE = "admin_onboard_task_delete",
    ADMIN_ONBOARD_TASK_UPDATE = "admin_onboard_task_update",
    ADMIN_ONBOARD_TASK_VIEW = "admin_onboard_task_view",
    ADMIN_REQ_RELEASE_CREATE = "admin_req_release_create",
    ADMIN_REQ_RELEASE_DELETE = "admin_req_release_delete",
    ADMIN_REQ_RELEASE_UPDATE = "admin_req_release_update",
    ADMIN_REQ_RELEASE_VIEW = "admin_req_release_view",
    ADMIN_RESET_JOB_DATE = "admin_reset_job_date",
    ADMIN_RESET_REQ_DATE = "admin_reset_req_date",
    ADMIN_RESET_USER_TERM = "admin_reset_user_term",
    ADMIN_VENDOR_VIEW = "admin_vendor_view",
    ADMIN_WF_TRANSITION_CREATE = "admin_wf_transition_create",
    ADMIN_WF_TRANSITION_DELETE = "admin_wf_transition_delete",
    ADMIN_WF_TRANSITION_UPDATE = "admin_wf_transition_update",
    ADMIN_CAN_IMPERSONATE = "admin_can_impersonate",
    AUTHENTICATED = "authenticated",
    CAND_SUB_REJECT_NAME_CLEAR = "cand _sub_reject_name_clear",
    CAND_DOC_CREATE = "cand_doc_create",
    CAND_DOC_DELETE = "cand_doc_delete",
    CAND_DOC_UPDATE = "cand_doc_update",
    CAND_DOC_VIEW = "cand_doc_view",
    CAND_INTVW_CANCEL = "cand_intvw_cancel",
    CAND_INTVW_CREATE = "cand_intvw_create",
    CAND_INTVW_DELETE = "cand_intvw_delete",
    CAND_INTVW_REQUEST = "cand_intvw_request",
    CAND_INTVW_RESULT_APPROVE = "cand_intvw_result_approve",
    CAND_INTVW_RESULT_CREATE = "cand_intvw_result_create",
    CAND_INTVW_RESULT_CRITERIA_CREATE = "cand_intvw_result_criteria_create",
    CAND_INTVW_RESULT_CRITERIA_DELETE = "cand_intvw_result_criteria_delete",
    CAND_INTVW_RESULT_CRITERIA_UPDATE = "cand_intvw_result_criteria_update",
    CAND_INTVW_RESULT_CRITERIA_VIEW = "cand_intvw_result_criteria_view",
    CAND_INTVW_RESULT_DELETE = "cand_intvw_result_delete",
    CAND_INTVW_RESULT_REJECT = "cand_intvw_result_reject",
    CAND_INTVW_RESULT_UPDATE = "cand_intvw_result_update",
    CAND_INTVW_RESULT_VIEW = "cand_intvw_result_view",
    CAND_INTVW_SCHEDULE = "cand_intvw_schedule",
    CAND_INTVW_SLOT_BOOK = "cand_intvw_slot_book",
    CAND_INTVW_SLOT_CANCEL = "cand_intvw_slot_cancel",
    CAND_INTVW_SLOT_CREATE = "cand_intvw_slot_create",
    CAND_INTVW_SLOT_UPDATE = "cand_intvw_slot_update",
    CAND_INTVW_SLOT_VIEW = "cand_intvw_slot_view",
    CAND_INTVW_UPDATE = "cand_intvw_update",
    CAND_INTVW_VIEW = "cand_intvw_view",
    CAND_JOB_HISTORY_VIEW = "cand_job_history_view",
    CAND_JOB_SUM_VIEW = "cand_job_sum_view",
    CAND_ONBOARD_CREDENTIAL_FULL = "cand_onboard_credential_full",
    CAND_ONBOARD_CREDENTIAL_SEND = "cand_onboard_credential_send",
    CAND_ONBOARD_CREDENTIAL_TEMP = "cand_onboard_credential_temp",
    CAND_ONBOARD_SEND_BACK = "cand_onboard_send_back",
    CAND_ONBOARD_SUBMIT = "cand_onboard_submit",
    CAND_ONBOARD_TASK_APPROVE = "cand_onboard_task_approve",
    CAND_ONBOARD_TASK_CREATE = "cand_onboard_task_create",
    CAND_ONBOARD_TASK_DELETE = "cand_onboard_task_delete",
    CAND_ONBOARD_TASK_REJECT = "cand_onboard_task_reject",
    CAND_ONBOARD_TASK_UNDER_REVIEW = "cand_onboard_task_under_review",
    CAND_ONBOARD_TASK_UPDATE = "cand_onboard_task_update",
    CAND_ONBOARD_TASK_VIEW = "cand_onboard_task_view",
    CAND_ONBOARD_VIEW = "cand_onboard_view",
    CAND_OWNERSHIP_HISTORY_VIEW = "cand_ownership_history_view",
    CAND_SUB_ASSIGNMENT_CREATE = "cand_sub_assignment_create",
    CAND_SUB_ASSIGNMENT_DELETE = "cand_sub_assignment_delete",
    CAND_SUB_ASSIGNMENT_UPDATE = "cand_sub_assignment_update",
    CAND_SUB_ASSIGNMENT_VIEW = "cand_sub_assignment_view",
    CAND_SUB_BILL_RATE_APPROVE = "cand_sub_bill_rate_approve",
    CAND_SUB_BILL_RATE_CREATE = "cand_sub_bill_rate_create",
    CAND_SUB_BILL_RATE_DELETE = "cand_sub_bill_rate_delete",
    CAND_SUB_BILL_RATE_NEGOTIATE = "cand_sub_bill_rate_negotiate",
    CAND_SUB_BILL_RATE_REJECT = "cand_sub_bill_rate_reject",
    CAND_SUB_BILL_RATE_UPDATE = "cand_sub_bill_rate_update",
    CAND_SUB_BILL_RATE_VIEW = "cand_sub_bill_rate_view",
    CAND_SUB_CLIENT_PRESENT_CREATE = "cand_sub_client_present_create",
    CAND_SUB_CLIENT_PRESENT_REJECT = "cand_sub_client_present_reject",
    CAND_SUB_CLIENT_PRESENT_SEND = "cand_sub_client_present_send",
    CAND_SUB_CLIENT_PRESENT_SUBMIT = "cand_sub_client_present_submit",
    CAND_SUB_CLIENT_PRESENT_UPDATE = "cand_sub_client_present_update",
    CAND_SUB_CLIENT_PRESENT_VIEW = "cand_sub_client_present_view",
    CAND_SUB_COMMENT_CREATE = "cand_sub_comment_create",
    CAND_SUB_COMMENT_VIEW = "cand_sub_comment_view",
    CAND_SUB_CONTRACT_APPROVE = "cand_sub_contract_approve",
    CAND_SUB_CONTRACT_CREATE = "cand_sub_contract_create",
    CAND_SUB_CONTRACT_DELETE = "cand_sub_contract_delete",
    CAND_SUB_CONTRACT_NEGOTIATE = "cand_sub_contract_negotiate",
    CAND_SUB_CONTRACT_REJECT = "cand_sub_contract_reject",
    CAND_SUB_CONTRACT_SUBMIT = "cand_sub_contract_submit",
    CAND_SUB_CONTRACT_UPDATE = "cand_sub_contract_update",
    CAND_SUB_CONTRACT_VIEW = "cand_sub_contract_view",
    CAND_SUB_CREATE = "cand_sub_create",
    CAND_SUB_DELEGATE_NAME_CLEAR = "cand_sub_delegate_name_clear",
    CAND_SUB_DELETE = "cand_sub_delete",
    CAND_SUB_HISTORY_VIEW = "cand_sub_history_view",
    CAND_SUB_NAME_CLEAR = "cand_sub_name_clear",
    CAND_SUB_NAME_CLEAR_CLIENT = "cand_sub_name_clear_client",
    CAND_SUB_REJECT_NAME_CLEAR_CLIENT = "cand_sub_reject_name_clear_client",
    CAND_SUB_OFFER_ACCEPT = "cand_sub_offer_accept",
    CAND_SUB_OFFER_CREATE = "cand_sub_offer_create",
    CAND_SUB_OFFER_REJECT = "cand_sub_offer_reject",
    CAND_SUB_OFFER_REQUEST = "cand_sub_offer_request",
    CAND_SUB_OFFER_SUBMIT = "cand_sub_offer_submit",
    CAND_SUB_OFFER_VIEW = "cand_sub_offer_view",
    CAND_SUB_REJECT = "cand_sub_reject",
    CAND_SUB_RISK_CLEAR = "cand_sub_risk_clear",
    CAND_SUB_RISK_CREATE = "cand_sub_risk_create",
    CAND_SUB_RISK_REJECT = "cand_sub_risk_reject",
    CAND_SUB_RISK_SUBMIT = "cand_sub_risk_submit",
    CAND_SUB_RISK_UPDATE = "cand_sub_risk_update",
    CAND_SUB_RISK_VIEW = "cand_sub_risk_view",
    CAND_SUB_SUBMIT = "cand_sub_submit",
    CAND_SUB_UPDATE = "cand_sub_update",
    CAND_SUB_VENDOR_PRESENT_CREATE = "cand_sub_vendor_present_create",
    CAND_SUB_VENDOR_PRESENT_REJECT = "cand_sub_vendor_present_reject",
    CAND_SUB_VENDOR_PRESENT_SUBMIT = "cand_sub_vendor_present_submit",
    CAND_SUB_VENDOR_PRESENT_UPDATE = "cand_sub_vendor_present_update",
    CAND_SUB_VENDOR_PRESENT_VIEW = "cand_sub_vendor_present_view",
    CAND_SUB_VIEW = "cand_sub_view",
    CAND_SUB_WITHDRAW = "cand_sub_withdraw",
    CAND_TAG_CREATE = "cand_tag_create",
    CAND_TAG_DELETE = "cand_tag_delete",
    CAND_TAG_UPDATE = "cand_tag_update",
    CAND_TAG_VIEW = "cand_tag_view",
    CANDIDATE_CREATE = "candidate_create",
    CANDIDATE_DELETE = "candidate_delete",
    CANDIDATE_UPDATE = "candidate_update",
    CLIENT_CREATE = "client_create",
    CLIENT_DELETE = "client_delete",
    CLIENT_DIV_CREATE = "client_div_create",
    CLIENT_DIV_DELETE = "client_div_delete",
    CLIENT_DIV_UPDATE = "client_div_update",
    CLIENT_INVOICE_AUTHORIZE = "client_invoice_authorize",
    CLIENT_INVOICE_CREATE = "client_invoice_create",
    CLIENT_INVOICE_DELETE = "client_invoice_delete",
    CLIENT_INVOICE_PAY = "client_invoice_pay",
    CLIENT_INVOICE_PAY_HISTORY_VIEW = "client_invoice_pay_history_view",
    CLIENT_INVOICE_RESET = "client_invoice_reset",
    CLIENT_INVOICE_UPDATE = "client_invoice_update",
    CLIENT_INVOICE_VIEW = "client_invoice_view",
    CLIENT_JOB_POSITION_CREATE = "client_job_position_create",
    CLIENT_JOB_POSITION_DELETE = "client_job_position_delete",
    CLIENT_JOB_POSITION_UPDATE = "client_job_position_update",
    CLIENT_LOB_CREATE = "client_lob_create",
    CLIENT_LOB_DELETE = "client_lob_delete",
    CLIENT_LOB_UPDATE = "client_lob_update",
    CLIENT_LOC_CREATE = "client_loc_create",
    CLIENT_LOC_DELETE = "client_loc_delete",
    CLIENT_LOC_UPDATE = "client_loc_update",
    CLIENT_RATE_CARD_CREATE = "client_rate_card_create",
    CLIENT_RATE_CARD_DELETE = "client_rate_card_delete",
    CLIENT_RATE_CARD_UPDATE = "client_rate_card_update",
    CLIENT_RATE_CARD_VIEW = "client_rate_card_view",
    CLIENT_REGION_CREATE = "client_region_create",
    CLIENT_REGION_DELETE = "client_region_delete",
    CLIENT_REGION_UPDATE = "client_region_update",
    CLIENT_SETTING_UPDATE = "client_setting_update",
    CLIENT_UPDATE = "client_update",
    CLIENT_VENDOR_MAP_CREATE = "client_vendor_map_create",
    CLIENT_VENDOR_MAP_DELETE = "client_vendor_map_delete",
    CLIENT_VENDOR_MAP_UPDATE = "client_vendor_map_update",
    CLIENT_VIEW = "client_view",
    DEBIT_CREDIT_CREATE = "debit_credit_create",
    DEBIT_CREDIT_DELETE = "debit_credit_delete",
    DEBIT_CREDIT_UPDATE = "debit_credit_update",
    DEBIT_CREDIT_VIEW = "debit_credit_view",
    EVENT_HISTORY_VIEW = "event_history_view",
    EXPENSE_CREATE = "expense_create",
    EXPENSE_DELETE = "expense_delete",
    EXPENSE_UPDATE = "expense_update",
    EXPENSE_VIEW = "expense_view",
    GLOBAL_JOB_CAT_CREATE = "global_job_cat_create",
    GLOBAL_JOB_CAT_DELETE = "global_job_cat_delete",
    GLOBAL_JOB_CAT_UPDATE = "global_job_cat_update",
    GLOBAL_JOB_POSITION_CREATE = "global_job_position_create",
    GLOBAL_JOB_POSITION_DELETE = "global_job_position_delete",
    GLOBAL_JOB_POSITION_UPDATE = "global_job_position_update",
    GLOBAL_JOB_SKILL_CREATE = "global_job_skill_create",
    GLOBAL_JOB_SKILL_DELETE = "global_job_skill_delete",
    GLOBAL_JOB_SKILL_UPDATE = "global_job_skill_update",
    REPORT_CAND_SUBMITTAL = "report_cand_submittal",
    REPORT_CLIENT_ACTIVITY = "report_client_activity",
    REPORT_CLIENT_STATEMENT = "report_client_statement",
    REPORT_EXPIRING_CREDENTIAL = "report_expiring_credential",
    REPORT_FILLED_ASSIGNMENT = "report_filled_assignment",
    REPORT_REQ_PERFORMANCE = "report_req_performance",
    REPORT_TS_VIEW = "report_ts_view",
    REPORT_VENDOR_PERFORMANCE = "report_vendor_performance",
    REPORT_CI_ACCOUNTING = "report_ci_accounting",
    REPORT_CI_DETAIL = "report_ci_detail",
    REPORT_CI_SUMMARY = "report_ci_summary",
    REPORT_TS_DETAIL = "report_ts_detail",
    REQ_APPROVE = "req_approve",
    REQ_APPROVER_CREATE = "req_approver_create",
    REQ_APPROVER_DELETE = "req_approver_delete",
    REQ_APPROVER_UPDATE = "req_approver_update",
    REQ_APPROVER_VIEW = "req_approver_view",
    REQ_CLOSE = "req_close",
    REQ_CANCEL = "req_cancel",
    REQ_COMMENT_CREATE = "req_comment_create",
    REQ_COMMENT_VIEW = "req_comment_view",
    REQ_COPY = "req_copy",
    REQ_CREATE = "req_create",
    REQ_DELETE = "req_delete",
    REQ_DOCUMENT_CREATE = "req_document_create",
    REQ_DOCUMENT_DELETE = "req_document_delete",
    REQ_DOCUMENT_UPDATE = "req_document_update",
    REQ_DOCUMENT_VIEW = "req_document_view",
    REQ_HISTORY_VIEW = "req_history_view",
    REQ_HOLD = "req_hold",
    REQ_OFFHOLD = "req_offhold",
    REQ_PO_UPDATE = "req_po_update",
    REQ_POSITION_HOLD = "req_position_hold",
    REQ_PRIVATE_COMMENT_CREATE = "req_private_comment_create",
    REQ_PRIVATE_COMMENT_VIEW = "req_private_comment_view",
    REQ_REJECT = "req_reject",
    REQ_RELEASE = "req_release",
    REQ_RELEASE_CREATE = "req_release_create",
    REQ_RELEASE_DELETE = "req_release_delete",
    REQ_RELEASE_UPDATE = "req_release_update",
    REQ_RELEASE_VIEW = "req_release_view",
    REQ_SUBMIT = "req_submit",
    REQ_TAG_CREATE = "req_tag_create",
    REQ_TAG_DELETE = "req_tag_delete",
    REQ_TAG_UPDATE = "req_tag_update",
    REQ_TAG_VIEW = "req_tag_view",
    REQ_UPDATE = "req_update",
    REQ_VIEW = "req_view",
    REQ_BATCH_RELEASE = "req_batch_release",
    TS_APPROVE = "ts_approve",
    TS_UNDER_REVIEW_CREATE = "ts_under_review_create",
    TS_UNDER_REVIEW_VIEW = "ts_under_review_view",
    TS_APPROVER_CREATE = "ts_approver_create",
    TS_APPROVER_DELETE = "ts_approver_delete",
    TS_APPROVER_UPDATE = "ts_approver_update",
    TS_APPROVER_VIEW = "ts_approver_view",
    TS_CREATE = "ts_create",
    TS_DOCUMENT_CREATE = "ts_document_create",
    TS_DOCUMENT_DELETE = "ts_document_delete",
    TS_DOCUMENT_UPDATE = "ts_document_update",
    TS_DOCUMENT_VIEW = "ts_document_view",
    TS_REJECT = "ts_reject",
    TS_RESET = "ts_reset",
    TS_SERV_TYPE_CREATE = "ts_serv_type_create",
    TS_SERV_TYPE_DELETE = "ts_serv_type_delete",
    TS_SERV_TYPE_UPDATE = "ts_serv_type_update",
    TS_SERV_TYPE_VIEW = "ts_serv_type_view",
    TS_SUBMIT = "ts_submit",
    TS_UPDATE = "ts_update",
    TS_VIEW = "ts_view",
    TS_WORK_HISTORY_VIEW = "ts_work_history_view",
    TS_PROVIDER_WORK_HISTORY = "ts_provider_work_history",
    USER_CAL_EVENT_CREATE = "user_cal_event_create",
    USER_CAL_EVENT_DELETE = "user_cal_event_delete",
    USER_CAL_EVENT_UPDATE = "user_cal_event_update",
    USER_CAL_EVENT_VIEW = "user_cal_event_view",
    USER_CREATE = "user_create",
    USER_DASHBOARD_SETTING_UPDATE = "user_dashboard_setting_update",
    USER_DELETE = "user_delete",
    USER_INVITE = "user_invite",
    USER_AUTO_REGISTER = "user_auto_register",
    USER_NOTIFICIATION_SETING_UPDATE = "user_notificiation_seting_update",
    USER_SEARCH_CREATE = "user_search_create",
    USER_SEARCH_DELETE = "user_search_delete",
    USER_SEARCH_PIN = "user_search_pin",
    USER_SEARCH_UPDATE = "user_search_update",
    USER_SEARCH_VIEW = "user_search_view",
    USER_UPDATE = "user_update",
    USER_VIEW = "user_view",
    VENDOR_CREATE = "vendor_create",
    VENDOR_DELETE = "vendor_delete",
    VENDOR_INVOICE_APPROVE = "vendor_invoice_approve",
    VENDOR_INVOICE_CREATE = "vendor_invoice_create",
    VENDOR_INVOICE_PAY_HISTORY = "vendor_invoice_pay_history",
    VENDOR_INVOICE_REJECT = "vendor_invoice_reject",
    VENDOR_INVOICE_REMIT = "vendor_invoice_remit",
    VENDOR_INVOICE_RESET = "vendor_invoice_reset",
    VENDOR_INVOICE_SUBMIT = "vendor_invoice_submit",
    VENDOR_INVOICE_UNDER_REVIEW = "vendor_invoice_under_review",
    VENDOR_INVOICE_UPDATE = "vendor_invoice_update",
    VENDOR_INVOICE_VIEW = "vendor_invoice_view",
    VENDOR_INVOICE_WF_HISTORY_VIEW = "vendor_invoice_wf_history_view",
    VENDOR_UPDATE = "vendor_update",
    VENDOR_VIEW = "vendor_view",
    CAND_SHARE_APPROVE = "cand_share_approve",
    TS_JOB_DETAIL = "ts_job_detail",
    TS_ONBOARDING_DETAIL = "ts_onboarding_detail",
    REPORT_MULTI_CLIENT_VIEW = "report_multi_client_view",
    REMIT_TO_VENDOR = "remit_to_vendor",
    GLOBAL_SERV_TYPE_VIEW = "global_serv_type_view",
    GLOBAL_SERV_TYPE_CREATE = "global_serv_type_create",
    GLOBAL_SERV_TYPE_UPDATE = "global_serv_type_update",
    GLOBAL_SERV_TYPE_DELETE = "global_serv_type_delete",
    REPORT_TS_CBI_NUMBER_VIEW = "report_ts_cbi_number_view",
    NOTIFICATION_TEMPLATE_VIEW = "notification_template_view",
    NOTIFICATION_TEMPLATE_CREATE = "notification_template_create",
    NOTIFICATION_TEMPLATE_DELETE = "notification_template_delete",
    NOTIFICATION_TEMPLATE_UPDATE = "notification_template_update",
    REPORT_SPEND_FORECAST = "report_spend_forecast",
    GENERATE_CONFIRMATION_LETTER = "generate_confirmation_letter",
    DEACTIVATE_CONFIRMATION_LETTER = "deactivate_confirmation_letter",
    VI_UNDER_REVIEW_CREATE = "vi_under_review_create",
    VI_UNDER_REVIEW_VIEW = "vi_under_review_view",
    UPDATE_CONFIRMATION_LETTER = "update_confirmation_letter",
    EDIT_PRESENTATION_INFO = "edit_presentation_info",
    EVENT_VIEW = "event_view",
    SUP_TKT_VIEW = "sup_tkt_view",
    SUP_TKT_CREATE = "sup_tkt_create",
    SUP_TKT_UPDATE = "sup_tkt_update",
    SUP_TKT_DELETE = "sup_tkt_delete",
    MSG_CREATE = "msg_create",
    MSG_UPDATE = "msg_update",
    MSG_DELETE = "msg_delete",
    CAND_OWNERSHIP_END = "cand_ownership_end",
    CONTENT_LIBRARY_VIEW = "content_library_view",
    CONTENT_LIBRARY_CREATE = "content_library_create",
    CONTENT_LIBRARY_DELETE = "content_library_delete",
    CONTENT_LIBRARY_UPDATE = "content_library_update",
    CONTENT_LIBRARY_USER_VIEW = "content_library_user_view",
    REMIT_SCHEDULED_PAYMENT = "remit_scheduled_payment",
    ASSIGNMENT_EXTEND_REQUEST = "assignment_extend_request",
    ASSIGNMENT_EXTEND = "assignment_extend",
    ASSIGNMENT_EXTEND_VIEW = "assignment_extend_view",
    AUDIT_LOG = "audit_log"
}