<!-- src/views/ProfilePage.vue -->
<template>
  <div class="space-y-8 p-4 md:p-0">
    <h1 class="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
      User Profile
    </h1>

    <!-- Profile Picture Section -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
    >
      <h2
        class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4"
      >
        Profile Picture
      </h2>
      <div
        class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
      >
        <!-- Profile Image Preview -->
        <div
          class="w-32 h-32 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0"
        >
          <img
            v-if="displayImageUrl"
            :src="displayImageUrl"
            alt="Profile"
            class="w-full h-full object-cover"
          />
          <svg
            v-else
            class="w-16 h-16 text-slate-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            ></path>
          </svg>
        </div>

        <!-- File Input & Upload Buttons -->
        <div class="flex flex-col items-center sm:items-start space-y-3">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            accept="image/*"
            class="hidden"
          />
          <button
            @click="openFileInput"
            :disabled="isUploading"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {{ isUploading ? "Uploading..." : "Upload New Photo" }}
          </button>
          <button
            v-if="displayImageUrl && !isUploading"
            @click="removeProfileImage"
            class="text-sm text-red-600 hover:underline"
          >
            Remove Photo
          </button>
          <p v-if="uploadError" class="text-red-500 text-sm">
            {{ uploadError }}
          </p>
        </div>
      </div>
    </div>

    <!-- Basic User Information -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
    >
      <h2
        class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4"
      >
        Account Information
      </h2>
      <div class="space-y-3 text-slate-700 dark:text-slate-300">
        <p>
          <strong>Username:</strong> {{ authStore.user?.username || "N/A" }}
        </p>
        <p><strong>Email:</strong> {{ authStore.user?.email || "N/A" }}</p>
        <p v-if="authStore.user?.date">
          <strong>Member Since:</strong> {{ formatDate(authStore.user.date) }}
        </p>
      </div>
    </div>

    <!-- Contact Information (Phone Number) Section -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
    >
      <h2
        class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4"
      >
        Contact Information
      </h2>
      <form @submit.prevent="handleUpdateProfile" class="space-y-4">
        <div>
          <label
            for="phoneNumber"
            class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1"
            >Phone Number</label
          >
          <input
            type="tel"
            id="phoneNumber"
            v-model="userProfile.phoneNumber"
            placeholder="e.g., +254712345678"
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Update Profile
        </button>
      </form>
    </div>

    <!-- User Stats -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
    >
      <h2
        class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4"
      >
        Your Task Stats
      </h2>
      <div
        v-if="tasksStore.loading"
        class="text-center text-slate-500 dark:text-slate-400"
      >
        Loading stats...
      </div>
      <div v-else-if="tasksStore.error" class="text-red-500">
        Error fetching stats: {{ tasksStore.error }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg shadow-sm">
          <p class="text-3xl font-bold text-green-600">
            {{ (tasksStore.tasks || []).length }}
          </p>
          <p class="text-slate-600 dark:text-slate-300">Total Tasks</p>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg shadow-sm">
          <p class="text-3xl font-bold text-blue-600">
            {{ completedTasksCount }}
          </p>
          <p class="text-slate-600 dark:text-slate-300">Completed</p>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg shadow-sm">
          <p class="text-3xl font-bold text-yellow-600">
            {{ pendingTasksCount }}
          </p>
          <p class="text-slate-600 dark:text-slate-300">Pending</p>
        </div>
      </div>
    </div>

    <!-- Change Password Section -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
    >
      <h2
        class="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4"
      >
        Change Password
      </h2>
      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label
            for="currentPassword"
            class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1"
            >Current Password</label
          >
          <input
            type="password"
            id="currentPassword"
            v-model="currentPassword"
            required
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label
            for="newPassword"
            class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1"
            >New Password</label
          >
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            required
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label
            for="confirmNewPassword"
            class="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1"
            >Confirm New Password</label
          >
          <input
            type="password"
            id="confirmNewPassword"
            v-model="confirmNewPassword"
            required
            class="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Update Password
        </button>
      </form>
    </div>

    <!-- Theme Preference (Dark Mode Toggle) -->
    <div
      class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 flex justify-between items-center"
    >
      <h2 class="text-2xl font-semibold text-slate-800 dark:text-slate-100">
        Dark Mode
      </h2>
      <label class="switch">
        <input type="checkbox" v-model="isDarkMode" @change="toggleTheme" />
        <span class="slider round"></span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import { useTasksStore } from "../stores/tasks";
import { useToast } from "vue-toastification";
import axios from "axios";

const authStore = useAuthStore();
const tasksStore = useTasksStore();
const toast = useToast();

const fileInput = ref(null);
const selectedFile = ref(null);
const displayImageUrl = ref(authStore.user?.profileImageUrl || null);
const isUploading = ref(false);
const uploadError = ref(null);

watch(
  () => authStore.user?.profileImageUrl,
  (newUrl) => {
    displayImageUrl.value = newUrl;
  }
);

const openFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith("image/")) {
      uploadError.value = "Please upload an image file.";
      selectedFile.value = null;
      displayImageUrl.value = authStore.user?.profileImageUrl;
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      uploadError.value = "Image size exceeds 2MB limit.";
      selectedFile.value = null;
      displayImageUrl.value = authStore.user?.profileImageUrl;
      return;
    }
    selectedFile.value = file;
    uploadError.value = null;
    const reader = new FileReader();
    reader.onload = (e) => {
      displayImageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
    uploadProfileImage();
  }
};

