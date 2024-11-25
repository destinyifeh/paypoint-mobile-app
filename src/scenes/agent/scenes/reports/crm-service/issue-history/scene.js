import moment from "moment";
import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import ActivityIndicator from "../../../../../../components/activity-indicator";
import Button from "../../../../../../components/button";
import Header from "../../../../../../components/header";
import {
  HTTP_NOT_FOUND,
  SUCCESSFUL_STATUS,
  SUCCESS_STATUS,
} from "../../../../../../constants/api";
import { BLOCKER } from "../../../../../../constants/dialog-priorities";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_OFF_WHITE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_BIG,
} from "../../../../../../constants/styles";
import {
  hideNavigator,
  showNavigator,
} from "../../../../../../services/redux/actions/navigation";
import { crmService } from "../../../../../../setup/api";
import { flashMessage } from "../../../../../../utils/dialog";
import {
  IssueListFilterForm,
  IssueListsSearchBar,
} from "./components/issue-list-filters";
import IssueLists from "./components/issue-lists";
class IssueHistoryScene extends React.Component {
  delayTimer = null;
  specialPageSize = 1000;
  TodaysDate = new Date();
  OneMonthsBefore = new Date(
    this.TodaysDate.getFullYear(),
    this.TodaysDate.getMonth() - 1
  );
  stableDate = new Date(Date.UTC(2023, 8, 1, 0, 0, 0));
  constructor() {
    super();

    this.state = {
      endDate: this.TodaysDate,
      startDate: this.stableDate,
      issuesData: [],
      filteredIssues: [],
      pageSize: 20,
      pageNum: 1,
      fetchingIssuesError: false,
      noRecord: false,
      isLoading: false,
      fetched: false,
      refreshing: false,
      isLoadingMore: false,
      form: "",
      isFilterLoader: false,
      isHandleEndReached: true,
      loader: false,
      searchFound: false,
      searchValue: "",
      noSearchFetched: false,
      dataCount: "",
      filterPageSize: "",
      debouncedValue: "",
      searchCount: "",
      alternativeData: [],
    };

    this.sheetRef = React.createRef();
    this.getIssues = this.getIssues.bind(this);
    this.getRefreshedData = this.getRefreshedData.bind(this);
    this.handleEndReached = this.handleEndReached.bind(this);
    this.updateFormField = this.updateFormField.bind(this);
    this.getFilterData = this.getFilterData.bind(this);
    this.closeSearchRecord = this.closeSearchRecord.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.getAlternativeData = this.getAlternativeData.bind(this);
  }

  componentDidMount() {
    this.getIssues();
    this.getAlternativeData();
  }

