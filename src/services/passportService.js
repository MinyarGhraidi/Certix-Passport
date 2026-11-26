import { apiRequest, apiUpload, ENDPOINTS, USE_MOCK_API } from "./apiClient";

export const INITIAL_RECORDS = [
  {
    id: "rec_01",
    category: "activity",
    type: "workshop",
    title: "Design Thinking Bootcamp",
    organization: "Club SESAME",
    date: "2026-10-18",
    startDate: "2026-10-18",
    endDate: "2026-10-18",
    role: "Participant",
    status: "verified",
    isClubOfficial: true,
    visible: true,
    description: "Bootcamp intensif de 2 jours sur les sprints de conception centrée utilisateur et le prototypage rapide.",
    evidenceUrl: null,
    evidenceName: null,
    rejectionReason: null,
  },
  {
    id: "rec_02",
    category: "achievement",
    type: "competition",
    title: "National Innovation Challenge — 1ère Place",
    organization: "Enactus Tunisia",
    date: "2026-10-14",
    startDate: "2026-10-12",
    endDate: "2026-10-14",
    role: "Chef d'équipe",
    status: "verified",
    isClubOfficial: true,
    visible: true,
    description: "Présentation d'une solution d'économie circulaire intelligente, 1er prix parmi 35 universités.",
    evidenceUrl: null,
    evidenceName: null,
    rejectionReason: null,
  },
  {
    id: "rec_03",
    category: "certification",
    type: "professional",
    title: "Google UX Design",
    organization: "Google / Coursera",
    date: "2026-10-10",
    startDate: "2026-06-01",
    endDate: "2026-10-10",
    role: "Certifiée",
    status: "verified",
    isClubOfficial: false,
    visible: true,
    description: "Certificat professionnel couvrant la recherche UX, les maquettes fonctionnelles et le prototypage haute fidélité.",
    evidenceUrl: "sample_google_cert.pdf",
    evidenceName: "Google_UX_Certificate.pdf",
    rejectionReason: null,
  },
  {
    id: "rec_04",
    category: "achievement",
    type: "recognition",
    title: "Membre Contributeur d'Excellence",
    organization: "Club SESAME",
    date: "2026-10-03",
    startDate: "2026-09-01",
    endDate: "2026-10-03",
    role: "Organisatrice Principale",
    status: "verified",
    isClubOfficial: true,
    visible: true,
    description: "Distinction attribuée pour l'engagement exceptionnel dans l'encadrement des nouveaux membres et des hackathons.",
    evidenceUrl: null,
    evidenceName: null,
    rejectionReason: null,
  },
  {
    id: "rec_05",
    category: "certification",
    type: "technical",
    title: "Advanced React Development",
    organization: "Frontend Masters",
    date: "2026-10-08",
    startDate: "2026-09-15",
    endDate: "2026-10-08",
    role: "Apprenante",
    status: "pending",
    isClubOfficial: false,
    visible: true,
    description: "Approfondissement de React 19, gestion d'état avancée et optimisation des performances.",
    evidenceUrl: "cert_react.pdf",
    evidenceName: "FrontendMasters_React.pdf",
    rejectionReason: null,
  },
  {
    id: "rec_06",
    category: "experience",
    type: "internship",
    title: "Stagiaire Product Design",
    organization: "Nexa Labs",
    date: "2026-07-01",
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    role: "Product Designer",
    status: "pending",
    isClubOfficial: false,
    visible: true,
    description: "Refonte du parcours d'accueil mobile et conduite d'entretiens utilisateurs pour une plateforme fintech.",
    evidenceUrl: "attestation_stage.pdf",
    evidenceName: "Attestation_Stage_NexaLabs.pdf",
    rejectionReason: null,
  },
  {
    id: "rec_07",
    category: "experience",
    type: "leadership",
    title: "Responsable Communication",
    organization: "Club SESAME",
    date: "2025-09-01",
    startDate: "2025-09-01",
    endDate: "2026-06-30",
    role: "Lead",
    status: "verified",
    isClubOfficial: true,
    visible: true,
    description: "Gestion des réseaux sociaux, création de supports visuels et croissance de l'engagement de 40%.",
    evidenceUrl: null,
    evidenceName: null,
    rejectionReason: null,
  },
  {
    id: "rec_08",
    category: "project",
    type: "open_source",
    title: "Open Library UI — Kit de composants accessibles",
    organization: "Contributeurs Open Source",
    date: "2026-03-01",
    startDate: "2026-03-01",
    endDate: "2026-10-01",
    role: "Contributrice Accessibilité",
    status: "verified",
    isClubOfficial: false,
    visible: true,
    description: "Contribution à un kit UI open source pour bibliothèques avec navigation clavier et vérification de contraste.",
    skills: ["Accessibilité", "Design systems", "TypeScript"],
    demoUrl: "https://example.com/demo",
    githubUrl: "https://github.com/example/open-library",
    evidenceUrl: null,
    evidenceName: null,
    rejectionReason: null,
  },
  {
    id: "rec_09",
    category: "project",
    type: "academic",
    title: "EcoPulse — Visualiseur énergétique académique",
    organization: "Université SESAME",
    date: "2025-10-01",
    startDate: "2025-10-01",
    endDate: "2026-02-28",
    role: "Lead Data Visualization",
    status: "verified",
    isClubOfficial: false,
    visible: true,
    description: "Tableau de bord académique visualisant la consommation énergétique des salles de cours.",
    skills: ["Data visualization", "D3", "UX research"],
    demoUrl: "https://example.com/ecopulse",
    evidenceUrl: null,
    evidenceName: null,
    rejectionReason: null,
  },
  {
    id: "rec_10",
    category: "achievement",
    type: "competition",
    title: "Social Impact Challenge — Finaliste",
    organization: "Social Ventures Forum",
    date: "2026-10-09",
    startDate: "2026-10-08",
    endDate: "2026-10-09",
    role: "Finaliste",
    status: "rejected",
    isClubOfficial: false,
    visible: false,
    description: "Participation à la finale nationale d'impact social avec une initiative pour l'emploi des jeunes.",
    evidenceUrl: "attestation_participation.pdf",
    evidenceName: "attestation_participation.pdf",
    rejectionReason: "Justificatif illisible ou incomplet. Veuillez fournir l'attestation officielle signée par les organisateurs.",
  },
];

