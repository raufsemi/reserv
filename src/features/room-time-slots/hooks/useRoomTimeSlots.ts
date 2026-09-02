"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  CreateRoomTimeSlotInput,
  RoomTimeSlotRow,
  UpdateRoomTimeSlotInput,
} from "../room-time-slot.types";

import {
  createRoomTimeSlot,
  deleteRoomTimeSlot,
  getRoomTimeSlots,
  updateRoomTimeSlot,
} from "../room-time-slot.actions";

export function useRoomTimeSlots(roomId: string | null, dayOfWeek: number) {
  const [slots, setSlots] = useState<RoomTimeSlotRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSlots = useCallback(async () => {
    if (!roomId) {
      setSlots([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await getRoomTimeSlots(roomId, dayOfWeek);
      setSlots(data);
    } catch (error) {
      console.error("Failed to fetch time slots:", error);
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, dayOfWeek]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSlots();
  }, [fetchSlots]);

  async function createTimeSlot(input: CreateRoomTimeSlotInput) {
    const result = await createRoomTimeSlot(input);
    await fetchSlots();
    return result;
  }

  async function updateTimeSlot(input: UpdateRoomTimeSlotInput) {
    const result = await updateRoomTimeSlot(input);
    await fetchSlots();
    return result;
  }

  async function deleteTimeSlot(id: string) {
    const result = await deleteRoomTimeSlot(id);
    await fetchSlots();
    return result;
  }

  return {
    slots,
    isLoading,

    createTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    refresh: fetchSlots,
  };
}
