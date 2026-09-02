"use client";

import { Button, Input, Modal, Pagination, Table } from "@heroui/react";
import { useBookers } from "../useBookers";

export function BookersPageClient() {
  const {
    selected,
    reason,
    bookers,
    page,
    totalPages,
    setPage,
    setReason,
    openBlockModal,
    closeModal,
    toggleBlock,
    setQuery,
    query,
    paginatedBookers,
  } = useBookers();

  const isModalOpen = selected !== null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Bookers Management</h1>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Name"
        className="w-64"
        placeholder="Search by phone number or name"
      />

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Bookers" className="min-w-150">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Telephone Number</Table.Column>
              <Table.Column>Total Bookings</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Block</Table.Column>
            </Table.Header>

            <Table.Body>
              {paginatedBookers.map((booker) => (
                <Table.Row key={booker.id}>
                  <Table.Cell>{booker.name.toUpperCase()}</Table.Cell>

                  <Table.Cell>{booker.phone_number}</Table.Cell>

                  <Table.Cell>{booker.total_bookings ?? 0}</Table.Cell>
                  <Table.Cell>
                    <div className="space-y-1">
                      {booker.is_blocked ? (
                        <span className="inline-flex rounded bg-danger/10 px-2 py-1 text-xs text-foreground">
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex rounded bg-success/10 px-2 py-1 text-xs text-foreground">
                          Active
                        </span>
                      )}

                      {booker.block_reason && (
                        <p className="text-[11px] text-muted">
                          {booker.block_reason}
                        </p>
                      )}
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    {/* <button
                      type="button"
                      onClick={() => openBlockModal(booker)}
                      className={`rounded border px-3 py-1 text-xs transition ${
                        booker.is_blocked
                          ? "border-green-200 text-green-600 hover:bg-green-50"
                          : "border-red-200 text-red-600 hover:bg-red-50"
                      }`}
                    >
                      {booker.is_blocked ? "Unblock" : "Block"}
                    </button> */}

                    <Button
                      type="button"
                      variant="outline"
                      className={
                        booker.is_blocked
                          ? "border-green-200 text-green-600 hover:bg-green-50"
                          : "border-red-200 text-red-600 hover:bg-red-50"
                      }
                      size="sm"
                      onPress={() => openBlockModal(booker)}
                    >
                      {booker.is_blocked ? "Unblock" : "Block"}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <Pagination>
        <Pagination.Summary>
          Showing {(page - 1) * 25 + 1}-
          {(page - 1) * 25 + paginatedBookers.length} of {bookers.length}{" "}
          results
        </Pagination.Summary>

        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={page === 1}
              onPress={() => setPage((p) => p - 1)}
            >
              <Pagination.PreviousIcon />
              <span>Previous</span>
            </Pagination.Previous>
          </Pagination.Item>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Pagination.Item key={p}>
              <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                {p}
              </Pagination.Link>
            </Pagination.Item>
          ))}

          <Pagination.Item>
            <Pagination.Next
              isDisabled={page === totalPages}
              onPress={() => setPage((p) => p + 1)}
            >
              <span>Next</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>

      <Modal>
        <Modal.Backdrop
          className="z-100000"
          isOpen={isModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeModal();
            }
          }}
        >
          <Modal.Container>
            <Modal.Dialog>
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Heading>
                  {selected?.is_blocked ? "Unblock User" : "Block User"}
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                {selected && (
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">{selected.name}</p>

                      <p className="text-sm text-gray-500">
                        {selected.phone_number}
                      </p>
                    </div>

                    {!selected.is_blocked && (
                      <div className="space-y-2">
                        <label
                          htmlFor="block-reason"
                          className="text-sm font-medium"
                        >
                          Reason
                        </label>

                        <textarea
                          id="block-reason"
                          value={reason}
                          onChange={(event) => setReason(event.target.value)}
                          placeholder="Reason for blocking (optional)"
                          rows={4}
                          className="w-full rounded-lg border p-3 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={toggleBlock}
                  className={`rounded-lg px-4 py-2 text-sm text-white ${
                    selected?.is_blocked
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {selected?.is_blocked ? "Unblock" : "Block"}
                </button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
