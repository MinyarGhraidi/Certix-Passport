import { apiRequest, apiUpload, ENDPOINTS, USE_MOCK_API, setAuthToken } from "./apiClient";

const USER_KEY = "certix_current_user";

export const DEFAULT_USER = {
  id: "usr_amira_01",
  fullName: "Amira Mansour",
  firstName: "Amira",
  lastName: "Mansour",
  username: "amira.mansour",
  email: "amira@university.tn",
  phoneCountryCode: "+216",
  phone: "98 123 456",
  country: "Tunisia (TN)",
  emailVerified: true,
  role: "student", // "student" | "admin"
  avatar: null,
  cover: null,
  studyProgram: "Génie Logiciel",
  level: "3ème année",
  university: "Université SESAME",
  club: "Club SESAME",
  bio: "Étudiante passionnée par le design produit, le développement fullstack et les projets à impact communautaire.",
  website: "https://example.com",
  linkedin: "https://www.linkedin.com/in/amira-mansour",
  github: "https://github.com/amira-mansour",
  publicSlug: "amira-mansour-782",
  publicSharingActive: true,
};

export const authService = {
  async login({ email, password, roleHint = "student", remember = true }) {
    if (!USE_MOCK_API) {
      const data = await apiRequest(ENDPOINTS.LOGIN, {
        method: "POST",
        auth: false,
        body: { email, password },
      });
      if (data?.access_token) {
        setAuthToken(data.access_token, remember);
      }
      return data.user || data;
    }

    // Mock simulation
    await new Promise((r) => setTimeout(r, 250));
    if (!email || !password || password.length < 8) {
      throw new Error("INVALID_CREDENTIALS");
    }
    const isAdmin = roleHint === "admin" || email.toLowerCase().includes("admin");
    const user = {
      ...DEFAULT_USER,
      email,
      role: isAdmin ? "admin" : "student",
      fullName: isAdmin ? "Bureau SESAME (Admin)" : "Amira Mansour",
      firstName: isAdmin ? "Bureau" : "Amira",
      lastName: isAdmin ? "SESAME" : "Mansour",
    };
    setAuthToken("mock-jwt-token-certix", remember);
    return user;
  },

  async register({ fullName, email, password, studyProgram, level }) {
    if (!USE_MOCK_API) {
      const data = await apiRequest(ENDPOINTS.REGISTER, {
        method: "POST",
        auth: false,
        body: {
          full_name: fullName,
          email,
          password,
          study_program: studyProgram,
          level,
        },
      });
      if (data?.access_token) {
        setAuthToken(data.access_token, true);
      }
      return data.user || data;
    }

    await new Promise((r) => setTimeout(r, 300));
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    const slug = `${firstName.toLowerCase()}-${(lastName || "member").toLowerCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const user = {
      ...DEFAULT_USER,
      id: `usr_${Date.now()}`,
      fullName: fullName.trim(),
      firstName,
      lastName,
      username: `${firstName.toLowerCase()}.${(lastName || "user").toLowerCase().replace(/\s+/g, "")}`,
      email: email.trim(),
      studyProgram,
      level,
      publicSlug: slug,
      role: "student",
      emailVerified: false,
    };
    setAuthToken("mock-jwt-token-certix", true);
    return user;
  },

  async requestPasswordReset(email) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.RESET_PASSWORD_REQUEST, {
        method: "POST",
        auth: false,
        body: { email },
      });
    }
    await new Promise((r) => setTimeout(r, 250));
    return { ok: true };
  },

  async confirmPasswordReset({ token, newPassword }) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.RESET_PASSWORD_CONFIRM, {
        method: "POST",
        auth: false,
        body: { token, new_password: newPassword },
      });
    }
    await new Promise((r) => setTimeout(r, 250));
    if (token === "expired" || token === "invalid") {
      throw new Error("INVALID_RESET_TOKEN");
    }
    return { ok: true };
  },

  async getProfile() {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ME);
    }
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  async updateProfile(fields) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ME, {
        method: "PUT",
        body: fields,
      });
    }
    await new Promise((r) => setTimeout(r, 200));
    return fields;
  },

  async uploadAvatar(file, onProgress) {
    if (!USE_MOCK_API) {
      const formData = new FormData();
      formData.append("file", file);
      return apiUpload(ENDPOINTS.ME_AVATAR, formData, { method: "POST", onProgress });
    }
    if (onProgress) {
      onProgress(40);
      await new Promise((r) => setTimeout(r, 150));
      onProgress(100);
    }
    return { avatarUrl: URL.createObjectURL(file) };
  },

  logout() {
    setAuthToken(null);
  },
};
