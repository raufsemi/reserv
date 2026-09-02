"use client";

import { exportReservationReportCSV } from "@/features/dashboard/reservation-report-csv";
import { useDashboard } from "./useDashboard";
import { Button, Card, Input, Pagination, Table } from "@heroui/react";
import { formatDate } from "@/lib/date";

export function DashboardClient() {
  const {
    month,
    setMonth,

    filtered,
    summary,

    searchPhone,
    setSearchPhone,

    paginatedReservations,

    currentPage,
    setCurrentPage,

    totalPages,
  } = useDashboard();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Monthly Report</h1>
          <p className="text-sm ">Filter bookings by month</p>
        </div>

        {/* MONTH PICKER */}
        <div className="flex gap-2 items-center">
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          ></Input>

          <Button
            variant="primary"
            size="lg"
            onClick={() => exportReservationReportCSV(filtered)}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKpi
          label="Total Bookings"
          value={summary.total}
          className={"text-blue-600"}
        />
        <DashboardKpi
          label="Active Rooms"
          value={summary.rooms}
          className={"text-blue-600"}
        />
        <DashboardKpi
          label="Confirmed"
          value={summary.confirmed}
          className={"text-green-600"}
        />
        <DashboardKpi
          label="Cancelled"
          value={summary.cancelled}
          className={"text-red-600"}
        />
      </div>

      <Input
        type="text"
        variant="primary"
        placeholder="Search by phone number"
        value={searchPhone}
        onChange={(e) => setSearchPhone(e.target.value)}
        aria-label="Name"
        className="w-64"
      />

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Team members" className="min-w-150">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Phone Number</Table.Column>
              <Table.Column>Room</Table.Column>
              <Table.Column>Date</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Participants</Table.Column>
              <Table.Column>Time slots</Table.Column>
            </Table.Header>

            <Table.Body>
              {paginatedReservations.map((reservation) => (
                <Table.Row key={reservation.id}>
                  <Table.Cell>
                    {reservation.booker_name.toUpperCase()}
                  </Table.Cell>
                  <Table.Cell>{reservation.booker_phone}</Table.Cell>
                  <Table.Cell>{reservation.room_name}</Table.Cell>
                  <Table.Cell>
                    {formatDate(reservation.booking_date)}
                  </Table.Cell>
                  <Table.Cell className="px-5 py-3">
                    <span
                      className={
                        reservation.status === "cancelled"
                          ? "text-red-500"
                          : "text-green-600"
                      }
                    >
                      {reservation.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{reservation.capacity}</Table.Cell>
                  <Table.Cell>
                    <span className="inline-flex items-center rounded-md bg-accent/10 px-2.5 py-1 text-sm font-medium text-accent">
                      {reservation.time_slot}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <Pagination className="mt-5">
        <Pagination.Summary>
          Page {currentPage} of {Math.max(totalPages, 1)}
        </Pagination.Summary>

        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={currentPage === 1}
              onPress={() => setCurrentPage((p) => p - 1)}
            >
              <Pagination.PreviousIcon />
              <span>Previous</span>
            </Pagination.Previous>
          </Pagination.Item>

          <Pagination.Item>
            <Pagination.Next
              isDisabled={currentPage >= totalPages}
              onPress={() => setCurrentPage((p) => p + 1)}
            >
              <span>Next</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}

function DashboardKpi({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <Card>
      <Card.Header>
        <Card.Title className={className}>{label}</Card.Title>
      </Card.Header>
      <Card.Content>
        <p className="text-3xl font-bold">{value}</p>
      </Card.Content>
    </Card>
  );
}