  specialDateRangeFormatter_StartDate = (date) => {
    let newDate = new Date(date),
      month = "" + (newDate.getMonth() + 1),
      day = "" + newDate.getDate(),
      year = newDate.getFullYear(),
      hours = "" + newDate.getHours(),
      minutes = "" + newDate.getMinutes(),
      seconds = "" + newDate.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    hours = "00";
    minutes = "00";
    seconds = "01";

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  specialDateRangeFormatter_EndDate = (date) => {
    let newDate = new Date(date),
      month = "" + (newDate.getMonth() + 1),
      day = "" + newDate.getDate(),
      year = newDate.getFullYear(),
      hours = "" + newDate.getHours(),
      minutes = "" + newDate.getMinutes(),
      seconds = "" + newDate.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    hours = "23";
    minutes = "59";
    seconds = "00";

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  async getRefreshedData() {
    const pageNum = 1;
    this.setState({ pageNum: pageNum });
    const { pageSize, startDate, endDate } = this.state;
    const issueStartDate = this.specialDateRangeFormatter_StartDate(startDate);
    const issueEndDate = this.specialDateRangeFormatter_EndDate(endDate);
    this.setState({ refreshing: true });
    try {
      const {
        status,
        response,
        code,
        description,
      } = await crmService.getIssuesHistory(
        issueStartDate,
        issueEndDate,
        pageNum,
        pageSize
      );
      console.log(response, "refresh data");
      if (
        status === SUCCESS_STATUS &&
        response?.description === SUCCESSFUL_STATUS
      ) {
        const { content, count } = response.data;
        if (content.length > 0 || count > 0) {
          this.setState((prevState) => ({
            issuesData: content,
            filteredIssues: content,
            pageNum: prevState.pageNum + 1,
            fetchingIssuesError: false,
            isLoading: false,
            fetched: true,
            refreshing: false,
          }));
          return;
        }
        this.setState({
          fetchingIssuesError: false,
          fetched: false,
          isLoading: false,
          refreshing: false,
        });
        return;
      } else {
        this.setState({
          fetchingIssuesError: false,
          fetched: false,
          isLoading: false,
          refreshing: false,
        });
        flashMessage(
          null,
          "Oops! Something went wrong, please try again later.",
          BLOCKER
        );
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async getIssues() {
    const { pageNum, pageSize, startDate, endDate } = this.state;

    const issueStartDate = this.specialDateRangeFormatter_StartDate(startDate);
    const issueEndDate = this.specialDateRangeFormatter_EndDate(endDate);
    this.setState({ isLoading: true, fetchingIssuesError: false });
    try {
      const {
        status,
        response,
        code,
        description,
      } = await crmService.getIssuesHistory(
        issueStartDate,
        issueEndDate,
        pageNum,
        pageSize
      );
      console.log(response, "issues data");
      if (
        (response?.description === "Failed" && response?.data === null) ||
        response?.description === "Data Not Found"
      ) {
        return this.setState({ noSearchFetched: true, isLoading: false });
      }
      if (
        status === SUCCESS_STATUS &&
        response?.description === SUCCESSFUL_STATUS
      ) {
        const { content, count } = response.data;
        if (content.length > 0 || count > 0) {
          this.setState((prevState) => ({
            issuesData: content,
            filteredIssues: content,
            pageNum: prevState.pageNum + 1,
            fetchingIssuesError: false,
            isLoading: false,
            fetched: true,
          }));
          return;
        }

        this.setState({
          isLoading: false,
          noSearchFetched: true,

          fetchingIssuesError: false,
        });
        return;
      } else {
        this.setState({
          fetchingIssuesError: true,
          fetched: false,
          isLoading: false,
        });
        flashMessage(
          null,
          "Oops! Something went wrong, please try again later.",
          BLOCKER
        );
        return false;
      }
    } catch (err) {
      console.log(err, "issues error");
    }
  }

  async handleEndReached() {
    const {
      pageNum,
      pageSize,
      issuesData,
      startDate,
      endDate,
      dataCount,
      isLoadingMore,
      filterPageSize,
      searchCount,
    } = this.state;

    const issueStartDate = this.specialDateRangeFormatter_StartDate(startDate);
    const issueEndDate = this.specialDateRangeFormatter_EndDate(endDate);

    const dataToCheck = issuesData;
    if (
      dataToCheck.length === dataCount ||
      isLoadingMore ||
      dataToCheck.length < filterPageSize ||
      dataToCheck.length === searchCount ||
      dataToCheck.length < pageSize
    ) {
      return;
    }
    this.setState({ isLoadingMore: true, fetchingIssuesError: false });

    try {
      const {
        status,
        response,
        code,
        description,
      } = await crmService.getIssuesHistory(
        issueStartDate,
        issueEndDate,
        pageNum,
        pageSize
      );
      if (
        status === SUCCESS_STATUS &&
        response?.description === SUCCESSFUL_STATUS
      ) {
        const { content, count } = response.data;
        if (content.length > 0 || count > 0) {
          this.setState((prevState) => ({
            issuesData: [...prevState.issuesData, ...content],
            filteredIssues: [...prevState.filteredIssues, ...content],
            pageNum: prevState.pageNum + 1,
            fetchingIssuesError: false,
            isLoadingMore: false,
            fetched: true,
            dataCount: count,
          }));
          return;
        }

        this.setState({
          fetchingIssuesError: false,
          fetched: false,
          isLoadingMore: false,
        });
        return;
      } else {
        this.setState({
          fetchingIssuesError: false,
          fetched: false,
          isLoadingMore: false,
        });

        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getReloadData() {
    const pageNum = 1;
    this.setState({ pageNum: pageNum });
    const { pageSize, startDate, endDate } = this.state;
    const issueStartDate = this.specialDateRangeFormatter_StartDate(startDate);
    const issueEndDate = this.specialDateRangeFormatter_EndDate(endDate);
    this.setState({ isLoading: true });
    try {
      const {
        status,
        response,
        code,
        description,
      } = await crmService.getIssuesHistory(
        issueStartDate,
        issueEndDate,
        pageNum,
        pageSize
      );
      if (
        status === SUCCESS_STATUS &&
        response?.description === SUCCESSFUL_STATUS
      ) {
        const { content, count } = response.data;
        if (content.length > 0 || count > 0) {
          this.setState((prevState) => ({
            issuesData: content,
            filteredIssues: content,
            pageNum: prevState.pageNum + 1,
            fetchingIssuesError: false,
            isLoading: false,
            fetched: true,
          }));
          return;
        }
        this.setState({
          fetchingIssuesError: false,
          fetched: false,
          isLoading: false,
          noSearchFetched: true,
        });
        return;
      } else {
        this.setState({
          fetchingIssuesError: true,
          fetched: false,
          isLoading: false,
        });
        flashMessage(
          null,
          "Oops! Something went wrong, please try again later.",
          BLOCKER
        );
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getAlternativeData() {
    const alternativepageNum = 1;
    const alternativeSize = 1000;
    const { startDate, endDate } = this.state;
    const issueStartDate = this.specialDateRangeFormatter_StartDate(startDate);
    const issueEndDate = this.specialDateRangeFormatter_EndDate(endDate);
    try {
      const {
        status,
        response,
        code,
        description,
      } = await crmService.handleIssueAlternativeData(
        issueStartDate,
        issueEndDate,
        alternativepageNum,
        alternativeSize
      );
      if (
        status === SUCCESS_STATUS &&
        response?.description === SUCCESSFUL_STATUS
      ) {
        const { content, count } = response.data;

        this.setState({
          alternativeData: content,
          fetchingIssuesError: false,
          loader: false,
        });
        return;
      }
      this.setState({
        alternativeData: [],
        fetchingIssuesError: false,
        loader: false,
      });

      return false;
    } catch (err) {
      console.log(err);
    }
  }

  responseCodeHandler = (code) => {
    if (code === HTTP_NOT_FOUND) {
      this.setState({
        fetched: false,
        isLoading: false,
      });
      flashMessage(
        null,
        "Oops! Sorry, the resource you're looking for could not be found.",
        BLOCKER
      );
    } else if (code === HTTP_INTERNAL_SERVER_ERROR) {
      this.setState({
        fetchingIssuesError: true,
        fetched: false,
        isLoading: false,
      });
      flashMessage(
        null,
        "Oops! Something went wrong, please try again later.",
        BLOCKER
      );
    } else if (code === 503) {
      this.setState({
        fetchingIssuesError: true,
        fetched: false,
        isLoading: false,
      });
      flashMessage(
        null,
        "Oops! Something went wrong, please try again later.",
        BLOCKER
      );
    } else {
      this.setState({
        fetchingIssuesError: true,
        fetched: false,
        isLoading: false,
      });
      flashMessage(
        null,
        "Oops! Something went wrong, please try again later.",
        BLOCKER
      );
    }
  };

  updateFormField(params) {
    const newForm = {
      ...this.state.form,
      ...params,
    };
    this.setState({ form: newForm });
  }

  async getFilterData() {
    this.setState({
      isFilterLoader: true,
      isHandleEndReached: false,
      loader: true,
    });
    this.sheetRef.current?.close();
    const {
      pageNum,
      pageSize,
      form,
      filteredIssues,
      startDate,
      endDate,
    } = this.state;

    const {
      transactionType,
      ticketStatus,
      startDateField,
      endDateField,
    } = form;

    const theStartDateField = moment
      .utc(
        moment(startDateField, "DD-MM-YYYY").format("YYYY-MM-DD") + "T00:00:00"
      )
      .format();

    const theEndDateField = moment
      .utc(
        moment(endDateField, "DD-MM-YYYY").format("YYYY-MM-DD") + "T00:00:00"
      )
      .format();

    const issueStartDate = this.specialDateRangeFormatter_StartDate(
      startDateField ? theStartDateField : startDate
    );
    const issueEndDate = this.specialDateRangeFormatter_EndDate(
      endDateField ? theEndDateField : endDate
    );

    const pageNumber = 1;
    const thePageSize = 1000;
    this.setState({
      fetchingIssuesError: false,
      isFilterLoader: false,
      filterPageSize: thePageSize,
    });
    try {
      const {
        status,
        response,
        code,
        description,
      } = await crmService.getFilterIssues(
        issueStartDate,
        issueEndDate,
        pageNumber,
        thePageSize,
        transactionType,
        ticketStatus
      );

      console.log(response, "respoo");
      if (
        status === SUCCESS_STATUS &&
        response?.description === SUCCESSFUL_STATUS
      ) {
        const { content, count } = response.data;
        if (content.length > 0 || count > 0) {
          this.setState({
            issuesData: content,
            fetchingIssuesError: false,
            loader: false,
            searchFound: true,
            form: "",
          });
          return;
        }
        this.setState({
          issuesData: filteredIssues,
          fetchingIssuesError: false,
          loader: false,
          searchFound: false,
          form: "",
        });
        flashMessage(
          null,
          "Your search did not return any results. Please modify your search and try again.",
          BLOCKER
        );
        return false;
      } else {
        this.setState({
          issuesData: filteredIssues,
          searchFound: false,
          loader: false,
          form: "",
        });
        flashMessage(
          null,
          "Oops! Something went wrong, please try again later.",
          BLOCKER
        );
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async handleSearch(value) {
    this.setState({ searchValue: value });

    const { filteredIssues, alternativeData } = this.state;

    if (!value) {
      this.setState({
        searchFound: false,
        issuesData: filteredIssues,
        noSearchFetched: false,
      });
      return;
    }
    const filtering = alternativeData.filter(
      (item) =>
        item.ticketNumber &&
        item.transactionRef &&
        (item.ticketNumber.toUpperCase().includes(value.toUpperCase()) ||
          item.ticketNumber.toLowerCase().includes(value.toLowerCase()) ||
          item.transactionRef.toUpperCase().includes(value.toUpperCase()) ||
          item.transactionRef.toLowerCase().includes(value.toLowerCase()))
    );
    if (!filtering || filtering.length === 0) {
      this.setState({
        issuesData: [],
        searchFound: true,
        noSearchFetched: true,
      });
    } else {
      this.setState({
        issuesData: filtering,
        searchFound: true,
        noSearchFetched: false,
        searchCount: filtering.length,
      });
    }
  }

  closeSearchRecord() {
    const { filteredIssues } = this.state;
    this.setState({
      searchFound: false,
      issuesData: filteredIssues,
      searchValue: "",
      noSearchFetched: false,
    });
  }

  navigateToScreen = (screenName, params) => {
    this.props.navigation.navigate(screenName, { transaction: params });
  };

  renderIssueItems = ({ item }) => (
    <IssueLists item={item} navigateTo={this.navigateToScreen} />
  );

  get errorOccurred() {
    return (
      <View>
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>Oops!</Text>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: FONT_SIZE_BIG,
          }}
        >
          An error occured. {"\n"}Please, try again.
        </Text>

        <Button
          containerStyle={{
            alignSelf: "center",
            backgroundColor: "white",
            marginTop: 30,
            width: "80%",
          }}
          //loading={this.state.isLoading}
          title="RELOAD"
          titleStyle={{
            color: COLOUR_BLUE,
          }}
          onPressOut={() => this.getReloadData()}
        />
      </View>
    );
  }

  get hasNoRecords() {
    return (
      <View style={{ alignSelf: "center" }}>
        <Text style={{ fontFamily: FONT_FAMILY_BODY_SEMIBOLD }}>
          No data available
        </Text>
      </View>
    );
  }

  render() {
    const {
      issuesData,
      isLoading,
      fetched,
      fetchingIssuesError,
      refreshing,
      isLoadingMore,
      isFilterLoader,
      form,
      loader,
      searchFound,
      searchValue,
      noSearchFetched,
    } = this.state;
    return (
      <View
        style={{
          //backgroundColor: "#F3F3F4",
          flex: 1,
          backgroundColor: "#FFFFFF",
        }}
        onTouchMove={() =>
          this.props.isNavigatorVisible ? this.props.hideNavigator() : null
        }
      >
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          leftComponent={
            <Icon
              underlayColor="transparent"
              color={COLOUR_WHITE}
              name="chevron-left"
              size={40}
              type="material"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title="Issue History"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
          }}
        />

        <View style={styles.mainInnerContainer}>
          <View style={styles.filtersContainer}>
            <IssueListsSearchBar
              handleSearch={this.handleSearch}
              searchValue={searchValue}
            />
            <TouchableOpacity
              onPress={() => this.sheetRef.current?.open()}
              style={styles.filterIcon}
            >
              <Icon
                iconStyle={{ marginTop: 10, color: COLOUR_BLACK }}
                name="sliders"
                type="font-awesome"
              />
            </TouchableOpacity>
          </View>
          {searchFound && (
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={this.closeSearchRecord}
            >
              <Icon name="cancel" type="material" />
            </TouchableOpacity>
          )}
          {noSearchFetched && this.hasNoRecords}
          {fetchingIssuesError && this.errorOccurred}

          {loader ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={noSearchFetched ? [] : issuesData}
              keyExtractor={(item, idx) => idx.toString() + item?.ticketNumber}
              initialNumToRender={20}
              ListEmptyComponent={() => (
                <Text style={{ textAlign: "center" }}>
                  {isLoading && "Loading issues..."}
                </Text>
              )}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderIssueItems}
              refreshControl={
                <RefreshControl
                  onRefresh={this.getRefreshedData}
                  refreshing={refreshing}
                />
              }
              onEndReached={this.handleEndReached}
              onEndReachedThreshold={0.1}
              ListFooterComponent={() => {
                if (isLoadingMore) {
                  return <ActivityIndicator />;
                } else {
                  return null;
                }
              }}
            />
          )}
          <IssueListFilterForm
            sheetRef={this.sheetRef}
            updateFormField={this.updateFormField}
            isFilterLoader={isFilterLoader}
            getFilterData={this.getFilterData}
            form={form}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainInnerContainer: {
    marginHorizontal: 30,
    marginVertical: 15,
    flex: 1,
  },
  filtersContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },
  filterIcon: {
    borderColor: COLOUR_OFF_WHITE,
    height: 49,
    width: "15%",
    left: 0,
    borderRadius: 8,
    borderWidth: 1.5,
  },
});

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    // pendingUrl: state.navigation.pendingUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueHistoryScene);
