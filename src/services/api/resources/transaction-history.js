import { TRANSACTION_HISTORY_API_BASE_URL } from "../../../constants/api-resources";
import Requester from "../finch-requester";

const API_BASE_URL = TRANSACTION_HISTORY_API_BASE_URL;

export default class TransactionHistory {
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

  downloadTransactionsReport(
    domainCode,
    endDate,
    pageNum,
    pageSize,
    parentReference,
    startDate,
    statusCodeInt,
    transactionTypeInt,
    username,
    transactionRef
  ) {
    return this.apiRequester.get({
      // endpoint: `transactions/search/download/details`, >>> transaction history
      endpoint: `v2/finch-transaction-history-service/journal/mini-statement/download`, // >>> statement of account
      args: {
        endDate,
        startDate,
        status: statusCodeInt,
        transactionType: transactionTypeInt,
      },
    });
  }

  getCommissionHistory(
    agentId,
    pageNum,
    pageSize,
    startDate,
    endDate,
    transactionTypeInt,
    event
  ) {
    return this.apiRequester.getIgnore401({
      endpoint: `v2/finch-transaction-history-service/commissions/`,
      args: {
        agentId,
        pageNum,
        pageSize,
        start: startDate,
        transactionTypeInt,
        event,
        end: endDate,
      },
    });
  }

  getTopContributors(startDate, endDate, dateInterval) {
    return this.apiRequester.getIgnore401({
      endpoint:
        "v3/finch-transaction-history-service/commissions/earnings/top-contributors",
      args: {
        from: startDate,
        to: endDate,
        dateIntervalType: dateInterval,
      },
    });
  }

  getCommissionsStats(dateInterval) {
    return this.apiRequester.getIgnore401({
      endpoint: "v3/finch-transaction-history-service/commissions/stats",
      args: {
        dateIntervalType: dateInterval,
      },
    });
  }

  getCommissionsWithdrawalReport(dateInterval, pageNum, pageSize) {
    return this.apiRequester.getIgnore401({
      endpoint: "v3/finch-transaction-history-service/commissions/withdrawals",
      args: {
        dateIntervalType: dateInterval,
         pageNum, 
         pageSize
      },
    });
  }


  getWithdrawalSummarry(dateInterval) {
    return this.apiRequester.getIgnore401({
      endpoint:
        "v3/finch-transaction-history-service/commissions/withdrawals/stats",
      args: {
        dateIntervalType: dateInterval,
      },
    });
  }

  getEarningPerformanceYearly(dateInterval) {
    return this.apiRequester.getIgnore401({
      endpoint:
        "v3/finch-transaction-history-service/commissions/earnings/performance",
      args: {
        dateIntervalType: dateInterval,
      },
    });
  }

  getStatementOfAccount(
    pageNum,
    pageSize,
    startDate,
    endDate,
    walletJournalTypeId = 1,
    order
  ) {
    return this.apiRequester.getIgnore401({
      endpoint: "v2/finch-transaction-history-service/journal/mini-statement",
      args: {
        endDate,
        pageNum,
        pageSize,
        startDate,
        sortDesc: order === "descending",
        walletJournalType: walletJournalTypeId,
      },
    });
  }

  requeryTransaction(transactionRef) {
    return this.apiRequester.get({
      endpoint: `v2/finch-transaction-history-service/resolutions/${transactionRef}/status`,
    });
  }

  retrieveTransactions(
    domainCode,
    pageNum,
    pageSize,
    parentId,
    serviceProviderId,
    statusCodeInt,
    transactionTypeInt,
    username
  ) {
    return this.apiRequester.getIgnore401({
      endpoint: "v2/finch-transaction-history-service/transactions/search",
      args: {
        domainCode,
        pageNum,
        pageSize,
        parentId,
        serviceProviderId,
        statusCodeInt,
        transactionTypeInt,
        username,
      },
    });
  }

  retrieveTransactionsByDate(
    domainCode,
    endDate,
    pageNum,
    pageSize,
    parentId,
    serviceProviderId,
    startDate,
    statusCodeInt,
    transactionTypeInt,
    username,
    transactionRef
  ) {
    return this.apiRequester.get({
      endpoint: "v2/finch-transaction-history-service/transactions/search",
      args: {
        domainCode,
        endDate,
        pageNum,
        pageSize,
        parentId,
        serviceProviderId,
        startDate,
        statusCodeInt,
        transactionRef,
        transactionTypeInt,
        username,
      },
    });
  }

  retrieveChartReportByDateRange(
    domainCode,
    startDate,
    endDate,
    pageNum,
    pageSize,
    parentId,
    serviceProviderId,
    statusCodeInt,
    transactionTypeInt,
    username
  ) {
    return this.apiRequester.get({
      endpoint:
        "v2/finch-transaction-history-service/transactions/chart/date-range",
      args: {
        domainCode,
        endDate,
        pageNum,
        pageSize,
        parentId,
        serviceProviderId,
        startDate,
        statusCodeInt,
        transactionTypeInt,
        username,
      },
    });
  }

  retrieveTransactionByRef(statusCodeInt, transactionRef) {
    return this.apiRequester.get({
      endpoint: "v2/finch-transaction-history-service/transactions/ref",
      args: {
        statusCodeInt,
        transactionRef,
      },
    });
  }

  retrieveTransactionsWalletbalance(
    domainCode,
    endDate,
    pageNum,
    pageSize,
    parentId,
    serviceProviderId,
    startDate,
    statusCodeInt,
    transactionTypeInt,
    username,
    transactionRef
  ) {
    return this.apiRequester.get({
      endpoint: "v2/finch-transaction-history-service/transactions/search",
      args: {
        domainCode,
        endDate,
        pageNum,
        pageSize,
        parentId,
        serviceProviderId,
        startDate,
        statusCodeInt,
        transactionRef,
        transactionTypeInt,
        username,
      },
    });
  }
}