export const passportService = {
  async getPassport() {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ME_PASSPORT);
    }
    await new Promise((r) => setTimeout(r, 200));
    try {
      const saved = localStorage.getItem("certix_records");
      return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  },

  async getMyAchievements() {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ME_ACHIEVEMENTS);
    }
    const all = await this.getPassport();
    return all.filter((item) => item.category === "achievement" || item.isClubOfficial);
  },

  async submitManualItem(itemData, file, onProgress) {
    if (!USE_MOCK_API) {
      const formData = new FormData();
      Object.entries(itemData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, String(v));
      });
      if (file instanceof File) {
        formData.append("evidence", file);
      }
      return apiUpload(ENDPOINTS.ME_ITEMS, formData, { method: "POST", onProgress });
    }
    if (onProgress) {
      onProgress(40);
      await new Promise((r) => setTimeout(r, 200));
      onProgress(100);
    }
    return {
      id: `rec_${Date.now()}`,
      ...itemData,
      status: "pending",
      isClubOfficial: false,
      visible: true,
      rejectionReason: null,
    };
  },

  async updateItem(id, itemData, file, onProgress) {
    if (!USE_MOCK_API) {
      if (file instanceof File) {
        const formData = new FormData();
        Object.entries(itemData).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, String(v));
        });
        formData.append("evidence", file);
        return apiUpload(ENDPOINTS.ME_ITEM_BY_ID(id), formData, { method: "PATCH", onProgress });
      }
      return apiRequest(ENDPOINTS.ME_ITEM_BY_ID(id), {
        method: "PATCH",
        body: itemData,
      });
    }
    if (onProgress) onProgress(100);
    return { ...itemData, id, status: "pending", rejectionReason: null };
  },

  async toggleVisibility(id, visible) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ME_ITEM_BY_ID(id), {
        method: "PATCH",
        body: { visible },
      });
    }
    await new Promise((r) => setTimeout(r, 150));
    return { id, visible };
  },

  async updatePublicSharing(active) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ME_SHARE, {
        method: "PATCH",
        body: { public_sharing_active: active },
      });
    }
    return { publicSharingActive: active };
  },

  async getPublicPassport(slug) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.PUBLIC_PASSPORT(slug), { auth: false });
    }
    return null;
  },

  async validateItem(id) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ADMIN_ITEM_BY_ID(id), {
        method: "PATCH",
        body: { status: "verified" },
      });
    }
    return { id, status: "verified" };
  },

  async rejectItem(id, reason) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ADMIN_ITEM_BY_ID(id), {
        method: "PATCH",
        body: { status: "rejected", rejection_reason: reason },
      });
    }
    return { id, status: "rejected", rejectionReason: reason };
  },
};
