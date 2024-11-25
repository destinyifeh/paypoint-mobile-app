import { CRM_API_BASE_URL } from "../../../constants/api-resources";
import { retrieveAuthToken } from "../../../utils/auth";
import Requester from "../requester";
const API_BASE_URL = CRM_API_BASE_URL;
const authToken = retrieveAuthToken();
export default class CRMService {
  constructor(props) {
    this.apiRequester = props
      ? props.apiRequester ||
        new Requester({
          apiBaseUrl: API_BASE_URL,
        })
      : new Requester({
          apiBaseUrl: API_BASE_URL,
        });
  }

  getIssuesHistory(
    startDate,
    endDate,
    pageNum,
    pageSize,
    transactionType,
    status
  ) {
    return this.apiRequester.get({
      endpoint: "v1/finch-crm/issue-history",
      args: {
        startDate: startDate,
        endDate: endDate,
        pageNumber: pageNum,
        pageSize: pageSize,
        transactionType: transactionType,
        status: status,
      },
    });
  }

  getFilterIssues(
    startDate,
    endDate,
    pageNum,
    pageSize,
    transactionType,
    status
  ) {
    return this.apiRequester.get({
      endpoint: "v1/finch-crm/issue-history",
      args: {
        startDate: startDate,
        endDate: endDate,
        pageNumber: pageNum,
        pageSize: pageSize,
        transactionType: transactionType,
        status: status,
      },
    });
  }

  handleIssueSearch(value) {
    return this.apiRequester.get({
      endpoint: "v1/finch-crm/issue-history",
      args: {
        transRef: value,
      },
    });
  }

  handleIssueAlternativeData(startDate, endDate, pageNum, pageSize) {
    return this.apiRequester.get({
      endpoint: "v1/finch-crm/issue-history",
      args: {
        startDate: startDate,
        endDate: endDate,
        pageNumber: pageNum,
        pageSize: pageSize,
      },
    });
  }

  getTicketNumber(ticketNumber) {
    return this.apiRequester.get({
      endpoint: `v1/finch-crm/tickets/${ticketNumber}`,
    });
  }

  getTransactionTicket(transRef) {
    return this.apiRequester.get({
      endpoint: `v1/finch-crm/transactions/${transRef}/tickets`,
    });
  }

  submitComment(ticketNumber, payload) {
    const formData = new FormData();
    if (payload.documentType === undefined) {
      formData.append("noteBody", payload.description);

      return this.apiRequester.post({
        endpoint: `v1/finch-crm/tickets/${ticketNumber}/comments`,
        headers: {
          "content-type": "multipart/form-data",
        },
        body: formData,
      });
    } else {
      formData.append("attachment", payload.file);
      formData.append("noteBody", payload.description);

      return this.apiRequester.post({
        endpoint: `v1/finch-crm/tickets/${ticketNumber}/comments`,
        headers: {
          documentType: payload.documentType,
          "content-type": "multipart/form-data",
        },
        body: formData,
      });
    }
  }

  submitComplaint(payload) {
    const formData = new FormData();
    if (payload.documentType === undefined) {
      formData.append("transactionRef", payload.transactionRef);
      formData.append("transactionType", payload.transactionType);
      formData.append("transactionDate", payload.transactionDate);
      formData.append("amount", payload.amount);
      formData.append("description", payload.description);
      formData.append("transactionStatus", payload.transactionStatus);
      formData.append("beneficiaryAccountNo", payload.beneficiaryAccountNo);
      formData.append("agentPhoneNo", payload.agentPhoneNo);
      formData.append("rrn", payload.rrn);
      formData.append("maskedPan", payload.maskedPan);
      formData.append("beneficiaryPhoneNo", payload.beneficiaryPhoneNo);
      formData.append("customerId", payload.customerId);
      formData.append("terminalId", payload.terminalId);
      formData.append("customerPhoneNo", payload.customerPhoneNo);

      return this.apiRequester.post({
        endpoint: "v1/finch-crm/tickets",
        headers: {
          "content-type": "multipart/form-data",
        },
        body: formData,
      });
    } else {
      formData.append("attachment", payload.attachment);
      formData.append("transactionRef", payload.transactionRef);
      formData.append("transactionType", payload.transactionType);
      formData.append("transactionDate", payload.transactionDate);
      formData.append("amount", payload.amount);
      formData.append("description", payload.description);
      formData.append("transactionStatus", payload.transactionStatus);
      formData.append("beneficiaryAccountNo", payload.beneficiaryAccountNo);
      formData.append("agentPhoneNo", payload.agentPhoneNo);
      formData.append("rrn", payload.rrn);
      formData.append("maskedPan", payload.maskedPan);
      formData.append("beneficiaryPhoneNo", payload.beneficiaryPhoneNo);
      formData.append("customerId", payload.customerId);
      formData.append("terminalId", payload.terminalId);
      formData.append("customerPhoneNo", payload.customerPhoneNo);

      return this.apiRequester.post({
        endpoint: "v1/finch-crm/tickets",
        headers: {
          documentType: payload.documentType,
          "content-type": "multipart/form-data",
        },
        body: formData,
      });
    }
  }

  onReopenIssue(ticketNumber, payload) {
    const formData = new FormData();
    if (payload.documentType === undefined) {
      formData.append("reason", payload.description);

      return this.apiRequester.post({
        endpoint: `v1/finch-crm/tickets/${ticketNumber}/reopen`,
        headers: {
          "content-type": "multipart/form-data",
        },
        body: formData,
      });
    } else {
      formData.append("attachment", payload.file);
      formData.append("reason", payload.description);

      return this.apiRequester.post({
        endpoint: `v1/finch-crm/tickets/${ticketNumber}/reopen`,
        headers: {
          documentType: payload.documentType,
          "content-type": "multipart/form-data",
        },
        body: formData,
      });
    }
  }
}
