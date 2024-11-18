import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FolderOrFile from "../components/FolderOrFile";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import Modal from "react-native-modal";
import { uploadingFoldersAndFiles } from "../redux/slices/fileSlice";

export default function Home() {
  const dispatch = useDispatch();
  const [pullRefresh, setPullRefresh] = useState(false);
  const {
    foldersAndFiles,
    isGettingFoldersAndFiles,
    uploadProgress,
    isUploadFoldersAndFiles,
  } = useSelector((state) => state.fileSlice);

  useEffect(() => {
    dispatch({ type: "GET_FOLDER_AND_FILES" });
  }, [dispatch]); // Add dependency array to prevent re-rendering in infinite loops

  const handleActionPress = async () => {
    try {
      const doc = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: "*/*",
      });

      if ((doc.assets?.length || 0) <= 30 && !doc.canceled) {
        dispatch({ type: "UPLOAD_FOLDER_AND_FILES", data: doc });
        console.log(doc);
      } else Alert.alert("Limited Files", "Only 30 files are upload at once");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePullRefresh = () => {
    setPullRefresh(true);
    dispatch({ type: "GET_FOLDER_AND_FILES" });
    setPullRefresh(false);
  };

  return (
    <View style={styles.container}>
      {isGettingFoldersAndFiles ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <>
          <FlatList
            data={foldersAndFiles}
            renderItem={FolderOrFile}
            keyExtractor={(item) => item.uniqueId}
            numColumns={3}
            key={`flatlist-columns-${3}`} // Force re-render on column changes
            columnWrapperStyle={styles.columnWrapper} // Add space between columns
            ItemSeparatorComponent={() => <View style={styles.rowSeparator} />} // Add space between rows
            refreshing={pullRefresh}
            onRefresh={handlePullRefresh}
          />
          <View style={styles.floatingContainer}>
            <TouchableOpacity
              key={"Upload Files"}
              style={styles.floatingButton}
              onPress={() => handleActionPress()}
            >
              <FontAwesome
                name={"plus"}
                size={30}
                color='white'
              />
              {/* <Text style={styles.buttonText}>Upload Files</Text> */}
            </TouchableOpacity>
          </View>
        </>
      )}
      <View>
        <Modal
          isVisible={isUploadFoldersAndFiles}
          onBackdropPress={() => {
            dispatch(uploadingFoldersAndFiles(false));
          }}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Uploading: {uploadProgress}%</Text>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  columnWrapper: {
    justifyContent: "space-between", // Space between columns
    // backgroundColor:"#000",
    marginBottom: 20, // Row gap
  },
  rowSeparator: {
    height: 20, // Row gap
  },
  floatingContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "flex-end",
  },
  floatingButton: {
    backgroundColor: "#ffbc1f",
    borderRadius: 30,
    padding: 15,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 18,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
  },
});
