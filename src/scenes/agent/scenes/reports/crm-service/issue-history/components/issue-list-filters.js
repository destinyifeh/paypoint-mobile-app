import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import Button from "../../../../../../../components/button";
import FormDate from "../../../../../../../components/form-controls/form-date";
import FormInput from "../../../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../../../components/form-controls/form-picker";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_OFF_WHITE,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_BIG,
  FONT_SIZE_TITLE,
} from "../../../../../../../constants/styles";
import ticketStatus from "../components/ticket-status.json";
import transactionType from "../components/transaction-types.json";
export const IssueListsSearchBar = ({ handleSearch, searchValue }) => {
  return (
    <View style={{ width: "82%" }}>
      <FormInput
        hideOptionalLabel
        outerContainerStyle={{
          marginBottom: 0,
        }}
        innerContainerStyle={{
          // elevation: 2,
          marginBottom: 0,
        }}
        leftIcon="search"
        rightIconOnpress={() => {
          //props.onSearch();
        }}
        inputStyle={
          {
            //elevation: 50,
          }
        }
        onChangeText={handleSearch}
        placeholder="Search"
        defaultValue={searchValue}
        // onSubmitEditing={() => props.onSearch()}
      />
    </View>
  );
};

export const IssueListFilterForm = ({
  sheetRef,
  updateFormField,
  isFilterLoader,
  getFilterData,
  form,
}) => {
  const [endDate] = React.useState(new Date());

  return (
    <RBSheet
      ref={sheetRef}
      animationType="fade"
      closeOnDragDown={true}
      duration={250}
      height={500}
      customStyles={{
        container: {
          borderRadius: 15,
        },
      }}
    >
      <View style={{ width: "100%" }}>
        <View style={styles.upperView}>
          <Text style={styles.filterTitle}>Filter</Text>
          <TouchableOpacity
            style={styles.filterIcon}
            onPress={() => sheetRef.current?.close()}
          >
            <Icon
              iconStyle={{ fontWeight: "bold", color: COLOUR_BLACK }}
              name="close"
              type="material"
              size={18}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.mainContainer}
        >
          <Text style={styles.loggedDate}>Date Logged:</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <FormDate
              innerContainerStyle={[styles.formInputInnerContainerStyle]}
              maxDate={endDate}
              minDate={"01-09-2023"}
              onDateSelect={(startDateField, isValid) => {
                updateFormField({ startDateField });
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Pick date"
              //propagateError={this.props.propagateFormErrors}
              text="Start Date:"
              validators={{
                required: false,
              }}
              width={150}
            />
            <FormDate
              innerContainerStyle={styles.formInputInnerContainerStyle}
              maxDate={endDate}
              minDate={"01-09-2023"}
              onDateSelect={(endDateField, isValid) => {
                updateFormField({ endDateField });
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Pick date"
              //propagateError={this.props.propagateFormErrors}
              text="End Date:"
              validators={{
                required: false,
              }}
              width={150}
            />
          </View>

          <FormPicker
            choices={ticketStatus.map(({ label, value }) => ({
              label: label,
              value: value,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(ticketStatus) => {
              updateFormField({ ticketStatus });
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            // propagateError={this.props.propagateFormErrors}
            text="Ticket Status:"
            validators={{
              required: false,
            }}
            placeholder="All"
          />

          <FormPicker
            choices={transactionType.map(({ label, value }) => ({
              label: label,
              value: value,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(transactionType) => {
              updateFormField({ transactionType });
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            // propagateError={this.props.propagateFormErrors}
            text="Transaction Type:"
            validators={{
              required: true,
            }}
            placeholder="All"
          />

          <Button
            onPress={getFilterData}
            containerStyle={{ marginTop: 10, backgroundColor: COLOUR_BLUE }}
            title="Apply Filter"
            loading={isFilterLoader}
          />
        </ScrollView>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  formInputInnerContainerStyle: {
    marginTop: 5,
  },
  formInputOuterContainerStyle: {
    marginBottom: 20,
  },
  mainContainer: {
    marginHorizontal: 30,
    marginVertical: 15,
  },

  upperView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomWidth: 2,
    paddingTop: 2,
    borderColor: COLOUR_OFF_WHITE,
  },
  filterTitle: {
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_BIG,
    color: COLOUR_BLACK,
    left: 30,
    paddingBottom: 10,
  },
  filterIcon: {
    elevation: 1,
    backgroundColor: COLOUR_OFF_WHITE,
    right: 30,
    padding: 1,
    height: 20,
    borderRadius: 5,
    marginBottom: 9,
  },
  loggedDate: {
    // position: "absolute",
    color: COLOUR_BLACK,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_TITLE,
  },
});
