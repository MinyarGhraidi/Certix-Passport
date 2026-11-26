import { apiRequest, ENDPOINTS, USE_MOCK_API } from "./apiClient";

/**
 * Event Data Models & Service Client conforming to SESAME Event Service (FastAPI)
 */

export const EVENT_TYPES = [
  { value: "all", labelKey: "events.types.all" },
  { value: "workshop", labelKey: "events.types.workshop" },
  { value: "hackathon", labelKey: "events.types.hackathon" },
  { value: "competition", labelKey: "events.types.competition" },
  { value: "evenement", labelKey: "events.types.evenement" },
];

export const EVENT_STATUSES = [
  { value: "all", labelKey: "events.statuses.all" },
  { value: "upcoming", labelKey: "events.statuses.upcoming" },
  { value: "ongoing", labelKey: "events.statuses.ongoing" },
  { value: "completed", labelKey: "events.statuses.completed" },
  { value: "cancelled", labelKey: "events.statuses.cancelled" },
  { value: "draft", labelKey: "events.statuses.draft" },
];

export const PARTICIPANT_ROLES = [
  { value: "participant", labelKey: "events.roles.participant" },
  { value: "organizer", labelKey: "events.roles.organizer" },
  { value: "speaker", labelKey: "events.roles.speaker" },
  { value: "mentor", labelKey: "events.roles.mentor" },
  { value: "winner", labelKey: "events.roles.winner" },
];

export const PARTICIPANT_STATUSES = [
  { value: "registered", labelKey: "events.participantStatuses.registered" },
  { value: "confirmed", labelKey: "events.participantStatuses.confirmed" },
  { value: "attended", labelKey: "events.participantStatuses.attended" },
  { value: "completed", labelKey: "events.participantStatuses.completed" },
];

export const INITIAL_EVENTS = [
  {
    id: "evt_01",
    title: "Design Thinking & Prototyping Sprint",
    type: "workshop",
    status: "completed",
    startDate: "2026-10-18T09:00",
    endDate: "2026-10-19T17:00",
    locationType: "in_person",
    location: "Campus SESAME - Lab 304",
    onlineLink: "",
    capacity: 40,
    bannerUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    description: "Sprint pratique de 2 jours sur la recherche utilisateur, la définition des problèmes, le prototypage rapide et les tests sous Figma.",
    createdBy: "usr_admin_01",
    createdAt: "2026-09-20T10:00:00Z",
    tags: ["UX Design", "Prototypage", "Innovation"],
    participants: [
      {
        id: "part_01",
        userId: "usr_amira_01",
        name: "Amira Mansour",
        email: "amira@university.tn",
        avatar: null,
        role: "participant",
        status: "completed",
        registeredAt: "2026-09-22T14:30:00Z",
        achievementAwarded: true,
      },
      {
        id: "part_02",
        userId: "usr_karim_02",
        name: "Karim Ben Salah",
        email: "karim.bensalah@university.tn",
        avatar: null,
        role: "organizer",
        status: "completed",
        registeredAt: "2026-09-21T09:15:00Z",
        achievementAwarded: true,
      },
      {
        id: "part_03",
        userId: "usr_sarah_03",
        name: "Sarah Trabelsi",
        email: "sarah.t@university.tn",
        avatar: null,
        role: "participant",
        status: "attended",
        registeredAt: "2026-09-23T11:00:00Z",
        achievementAwarded: false,
      },
    ],
  },
  {
    id: "evt_02",
    title: "SESAME Hackathon : Smart Campus & IA 2026",
    type: "hackathon",
    status: "completed",
    startDate: "2026-11-10T18:00",
    endDate: "2026-11-12T16:00",
    locationType: "hybrid",
    location: "Hall Innovation SESAME",
    onlineLink: "https://meet.sesame.tn/smartcampus",
    capacity: 100,
    bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    description: "Hackathon non-stop de 48 heures dédié au déploiement de solutions d'IA générative et d'IoT pour un campus durable.",
    createdBy: "usr_admin_01",
    createdAt: "2026-10-01T08:00:00Z",
    tags: ["IA", "IoT", "Smart Campus", "Fullstack"],
    participants: [
      {
        id: "part_04",
        userId: "usr_amira_01",
        name: "Amira Mansour",
        email: "amira@university.tn",
        avatar: null,
        role: "winner",
        status: "completed",
        registeredAt: "2026-10-05T12:00:00Z",
        achievementAwarded: true,
      },
      {
        id: "part_05",
        userId: "usr_mohamed_04",
        name: "Mohamed Ali Dridi",
        email: "mohamed.dridi@university.tn",
        avatar: null,
        role: "participant",
        status: "attended",
        registeredAt: "2026-10-06T15:20:00Z",
        achievementAwarded: true,
      },
    ],
  },
  {
    id: "evt_03",
    title: "Workshop Architecture Cloud & Sécurité AWS",
    type: "workshop",
    status: "upcoming",
    startDate: "2026-12-05T14:00",
    endDate: "2026-12-05T18:00",
    locationType: "in_person",
    location: "Amphi A - SESAME",
    onlineLink: "",
    capacity: 60,
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    description: "Masterclass technique animée par des architectes AWS certifiés sur les politiques IAM, le réseau VPC et le déploiement de conteneurs.",
    createdBy: "usr_admin_01",
    createdAt: "2026-11-15T09:00:00Z",
    tags: ["Cloud", "AWS", "Sécurité", "DevOps"],
    participants: [
      {
        id: "part_06",
        userId: "usr_amira_01",
        name: "Amira Mansour",
        email: "amira@university.tn",
        avatar: null,
        role: "participant",
        status: "confirmed",
        registeredAt: "2026-11-18T10:00:00Z",
        achievementAwarded: false,
      },
    ],
  },
  {
    id: "evt_04",
    title: "Coupe Nationale de Programmation Compétitive",
    type: "competition",
    status: "upcoming",
    startDate: "2026-12-19T10:00",
    endDate: "2026-12-19T16:00",
    locationType: "online",
    location: "",
    onlineLink: "https://codeforces.com/group/sesame2026",
    capacity: 150,
    bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    description: "Concours annuel d'algorithmique et structures de données réunissant les équipes universitaires en résolution rapide.",
    createdBy: "usr_admin_01",
    createdAt: "2026-11-10T12:00:00Z",
    tags: ["Algorithmes", "C++", "Python", "Compétition"],
    participants: [],
  },
  {
    id: "evt_05",
    title: "Journée d'Intégration & Réseautage Club SESAME",
    type: "evenement",
    status: "ongoing",
    startDate: "2026-11-26T09:00",
    endDate: "2026-11-26T19:00",
    locationType: "in_person",
    location: "Auditorium Principal SESAME",
    onlineLink: "",
    capacity: 250,
    bannerUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    description: "Rencontre d'accueil des nouveaux membres, démonstrations de projets, retours d'alumni et ateliers collaboratifs.",
    createdBy: "usr_admin_01",
    createdAt: "2026-11-01T10:00:00Z",
    tags: ["Communauté", "Networking", "Showcase"],
    participants: [
      {
        id: "part_07",
        userId: "usr_amira_01",
        name: "Amira Mansour",
        email: "amira@university.tn",
        avatar: null,
        role: "organizer",
        status: "attended",
        registeredAt: "2026-11-02T09:00:00Z",
        achievementAwarded: false,
      },
    ],
  },
];

