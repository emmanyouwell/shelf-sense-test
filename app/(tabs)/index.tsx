import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios"; // Ensure axios is installed or use fetch
import WebView from "react-native-webview";
const egg = require("../../assets/images/egg available.png");
const noegg = require("../../assets/images/egg not available.png");

const can = require("../../assets/images/can available.png");
const nocan = require("../../assets/images/can not available.png");

const bottle = require("../../assets/images/oil.png");
const nobottle = require("../../assets/images/no oil.png");

const rice = require("../../assets/images/sack of rice.png");
const norice = require("../../assets/images/no sack of rice.png");
const EggTray = () => {
  const [trayStatus, setTrayStatus] = useState({
    count: 0,
    slot1: false,
    slot2: false,
    slot3: false,
    slot4: false,
    slot5: false,
    slot6: false,
  });
  const [canStatus, setCanStatus] = useState({
    count: 0,
    slot1: false,
    slot2: false,
    slot3: false,
    slot4: false,
    slot5: false,
    slot6: false,
  });
  const [oilWeight, setOilWeight] = useState({
    amount: 0.0,
  });
  const [riceWeight, setRiceWeight] = useState({
    amount: 0.0,
  });

  const [items, setItems] = useState([
    {
      barcode: "",
      productName: "",
      expirationDate: "",
    },
  ]);
  const [isError, setIsError] = useState(false);

  const deleteBarcode = async (itemId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await axios.delete(
                `https://shelf-sense-backend.onrender.com/api/v1/barcode/delete/${itemId}`
              );
              // Remove the item from the state
              setItems(items.filter((item) => item.barcode !== itemId));
            } catch (error) {
              console.error("Failed to delete the item:", error);
            }
          },
        },
      ]
    );
  };
  useEffect(() => {
    const fetchEgg = () => {
      axios
        .get("https://shelf-sense-backend.onrender.com/api/v1/egg/latest-status")
        .then((res) => {
          console.log(res.data);
          setTrayStatus(res.data.status);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const fetchCan = () => {
      axios
        .get("https://shelf-sense-backend.onrender.com/api/v1/can/latest-status")
        .then((res) => {
          console.log(res.data);
          setCanStatus(res.data.status);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const fetchRice = () => {
      axios
        .get("https://shelf-sense-backend.onrender.com/api/v1/rice/latest-status")
        .then((res) => {
          console.log(res.data);
          setRiceWeight(res.data.status);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const fetchOil = () => {
      axios
        .get("https://shelf-sense-backend.onrender.com/api/v1/bottle/latest-status")
        .then((res) => {
          console.log(res.data);
          setOilWeight(res.data.status);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const fetchItems = () => {
      axios
        .get("https://shelf-sense-backend.onrender.com/api/v1/barcode/all")
        .then((res) => {
          console.log(res.data);
          setItems(res.data.items);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchCan();
    fetchEgg();
    fetchRice();
    fetchOil();
    fetchItems();
    const interval = setInterval(() => {
      fetchCan();
      fetchEgg();
      fetchRice();
      fetchOil();
      fetchItems();
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Eggs: {trayStatus.count}</Text>
          <View style={styles.grid}>
            {Object.entries(trayStatus)
              .filter(([key, _]) => key.startsWith("slot"))
              .map(([slot, isFilled], index) => (
                <View key={index} style={styles.gridItem}>
                  <Image source={isFilled ? egg : noegg} style={styles.image} />
                </View>
              ))}
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Cans: {canStatus.count}</Text>
          <View style={styles.grid}>
            {Object.entries(canStatus)
              .filter(([key, _]) => key.startsWith("slot"))
              .map(([slot, isFilled], index) => (
                <View key={index} style={styles.gridItem}>
                  <Image source={isFilled ? can : nocan} style={styles.image} />
                </View>
              ))}
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>
            Rice (kg): {riceWeight.amount.toFixed(2)} kg
          </Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              {parseFloat(riceWeight.amount.toFixed(2)) > 0 ? (
                <Image source={rice} style={styles.image} />
              ) : (
                <Image source={norice} style={styles.image} />
              )}
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>
            Bottle (L): {oilWeight.amount.toFixed(2)} L
          </Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              {parseFloat(oilWeight.amount.toFixed(2)) > 0 ? (
                <Image source={bottle} style={styles.image} />
              ) : (
                <Image source={nobottle} style={styles.image} />
              )}
            </View>
          </View>
        </View>
        {/* <View style={styles.card}>
          <Text style={styles.title}>Camera</Text>
          <View style={styles.grid}>
            {isError ? (
              <Text style={styles.errorText}>Camera not ready</Text>
            ) : (
              <WebView
                style={styles.webstream}
                source={{ uri: "http://192.168.202.4:81/stream" }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onError={() => setIsError(true)}
              />
            )}
          </View>
        </View> */}
        <View style={styles.card}>
          <Text style={styles.title}>Other items</Text>
          <View style={styles.grid}>
            {items.map((item, index) => {
              const expirationDate = new Date(item.expirationDate);
              expirationDate.setHours(0, 0, 0, 0);
              const isExpired =
                expirationDate < new Date(new Date().setHours(0, 0, 0, 0));
              return (
                <TouchableOpacity
                  key={index}
                  style={isExpired ? styles.itemExpired : styles.item}
                  onPress={() => deleteBarcode(item.barcode)}
                >
                  <Text>Barcode: {item.barcode}</Text>
                  <Text>Product Name: {item.productName}</Text>
                  <Text>Expiration Date: {item.expirationDate}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 16,
    borderRadius: 8,
  },
  itemExpired: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  webstream: {
    flex: 1,
    width: "100%",
    height: 200,
  },
  scrollView: {
    flexGrow: 1, // Ensures that the ScrollView fills the screen
  },
  card: {
    marginTop: 20,
    padding: 10,
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  gridItem: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default EggTray;
