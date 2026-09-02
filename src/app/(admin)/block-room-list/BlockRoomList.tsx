"use client";

import { deleteRoomOverrideAction } from "@/features/room-overrides/room-overrides.actions";
import { formatDate } from "@/lib/date";
import { Button, Card, Chip } from "@heroui/react";
import { useMemo, useState } from "react";

type Room = {
  id: string;
  name: string;
};

type RoomOverride = {
  id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  blocked_reason: string | null;
};

type Props = {
  rooms: Room[];
  overrides: RoomOverride[];
};

export default function BlockRoomList({ rooms, overrides }: Props) {
  const [blocks, setBlocks] = useState(overrides);

  const groupedBlocks = useMemo(() => {
    return rooms
      .map((room) => ({
        room,
        blocks: blocks.filter((block) => block.room_id === room.id),
      }))
      .filter((group) => group.blocks.length > 0);
  }, [rooms, blocks]);

  async function handleDelete(id: string) {
    await deleteRoomOverrideAction(id);

    setBlocks((current) => current.filter((block) => block.id !== id));
  }

  return (
    <section className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Blocked Rooms</h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage periods when rooms are unavailable for booking.
        </p>
      </div>

      {/* Empty */}
      {groupedBlocks.length === 0 ? (
        <Card className="border border-dashed p-8 text-center shadow-none">
          <p className="text-sm font-medium text-gray-700">
            No rooms are blocked
          </p>

          <p className="mt-1 text-sm text-gray-500">
            All rooms are currently available for booking.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {groupedBlocks.map(({ room, blocks }) => (
            <Card
              key={room.id}
              className="overflow-hidden border border-gray-200 shadow-none"
            >
              {/* Room Header */}
              <div className="flex items-center justify-between border-b bg-gray-50 px-5 py-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{room.name}</h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {blocks.length}{" "}
                    {blocks.length === 1 ? "blocked period" : "blocked periods"}
                  </p>
                </div>

                <Chip size="sm" color="danger" variant="soft">
                  Blocked
                </Chip>
              </div>

              {/* Blocks */}
              <div className="divide-y">
                {blocks.map((block) => {
                  const isSingleDay = block.start_date === block.end_date;

                  return (
                    <div
                      key={block.id}
                      className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                          📅
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {isSingleDay
                              ? formatDate(block.start_date)
                              : `${formatDate(block.start_date)} → ${formatDate(
                                  block.end_date,
                                )}`}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {isSingleDay ? "One day" : "Date range"}
                          </p>

                          {block.blocked_reason && (
                            <div className="mt-3">
                              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                Reason
                              </p>

                              <p className="mt-0.5 truncate text-sm text-gray-600">
                                {block.blocked_reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="danger"
                        onPress={() => handleDelete(block.id)}
                      >
                        Remove Block
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
