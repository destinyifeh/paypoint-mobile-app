import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
//import ActivityIndicator from '../../../../../components/activity-indicator';
//import GradientIcon from '../../../../../components/icons/gradient-icon';
import { Icon } from "react-native-elements";
import {
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
} from "../../../../../../constants/styles";
export default function BankItem({ item }) {
  const [toggler, setToggler] = React.useState(false);

  const getColorForMastercard = (value) => {
    const parsedValue = parseFloat(value);

    if (parsedValue < 31) {
      return "#DC4437";
    } else if (value === "N/A") {
      return "#D3D3D3";
    } else if (parsedValue >= 31 && parsedValue <= 70) {
      return "#EC9B40";
    } else if (parsedValue > 70) {
      return "#519E47";
    }

    return "transparent"; // Default color if no condition is met
  };
  const getColorForVerve = (value) => {
    const parsedValue = parseFloat(value);

    if (parsedValue < 31) {
      return "#DC4437";
    } else if (value === "N/A") {
      return "#D3D3D3";
    } else if (parsedValue >= 31 && parsedValue <= 70) {
      return "#EC9B40";
    } else if (parsedValue > 70) {
      return "#519E47";
    }

    return "transparent"; // Default color if no condition is met
  };

  const getColorForVisa = (value) => {
    const parsedValue = parseFloat(value);

    if (parsedValue < 31) {
      return "#DC4437";
    } else if (value === "N/A") {
      return "#D3D3D3";
    } else if (parsedValue >= 31 && parsedValue <= 70) {
      return "#EC9B40";
    } else if (parsedValue > 70) {
      return "#519E47";
    }

    return "transparent"; // Default color if no condition is met
  };
  return (
    <View style={{ marginBottom: 15 }}>
      <View
        style={{
          backgroundColor: "#F3F4F6",
          padding: 15,
          width: 325,
          justifyContent: "center",
          alignSelf: "center",
          elevation: 0,
          borderRadius: 5,
          borderColor: "#D3D3D3",
          borderWidth: 0.2,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => setToggler((prev) => !prev)}
        >
          <Text
            style={{
              textTransform: "capitalize",
              fontSize: 14,
              fontWeight: "400",
              lineHeight: 20,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              maxWidth: 150,
            }}
          >
            {item.bankName}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            {toggler ? null : (
              <>
                <Text
                  style={{
                    backgroundColor: getColorForMastercard(item.mastercard),
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                  }}
                />
                <Text
                  style={{
                    backgroundColor: getColorForVerve(item.verve),
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    marginHorizontal: 8,
                  }}
                />

                <Text
                  style={{
                    backgroundColor: getColorForVisa(item.visa),

                    width: 16,
                    height: 16,
                    borderRadius: 4,
                  }}
                />
              </>
            )}
            <Icon
              name={toggler ? "chevron-up" : "chevron-down"}
              type="feather"
              size={24}
              containerStyle={
                toggler
                  ? {
                      //position: 'absolute',
                      //right: 15
                      left: 0,
                    }
                  : { left: 8 }
              }
            />
          </View>
        </TouchableOpacity>
      </View>
      {toggler && (
        <View
          style={{
            padding: 20,
            width: 325,
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 5,
            borderColor: "#D3D3D3",
            borderWidth: 0.2,
            minHeight: 100,
            backgroundColor: "#F3F4F6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 30,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILY_BODY,
                color: getColorForMastercard(item.mastercard),
                fontSize: 14,
                fontWeight: "400",
              }}
            >
              Mastercard - {item.mastercard}
            </Text>
            <Text
              style={{
                backgroundColor: getColorForMastercard(item.mastercard),

                width: 16,
                height: 16,
                borderRadius: 4,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 30,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILY_BODY,
                color: getColorForVerve(item.verve),
                fontSize: 14,
                fontWeight: "400",
              }}
            >
              Verve - {item.verve}
            </Text>
            <Text
              style={{
                backgroundColor: getColorForVerve(item.verve),
                width: 16,
                height: 16,
                borderRadius: 4,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              height: 30,
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILY_BODY,
                color: getColorForVisa(item.visa),
                fontSize: 14,
                fontWeight: "400",
              }}
            >
              VISA - {item.visa}
            </Text>
            <Text
              style={{
                backgroundColor: getColorForVisa(item.visa),
                width: 16,
                height: 16,
                borderRadius: 4,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
