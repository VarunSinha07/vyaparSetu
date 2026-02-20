"use client";

import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Send,
  FileText,
  DollarSign,
  AlertCircle,
  Plus,
  Eye,
  Ban,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: Date | string;
  metadata?: Record<string, unknown>;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const getEventIcon = (action: string) => {
  const actionLower = action.toLowerCase();

  if (actionLower.includes("create") || actionLower.includes("upload")) {
    return <Plus className="h-4 w-4" />;
  }
  if (actionLower.includes("approve") || actionLower.includes("verified")) {
    return <CheckCircle className="h-4 w-4" />;
  }
  if (actionLower.includes("reject")) {
    return <XCircle className="h-4 w-4" />;
  }
  if (actionLower.includes("submit")) {
    return <Send className="h-4 w-4" />;
  }
  if (actionLower.includes("edit") || actionLower.includes("update")) {
    return <Edit className="h-4 w-4" />;
  }
  if (actionLower.includes("payment") && actionLower.includes("success")) {
    return <DollarSign className="h-4 w-4" />;
  }
  if (actionLower.includes("payment") && actionLower.includes("initiate")) {
    return <Clock className="h-4 w-4" />;
  }
  if (actionLower.includes("payment") && actionLower.includes("fail")) {
    return <AlertCircle className="h-4 w-4" />;
  }
  if (actionLower.includes("issue")) {
    return <FileText className="h-4 w-4" />;
  }
  if (actionLower.includes("mismatch")) {
    return <AlertCircle className="h-4 w-4" />;
  }
  if (actionLower.includes("review") || actionLower.includes("under_review")) {
    return <Eye className="h-4 w-4" />;
  }
  if (actionLower.includes("cancel")) {
    return <Ban className="h-4 w-4" />;
  }

  return <Clock className="h-4 w-4" />;
};

const getEventColor = (action: string) => {
  const actionLower = action.toLowerCase();

  if (
    actionLower.includes("approve") ||
    actionLower.includes("verified") ||
    actionLower.includes("success")
  ) {
    return "text-green-600 bg-green-50";
  }
  if (actionLower.includes("reject") || actionLower.includes("fail")) {
    return "text-red-600 bg-red-50";
  }
  if (actionLower.includes("mismatch")) {
    return "text-orange-600 bg-orange-50";
  }
  if (actionLower.includes("payment") || actionLower.includes("issue")) {
    return "text-blue-600 bg-blue-50";
  }

  return "text-gray-600 bg-gray-50";
};

const formatActionName = (action: string) => {
  // Convert snake_case or SCREAMING_SNAKE_CASE to Title Case
  return action
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export function Timeline({ events }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => {
          const isLast = eventIdx === events.length - 1;
          const timestamp = new Date(event.timestamp);

          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute left-4 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div>
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full ${getEventColor(event.action)}`}
                    >
                      {getEventIcon(event.action)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatActionName(event.action)}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        by {event.actor}
                      </p>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {formatDistanceToNow(timestamp, { addSuffix: true })}
                      {" • "}
                      {timestamp.toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                    {event.metadata &&
                      Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                          {(() => {
                            const reason = event.metadata.reason;
                            return typeof reason === "string" && reason ? (
                              <div>
                                <span className="font-medium">Reason:</span>{" "}
                                {reason}
                              </div>
                            ) : null;
                          })()}
                          {(() => {
                            const comment = event.metadata.comment;
                            return typeof comment === "string" && comment ? (
                              <div>
                                <span className="font-medium">Comment:</span>{" "}
                                {comment}
                              </div>
                            ) : null;
                          })()}
                          {(() => {
                            const amount = event.metadata.amount;
                            return typeof amount === "number" ? (
                              <div>
                                <span className="font-medium">Amount:</span> ₹
                                {amount.toLocaleString("en-IN")}
                              </div>
                            ) : null;
                          })()}
                          {(() => {
                            const poNumber = event.metadata.poNumber;
                            return typeof poNumber === "string" && poNumber ? (
                              <div>
                                <span className="font-medium">PO Number:</span>{" "}
                                {poNumber}
                              </div>
                            ) : null;
                          })()}
                          {(() => {
                            const invoiceNumber = event.metadata.invoiceNumber;
                            return typeof invoiceNumber === "string" &&
                              invoiceNumber ? (
                              <div>
                                <span className="font-medium">
                                  Invoice Number:
                                </span>{" "}
                                {invoiceNumber}
                              </div>
                            ) : null;
                          })()}
                          {(() => {
                            const title = event.metadata.title;
                            return typeof title === "string" && title ? (
                              <div>
                                <span className="font-medium">Title:</span>{" "}
                                {title}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
