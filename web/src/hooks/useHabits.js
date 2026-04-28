import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export function useHabits(filters = { status: 'all', sortBy: 'default' }) {
  const { token } = useAuth();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHabits = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      
      const url = `/api/habits${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const data = await apiRequest(url, { token });
      setHabits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, filters.status, filters.sortBy]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  async function createHabit(habitData) {
    const created = await apiRequest("/api/habits", {
      method: "POST",
      body: JSON.stringify(habitData),
      token,
    });

    setHabits((prev) => [created, ...prev]);
    return created;
  }

  async function updateHabit(id, habitData) {
    const updated = await apiRequest(`/api/habits/${id}`, {
      method: "PUT",
      body: JSON.stringify(habitData),
      token,
    });

    setHabits((prev) => prev.map((h) => (h._id === id ? updated : h)));
    return updated;
  }

  async function deleteHabit(id) {
    await apiRequest(`/api/habits/${id}`, {
      method: "DELETE",
      token,
    });

    setHabits((prev) => prev.filter((h) => h._id !== id));
  }

  async function toggleCompletion(id) {
    const updated = await apiRequest(`/api/habits/${id}/complete`, {
      method: "PATCH",
      token,
    });

    setHabits((prev) => prev.map((h) => (h._id === id ? updated : h)));
    return updated;
  }

  return { habits, isLoading, error, fetchHabits, createHabit, updateHabit, deleteHabit, toggleCompletion };
}