const uploadProfileImage = async () => {
  if (!selectedFile.value) {
    uploadError.value = "No file selected to upload.";
    return;
  }
  isUploading.value = true;
  uploadError.value = null;
  const formData = new FormData();
  formData.append("profileImage", selectedFile.value);
  try {
    const response = await axios.put("/users/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.data.profileImageUrl) {
      authStore.user.profileImageUrl = response.data.profileImageUrl;
    }
    toast.success("Profile picture updated!");
    selectedFile.value = null;
  } catch (error) {
    console.error("Profile image upload failed:", error);
    uploadError.value =
      error.response?.data?.message || "Failed to upload image.";
    displayImageUrl.value = authStore.user?.profileImageUrl;
  } finally {
    isUploading.value = false;
  }
};

const removeProfileImage = async () => {
  if (!confirm("Are you sure you want to remove your profile picture?")) return;
  isUploading.value = true;
  uploadError.value = null;
  try {
    await axios.delete("/users/profile-image");
    authStore.user.profileImageUrl = null;
    toast.success("Profile picture removed!");
    displayImageUrl.value = null;
  } catch (error) {
    console.error("Failed to remove profile image:", error);
    uploadError.value =
      error.response?.data?.message || "Failed to remove image.";
  } finally {
    isUploading.value = false;
  }
};

const userProfile = ref({
  phoneNumber: authStore.user?.phoneNumber || "",
});

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      userProfile.value.phoneNumber = newUser.phoneNumber || "";
    }
  },
  { immediate: true }
);

const handleUpdateProfile = async () => {
  try {
    const response = await axios.put("/users/profile", {
      phoneNumber: userProfile.value.phoneNumber,
    });
    authStore.user = { ...authStore.user, ...response.data.user };
    toast.success("Profile updated successfully!");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update profile.");
    console.error("Profile update error:", error);
  }
};

const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const isDarkMode = ref(false);

// --- FIX: Make computed properties defensive ---
const completedTasksCount = computed(
  () =>
    (tasksStore.tasks || []).filter((task) => task.status === "completed")
      .length
);
const pendingTasksCount = computed(
  () =>
    (tasksStore.tasks || []).filter((task) => task.status === "pending").length
);

onMounted(() => {
  if (authStore.isAuthenticated) {
    tasksStore.fetchTasks();
  }
  isDarkMode.value =
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  updateHtmlClass();
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const handleChangePassword = async () => {
  if (newPassword.value !== confirmNewPassword.value) {
    toast.error("New passwords do not match.");
    return;
  }
  if (newPassword.value.length < 6) {
    toast.error("New password must be at least 6 characters long.");
    return;
  }
  try {
    const response = await axios.put("/auth/change-password", {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
    toast.success(response.data.message || "Password updated successfully!");
    currentPassword.value = "";
    newPassword.value = "";
    confirmNewPassword.value = "";
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update password.");
    console.error("Change password error:", error);
  }
};

const updateHtmlClass = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
  }
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  updateHtmlClass();
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: #10b981;
}
input:focus + .slider {
  box-shadow: 0 0 1px #10b981;
}
input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
</style>
