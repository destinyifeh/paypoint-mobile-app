import React from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";
import ActivityIndicator from "../../../../../components/activity-indicator";
import Header from "../../../../../components/header";
import {
  COLOUR_BLUE,
  COLOUR_LIGHT_GREY,
  COLOUR_MID_GREY,
  COLOUR_OFF_WHITE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from "../../../../../constants/styles";
import {
  hideNavigator,
  showNavigator,
} from "../../../../../services/redux/actions/navigation";
import { bankMonitoringService } from "../../../../../setup/api";
import BankSearch from "./components/bank-search";
import BankItem from "./components/bankItem";
class BankNetworkScene extends React.Component {
  constructor() {
    super();
    this.state = {
      searchValue: "",
      isSearching: false,
      searchItem: false,
      NoRecord: false,
      searchRecord: [],
      banks: [],
      refreshing: false,
      isRefresh: false,
      NoSearchResult: false,
    };
    this.onSearch = this.onSearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.transformSearchItem = this.transformSearchItem.bind(this);
    this.getTheBanksNetwork = this.getTheBanksNetwork.bind(this);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.getTheBanksNetwork();
    this.ref.current?.open();
  }

  async getTheBanksNetwork() {
    this.setState({ isRefresh: true, NoRecord: false });

    try {
      const res = await bankMonitoringService.getBanksNetwork();
      console.log(res, "bank network");
      if (res.response === "" || res.response?.length === 0 || !res.response) {
        this.setState({ NoRecord: true, isRefresh: false });
        return;
      }
      this.setState({
        banks: res.response?.sort((a, b) =>
          a.bankName.localeCompare(b.bankName)
        ),
        isRefresh: false,
      });
    } catch (err) {
      console.log(err);
      setTimeout(() => {
        this.setState({ isRefresh: false, NoRecord: true });
        Alert.alert(null, "Oops! Something went wong.");
      }, 5000);
    }
  }

  transformSearchItem(value) {
    const lowercaseSearchValue = value.toLowerCase();
    const text = lowercaseSearchValue;
    const firstSpaceIndex = text.indexOf(" ");
    const firstWord =
      firstSpaceIndex !== -1 ? text.substring(0, firstSpaceIndex) : text;
    return firstWord;
  }
  onSearch(searchValue) {
    this.setState({ searchValue: searchValue, isSearching: true });

    if (!searchValue || searchValue == "") {
      this.setState({
        isSearching: false,
        searchItem: false,
        searchValue: "",
        NoSearchResult: false,
      });
      return;
    }

    const { banks } = this.state;

    const filterBanks = banks.filter(
      (item) =>
        item.bankName.startsWith(searchValue) ||
        item.bankName
          .toLowerCase()
          .includes(this.transformSearchItem(searchValue))
    );
    if (!filterBanks || filterBanks.length === 0 || filterBanks.length === "") {
      const message = "No search result for " + searchValue + " found";
      this.setState({
        isSearching: false,
        searchItem: false,
        NoSearchResult: true,
      });
      return;
    } else {
      this.setState({
        searchRecord: filterBanks?.sort((a, b) =>
          a.bankName.localeCompare(b.bankName)
        ),
      });
      setTimeout(() => {
        this.setState({
          isSearching: false,
          searchItem: true,
          NoSearchResult: false,
        });
      }, 0);
    }
  }

  handleSearch() {
    this.setState({ isSearching: true });
    const { banks, searchValue } = this.state;

    if (!searchValue || searchValue == "") {
      this.setState({
        isSearching: false,
        searchItem: false,
        searchValue: "",
        NoSearchResult: false,
      });
      return Alert.alert(null, "Please enter a search query.");
    }

    const filterBanks = banks.filter(
      (item) =>
        item.bankName
          .toLowerCase()
          .startsWith(this.transformSearchItem(searchValue)) ||
        item.bankName
          .toLowerCase()
          .includes(this.transformSearchItem(searchValue))
    );
    if (!filterBanks || filterBanks.length === 0 || filterBanks.length === "") {
      const message = "No search result for " + searchValue + " found";
      this.setState({
        isSearching: false,
        searchItem: false,
        NoSearchResult: true,
      });

      return;
    } else {
      this.setState({
        searchRecord: filterBanks?.sort((a, b) =>
          a.bankName.localeCompare(b.bankName)
        ),
      });
      setTimeout(() => {
        this.setState({
          isSearching: false,
          searchItem: true,
          NoSearchResult: false,
        });
      }, 0);
    }
  }

  renderBankItem = ({ item }) => <BankItem item={item} />;

  render() {
    const {
      NoRecord,
      searchItem,
      searchRecord,
      isSearching,
      banks,
      isRefresh,
      NoSearchResult,
      searchValue,
    } = this.state;
    return (
      <View
        style={{
          backgroundColor: "#F3F3F4",
          flex: 1,
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
          title="Bank Network"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
          }}
          rightComponent={
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={this.getTheBanksNetwork}
            >
              <Icon
                underlayColor="transparent"
                color={COLOUR_WHITE}
                name="refresh"
                size={20}
                type="materialicons"
              />
              <Text style={{ color: "white", left: 5 }}>Refresh</Text>
            </TouchableOpacity>
          }
        />

        <View style={{ marginLeft: 20, marginTop: 10, padding: 10 }}>
          <Text>
            View the real-time success rate of your recipient bank cards.
          </Text>
        </View>

        <BankSearch
          value={this.state.searchValue}
          onSearch={this.handleSearch}
          onChangeText={(val) => this.onSearch(val)}
        />
        <Text style={{ textAlign: "center" }}>
          {NoRecord && "No record available yet"}
        </Text>
        {NoSearchResult ? (
          <>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  searchValue: "",
                  searchItem: false,
                  NoSearchResult: false,
                })
              }
              style={{ alignSelf: "flex-end", right: 40, marginBottom: 20 }}
            >
              <Icon name="close" type="material" />
            </TouchableOpacity>
            <Text style={{ textAlign: "center" }}>
              No search result for "{searchValue && searchValue}" found
            </Text>
          </>
        ) : (
          <>
            {searchItem && (
              <TouchableOpacity
                onPress={() =>
                  this.setState({ searchValue: "", searchItem: false })
                }
                style={{ alignSelf: "flex-end", right: 40, marginBottom: 20 }}
              >
                <Icon name="close" type="material" />
              </TouchableOpacity>
            )}
            {isSearching || isRefresh ? (
              <View style={{ height: "40%" }}>
                <ActivityIndicator />
              </View>
            ) : (
              <FlatList
                data={searchItem ? searchRecord : banks}
                keyExtractor={(item, idx) => idx.toString()}
                initialNumToRender={10}
                ListEmptyComponent={() => (
                  <Text style={{ textAlign: "center" }}>
                    {!NoRecord && "Loading..."}
                  </Text>
                )}
                renderItem={this.renderBankItem}
                refreshControl={
                  <RefreshControl onRefresh={this.getTheBanksNetwork} />
                }
              />
            )}
          </>
        )}

        <RBSheet
          ref={this.ref}
          animationType="fade"
          closeOnDragDown={true}
          duration={250}
          height={500}
          customStyles={{
            container: {
              borderRadius: 10,
            },
          }}
        >
          <ScrollView style={styles.disclaimerContainer}>
            <TouchableOpacity
              style={styles.disclaimerCloseIcon}
              onPress={() => this.ref.current?.close()}
            >
              <Icon
                underlayColor="transparent"
                color={COLOUR_MID_GREY}
                name="close"
                size={30}
                type="evilicons"
              />
            </TouchableOpacity>
            <View style={styles.mainIconContainer}>
              <Icon
                underlayColor="transparent"
                color={COLOUR_WHITE}
                name="info"
                size={65}
                type="materialicons"
                iconStyle={{
                  textAlign: "center",
                  margin: 15,
                  color: COLOUR_BLUE,
                }}
              />
            </View>
            <View style={styles.disclaimerTextContainer}>
              <Text style={styles.disclaimerHeader}>Disclaimer</Text>
              <Text style={styles.disclaimerText}>
                The % success rate provided below is based on the number of
                successful transactions passed through the Interswitch Kimono
                Application.
              </Text>
              <Text style={styles.disclaimerText}>
                You are at liberty not to use this information in your decision
                to complete a transaction.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.disclaimerButton}
              onPress={() => this.ref.current?.close()}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: COLOUR_BLUE,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Okay
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </RBSheet>
      </View>
    );
  }
}

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
)(BankNetworkScene);

const styles = StyleSheet.create({
  disclaimerContainer: {
    marginHorizontal: 10,
  },
  disclaimerCloseIcon: {
    alignSelf: "flex-end",
    padding: 5,
  },
  mainIconContainer: {
    backgroundColor: COLOUR_LIGHT_GREY,
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },

  disclaimerTextContainer: {
    padding: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  disclaimerHeader: {
    color: COLOUR_BLUE,
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },
  disclaimerText: {
    padding: 10,
    lineHeight: 20,
  },
  disclaimerButton: {
    borderWidth: 1,
    borderColor: COLOUR_OFF_WHITE,
    padding: 12,
    borderRadius: 10,
    margin: 10,
  },
});
