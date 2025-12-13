import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../api/apiClient";

import { useProfile, useUpdateProfile } from "../hooks/useProfile";

type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditProfile"
>;
type GenderOption = "Female" | "Male" | "Other" | "Prefer not to say";

const API_UPLOAD_URL = `${API_BASE_URL}/api/upload`;

/**
 * Convert relative upload paths to full URLs
 */
const getFullImageUrl = (url: string): string => {
  if (!url) return "https://i.pravatar.cc/300?img=12";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_BASE_URL}${url}`;
};

export default function EditProfileScreen(): JSX.Element {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();

  const { data, isLoading } = useProfile();
  const { mutate, isPending: saving } = useUpdateProfile();

  const [uploading, setUploading] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<GenderOption>("Female");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setBio(data.bio || "");
      setGender((data.gender as GenderOption) || "Female");
      setProfilePicture(data.profilePicture || "");
    }
  }, [data]);

  const uploadImage = async (uri: string): Promise<string | null> => {
    try {
      setUploading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Authentication required",
          text2: "Please login again",
        });
        return null;
      }

      const form = new FormData();
      form.append("image", {
        uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(API_UPLOAD_URL, {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      return data.url;
    } catch (err: any) {
      console.error("Upload error:", err);
      Toast.show({
        type: "error",
        text1: "Upload failed",
        text2: err.message || "Please try again",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.9,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      async (response) => {
        if (response.didCancel) return;

        if (response.errorCode) {
          Toast.show({
            type: "error",
            text1: "Error picking image",
            text2: response.errorMessage,
          });
          return;
        }

        const uri = response.assets?.[0]?.uri;
        if (!uri) return;

        const uploaded = await uploadImage(uri);
        if (uploaded) {
          setProfilePicture(uploaded);
          Toast.show({
            type: "success",
            text1: "Image uploaded",
            text2: "Don't forget to save",
          });
        }
      }
    );
  };

  const handleSaveProfile = () => {
    if (!name.trim()) {
      return Toast.show({ type: "error", text1: "Name is required" });
    }

    mutate(
      {
        name: name.trim(),
        bio: bio.trim(),
        gender,
        profilePicture,
      },
      {
        onSuccess: () => navigation.goBack(),
      }
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#2D6CF6" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit profile</Text>
          <TouchableOpacity onPress={handleSaveProfile} disabled={saving || uploading}>
            {saving ? (
              <ActivityIndicator size="small" color="#2D6CF6" />
            ) : (
              <Text style={[styles.saveBtn, (uploading || saving) && styles.disabledText]}>
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View style={[styles.center, { marginTop: 24, marginBottom: 8 }]}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: getFullImageUrl(profilePicture) }} style={styles.profileImage} />
            {uploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
          </View>

          <TouchableOpacity onPress={pickImage} disabled={uploading} style={{ marginTop: 12 }}>
            <Text style={[styles.changePhotoText, uploading && styles.disabledText]}>
              {uploading ? "Uploading..." : "Change profile picture"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            maxLength={50}
            editable={!saving}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />
          <Text style={styles.charCount}>{name.length}/50</Text>
        </View>

        {/* Bio */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]} 
            multiline
            value={bio}
            onChangeText={setBio}
            maxLength={200}
            textAlignVertical="top"
            editable={!saving}
            placeholder="Tell us about yourself"
            placeholderTextColor="#999"
          />
          <Text style={styles.charCount}>{bio.length}/200</Text>
        </View>

        {/* Gender Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowGenderModal(true)}
            disabled={saving}
          >
            <Text style={styles.dropdownText}>{gender}</Text>
            <Icon name="chevron-down" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Gender Modal */}
      <Modal visible={showGenderModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {(["Female", "Male", "Other", "Prefer not to say"] as GenderOption[]).map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  setGender(option);
                  setShowGenderModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
                {gender === option && <Icon name="check" size={20} color="#2D6CF6" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  center: { alignItems: "center", justifyContent: "center" },

  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },

  saveBtn: {
    color: "#2D6CF6",
    fontWeight: "600",
    fontSize: 16,
  },

  disabledText: {
    color: "#999",
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },

  /* ---- Profile Image ---- */
  imageWrapper: {
    position: "relative",
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    borderWidth: 3,
    borderColor: "#2D6CF6",
  },

  /** Fixed overlay – same size as image, perfectly centered **/
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  changePhotoText: {
    color: "#2D6CF6",
    fontSize: 16,
    fontWeight: "500",
  },

  inputContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },

  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },

  input: {
    padding: 14,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    fontSize: 15,
    color: "#000",
  },

  bioInput: {
    height: 100,
    paddingTop: 14,
  },

  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },

  dropdown: {
    padding: 14,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownText: {
    fontSize: 15,
    color: "#000",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    maxHeight: "80%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
    textAlign: "center",
  },

  modalOption: {
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  modalOptionText: {
    fontSize: 16,
    color: "#000",
  },
});