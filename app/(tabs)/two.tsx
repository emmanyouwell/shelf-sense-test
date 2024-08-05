import { StyleSheet, Image, Button, TextInput, Platform } from "react-native";
import React, { useState, useEffect, ReactNode } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, View } from "@/components/Themed";
import { CameraView, Camera } from "expo-camera";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
interface BarCodeEvent {
  type: string;
  data: string;
}

export default function TabTwoScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    barcode: "",
    productName: "",
    expirationDate: new Date(),
  });
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  // State to hold the formatted date string
  const [dateText, setDateText] = useState("");
  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    // Format the date and update the text input
    setDateText(currentDate.toLocaleDateString());
    setFormData({ ...formData, expirationDate: currentDate });
  };

  const showDatepicker = () => {
    setShow(true);
  };
  const handleFormSubmit = async () => {
    const apiEndpoint = "https://shelf-sense-backend.onrender.com/api/v1/barcode/save";
    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Form submitted successfully:", response.data);
      setScanned(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setScanned(false);
    setShowForm(false);
  };
  const resetFormAndHide = () => {
    // Reset formData to its initial state
    setFormData({
      barcode: "",
      productName: "",
      expirationDate: new Date(),
      // Add other fields as necessary
    });

    // Reset dateText to its initial state
    setDateText("");

    // Set showForm to false to hide the form
    setShowForm(false);
  };
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);
  const handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
    try {
      // Replace :barcode with the actual barcode data
      // If no item details are found, show the form to add a new item
      setShowForm(true);
      setFormData({ ...formData, barcode: data }); // Pre-fill the barcode in the form
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error status:", error.response?.status);
        console.error("Axios error response:", error.response?.data);
      } else {
        console.error("Non-Axios error:", error);
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add an Item</Text>
      <View style={{ position: "absolute", top: 0, left: 0, padding: 10 }}>
        <Icon.Button
          name="arrow-back"
          backgroundColor="black"
          onPress={resetFormAndHide}
        >
          Back
        </Icon.Button>
      </View>
      {showForm ? (
        <View style={styles.formContainer}>
          {/* Barcode input */}
          <TextInput
            style={styles.input}
            value={formData.barcode}
            placeholder="Barcode"
            onChangeText={(text) => setFormData({ ...formData, barcode: text })}
          />
          {/* Product Name input */}
          <TextInput
            style={styles.input}
            value={formData.productName}
            placeholder="Product Name"
            onChangeText={(text) =>
              setFormData({ ...formData, productName: text })
            }
          />
          <View>
            <Button onPress={showDatepicker} title="Set Expiration Date" />
            <TextInput
              value={dateText}
              placeholder="Select Date"
              editable={false} // Makes the text input non-editable
            />
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>
          <Button title="Submit" onPress={handleFormSubmit} />
        </View>
      ) : (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
            
              "pdf417",
              "code39",
              "code128",
              "ean13",
              "ean8",
            ],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  barcodecontainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  formContainer: {
    width: "80%", // Adjust based on your design
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  card: {
    marginTop: 20,
    padding: 20,
    alignItems: "center",
    width: "90%",
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  cardImage: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    margin: 5,
  },
});