export const eventApi = {
  async getEvents(params = {}) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.EVENTS, { params });
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const stored = localStorage.getItem("certix_events");
          resolve(stored ? JSON.parse(stored) : INITIAL_EVENTS);
        } catch {
          resolve(INITIAL_EVENTS);
        }
      }, 200);
    });
  },

  async getEventById(id) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.EVENT_BY_ID(id));
    }
    const all = await this.getEvents();
    return all.find((e) => e.id === id) || null;
  },

  async createEvent(eventData) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ADMIN_EVENTS, {
        method: "POST",
        body: eventData,
      });
    }
    return { ...eventData, id: `evt_${Date.now()}`, createdAt: new Date().toISOString(), participants: [] };
  },

  async updateEvent(id, eventData) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ADMIN_EVENT_BY_ID(id), {
        method: "PUT",
        body: eventData,
      });
    }
    return { ...eventData, id, updatedAt: new Date().toISOString() };
  },

  async updateEventStatus(id, status) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ADMIN_EVENT_STATUS(id), {
        method: "PATCH",
        body: { status },
      });
    }
    return { id, status };
  },

  async deleteEvent(id) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ADMIN_EVENT_BY_ID(id), {
        method: "DELETE",
      });
    }
    return { ok: true };
  },

  async addParticipant(eventId, participantData) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.EVENT_PARTICIPANTS(eventId), {
        method: "POST",
        body: participantData,
      });
    }
    return {
      ...participantData,
      id: `part_${Date.now()}`,
      registeredAt: new Date().toISOString(),
      achievementAwarded: false,
    };
  },

  async updateParticipantStatus(eventId, participantId, status) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.EVENT_PARTICIPANT_BY_ID(eventId, participantId), {
        method: "PATCH",
        body: { status },
      });
    }
    return { id: participantId, status };
  },

  async removeParticipant(eventId, participantId) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.EVENT_PARTICIPANT_BY_ID(eventId, participantId), {
        method: "DELETE",
      });
    }
    return { ok: true };
  },

  async awardAchievements(eventId, items) {
    if (!USE_MOCK_API) {
      return apiRequest(ENDPOINTS.ADMIN_EVENT_ACHIEVEMENTS(eventId), {
        method: "POST",
        body: { participants: items },
      });
    }
    return { awarded: items.length };
  },

  saveEventsToStorage(events) {
    try {
      localStorage.setItem("certix_events", JSON.stringify(events));
    } catch {
      // ignore storage quota errors
    }
  },
};
