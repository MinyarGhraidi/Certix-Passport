import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import i18n from "../i18n";
import { authService, DEFAULT_USER } from "./authService";
import { passportService, INITIAL_RECORDS } from "./passportService";
import { eventApi, INITIAL_EVENTS } from "./eventService";
import { USE_MOCK_API } from "./apiClient";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("certix_current_user");
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem("certix_records");
      return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  });

  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem("certix_events");
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("certix_theme") || "light";
    } catch {
      return "light";
    }
  });

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [activeTab, setActiveTab] = useState(() => (currentUser ? "dashboard" : "login"));
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalInitialCategory, setModalInitialCategory] = useState("achievement");

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Toast notifications
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  // Theme sync
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("certix_theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Persist local cache
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("certix_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("certix_current_user");
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem("certix_records", JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  useEffect(() => {
    eventApi.saveEventsToStorage(events);
  }, [events]);

  // Listen for 401 unauthorized from API Gateway
  useEffect(() => {
    const handleUnauthorized = () => {
      authService.logout();
      setCurrentUser(null);
      setActiveTab("login");
      showNotification(i18n.t("notifications.signedOut"), "error");
    };
    window.addEventListener("certix:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("certix:unauthorized", handleUnauthorized);
  }, [showNotification]);

  // Fetch initial backend data when live API mode is enabled
  const refreshAllFromBackend = useCallback(async () => {
    if (USE_MOCK_API || !currentUser) return;
    setIsLoadingData(true);
    setApiError(null);
    try {
      const [profile, passportItems, eventList] = await Promise.all([
        authService.getProfile(),
        passportService.getPassport(),
        eventApi.getEvents(),
      ]);
      if (profile) setCurrentUser(profile);
      if (Array.isArray(passportItems)) setRecords(passportItems);
      if (Array.isArray(eventList)) setEvents(eventList);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoadingData(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!USE_MOCK_API && currentUser) {
      refreshAllFromBackend();
    }
  }, [USE_MOCK_API]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auth operations
  const login = async (email, password, roleHint = "student", remember = true) => {
    const user = await authService.login({ email, password, roleHint, remember });
    setCurrentUser(user);
    showNotification(i18n.t("notifications.welcome", { name: user.firstName || user.fullName }));
    setActiveTab(user.role === "admin" ? "admin" : "dashboard");
    return user;
  };

  const register = async (data) => {
    const newUser = await authService.register(data);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab("login");
    showNotification(i18n.t("notifications.signedOut"));
  };

  // Profile operations
  const updateProfile = async (updatedFields) => {
    const prev = currentUser;
    setCurrentUser((p) => ({ ...p, ...updatedFields }));
    try {
      await authService.updateProfile(updatedFields);
      if (typeof updatedFields.publicSharingActive === "boolean") {
        await passportService.updatePublicSharing(updatedFields.publicSharingActive);
      }
      showNotification(i18n.t("notifications.profileUpdated"));
    } catch (err) {
      setCurrentUser(prev);
      showNotification(err.message, "error");
    }
  };

  // Record visibility toggle with optimistic update & rollback on API failure
  const toggleVisibility = async (recordId) => {
    const target = records.find((r) => r.id === recordId);
    if (!target) return;
    const nextVisible = !target.visible;

    setRecords((prev) =>
      prev.map((rec) => (rec.id === recordId ? { ...rec, visible: nextVisible } : rec))
    );

    try {
      await passportService.toggleVisibility(recordId, nextVisible);
      showNotification(
        nextVisible ? i18n.t("notifications.setPublic") : i18n.t("notifications.setPrivate")
      );
    } catch (err) {
      setRecords((prev) =>
        prev.map((rec) => (rec.id === recordId ? { ...rec, visible: !nextVisible } : rec))
      );
      showNotification(err.message, "error");
    }
  };

  // Add or resubmit record
  const saveRecord = async (recordData, rawFile = null, onProgress) => {
    if (editingRecord) {
      const updated = await passportService.updateItem(editingRecord.id, recordData, rawFile, onProgress);
      setRecords((prev) =>
        prev.map((rec) =>
          rec.id === editingRecord.id
            ? { ...rec, ...recordData, ...updated, status: "pending", rejectionReason: null }
            : rec
        )
      );
      showNotification(i18n.t("notifications.recordResubmitted"));
    } else {
      const created = await passportService.submitManualItem(recordData, rawFile, onProgress);
      const newRec = {
        ...recordData,
        ...created,
        status: "pending",
        isClubOfficial: false,
        visible: true,
        rejectionReason: null,
      };
      setRecords((prev) => [newRec, ...prev]);
      showNotification(i18n.t("notifications.recordSubmitted"));
    }
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  // Admin validation/rejection
  const adminValidateRecord = async (recordId) => {
    await passportService.validateItem(recordId);
    setRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: "verified", rejectionReason: null } : r))
    );
    showNotification(i18n.t("notifications.recordValidated"));
  };

  const adminRejectRecord = async (recordId, reason) => {
    await passportService.rejectItem(recordId, reason);
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, status: "rejected", rejectionReason: reason || "Does not meet requirements." }
          : r
      )
    );
    showNotification(i18n.t("notifications.recordRejected"));
  };

  // Event Service operations
  const saveEvent = async (eventData) => {
    if (editingEvent) {
      const updated = await eventApi.updateEvent(editingEvent.id, eventData);
      setEvents((prev) =>
        prev.map((evt) => (evt.id === editingEvent.id ? { ...evt, ...eventData, ...updated } : evt))
      );
      showNotification(i18n.t("notifications.eventUpdated"));
    } else {
      const created = await eventApi.createEvent(eventData);
      const newEvt = {
        ...eventData,
        ...created,
        createdBy: currentUser?.id || "usr_admin_01",
        participants: created.participants || [],
      };
      setEvents((prev) => [newEvt, ...prev]);
      showNotification(i18n.t("notifications.eventCreated"));
    }
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const deleteEvent = async (eventId) => {
    await eventApi.deleteEvent(eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    if (selectedEventId === eventId) setSelectedEventId(null);
    showNotification(i18n.t("notifications.eventDeleted"), "error");
  };

  const updateEventStatus = async (eventId, newStatus) => {
    await eventApi.updateEventStatus(eventId, newStatus);
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e)));
    showNotification(i18n.t("notifications.eventStatusUpdated"));
  };

  const addParticipantToEvent = async (eventId, participantData) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (
      targetEvent?.participants.some(
        (p) => p.email.toLowerCase() === participantData.email.toLowerCase()
      )
    ) {
      throw new Error("Ce membre est déjà inscrit à cet événement.");
    }

    const created = await eventApi.addParticipant(eventId, participantData);
    const newParticipant = {
      userId: participantData.userId || `usr_${Date.now()}`,
      name: participantData.name,
      email: participantData.email,
      avatar: null,
      role: participantData.role || "participant",
      status: participantData.status || "confirmed",
      ...created,
    };

    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? { ...evt, participants: [...evt.participants, newParticipant] }
          : evt
      )
    );
    showNotification(i18n.t("notifications.participantAdded", { name: participantData.name }));
  };

  const removeParticipantFromEvent = async (eventId, participantId) => {
    await eventApi.removeParticipant(eventId, participantId);
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? { ...evt, participants: evt.participants.filter((p) => p.id !== participantId) }
          : evt
      )
    );
    showNotification(i18n.t("notifications.participantRemoved"));
  };

  const updateParticipantStatus = async (eventId, participantId, newStatus) => {
    await eventApi.updateParticipantStatus(eventId, participantId, newStatus);
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === eventId
          ? {
              ...evt,
              participants: evt.participants.map((p) =>
                p.id === participantId ? { ...p, status: newStatus } : p
              ),
            }
          : evt
      )
    );
    showNotification(i18n.t("notifications.participantStatusUpdated"));
  };

  const awardAchievementToParticipant = async (event, participant) => {
    const alreadyAwarded = records.some(
      (r) => r.title === event.title && r.isClubOfficial && r.role.toLowerCase() === participant.role.toLowerCase()
    );
    if (alreadyAwarded) {
      showNotification("Achievement déjà attribué à ce participant.", "error");
      return;
    }

    await eventApi.awardAchievements(event.id, [{ email: participant.email, role: participant.role }]);

    const newRecord = {
      id: `rec_${Date.now()}`,
      category: event.type === "workshop" ? "activity" : "achievement",
      type: event.type,
      title: event.title,
      organization: "Club SESAME",
      date: event.startDate ? event.startDate.split("T")[0] : new Date().toISOString().split("T")[0],
      startDate: event.startDate ? event.startDate.split("T")[0] : "",
      endDate: event.endDate ? event.endDate.split("T")[0] : "",
      role: participant.role.charAt(0).toUpperCase() + participant.role.slice(1),
      status: "verified",
      isClubOfficial: true,
      visible: true,
      description: event.description,
      evidenceUrl: null,
      evidenceName: null,
      rejectionReason: null,
    };

    setRecords((prev) => [newRecord, ...prev]);

    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === event.id
          ? {
              ...evt,
              participants: evt.participants.map((p) =>
                p.id === participant.id ? { ...p, achievementAwarded: true, status: "completed" } : p
              ),
            }
          : evt
      )
    );

    showNotification(i18n.t("notifications.achievementAwarded", { name: participant.name }));
  };

  const openAddModal = (category = "achievement") => {
    setEditingRecord(null);
    setModalInitialCategory(category);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setModalInitialCategory(record.category);
    setIsModalOpen(true);
  };

  const openCreateEventModal = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const viewEventDetails = (eventId) => {
    setSelectedEventId(eventId);
    setActiveTab("event-details");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        records,
        events,
        theme,
        toggleTheme,
        selectedEventId,
        setSelectedEventId,
        activeTab,
        setActiveTab,
        isLoadingData,
        apiError,
        refreshAllFromBackend,
        login,
        register,
        logout,
        updateProfile,
        toggleVisibility,
        saveRecord,
        adminValidateRecord,
        adminRejectRecord,
        saveEvent,
        deleteEvent,
        updateEventStatus,
        addParticipantToEvent,
        removeParticipantFromEvent,
        updateParticipantStatus,
        awardAchievementToParticipant,
        isModalOpen,
        setIsModalOpen,
        editingRecord,
        modalInitialCategory,
        openAddModal,
        openEditModal,
        isEventModalOpen,
        setIsEventModalOpen,
        editingEvent,
        openCreateEventModal,
        openEditEventModal,
        viewEventDetails,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
